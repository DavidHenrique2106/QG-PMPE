/* Sincronização com o servidor (Vercel).
 * Expõe window.Nuvem com a mesma interface que o app usava antes:
 *   Nuvem.db()      -> doc("estado/x"|"notas/x").get / set / delete / onSnapshot
 *   Nuvem.assets()  -> upload(blob) / delete(id) / baixar(id)
 * Tudo continua salvo primeiro no navegador; a nuvem é uma cópia que aparece em qualquer aparelho.
 */
(function () {
  "use strict";
  const LS_SENHA = "qgpmpe:senha";
  const LS_PENDENTES = "qgpmpe:nuvem-pendentes"; // chaves do estado que não chegaram ao servidor
  const LS_REV = "qgpmpe:nuvem-rev";
  const PARTE = 3.5 * 1024 * 1024;
  const POLL_MS = 15000;

  const ls = {
    get(k) { try { return localStorage.getItem(k); } catch (e) { return null; } },
    set(k, v) { try { localStorage.setItem(k, v); } catch (e) {} },
    del(k) { try { localStorage.removeItem(k); } catch (e) {} },
  };
  let senha = ls.get(LS_SENHA);

  class ErroNuvem extends Error {
    constructor(code, msg) { super(msg || code); this.code = code; }
  }

  async function api(caminho, opt = {}, comSenha = senha) {
    let r;
    try {
      r = await fetch("/api/" + caminho, {
        ...opt,
        headers: { ...(opt.headers || {}), "x-qg-senha": comSenha || "" },
        cache: "no-store",
      });
    } catch (e) {
      throw new ErroNuvem("offline", "Sem conexão");
    }
    if (r.status === 401) throw new ErroNuvem("senha", "Senha incorreta");
    if (r.status === 413) throw new ErroNuvem("too_large");
    if (!r.ok) throw new ErroNuvem("servidor", "Erro " + r.status);
    return r;
  }
  const apiJson = async (c, o) => (await api(c, o)).json();

  /* ---------- Estado (com sondagem periódica) ---------- */
  const ouvintes = {}; // chave -> [cb]
  const ultimaEscrita = {}; // chave -> rev gravada por este aparelho
  const gravando = {};
  let rev = 0, primeira = true, timer = null, sondando = false;

  const pendentes = () => { try { return JSON.parse(ls.get(LS_PENDENTES) || "[]"); } catch (e) { return []; } };
  function marcarPendente(k, sim) {
    const p = new Set(pendentes());
    sim ? p.add(k) : p.delete(k);
    ls.set(LS_PENDENTES, JSON.stringify([...p]));
  }

  async function gravarEstado(k, dados) {
    gravando[k] = (gravando[k] || 0) + 1;
    try {
      const { rev: r } = await apiJson("estado?k=" + encodeURIComponent(k), {
        method: "PUT",
        headers: { "content-type": "application/json" },
        body: JSON.stringify(dados),
      });
      ultimaEscrita[k] = r;
      marcarPendente(k, false);
      Nuvem._status("ok");
    } catch (e) {
      marcarPendente(k, true);
      Nuvem._status(e.code === "senha" ? "senha" : "offline");
      throw e;
    } finally {
      gravando[k]--;
    }
  }

  // Envia o que ficou salvo só no aparelho (ex.: estudou sem internet).
  async function enviarPendentes() {
    const fonte = Nuvem.fonte;
    if (!fonte) return;
    for (const k of pendentes()) {
      const d = fonte(k);
      if (d !== undefined) await gravarEstado(k, d).catch(() => {});
    }
  }

  function snap(existe, dados) {
    return { exists: existe, data: () => dados, metadata: { fromCache: false, hasPendingWrites: false } };
  }

  async function sondar() {
    if (sondando || !senha || !Object.keys(ouvintes).length) return;
    sondando = true;
    try {
      if (primeira) await enviarPendentes();
      const r = await apiJson("estado?desde=" + (primeira ? 0 : rev));
      Nuvem._status("ok");
      const travadas = new Set(pendentes());
      for (const [k, cbs] of Object.entries(ouvintes)) {
        const doc = r.docs[k];
        if (!doc) {
          if (primeira) cbs.forEach((cb) => cb(snap(false)));
          continue;
        }
        // Ignora o eco do que este aparelho acabou de gravar e não atropela edição em andamento.
        if (ultimaEscrita[k] && doc.r <= ultimaEscrita[k]) continue;
        if (gravando[k] || travadas.has(k) || (Nuvem.pendente && Nuvem.pendente(k))) continue;
        cbs.forEach((cb) => cb(snap(true, doc.d)));
      }
      rev = r.rev;
      ls.set(LS_REV, String(rev));
      primeira = false;
    } catch (e) {
      Nuvem._status(e.code === "senha" ? "senha" : "offline");
    } finally {
      sondando = false;
    }
  }
  function agendar() {
    clearTimeout(timer);
    if (document.hidden) return;
    timer = setTimeout(async () => { await sondar(); agendar(); }, POLL_MS);
  }
  document.addEventListener("visibilitychange", () => { if (!document.hidden) { sondar(); agendar(); } });
  window.addEventListener("online", () => { enviarPendentes(); sondar(); });
  window.addEventListener("focus", () => sondar());

  /* ---------- db ---------- */
  function doc(caminho) {
    const [col, id] = caminho.split("/");
    if (col === "estado") {
      return {
        set: (d) => gravarEstado(id, d),
        onSnapshot(cb) {
          (ouvintes[id] = ouvintes[id] || []).push(cb);
          clearTimeout(Nuvem._t);
          Nuvem._t = setTimeout(() => { sondar(); agendar(); }, 0);
          return () => { ouvintes[id] = ouvintes[id].filter((x) => x !== cb); };
        },
      };
    }
    if (col === "notas") {
      const q = "notas?id=" + encodeURIComponent(id);
      return {
        async get() { const r = await apiJson(q); return snap(r.existe, r.dados); },
        async set(d) { await api(q, { method: "PUT", headers: { "content-type": "application/json" }, body: JSON.stringify(d) }); },
        async delete() { await api(q, { method: "DELETE" }); },
      };
    }
    throw new Error("Coleção desconhecida: " + col);
  }

  /* ---------- PDFs (com cópia local para abrir rápido e sem internet) ---------- */
  let cacheDb = null;
  function cache() {
    if (cacheDb) return cacheDb;
    cacheDb = new Promise((res, rej) => {
      const r = indexedDB.open("qgpmpe-cache", 1);
      r.onupgradeneeded = () => r.result.createObjectStore("pdf");
      r.onsuccess = () => res(r.result);
      r.onerror = () => rej(r.error);
    });
    return cacheDb;
  }
  async function cacheOp(modo, fn) {
    try {
      const d = await cache();
      return await new Promise((res, rej) => {
        const t = d.transaction("pdf", modo);
        const req = fn(t.objectStore("pdf"));
        t.oncomplete = () => res(req && req.result);
        t.onerror = () => rej(t.error);
      });
    } catch (e) { return null; }
  }
  const novoId = () => "a" + Date.now().toString(36) + Math.random().toString(36).slice(2, 8);

  const assets = {
    async upload(blob, opt = {}) {
      if (blob.size > 25 * 1024 * 1024) throw new ErroNuvem("too_large");
      const id = novoId();
      const n = Math.max(1, Math.ceil(blob.size / PARTE));
      for (let i = 0; i < n; i++) {
        const parte = blob.slice(i * PARTE, (i + 1) * PARTE);
        await api(`pdf?id=${id}&parte=${i}`, { method: "POST", headers: { "content-type": "application/octet-stream" }, body: parte });
      }
      await api(`pdf?id=${id}&fim=1`, {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ partes: n, tamanho: blob.size, tipo: opt.type || blob.type || "application/pdf" }),
      });
      await cacheOp("readwrite", (s) => s.put(blob, id));
      return { id };
    },
    async delete(id) {
      await cacheOp("readwrite", (s) => s.delete(id));
      await api("pdf?id=" + encodeURIComponent(id), { method: "DELETE" });
    },
    async baixar(id) {
      const local = await cacheOp("readonly", (s) => s.get(id));
      if (local) return local;
      const info = await apiJson("pdf?id=" + encodeURIComponent(id));
      const partes = [];
      for (let i = 0; i < info.partes; i++) partes.push(await (await api(`pdf?id=${id}&parte=${i}`)).blob());
      const blob = new Blob(partes, { type: info.tipo || "application/pdf" });
      await cacheOp("readwrite", (s) => s.put(blob, id));
      return blob;
    },
  };

  /* ---------- API pública ---------- */
  const Nuvem = {
    ativo: () => Boolean(senha),
    db: () => ({ doc }),
    assets: () => assets,
    fonte: null, // (chave) => dados atuais do app, para reenviar o que ficou pendente
    pendente: null, // (chave) => true se o app tem gravação aguardando
    statusAtual: "desligado",
    aoMudarStatus: null,
    _status(s) {
      if (s === this.statusAtual) return;
      this.statusAtual = s;
      this.aoMudarStatus && this.aoMudarStatus(s);
    },
    async servidor() {
      const r = await fetch("/api/status", { cache: "no-store" });
      return r.json();
    },
    async entrar(s) {
      await api("status", {}, s); // lança ErroNuvem("senha") se estiver errada
      senha = s;
      ls.set(LS_SENHA, s);
    },
    sair() {
      senha = null;
      ls.del(LS_SENHA);
      ls.del(LS_PENDENTES);
    },
    sincronizarAgora: () => sondar(),
  };
  window.Nuvem = Nuvem;
})();
