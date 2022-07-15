const jwt = require('jsonwebtoken')
const UserModel = require('../models/userSchema')

const middlewares = {}

middlewares.authenticationRequired = (req, resp, next) => {
    const { authorization } = req.headers
    if (!authorization) {
        return resp.status(401).send({ error: 'Autenticação requerida' })
    }
    const token = authorization.split(" ")[1]
    jwt.verify(token, process.env.TOKEN_SECRET, function (err, decoded) {
        if (err) {
            return resp.status(401).send({ error: 'Token inválido.' });
        }
        next()
    })
}

module.exports = middlewares