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
        if(!user.isVerified){
            let emailToken = await Token.findOne({ where: { userId: user.id }, });
            if (!emailToken) {
                emailToken = await Token.create({
                    userId: user.uuid,
                    token: crypto.randomBytes(32).toString("hex") 
                 })
                const url = `${process.env.Base_url}/users/${user.uuid}/verify/${emailToken.token}`;
                await sendEmail(user.email, "Verify Email", url);
            } 
            return res.status(400).send({ msg: "An Email sent to your account please verify" });
        }
       const id = user.id
       const name = user.name
       const email = user.email
       const fakultas = user.fakultas
       const role = user.role

       const accessToken = jwt.sign({id, name, email, fakultas, role}, process.env.JWT_ACCESS, {
        expiresIn: '20s'
       });
       const refreshToken = jwt.sign({id, name, email, fakultas, role}, process.env.JWT_REFRESH, {
        expiresIn: '1d'
       });
       await User.update({refresh_token:refreshToken}, {
        where: {
            id : user.id
        }
       });
       res.cookie('refreshToken', refreshToken, {
        httpOnly: true,
        maxAge: 24 * 60 * 60 * 1000,
        secure: false
       })
       res.json({accessToken})

    } catch (error) {
        res.status(500).send({ msg: "Internal Server Error" });
    } 
};

export const Me = async (req, res) => {
    try {
        const refreshToken = req.cookies.refreshToken;
        if (!refreshToken) {
            return res.status(401).json({ msg: "Silahkan login ke akun anda" });
        }
        jwt.verify(refreshToken, process.env.JWT_REFRESH, async (err, decoded) => {
            if (err) {
                return res.status(401).json({ msg: "Token tidak valid" });
            } else {
                const userId = decoded.id;
                const user = await User.findOne({
                    attributes: ['uuid', 'fakultas', 'name', 'email', 'role'],
                    where: {
                        id: userId
                    }
                });
                if (!user) {
                    return res.status(404).json({ msg: "User tidak ditemukan" });
                }
                return res.status(200).json(user);
            }
        });
    } catch (error) {
        res.status(500).send({ msg: "Internal Server Error" });
    }
};

export const logOut = async (req, res) => {
    try {
        const refreshToken = req.cookies.refreshToken
        if(!refreshToken) return res.sendStatus(204);
        const user = await User.findOne({
            where: {
                refresh_token: refreshToken
            }
        });
        if(!user) return res.sendStatus(204);
        const userId = user.id;
        await User.update({refreshToken: null}, {
            where: {
                id: userId
            }
        });
        res.clearCookie('refreshToken');
        return res.sendStatus(200);
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