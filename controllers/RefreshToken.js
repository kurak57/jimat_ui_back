import Users from "../models/UserModel.js";
import jwt from "jsonwebtoken";

export const refreshToken = async(req, res) => {
    try {
        const refreshToken = req.cookies.refreshToken
        if(!refreshToken) return res.sendStatus(401);
        const user = await Users.findOne({
            where: {
                refresh_token: refreshToken
            }
        });
        if(!user) return res.sendStatus(403);
        jwt.verify(refreshToken, process.env.JWT_REFRESH, (err, decoded) => {
            if(err) return res.sendStatus(403);
            const id = user.id
            const name = user.name
            const email = user.email
            const fakultas = user.fakultas
            const role = user.role
            const accessToken = jwt.sign({id, name, email, fakultas, role}, process.env.JWT_ACCESS, {
                expiresIn: '20s'
            });
            res.json({ accessToken });
        })
    } catch (error) {
        console.log(error);
    }
}