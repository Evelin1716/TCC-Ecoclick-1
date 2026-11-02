const { badRequest } = require('../utils/AppError');

/** Valida body/query/params com um schema zod e substitui pelos valores já limpos. */
const validate = (schemas) => (req, _res, next) => {
  for (const part of ['params', 'query', 'body']) {
    if (!schemas[part]) continue;
    const r = schemas[part].safeParse(req[part]);
    if (!r.success) {
      const first = r.error.issues[0];
      const where = first.path.length ? ` (${first.path.join('.')})` : '';
      return next(badRequest(`${first.message}${where}`, 'validation_error', { issues: r.error.issues.map((i) => ({ path: i.path.join('.'), message: i.message })) }));
    }
    if (part === 'query') Object.defineProperty(req, 'query', { value: r.data, configurable: true, writable: true });
    else req[part] = r.data;
  }
  next();
};

module.exports = validate;
