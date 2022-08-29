const UserModel = require('../models/userSchema')
const LeadModel = require('../models/leadSchema')

const utils = {}

utils.createLead = async (userId) => {
    try {
        return await LeadModel.create({ userId })
    } catch (err) {
        console.log(err)
        await UserModel.findByIdAndDelete(userId)
    }
}

module.exports = utils
