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

export const signUp = async(req, res) => {
    const {name, fakultas, email, password, confPassword, role} = req.body;
    const user = await User.findOne({
        where: {
            email: req.body.email
        }
    });
    if(user) return res.status(400).json({msg: "Email sudah digunakan"})
    if(password!==confPassword) return res.status(400).json({msg: "Password dan confirm password tidak sesuai"})
    const hashPassword = await argon2.hash(password);
    try {
        await User.create({
            name: name,
            fakultas: fakultas,
            email: email,
            password: hashPassword,
            role: role
        });
        res.status(201).json({msg: "Registrasi Berhasil"})
    } catch (error) {
        res.status(400).json({msg: error.message});
    }
}