import dotenv from "dotenv";
dotenv.config();

const Port = process.env.PORT;
const MongoDbUri = process.env.MONGO_URI;
const StatusSecret = process.env.STATUS_SECRET;
const JWT_SECRET =process.env.JWT_PRIVATE_KEY;



export  { Port, MongoDbUri, StatusSecret, JWT_SECRET};
