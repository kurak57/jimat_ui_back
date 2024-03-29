import { DataTypes } from "sequelize";
import db from "../config/Database.js";
import Users from "./UserModel.js";

const Token = db.define("token", {
  userId:{
    type: DataTypes.STRING,
    allowNull: false,
    validate: {
        notEmpty: true
    }
},
  token: {
    type: DataTypes.STRING,
    unique: true,
    allowNull: false
  },
  createdAt: {
    type: DataTypes.DATE,
    defaultValue: DataTypes.NOW,
    allowNull: false,
    expires: 3600
  }
}, {
  freezeTableName: true
});

export default Token;
