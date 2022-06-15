const UserModel = require('../models/userSchema')
const LeadModel = require('../models/leadSchema')
const ClientModel = require('../models/clientSchema')
const EmployeeModel = require('../models/employeeSchema')

const utils = {}


utils.emailAlreadyRegistered = async (email) => {
    const user = await UserModel.findOne({ email })
    return user ? true : false
}

utils.cpfAlreadyRegistered = async (cpf) => {
    const user = await UserModel.findOne({ cpf })
    return user ? true : false
}

utils.getUserInfoByRole = async (user) => {
    const { roles, _id } = user

    const payload = {}
    payload.userInfo = user
    if (roles.includes('isLead')) {
        payload.leadInfo = await LeadModel.findOne({ user: _id })
    }

    if (roles.includes('isClient')) {
        payload.clientInfo = await ClientModel.findOne({ user: _id })
    }

    if (roles.includes('isAdmin') || roles.includes('isSiteAdmin') || roles.includes('isSalesManager')) {
        payload.employeeInfo = await EmployeeModel.findOne({ user: _id })
    }

    return payload
}

module.exports = utils