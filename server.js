require('dotenv').config()

const app = require('./src/index')
const PORT = 3000

app.listen(process.env.PORT || PORT, () => console.log(`Server listening at port ${PORT}`))
