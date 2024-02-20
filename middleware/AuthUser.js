import User from "../models/UserModel.js";
import jwt from "jsonwebtoken"


export const verifyUser = (req, res, next) => {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1]
    if(token == null) return res.status(401).json({msg: "Silahkan login ke akun anda"});
    jwt.verify(token, process.env.JWT_ACCESS, (err, decoded) => {
        if(err) return res.status(403).json({msg: 'Token tidak valid'});
        req.email = decoded.email
        req.userId = decoded.id;
        req.role = decoded.role
        next();
    })
}

export const adminOnly = async (req, res, next) => {
    const user = await User.findOne({
        where: {
            id: req.userId
        }
    });
    if(!user) return res.status(404).json({msg: "User tidak ditemukan"});
    if(user.role !== "admin") return res.status(403).json({msg: "Akses dilarang"});
    next();
}