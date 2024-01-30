import { response } from "express";
import Score from "../models/ScoreModel.js";
import {Sequelize} from "sequelize";

export const AvgUiMbkm = async (req, res) => {
    try {
        const score = await Score.findOne({
            where: {
                uuid: req.params.id
            }
        });
        if(!score) return res.status(404).json({msg: "Data peminatan tidak ditemukan"})
            let response;
            response = await Score.findAll({
                attributes: [
                    [Sequelize.fn('AVG', Sequelize.col('pertukaranPelajar')), 'avgAllPrtknPelajar'],
                    [Sequelize.fn('AVG', Sequelize.col('magang')), 'avgAllMagang'],
                    [Sequelize.fn('AVG', Sequelize.col('asistensiMengajar')), 'avgallAsisMengajar'],
                    [Sequelize.fn('AVG', Sequelize.col('penelitian')), 'avgAllPenelitian'],
                    [Sequelize.fn('AVG', Sequelize.col('kemanusiaan')), 'avgAllKemanusiaan'],
                    [Sequelize.fn('AVG', Sequelize.col('wirausaha')), 'avgAllWirausaha'],
                    [Sequelize.fn('AVG', Sequelize.col('stupen')), 'avgAllStupen'],
                    [Sequelize.fn('AVG', Sequelize.col('k2nTematik')), 'avgAllTematik']
                ],
            });
        res.status(200).json(response);
    } catch (error) {
        res.status(500).json(response);
    }
}

export const AvgFakMbkm = async (req, res) => {
    try {
        const score = await Score.findOne({
            where: {
                uuid: req.params.id
            }
        });
        if(!score) return res.status(404).json({msg: "Data peminatan tidak ditemukan"})
            let response;
            response = await Score.findAll({
                attributes: [
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
                    fakultas: score.fakultas
                },
            });
        res.status(200).json(response);
    } catch (error) {
        res.status(500).json(response);
    }
}