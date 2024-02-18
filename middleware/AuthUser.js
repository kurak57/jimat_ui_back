import User from "../models/UserModel.js";
import jwt from "jsonwebtoken"


export const verifyUser = (req, res, next) => {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1]
    if(token == null) return res.sendStatus(401);
    jwt.verify(token, process.env.JWT_ACCESS, (err, decoded) => {
        if(err) return res.sendStatus(403);
        req.email = decoded.email
        req.userId = decoded.id;
        next();
    })
}

export const adminOnly = async (req, res, next) => {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];
    if (!token) return res.sendStatus(401);

    jwt.verify(token, process.env.JWT_ACCESS, async (err, decoded) => {
        if (err) return res.sendStatus(403);
        if (decoded.role !== "admin") return res.status(403).json({ msg: "Akses dilarang" });
        next();
    });
};

