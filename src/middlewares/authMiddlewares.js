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

middlewares.checkRolesSetOnUserCreation = (req, resp, next) => {
    const { roles } = req.body
    if (
        roles.includes('isAdmin') ||
        roles.includes('isSiteAdmin') ||
        roles.includes('isSalesManager')) {
        const authToken = req.header('auth-token')
        if (!authToken) {
            resp.status(401).json({ error: "Permissão Negada" })
            return
        }
        jwt.verify(authToken, process.env.TOKEN_SECRET, async function (err, decoded) {
            if (err) {
                resp.status(401).send({ error: 'Token inválido.' });
                return
            }
            const { email } = decoded
            const user = await UserModel.findOne({ email })
            if (user) {
                const userRoles = user.roles
                if (!userRoles.includes('isAdmin')) {
                    resp.status(403).json({ error: 'Proibido' })
                    return
                } else {
                    next()
                }
            } else {
                resp.status(401).json({ error: "Token inválido" })
                return
            }
        })
    } else {
        next()
    }
}

module.exports = middlewares