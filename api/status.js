// GET /api/status — diz se o servidor está configurado e se a senha enviada está certa.
import { json, autorizado, senhaConfigurada, redisConfigurado, negar } from "./_lib.js";

export async function GET(request) {
  const info = {
    senha: senhaConfigurada(),
    banco: redisConfigurado(),
    arquivos: Boolean(process.env.BLOB_READ_WRITE_TOKEN || process.env.BLOB_STORE_ID),
  };
  if (request.headers.get("x-qg-senha") != null) {
    if (!autorizado(request)) return negar();
    info.ok = true;
  }
  return json(info);
}
