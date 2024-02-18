import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import db from "./config/Database.js";
import cookieParser from "cookie-parser"
import UserRoute from "./routes/UserRoute.js";
import AuthRoute from "./routes/AuthRoute.js";
import ScoreRoute from "./routes/ScoreRoute.js"

dotenv.config();
const app = express();

// (async()=>{
//     await db.sync();
// })();
try {
    await db.authenticate();
    console.log('Database Connected...');
} catch (error) {
    console.log(error);
}

app.use(cors({
    credentials: true,
    origin: process.env.Base_url
}));

app.use(cookieParser())
app.use(express.json());
app.use(UserRoute);
app.use(AuthRoute);
app.use(ScoreRoute);


// store.sync();

const port = process.env.PORT || 5000

app.get('/', (req, res) => {
    res.send('API JIMAT UI RUNNING')
});

app.get('/favicon.ico', (req, res) => {
    res.sendStatus(404);
});

app.listen(port, () => {
    console.log(`Server berjalan di http://localhost:${port}`);
});
