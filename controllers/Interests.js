import { response } from "express";
import Interest from "../models/InterestModel.js";
import User from "../models/UserModel.js";
import { Op, Sequelize} from "sequelize";

export const getInterests = async (req, res) => {
    try {
        let response;
        if(req.role === "admin"){
            response = await Interest.findAll({
                attributes: ['uuid','name','fakultas', 'k2nTematik', 'pertukaranPelajar','magang', 
                'asistensiMengajar', 'penelitian', 'kemanusiaan', 'wirausaha', 'stupen'],
                include: [{
                    model: User,
                    attributes: ['name', 'email']
                }]
            });
        } else {
            response = await Interest.findAll({
                attributes: ['uuid','name','fakultas', 'k2nTematik', 'pertukaranPelajar','magang', 
                'asistensiMengajar', 'penelitian', 'kemanusiaan', 'wirausaha', 'stupen'],
                where: {
                    userId: req.userId
                },
                include: [{
                    model: User,
                    attributes: ['name', 'email']
                }]
            });
        }
        res.status(200).json(response);
    } catch (error) {
        res.status(500).json(response);
    }
}

export const getAvgInterest = async (req, res) => {
    try {
        const interest = await Interest.findOne({
            where: {
                uuid: req.params.id
            }
        });
        if(!interest) return res.status(404).json({msg: "Data peminatan tidak ditemukan"})
            let response;
            response = await Interest.findAll({
                attributes: ['fakultas',
                    [Sequelize.fn('AVG', Sequelize.col('k2nTematik')), 'avgTematik'],
                    [Sequelize.fn('AVG', Sequelize.col('pertukaranPelajar')), 'avgPrtknPelajar'],
                    [Sequelize.fn('AVG', Sequelize.col('magang')), 'avgMagang'],
                    [Sequelize.fn('AVG', Sequelize.col('asistensiMengajar')), 'avgAsisMengajar'],
                    [Sequelize.fn('AVG', Sequelize.col('penelitian')), 'avgPenelitian'],
                    [Sequelize.fn('AVG', Sequelize.col('kemanusiaan')), 'avgKemanusiaan'],
                    [Sequelize.fn('AVG', Sequelize.col('wirausaha')), 'avgWirausaha'],
                    [Sequelize.fn('AVG', Sequelize.col('stupen')), 'avgStupen']
                ],
                where: {
                    fakultas: interest.fakultas
                },
            });
        res.status(200).json(response);
    } catch (error) {
        res.status(500).json(response);
    }
}

export const getAvgInterests = async (req, res) => {
    try {
        const interest = await Interest.findOne({
            where: {
                uuid: req.params.id
            }
        });
        if(!interest) return res.status(404).json({msg: "Data peminatan tidak ditemukan"})
            let response;
            response = await Interest.findAll({
                attributes: [
                    [Sequelize.fn('AVG', Sequelize.col('k2nTematik')), 'avgAllTematik'],
                    [Sequelize.fn('AVG', Sequelize.col('pertukaranPelajar')), 'avgAllPrtknPelajar'],
                    [Sequelize.fn('AVG', Sequelize.col('magang')), 'avgAllMagang'],
                    [Sequelize.fn('AVG', Sequelize.col('asistensiMengajar')), 'avgallAsisMengajar'],
                    [Sequelize.fn('AVG', Sequelize.col('penelitian')), 'avgAllPenelitian'],
                    [Sequelize.fn('AVG', Sequelize.col('kemanusiaan')), 'avgAllKemanusiaan'],
                    [Sequelize.fn('AVG', Sequelize.col('wirausaha')), 'avgAllWirausaha'],
                    [Sequelize.fn('AVG', Sequelize.col('stupen')), 'avgAllStupen']
                ],
            });
        res.status(200).json(response);
    } catch (error) {
        res.status(500).json(response);
    }
}

