// Permite usar async/await nas rotas: qualquer erro vai para o middleware de erros.
module.exports = (fn) => (req, res, next) => Promise.resolve(fn(req, res, next)).catch(next);
