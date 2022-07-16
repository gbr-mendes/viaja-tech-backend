const express = require('express')
const cors = require('cors')
const db = require('./config/db')

const app = express()
app.use(cors())
app.use(express.json())

// Database connection
db.connect()

// Routes
const userRoutes = require('./routes/userRoutes')
const leadRoutes = require('./routes/leadRoutes')
const employeeRoutes = require('./routes/employeeRoutes')

const URL_PREFIX = '/api/v1'

app.use(`${URL_PREFIX}/users`, userRoutes)
app.use(`${URL_PREFIX}/leads`, leadRoutes)
app.use(`${URL_PREFIX}/employee`, employeeRoutes)

module.exports = app
