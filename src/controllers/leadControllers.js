const LeadModel = require('../models/leadSchema')
const UserModel = require('../models/userSchema')
const { paginatedQuery } = require('../utils/queries')
const { queryBuilderToGetLeads } = require('../utils/leads')

const controller = {}

controller.getLeads = async (req, resp) => {
    let { limit, page } = req.query

    limit = Number.parseInt(limit)
    page = Number.parseInt(page)

    try {
        paginatedQuery(LeadModel, limit, page, queryBuilderToGetLeads, resp)
    } catch (err) {
        console.log(err)
        resp.status(500).json({ error: "Ocorreu um erro ao recuperar as leads" })
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