export const getInterestById = async (req, res) => {
    try {
        const interest = await Interest.findOne({
            where: {
                uuid: req.params.id
            }
        });
        if(!interest) return res.status(404).json({msg: "Data peminatan tidak ditemukan"})
        let response;
        if(req.role === "admin"){
            response = await Interest.findOne({
                where: {
                    id: interest.id
                },
                attributes: ['uuid','name','fakultas', 'k2nTematik', 'pertukaranPelajar','magang', 
                'asistensiMengajar', 'penelitian', 'kemanusiaan', 'wirausaha', 'stupen'
                ],
                include: [{
                    model: User,
                    attributes: ['name', 'email']
                }]
            });
        } else {
            response = await Interest.findOne({
                attributes: ['uuid','name','fakultas', 'k2nTematik', 'pertukaranPelajar','magang', 
                'asistensiMengajar', 'penelitian', 'kemanusiaan', 'wirausaha', 'stupen'],
                where: {
                    [Op.and] : [{id: interest.id}, {userId: req.userId}]
                },
                include: [{
                    model: User,
                    attributes: ['name', 'email']
                }]
            });
        }
        res.status(200).json(response);
    } catch (error) {
        res.status(500).json(response);
    }
}

export const createInterest = async (req, res) => {
    const {
        name, 
        fakultas,
        k2nTematik, 
        pertukaranPelajar, 
        magang, 
        asistensiMengajar, 
        penelitian, 
        kemanusiaan, 
        wirausaha, 
        stupen} = req.body;
    try {
        await Interest.create({
            name: name,
            fakultas: fakultas,
            k2nTematik: k2nTematik,
            pertukaranPelajar: pertukaranPelajar,
            magang: magang,
            asistensiMengajar: asistensiMengajar,
            penelitian: penelitian,
            kemanusiaan: kemanusiaan,
            wirausaha: wirausaha,
            stupen: stupen,
            userId: req.userId
        });
        res.status(201).json({msg: "Data Peminatan Berhasil Ditambahkan"})
    } catch (error) {
        res.status(500).json({msg: "Data gagal ditambahkan"});
    }
}

export const updateInterest = async (req, res) => {
    try {
        const interest = await Interest.findOne({
            where: {
                uuid: req.params.id
            }
        });
        if(!interest) return res.status(404).json({msg: "Data peminatan tidak ditemukan"});
        const {
            name,
            fakultas,
            k2nTematik,
            pertukaranPelajar, 
            magang, 
            asistensiMengajar, 
            penelitian, 
            kemanusiaan, 
            wirausaha, 
            stupen} = req.body;
        if(req.role === "admin"){
            await Interest.update({
            name, fakultas, k2nTematik, pertukaranPelajar, magang, 
            asistensiMengajar, penelitian, kemanusiaan, wirausaha, stupen}, {
                where: {
                    id: interest.id
                }
            });
        } else {
            if (req.userId !== interest.userId) return res.status(403).json({msg: "Akses Terlarang"})
            await Interest.update({
            name, fakultas, k2nTematik, pertukaranPelajar, magang, 
            asistensiMengajar, penelitian, kemanusiaan, wirausaha, stupen}, {
                where: {
                    [Op.and] : [{id: interest.id}, {userId: req.userId}]
                },
            });
        }
        res.status(201).json({msg: "Data Peminatan Berhasil Diupdate"})
    } catch (error) {
        res.status(500).json({msg: error.message});
    }
}

export const deleteInterest = async (req, res) => {
    try {
        const interest = await Interest.findOne({
            where: {
                uuid: req.params.id
            }
        });
        if(!interest) return res.status(404).json({msg: "Data peminatan tidak ditemukan"});
        if(req.role === "admin"){
            await Interest.destroy({
                where: {
                    id: interest.id
                }
            });
        } else {
            if (req.userId !== interest.userId) return res.status(403).json({msg: "Akses Terlarang"})
            await Interest.destroy({
                where: {
                    [Op.and] : [{id: interest.id}, {userId: req.userId}]
                },
            });
        }
        res.status(201).json({msg: "Data Peminatan Dihapus"})
    } catch (error) {
        res.status(500).json({msg: error.message});
    }
}