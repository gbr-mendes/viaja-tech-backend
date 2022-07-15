const jwt = require('jsonwebtoken')
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
        const { authorization } = req.headers
        const token = authorization.split(" ")[1]

        jwt.verify(token, process.env.TOKEN_SECRET, async function (err, decoded) {
            if (err) {
                return resp.status(401).json({ error: 'Token inválido.' });
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