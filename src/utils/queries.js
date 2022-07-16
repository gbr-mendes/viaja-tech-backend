const utils = {}

const getModelCount = async (model) => {
    const count = await model.count()
    return count
}

utils.paginatedQuery = async (Model, limit, page, resp, queryBuilder = null, fields = []) => {
    const total = await getModelCount(Model)
    const results = {}
    results.next = null

    const query = await Model.find({})
        .limit(limit || 5)
        .skip((page - 1) * limit || 0)
        .select(fields)

    if (total > page * limit) {
        results.next = `${process.env.HOST}/leads?page=${page + 1 || 2}&limit=${limit || 5}`
    }

    results.total = total
    results.results = queryBuilder ? await queryBuilder(query) : query

    return resp.status(200).json(results)
}

module.exports = utils