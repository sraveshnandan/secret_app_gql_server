import dotenv from "dotenv";
dotenv.config();

const Port = process.env.PORT;
const MongoDbUri = process.env.MONGODB_URI;
const StatusSecret = process.env.STATUS_SECRET;


export  { Port, MongoDbUri, StatusSecret};
