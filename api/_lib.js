// Funções compartilhadas pelas rotas da API (arquivos com "_" não viram rota na Vercel).
import { createHash, timingSafeEqual } from "node:crypto";

/* ---------- Resposta ---------- */
export function json(data, status = 200) {
  return new Response(JSON.stringify(data), {
    status,
    headers: { "content-type": "application/json; charset=utf-8", "cache-control": "no-store" },
  });
}
export const erro = (status, code, msg) => json({ erro: code, msg }, status);

/* ---------- Senha ---------- */
const hash = (s) => createHash("sha256").update(String(s)).digest();
export function senhaConfigurada() {
  return Boolean(process.env.QG_SENHA);
}
export function autorizado(request) {
  const certa = process.env.QG_SENHA;
  if (!certa) return false;
  const enviada = request.headers.get("x-qg-senha") || "";
  return timingSafeEqual(hash(enviada), hash(certa));
}
// Pequena espera em senha errada para dificultar tentativas em sequência.
export async function negar() {
  await new Promise((r) => setTimeout(r, 800));
  return erro(401, "senha", "Senha incorreta.");
}

/* ---------- Redis (Upstash, via REST) ---------- */
const REDIS_URL = process.env.KV_REST_API_URL || process.env.UPSTASH_REDIS_REST_URL;
const REDIS_TOKEN = process.env.KV_REST_API_TOKEN || process.env.UPSTASH_REDIS_REST_TOKEN;
export const redisConfigurado = () => Boolean(REDIS_URL && REDIS_TOKEN);

export async function redis(...cmd) {
  const r = await fetch(REDIS_URL, {
    method: "POST",
    headers: { authorization: `Bearer ${REDIS_TOKEN}`, "content-type": "application/json" },
    body: JSON.stringify(cmd),
  });
  const out = await r.json();
  if (!r.ok || out.error) throw new Error(out.error || `redis ${r.status}`);
  return out.result;
}
export async function pipeline(cmds) {
  const r = await fetch(REDIS_URL + "/pipeline", {
    method: "POST",
    headers: { authorization: `Bearer ${REDIS_TOKEN}`, "content-type": "application/json" },
    body: JSON.stringify(cmds),
  });
  const out = await r.json();
  if (!r.ok) throw new Error(`redis ${r.status}`);
  for (const x of out) if (x.error) throw new Error(x.error);
  return out.map((x) => x.result);
}

// Converte o retorno de HGETALL ([campo, valor, campo, valor…]) em objeto.
export function pares(arr) {
  const o = {};
  for (let i = 0; i < (arr || []).length; i += 2) o[arr[i]] = arr[i + 1];
  return o;
}

/* ---------- Chaves ---------- */
export const K = {
  rev: "qg:rev", // contador global de versões
  estado: "qg:estado", // hash: chave do estado -> {r, d}
  notas: "qg:notas", // hash: id do PDF -> {t, em}
  pdfs: "qg:pdfs", // hash: id do arquivo -> {partes:[url], tamanho, tipo}
};
export const CHAVES_ESTADO = ["config", "grade", "feitos", "topicos", "simulados", "pdfs", "questoes"];
export const idValido = (s) => typeof s === "string" && /^[A-Za-z0-9_-]{1,64}$/.test(s);
