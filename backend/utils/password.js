const bcrypt = require('bcryptjs');
const ROUNDS = 12;
// Hash fictício: gasta o mesmo tempo quando o e-mail não existe (evita descobrir contas pelo tempo de resposta)
const DUMMY = bcrypt.hashSync('eco-dummy-password', ROUNDS);

const hash = (plain) => bcrypt.hash(plain, ROUNDS);
const verify = (plain, hashed) => bcrypt.compare(plain, hashed || DUMMY).then((ok) => ok && !!hashed);

module.exports = { hash, verify };
