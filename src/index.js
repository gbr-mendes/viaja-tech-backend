const express = require('express')
const cors = require('cors')
const db = require('./config/db')
const swaggerUi = require('swagger-ui-express')
const swaggerDocument = require('./swagger.json')

const app = express()
app.use(cors())
app.use(express.json())

// Database connection
db.connect()

// Routes
const userRoutes = require('./routes/userRoutes');
const leadRoutes = require('./routes/leadRoutes');
const employeeRoutes = require('./routes/employeeRoutes');
const packagesRoutes = require('./routes/packageRoutes');

const URL_PREFIX = '/api/v1'

app.use(`${URL_PREFIX}/users`, userRoutes);
app.use(`${URL_PREFIX}/leads`, leadRoutes);
app.use(`${URL_PREFIX}/employee`, employeeRoutes);
app.use(`${URL_PREFIX}/packages`, packagesRoutes);
app.use(`${URL_PREFIX}/docs`, swaggerUi.serve, swaggerUi.setup(swaggerDocument));

module.exports = app
