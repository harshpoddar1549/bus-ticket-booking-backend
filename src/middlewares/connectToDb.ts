import mongoose from "mongoose";

export const connectToDb = async () =>{
    try{
        const url = `mongodb://${process.env.DB_USERNAME}:${process.env.DB_PASSWORD}@ac-anzbgod-shard-00-00.nshatai.mongodb.net:27017,ac-anzbgod-shard-00-01.nshatai.mongodb.net:27017,ac-anzbgod-shard-00-02.nshatai.mongodb.net:27017/${process.env.DB_NAME}?ssl=true&replicaSet=atlas-fv1jj2-shard-0&authSource=admin&retryWrites=true&w=majority`
        const connectObj = await mongoose.connect(url)
        console.log("[INFO] Connected to Database:- hostname: " +  connectObj.connection.host + " dbName: " + connectObj.connection.name)
    }
    catch(err){
        console.log('[ERROR] Error: ', err)
        process.exit(1)
    }
}