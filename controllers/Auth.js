import Token from "../models/TokenModel.js";
import sendEmail from "../Utils/sendEmail.js";
import crypto from "crypto";
import User from "../models/UserModel.js";
import argon2 from 'argon2';

export const Login = async (req, res) => {
    const user = await User.findOne({
        where: {
            email: req.body.email
        }
    });
    if(!user) return res.status(404).json({msg: "User tidak ditemukan"});
    const match = await argon2.verify(user.password, req.body.password);
    if(!match) return res.status(400).json({msg: "Password Salah"});
    req.session.userId = user.uuid;

    if(!user.verified){
        let token = await Token.findOne({ where: { userId: user.uuid }, });
        if (!token) {
            token = await Token.create({
                userId: user.uuid,
                token: crypto.randomBytes(32).toString("hex") 
             })
            const url = `${process.env.Front_origin}/users/${user.uuid}/verify${token.token}`;
            await sendEmail(user.email, "Verify Email", url);
        }
        return res.status(400).send({ message: "An Email sent to your account please verify" });
    }

    const uuid = user.uuid;
    const name = user.name;
    const email = user.email;
    const role = user.role;
    res.status(200).json({uuid, name, email, role});
};

export const Me  = async (req, res) => {
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
}

export const logOut = (req, res) => {
    req.session.destroy((err) => {
        if(err) return res.status(400).json({msg: "Logout gagal"});
        res.status(200).json({msg: "Anda telah logout"});
    });
}

export const createUser = async(req, res) => {
    const {name, fakultas, email, password, confPassword, role} = req.body;
    if (!email.endsWith('@ui.ac.id')) {
        return res.status(400).json({msg: "Email harus menggunakan domain @ui.ac.id"});
    }
    let user = await User.findOne({
        where: {
            email: req.body.email
        }
    });
    if(user) return res.status(400).json({msg: "Email sudah digunakan"})
    if(password!==confPassword) return res.status(400).json({msg: "Password dan confirm password tidak sesuai"})
    const hashPassword = await argon2.hash(password);
    try {
        user = await User.create({
            name: name,
            fakultas: fakultas,
            email: email,
            password: hashPassword,
            role: role
        });
         const token = await Token.create({
            userId: user.uuid,
            token: crypto.randomBytes(32).toString("hex") 
         })

        const url = `${process.env.Front_origin}/users/${user.uuid}/verify${token.token}`;
        await sendEmail(user.email, "Verify Email", url)

        res.status(201).json({msg: "An Email sent to your account please verify"})
    } catch (error) {
        res.status(400).json({msg: error.message});
    }
}

export const verifyToken = async (req, res) => {
    try {
        const user = await User.findOne({ 
            where: { 
                uuid: req.params.id 
            }
        });
        if (!user) return res.status(400).send({ message: "Invalid link" });

        const token = await Token.findOne({
            where: { userId: user.uuid, token: req.params.token },
        });
        if (!token) return res.status(400).send({ message: "Invalid link" });
        await User.update({ verified: true }, { where: { id: user.id } });
        await token.destroy();

        res.status(200).send({ message: "Email verified successfully" });
    } catch (error) {
        res.status(500).send({ message: "Internal Server Error" });
    }
}