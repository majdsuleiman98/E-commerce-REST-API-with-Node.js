const {Product} = require('../../models/Product');
const ConnectToDB = require('../../config/DataBase');
const fs = require('fs');
const dotenv = require("dotenv");
dotenv.config({path: '../../.env'})

ConnectToDB();


const products = JSON.parse(fs.readFileSync('./products.json'));

const InsertData = async()=>{
    try {
        await Product.insertMany(products);
        console.log('Data Inserted...');
        process.exit();
    } catch (error) {
        console.log(error);
    }
}

const DestroytData = async()=>{
    try {
        await Product.deleteMany();
        console.log('Data Destroyed...');
        process.exit();
    } catch (error) {
        console.log(error);
    }
}

if(process.argv[2] === '-i') {
    InsertData();
}
else if(process.argv[2] === '-d'){
    DestroytData();
}