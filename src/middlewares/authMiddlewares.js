const jwt = require('jsonwebtoken')
const { getToken } = require('../utils/users')

const middlewares = {}

middlewares.authenticationRequired = (req, resp, next) => {
    const { authorization } = req.headers
    if (!authorization) {
        return resp.status(401).send({ error: 'Autenticação requerida' })
    }
    const token = getToken(req)
    jwt.verify(token, process.env.TOKEN_SECRET, function (err, decoded) {
        if (err) {
            return resp.status(401).send({ error: 'Token inválido.' });
        }
        next()
    })
}

module.exports = middlewares