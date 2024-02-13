import { Sequelize } from "sequelize";
import db from "../config/Database.js";

const {DataTypes} = Sequelize;

const Token = db.define("token", {
  userUUID:{
    type: DataTypes.INTEGER,
    allowNull: false,
    unique: true,
    validate: {
        notEmpty: true
    }
},
  token: {
    type: DataTypes.STRING,
    allowNull: false
  },
  createdAt: {
    type: DataTypes.DATE,
    defaultValue: DataTypes.NOW,
    allowNull: false,
    expires: 3600
  }
});
export default Token;
