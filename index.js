import express from "express";
import cors from "cors";
import session from "express-session";
import dotenv from "dotenv";
import db from "./config/Database.js";
import SequelizeStore from "connect-session-sequelize";
import UserRoute from "./routes/UserRoute.js";
import InterestRoute from "./routes/InterestRoute.js";
import AuthRoute from "./routes/AuthRoute.js";
import ScoreRoute from "./routes/ScoreRoute.js"

dotenv.config();

const app = express();

const sessionStore = SequelizeStore(session.Store);

const store = new sessionStore ({
    db: db
}); 

// (async()=>{
//     await db.sync();
// })();

app.use(session({
    secret: process.env.SESS_SECRET,
    resave: false,
    saveUninitialized: true,
    store: store,
    cookie: {
        secure: "auto"
    }
}));

app.use(cors({
    credentials: true,
    origin: process.env.Front_origin
}));
app.use(express.json());
app.use(UserRoute);
app.use(InterestRoute);
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

