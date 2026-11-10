// Anotações de cada PDF.
// GET /api/notas?id=X · PUT /api/notas?id=X (corpo {t, em}) · DELETE /api/notas?id=X
import { json, erro, autorizado, negar, redis, K, idValido } from "./_lib.js";

function lerId(request) {
  const id = new URL(request.url).searchParams.get("id");
  return idValido(id) ? id : null;
}

export async function GET(request) {
  if (!autorizado(request)) return negar();
  const id = lerId(request);
  if (!id) return erro(400, "id", "Id inválido.");
  const v = await redis("HGET", K.notas, id);
  return json(v ? { existe: true, dados: JSON.parse(v) } : { existe: false });
}

export async function PUT(request) {
  if (!autorizado(request)) return negar();
  const id = lerId(request);
  if (!id) return erro(400, "id", "Id inválido.");
  const body = await request.json().catch(() => null);
  if (!body || typeof body.t !== "string") return erro(400, "json", "Corpo inválido.");
  await redis("HSET", K.notas, id, JSON.stringify({ t: body.t, em: body.em || new Date().toISOString() }));
  return json({ ok: true });
}

export async function DELETE(request) {
  if (!autorizado(request)) return negar();
  const id = lerId(request);
  if (!id) return erro(400, "id", "Id inválido.");
  await redis("HDEL", K.notas, id);
  return json({ ok: true });
}
