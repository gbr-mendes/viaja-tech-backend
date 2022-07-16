const LeadModel = require('../models/leadSchema')
const UserModel = require('../models/userSchema')
const { paginatedQuery } = require('../utils/queries')
const { queryBuilderToGetLeads } = require('../utils/leads')

const controller = {}

controller.getLeads = async (req, resp) => {
    let { limit, page } = req.query

    try {
        return paginatedQuery(LeadModel, limit, page, resp, queryBuilder = queryBuilderToGetLeads, fields = ["-__v"])
    } catch (err) {
        console.log(err)
        return resp.status(500).json({ error: "Ocorreu um erro ao recuperar as leads" })
    }
}

controller.getLeadById = async (req, resp) => {
    const { id } = req.params
    try {
        const lead = await LeadModel.findById(id)
        if (!lead) {
            resp.status(400).json({ error: 'Lead not found' })
            return
        }
        const { user } = lead
        const userData = await UserModel.findById(user).select(['name', 'email', 'cpf', 'phone'])
        const payload = { ...lead.toObject(), ...userData.toObject() }
        resp.status(200).json(payload)
    } catch (err) {
        console.log(err)
        resp.status(500).json({ erro: "An error has ocurred" })
    }
}

module.exports = controller