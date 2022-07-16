const utils = {}

const getModelCount = async (model) => {
    const count = await model.count()
    return count
}

utils.paginatedQuery = async (Model, limit = 5, page = 1, resp, queryBuilder = null, fields = []) => {
    const total = await getModelCount(Model)
    const results = {}
    results.next = null

    limit = Number.parseInt(limit)
    page = Number.parseInt(page)

    const query = await Model.find({})
        .limit(limit)
        .skip((page - 1) * limit)
        .select(fields)

    if (total > (page * limit)) {
        results.next = `${process.env.HOST}/leads?page=${page + 1}&limit=${limit}`
    }

    results.total = total
    results.results = queryBuilder ? await queryBuilder(query) : query

    return resp.status(200).json(results)
}

module.exports = utils