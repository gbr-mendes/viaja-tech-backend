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
    const { role, _id } = user
    const payload = {}
    payload.userInfo = user
    if (role == 'isLead') {
        payload.leadInfo = await LeadModel.findOne({ user: _id })
    }

    if (role == 'isClient') {
        payload.clientInfo = await ClientModel.findOne({ user: _id })
    }

    if (role == 'isAdmin' || role == 'isSiteAdmin' || role == 'isSalesManager') {
        payload.employeeInfo = await EmployeeModel.findOne({ user: _id })
    }

    return payload
}

utils.getToken = (req) => {
    const { authorization } = req.headers
    if (authorization) {
        const token = authorization.split(' ')[1]
        return token
    }
    return null
}

module.exports = utils