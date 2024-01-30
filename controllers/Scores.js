import { response } from "express";
import Score from "../models/ScoreModel.js";
import User from "../models/UserModel.js";
import { Op } from "sequelize";

export const getScores = async (req, res) => {
    try {
        let response;
        if(req.role === "admin"){
            response = await Score.findAll({
                attributes: ['uuid','name','fakultas', 
                "sf_like", "sf_comp", "ma_like", "ma_comp", "bd_like", "bd_comp",
                "dp_like", "dp_comp", "me_like", "me_comp", "no_like", "no_comp",
                "ar_like", "ar_comp", "he_like", "he_comp", "ss_like", "ss_comp",
                "in_like", "in_comp", "bs_like", "bs_comp", "fa_like", "fa_comp",
                "sc_like", "sc_comp", "qc_like", "qc_comp", "mw_like", "mw_comp",
                "ps_like", "ps_comp", "cr_like", "cr_comp", "bse_like", "bse_comp",
                'pertukaranPelajar','magang', 'asistensiMengajar', 'penelitian', 
                'kemanusiaan', 'wirausaha', 'stupen', 'k2nTematik'],
                include: [{
                    model: User,
                    attributes: ['name', 'email']
                }]
            });
        } else {
            response = await Score.findAll({
                attributes: ['uuid','name','fakultas', 
                "sf_like", "sf_comp", "ma_like", "ma_comp", "bd_like", "bd_comp",
                "dp_like", "dp_comp", "me_like", "me_comp", "no_like", "no_comp",
                "ar_like", "ar_comp", "he_like", "he_comp", "ss_like", "ss_comp",
                "in_like", "in_comp", "bs_like", "bs_comp", "fa_like", "fa_comp",
                "sc_like", "sc_comp", "qc_like", "qc_comp", "mw_like", "mw_comp",
                "ps_like", "ps_comp", "cr_like", "cr_comp", "bse_like", "bse_comp",
                'pertukaranPelajar','magang', 'asistensiMengajar', 'penelitian', 
                'kemanusiaan', 'wirausaha', 'stupen', 'k2nTematik'],
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

export const getScoreById = async (req, res) => {
    try {
        const score = await Score.findOne({
            where: {
                uuid: req.params.id
            }
        });
        if(!score) return res.status(404).json({msg: "Score peminatan tidak ditemukan"})
        let response;
        if(req.role === "admin"){
            response = await Score.findOne({
                where: {
                    id: score.id
                },
                attributes: ['uuid','name','fakultas', 
                "sf_like", "sf_comp", "ma_like", "ma_comp", "bd_like", "bd_comp",
                "dp_like", "dp_comp", "me_like", "me_comp", "no_like", "no_comp",
                "ar_like", "ar_comp", "he_like", "he_comp", "ss_like", "ss_comp",
                "in_like", "in_comp", "bs_like", "bs_comp", "fa_like", "fa_comp",
                "sc_like", "sc_comp", "qc_like", "qc_comp", "mw_like", "mw_comp",
                "ps_like", "ps_comp", "cr_like", "cr_comp", "bse_like", "bse_comp",
                'pertukaranPelajar','magang', 'asistensiMengajar', 'penelitian', 
                'kemanusiaan', 'wirausaha', 'stupen', 'k2nTematik'
                ],
                include: [{
                    model: User,
                    attributes: ['name', 'email']
                }]
            });
        } else {
            response = await Score.findOne({
                attributes: ['uuid','name','fakultas', 
                "sf_like", "sf_comp", "ma_like", "ma_comp", "bd_like", "bd_comp",
                "dp_like", "dp_comp", "me_like", "me_comp", "no_like", "no_comp",
                "ar_like", "ar_comp", "he_like", "he_comp", "ss_like", "ss_comp",
                "in_like", "in_comp", "bs_like", "bs_comp", "fa_like", "fa_comp",
                "sc_like", "sc_comp", "qc_like", "qc_comp", "mw_like", "mw_comp",
                "ps_like", "ps_comp", "cr_like", "cr_comp", "bse_like", "bse_comp",
                'pertukaranPelajar','magang', 'asistensiMengajar', 'penelitian', 
                'kemanusiaan', 'wirausaha', 'stupen', 'k2nTematik'],
                where: {
                    [Op.and] : [{id: score.id}, {userId: req.userId}]
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

export const createScore = async (req, res) => {
    const {
        name, fakultas,
        sf_like, sf_comp, ma_like, ma_comp, bd_like, bd_comp,
        dp_like, dp_comp, me_like, me_comp, no_like, no_comp,
        ar_like, ar_comp, he_like, he_comp, ss_like, ss_comp,
        in_like, in_comp, bs_like, bs_comp, fa_like, fa_comp,
        sc_like, sc_comp, qc_like, qc_comp, mw_like, mw_comp,
        ps_like, ps_comp, cr_like, cr_comp, bse_like, bse_comp,
        pertukaranPelajar, magang, asistensiMengajar, 
        penelitian, kemanusiaan, wirausaha, stupen, k2nTematik
        } = req.body;
    try {
        await Score.create({
            name, fakultas,
            sf_like, sf_comp, ma_like, ma_comp, bd_like, bd_comp,
            dp_like, dp_comp, me_like, me_comp, no_like, no_comp,
            ar_like, ar_comp, he_like, he_comp, ss_like, ss_comp,
            in_like, in_comp, bs_like, bs_comp, fa_like, fa_comp,
            sc_like, sc_comp, qc_like, qc_comp, mw_like, mw_comp,
            ps_like, ps_comp, cr_like, cr_comp, bse_like, bse_comp,
            k2nTematik, pertukaranPelajar, magang, asistensiMengajar,
            penelitian, kemanusiaan, wirausaha,stupen,
            userId: req.userId
        });
        res.status(201).json({msg: "Score Peminatan Berhasil Ditambahkan"})
    } catch (error) {
        res.status(500).json({msg: "Score gagal ditambahkan"});
    }
}

export const updateScore = async (req, res) => {
    try {
        const score = await Score.findOne({
            where: {
                uuid: req.params.id
            }
        });
        if(!score) return res.status(404).json({msg: "Score peminatan tidak ditemukan"});
        const {
            name, fakultas,
            sf_like, sf_comp, ma_like, ma_comp, bd_like, bd_comp,
            dp_like, dp_comp, me_like, me_comp, no_like, no_comp,
            ar_like, ar_comp, he_like, he_comp, ss_like, ss_comp,
            in_like, in_comp, bs_like, bs_comp, fa_like, fa_comp,
            sc_like, sc_comp, qc_like, qc_comp, mw_like, mw_comp,
            ps_like, ps_comp, cr_like, cr_comp, bse_like, bse_comp,
            pertukaranPelajar, magang, asistensiMengajar, 
            penelitian, kemanusiaan, wirausaha, stupen, k2nTematik
        } = req.body;
        if(req.role === "admin"){
            await Score.update({
                name, fakultas,
                sf_like, sf_comp, ma_like, ma_comp, bd_like, bd_comp,
                dp_like, dp_comp, me_like, me_comp, no_like, no_comp,
                ar_like, ar_comp, he_like, he_comp, ss_like, ss_comp,
                in_like, in_comp, bs_like, bs_comp, fa_like, fa_comp,
                sc_like, sc_comp, qc_like, qc_comp, mw_like, mw_comp,
                ps_like, ps_comp, cr_like, cr_comp, bse_like, bse_comp,
                pertukaranPelajar, magang, asistensiMengajar, 
                penelitian, kemanusiaan, wirausaha, stupen, k2nTematik}, {
                where: {
                    id: score.id
                }
            });
        } else {
            if (req.userId !== score.userId) return res.status(403).json({msg: "Akses Terlarang"})
            await Score.update({
                name, fakultas,
                sf_like, sf_comp, ma_like, ma_comp, bd_like, bd_comp,
                dp_like, dp_comp, me_like, me_comp, no_like, no_comp,
                ar_like, ar_comp, he_like, he_comp, ss_like, ss_comp,
                in_like, in_comp, bs_like, bs_comp, fa_like, fa_comp,
                sc_like, sc_comp, qc_like, qc_comp, mw_like, mw_comp,
                ps_like, ps_comp, cr_like, cr_comp, bse_like, bse_comp,
                pertukaranPelajar, magang, asistensiMengajar, 
                penelitian, kemanusiaan, wirausaha, stupen, k2nTematik
                }, {
                where: {
                    [Op.and] : [{id: score.id}, {userId: req.userId}]
                },
            });
        }
        res.status(201).json({msg: "Score Peminatan Berhasil Diupdate"})
    } catch (error) {
        res.status(500).json({msg: error.message});
    }
}

export const deleteScore = async (req, res) => {
    try {
        const score = await Score.findOne({
            where: {
                uuid: req.params.id
            }
        });
        if(!score) return res.status(404).json({msg: "Score peminatan tidak ditemukan"});
        if(req.role === "admin"){
            await Score.destroy({
                where: {
                    id: score.id
                }
            });
        } else {
            if (req.userId !== score.userId) return res.status(403).json({msg: "Akses Terlarang"})
            await Score.destroy({
                where: {
                    [Op.and] : [{id: score.id}, {userId: req.userId}]
                },
            });
        }
        res.status(201).json({msg: "Score Peminatan Dihapus"})
    } catch (error) {
        res.status(500).json({msg: error.message});
    }
}