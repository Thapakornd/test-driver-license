import mongoose from "mongoose";

const connectDb = async (url) => {
    try {
        mongoose.connect(url).then(() => {
            console.log(`Connected to MONGO Database server!`);
        })
    } catch (error) {
        console.log(error)
        throw new Error(error)
    }
}

export default connectDb;