// Estado do app (progresso, grade, questões, simulados, lista de PDFs…).
// GET  /api/estado?desde=N  -> { rev, docs: { chave: dados } } só com o que mudou depois da versão N
// PUT  /api/estado?k=chave  -> grava os dados da chave e devolve { rev }
import { json, erro, autorizado, negar, redis, pipeline, pares, K, CHAVES_ESTADO } from "./_lib.js";

export async function GET(request) {
  if (!autorizado(request)) return negar();
  const desde = Number(new URL(request.url).searchParams.get("desde")) || 0;
  const rev = Number(await redis("GET", K.rev)) || 0;
  if (desde && rev === desde) return json({ rev, docs: {} });
  const todos = pares(await redis("HGETALL", K.estado));
  const docs = {};
  for (const [k, v] of Object.entries(todos)) {
    const { r, d } = JSON.parse(v);
    if (!desde || r > desde) docs[k] = { r, d };
  }
  return json({ rev, docs });
}

export async function PUT(request) {
  if (!autorizado(request)) return negar();
  const k = new URL(request.url).searchParams.get("k");
  if (!CHAVES_ESTADO.includes(k)) return erro(400, "chave", "Chave desconhecida.");
  let d;
  try {
    d = await request.json();
  } catch {
    return erro(400, "json", "Corpo inválido.");
  }
  const rev = await redis("INCR", K.rev);
  await pipeline([["HSET", K.estado, k, JSON.stringify({ r: rev, d })]]);
  return json({ rev });
}
