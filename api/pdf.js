// Arquivos PDF, guardados no Vercel Blob em partes de até 3,5 MB
// (o limite de corpo de uma função da Vercel é 4,5 MB).
//
// POST   /api/pdf?id=X&parte=N   corpo binário  -> grava a parte N
// POST   /api/pdf?id=X&fim=1     corpo {partes, tamanho, tipo} -> fecha o arquivo
// GET    /api/pdf?id=X           -> { partes: N, tamanho, tipo }
// GET    /api/pdf?id=X&parte=N   -> bytes da parte N
// DELETE /api/pdf?id=X           -> apaga o arquivo
//
// Os endereços no Blob têm sufixo aleatório e nunca saem do servidor:
// o navegador só acessa os bytes passando por esta rota, com a senha.
import { put, del } from "@vercel/blob";
import { json, erro, autorizado, negar, redis, K, idValido } from "./_lib.js";

const MAX_PARTE = 3.5 * 1024 * 1024;
const MAX_ARQUIVO = 25 * 1024 * 1024;
const pendentes = (id) => `qg:pdfup:${id}`; // partes enviadas e ainda não fechadas

function params(request) {
  const u = new URL(request.url).searchParams;
  return { id: u.get("id"), parte: u.get("parte"), fim: u.get("fim") };
}
async function manifesto(id) {
  const v = await redis("HGET", K.pdfs, id);
  return v ? JSON.parse(v) : null;
}

export async function GET(request) {
  if (!autorizado(request)) return negar();
  const { id, parte } = params(request);
  if (!idValido(id)) return erro(400, "id", "Id inválido.");
  const m = await manifesto(id);
  if (!m) return erro(404, "nao_existe", "Arquivo não encontrado.");
  if (parte == null) return json({ partes: m.partes.length, tamanho: m.tamanho, tipo: m.tipo });
  const url = m.partes[Number(parte)];
  if (!url) return erro(404, "parte", "Parte não encontrada.");
  const r = await fetch(url);
  if (!r.ok) return erro(502, "blob", "Falha ao ler o arquivo.");
  return new Response(r.body, {
    headers: { "content-type": "application/octet-stream", "cache-control": "private, max-age=31536000, immutable" },
  });
}

export async function POST(request) {
  if (!autorizado(request)) return negar();
  const { id, parte, fim } = params(request);
  if (!idValido(id)) return erro(400, "id", "Id inválido.");

  if (fim) {
    const body = await request.json().catch(() => null);
    const n = Number(body?.partes);
    if (!n || n > 20) return erro(400, "json", "Corpo inválido.");
    const urls = await redis("HGETALL", pendentes(id));
    const mapa = {};
    for (let i = 0; i < urls.length; i += 2) mapa[urls[i]] = urls[i + 1];
    const partes = Array.from({ length: n }, (_, i) => mapa[i]);
    if (partes.some((u) => !u)) return erro(400, "incompleto", "Faltam partes do arquivo.");
    await redis("HSET", K.pdfs, id, JSON.stringify({ partes, tamanho: body.tamanho || 0, tipo: body.tipo || "application/pdf" }));
    await redis("DEL", pendentes(id));
    return json({ id });
  }

  const i = Number(parte);
  if (!Number.isInteger(i) || i < 0 || i * MAX_PARTE >= MAX_ARQUIVO) return erro(400, "parte", "Parte inválida.");
  const bytes = await request.arrayBuffer();
  if (bytes.byteLength > MAX_PARTE) return erro(413, "too_large", "Parte grande demais.");
  const blob = await put(`pdfs/${id}/${i}.bin`, bytes, {
    access: "public",
    addRandomSuffix: true,
    contentType: "application/octet-stream",
  });
  await redis("HSET", pendentes(id), String(i), blob.url);
  await redis("EXPIRE", pendentes(id), 3600);
  return json({ ok: true });
}

export async function DELETE(request) {
  if (!autorizado(request)) return negar();
  const { id } = params(request);
  if (!idValido(id)) return erro(400, "id", "Id inválido.");
  const m = await manifesto(id);
  if (m?.partes?.length) await del(m.partes).catch(() => {});
  await redis("HDEL", K.pdfs, id);
  return json({ ok: true });
}
