const express = require("express");
const app = express();
const dotenv = require("dotenv").config();
const morgan = require("morgan");
const ConnectToDB = require("./config/DataBase");
const errorHandler = require("./middlewares/errorMiddleware");
const notfoundHandler = require("./middlewares/notfoundMiddleware");
const AllRoutes = require('./routes');
//Connection to database
ConnectToDB();

//Middlewares
app.use(express.json());
if(process.env.NODE_ENV === "development") {
    app.use(morgan("dev")); 
}

//Routes
AllRoutes(app);

app.use(notfoundHandler)
app.use(errorHandler)

//Run server
PORT = process.env.PORT || 5000;
const server = app.listen(PORT,()=> console.log(`Server is running on ${PORT} with ${process.env.NODE_ENV} mode`));

//handle errors outside express
process.on('unhandledRejection',(err)=>{
    console.error(`UnhandledRejection Errors : ${err.name} ${err.message}`);
    server.close(()=>{
        console.error('Application shutting down...');
        process.exit(1);
    });
});

