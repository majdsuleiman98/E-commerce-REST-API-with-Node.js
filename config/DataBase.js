const mongoose = require("mongoose");

const ConnectToDB = async()=>{
    try {
        await mongoose.connect(process.env.MONGO_URI);
        console.log("DataBase Connected Successfully...");
    } catch (error) {
        console.log(`DataBase Error - ${error}`);
        process.exit(1);
    }
}

module.exports = ConnectToDB;