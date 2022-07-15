const jwt = require('jsonwebtoken')
const middlewares = {}

const checkRole = (roles, userRoles) => {
    let allowed = false
    roles.map(role => {
        if (userRoles.includes(role)) {
            allowed = true
        }
    })
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
            const { roles: userRoles } = decoded
            const allowed = checkRole(roles, userRoles)
            if (allowed) {
                return next()
            } else {
                return resp.status(403).json({ error: "Permissão negada" })
            }
        })
    }
}

module.exports = middlewares