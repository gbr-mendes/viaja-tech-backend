const mongoose = require("mongoose");

const connect = async () => {
    try {
        mongoose.connect(process.env.MONGODB_URI, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
        });
        console.log("Database connected...");
    } catch (e) {
        console.log("Error on database connection: ", e.message);
    }
};
module.exports = {
    connect
};