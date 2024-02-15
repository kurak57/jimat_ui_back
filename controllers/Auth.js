import Token from "../models/TokenModel.js";
import sendEmail from "../utils/sendEmail.js";
import crypto from "crypto";
import User from "../models/UserModel.js";
import argon2 from 'argon2';
import jwt from 'jsonwebtoken';

export const Login = async (req, res) => {
    try {
        const user = await User.findOne({
            where: {
                email: req.body.email
            }
        });
        if(!user) return res.status(404).json({msg: "User tidak ditemukan"});
        const match = await argon2.verify(user.password, req.body.password);
        if(!match) return res.status(400).json({msg: "Password Salah"});
        req.session.userId = user.uuid;
    } catch (error) {
        res.status(500).send({ msg: "Internal Server Error" });
    }
    
};

export const Me  = async (req, res) => {
    try {
        if(!req.session.userId){
            return res.status(401).json({msg: "Mohon login ke akun anda!"})
        };
        const user = await User.findOne({
            attributes: ['uuid', 'fakultas', 'name', 'email', 'role'],
            where: {
                uuid: req.session.userId
            }
        });
        if(!user) return res.status(404).json({msg: "User tidak ditemukan"});
        res.status(200).json(user);
    } catch (error) {
        res.status(500).send({ msg: "Internal Server Error" });
    }
}

export const logOut = (req, res) => {
    try {
        req.session.destroy((err) => {
            if(err) return res.status(400).json({msg: "Logout gagal"});
            res.status(200).json({msg: "Anda telah logout"});
        });
    } catch (error) {
        res.status(500).send({ msg: "Internal Server Error" });
    }
}

export const verifyToken = async (req, res) => {
    try {
        const user = await User.findOne({ 
            where: { 
                uuid: req.params.id 
            }
        });
        if (!user) return res.status(400).send({ msg: "user tidak ditemukan" });

        const token = await Token.findOne({
            where: { userId: user.uuid, token: req.params.token },
        });
        if (!token) return res.status(400).send({ msg: "Invalid link, token salah" });
        await User.update({
            isVerified: true,
        }, {
            where:{
                id: user.id
            }
        });
        await token.destroy();
        res.status(200).send({ msg: "Email verified successfully" });
    } catch (error) {
        res.status(500).send({ msg: "Internal Server Error" });
    }
}