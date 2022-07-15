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

app.use('/users', userRoutes)
app.use('/leads', leadRoutes)
app.use('/employee', employeeRoutes)

module.exports = app
