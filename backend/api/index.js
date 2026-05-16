import app from "../src/server.js";
import connectDB from "../config/db.js";


const handler = async (req, res) => {
    try {
        await connectDB();
        return app(req, res);
    } catch (error) {
        res.status(500).send("Database connection error");
    }
};

export default handler;