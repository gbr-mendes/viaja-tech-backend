const LeadModel = require('../models/leadSchema')
const UserModel = require('../models/userSchema')
const leadsUtils = require('../utils/leads')

const controller = {}

controller.getLeads = async (req, resp) => {
    let { limit, page } = req.query
    limit = Number.parseInt(limit)
    page = Number.parseInt(page)

    const results = {}
    results.next = null
    try {
        const total = await LeadModel.find({})
        const leads = await LeadModel.find({})
            .limit(limit || 5)
            .skip((page - 1) * limit || 0)

        const next = await LeadModel.find({})
            .limit(limit || 5)
            .skip(page * limit || 5)

        if (next.length > 0) {
            results.next = `${process.env.HOST}/leads?page=${page + 1 || 2}&limit=${limit || 5}`
        }

        results.total = total.length //Temp resolution
        results.results = await leadsUtils.queryBuilderToGetLeads(leads)
        resp.status(200).json(results)
    } catch (err) {
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