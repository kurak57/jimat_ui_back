import User from "../models/UserModel.js";
import argon2, { hash } from 'argon2';
import Token from "../models/TokenModel.js";
import sendEmail from "../Utils/sendEmail.js";
import crypto from "crypto";

export const getUsers = async (req, res) => {
    try {
        const response = await User.findAll({
            attributes: ['uuid','name','fakultas','email','role']
        });
        res.status(200).json(response);
    } catch (error) {
        res.status(500).json({msg: error.message});
    }
}

export const getUserById = async(req, res) => {
    try {
        const response = await User.findOne({
            attributes: ['uuid','name','fakultas','email','role'],
            where: {
                uuid: req.params.id
            }
        });
        res.status(200).json(response);
    } catch (error) {
        res.status(500).json({msg: error.message});
    }
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
            token: crypto.randomBytes(32).toString("hex") 
         })

        const url = `${process.env.Base_url}/users/${user.id}/verify/${token.token}`;
        await sendEmail(user.email, "Verify Email", url)

        res.status(201).json({msg: "An Email sent to your account please verify"})
    } catch (error) {
        res.status(400).json({msg: error.message});
    }
}

export const updateUser = async (req, res) => {
    const user = await User.findOne({
        where: {
            uuid: req.params.id
        }
    });
    if(!user) return res.status(404).json({msg: "User tidak ditemukan"});
    const {name, fakultas, email, password, confPassword, role} = req.body;
    let hashPassword;
    if(password === "" || password === null){
        hashPassword = user.password
    }else {
        hashPassword = await argon2.hash(password);
    }
    if(password!==confPassword) return res.status(400).json({msg: "Password dan confirm password tidak sesuai"})
    try {
        await User.update({
            name: name,
            fakultas, fakultas,
            email: email,
            password: hashPassword,
            role: role
        }, {
            where:{
                id: user.id
            }
        });
        res.status(201).json({msg: "Update Data Berhasil"})
    } catch (error) {
        res.status(400).json({msg: error.message});
    }
}

export const deleteUser = async (req, res) => {
    const user = await User.findOne({
        where: {
            uuid: req.params.id
        }
    });
    if(!user) return res.status(404).json({msg: "User tidak ditemukan"});
    try {
        await User.destroy({
            where:{
                id: user.id
            }
        });
        res.status(201).json({msg: "Data User Dihapus"})
    } catch (error) {
        res.status(400).json({msg: error.message});
    }
}   

