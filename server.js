require('dotenv').config()

const app = require('./src/index')
const PORT = 3001

app.listen(process.env.PORT || PORT, () => console.log(`Server listening at port ${PORT}`))
