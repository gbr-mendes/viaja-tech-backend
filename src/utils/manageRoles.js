const UserModel = require('../models/userSchema')
const LeadModel = require('../models/leadSchema')
const EmployeeModel = require('../models/employeeSchema')

const utils = {}

utils.createLead = async (userId) => {
    try {
        return await LeadModel.create({ user: userId })
    } catch (err) {
        console.log(err)
        await UserModel.findByIdAndDelete(userId)
    }
}

const createEmployee = async (userId, roles, data) => {
    const employeeData = {}
    const { salary } = data
    employeeData.user = userId
    employeeData.salary = salary

    if (roles.includes('isAdmin')) {
        employeeData.position = 'General Manager'
    } else if (roles.includes('isSiteAdmin')) {
        employeeData.position = 'Content Manager'
    } else if (roles.includes('isSalesManager')) {
        employeeData.position = 'Sales Manager'
    }

    try {
        await EmployeeModel.create(employeeData)
    } catch (err) {
        console.log(err)
        await UserModel.findByIdAndDelete(userId)
    }
}

utils.setUserRole = (userId, data) => {
    const { roles } = data

    // All users created are also leads
    createLead(userId)

    if (
        roles.includes('isSiteAdmin') ||
        roles.includes('isSalesManager') ||
        roles.includes('isAdmin')
    ) {
        createEmployee(userId, roles, data)
    }

}

module.exports = utils
