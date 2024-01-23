import mongoose from "mongoose";
import { Server } from "socket.io"; 
import app from "./app.js";
import logger from "./configs/logger.config.js";
import dotenv from "dotenv";
import SocketServer from "./utils/SocketServer.js";
import { errorHandler } from "./helpers/errorHandler.js";

dotenv.config();

const { DATABASE_URL } = process.env;
const PORT = process.env.PORT

//exit on mongodb error
mongoose.connection.on('error', (err) => {
     errorHandler(`MongoDb connection error: ${ err }`);
    process.exit(1);
});

//mongodb debug mode
if(process.env.NODE_ENV !== "production"){
    mongoose.set('debug', true);
}

//mongodb connection
mongoose.connect(DATABASE_URL, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
}).then(() => {
    logger.info('Connected to mongoDb');
});

let server;

server = app.listen(PORT, () => {
    logger.info(`Server is listening to PORT ${ PORT }`);
});

//socket io
const io = new Server(server, {
    pingTimeout: 60000,
    cors: {
        origin: process.env.CLIENT_ENDPOINT,
    }
});

io.on("connection", (socket) => {
    logger.info('Socket io connected successfully');
    SocketServer(socket, io);
});


//handle server errors

const exitHandler =() => {
    if(server){
        logger.info("Sever closed");
        process.exit(1);
    }else{
        process.exit(1);
    }
}
const unexpectedErrorHandler=(error) => {
    logger.error(error);
    exitHandler();
}
process.on("uncaughtException", unexpectedErrorHandler);
process.on("unhandledRejection", unexpectedErrorHandler);

//SIGTERM
process.on("SIGTERM", () => {
    if(server){
        logger.info("Server closed.");
        process.exit(1);
    }
})