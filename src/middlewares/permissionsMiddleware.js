const jwt = require('jsonwebtoken')
const { getToken } = require('../utils/users')
const middlewares = {}

const checkRole = (roles, userRole) => {
    let allowed = false
    if (roles.includes(userRole)) {
        allowed = true
    }
    return allowed
}

middlewares.verifyPermission = (roles) => {
    return (req, resp, next) => {
        const token = getToken(req)

        jwt.verify(token, process.env.TOKEN_SECRET, async function (err, decoded) {
            if (err) {
                return resp.status(401).json({ error: 'Token inválido ou não informado.' });
            }
            const { role: userRole } = decoded
            const allowed = checkRole(roles, userRole)
            if (allowed) {
                return next()
            } else {
                return resp.status(403).json({ error: "Permissão negada" })
            }
        })
    }
}

module.exports = middlewares