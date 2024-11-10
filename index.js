import http from "http"
import { Server } from "socket.io";
import dotenv from "dotenv"
import express from 'express'
import cookieParser from 'cookie-parser'
import morgan from 'morgan'
import { addMsgToConversation } from "./controllers/msgController.js";
import AppError from "./utils/appError.js";
import connectToMongoDB from './db/connectToMongoDb.js';
import convRouter from "./routes/ConversationRouter.js";
import cors from 'cors'
import msgRouter from "./routes/MessageRouter.js";
import { globalErrorHandler } from './controllers/errorController.js';
import { subscribe, publish } from "./redis/pubsub.js";
import compression  from 'compression'

process.on('uncaughtException', err => {
    console.log('UNCAUGHT EXCEPTION! 💥 Shutting down...');
    console.log(err.name, err.message);
    process.exit(1);
  });
   
  
  


dotenv.config();
const PORT = process.env.PORT ;

const app = express();



const server = http.createServer(app);
const io = new Server(server, {
   cors: {
       allowedHeaders: ["*"],
       origin: `${process.env.CLIENT_URL}`
     }
});


app.use(cors({
  origin: `${process.env.CLIENT_URL}`,
  credentials: true,
  sameSite: 'none'
}));
const logRequestInfo = (req, res, next) => {
  console.log(`[${new Date().toLocaleString()}] ${req.method} ${req.url}`);
  next();
};

app.use(morgan('dev'));

app.use(cookieParser());
app.use(express.json());
app.use(logRequestInfo);
app.use(compression());

const userSocketMap = {};







process.on('unhandledRejection', err => {
    console.log('UNHANDLED REJECTION! 💥 Shutting down...');
    console.log(err.name, err.message);
    server.close(() => {
      process.exit(1);
    });
  });
  
  



io.on("connection", (socket) => {
   const user = socket.handshake.query.user;
   console.log('connected Username:', user);
   userSocketMap[user] = socket;

    const channelName = `chat_${user}`
   subscribe(channelName, (msg) => {
         console.log('Received message for channel', msg);
         socket.emit("chat msg", JSON.parse(msg));
   });

   socket.on('chat msg', (msg) => {

        console.log('socket msg->' ,msg);
        const receiverSocket = userSocketMap[msg.receiver];
        if(receiverSocket) {
          //both sender and receiver are connected to same BE
          receiverSocket.emit('chat msg', msg);
        }else {
          // sender and receiver on diff BEs, so we need to use pubsub
          const channelName = `chat_${msg.receiver}`
          publish(channelName, JSON.stringify(msg));
        } 
      
   });




})





server.listen(PORT, (req, res) => {
  connectToMongoDB()

   console.log(`Server is running at ${PORT}`);
})




app.get('/', (req, res) => {
  res.send("Welcome to HHLD Chat App!");
});
app.use('/api/chat/v1',convRouter)
app.use('/api/msg/v2',msgRouter)


app.all('*',(req,res,next) =>{
  /*const err = new Error('cannot find url on this server')
  err.status = 'fail',
  err.statusCode = 404;*/
  next(new AppError('cannot find url on this server',404));
  })
  


    app.use(globalErrorHandler) 