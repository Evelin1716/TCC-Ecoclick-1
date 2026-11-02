// Erro "esperado" com status HTTP, código estável e mensagem em português para o usuário.
class AppError extends Error {
  constructor(status, code, message, extra) {
    super(message || code);
    this.status = status;
    this.code = code;
    this.extra = extra || null;
  }
}
const badRequest = (message, code = 'bad_request', extra) => new AppError(400, code, message, extra);
const unauthorized = (message = 'Faça login para continuar.') => new AppError(401, 'unauthorized', message);
const forbidden = (message = 'Você não tem permissão para isso.', code = 'forbidden') => new AppError(403, code, message);
const notFound = (message = 'Não encontrado.') => new AppError(404, 'not_found', message);
const conflict = (message, code = 'conflict', extra) => new AppError(409, code, message, extra);

module.exports = { AppError, badRequest, unauthorized, forbidden, notFound, conflict };
