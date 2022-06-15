const UserModel = require('../models/userSchema')

const utils = {}

utils.queryBuilderToGetLeads = async (leads) => {
    const results = await Promise.all(leads.map(async lead => {
        const { user } = lead
        const userData = await UserModel.findById(user).select(['-_id', 'name', 'email', 'phone', 'cpf'])
        const result = { ...userData.toObject(), ...lead.toObject() }
        return result
    }))
    return results
}

module.exports = utils
