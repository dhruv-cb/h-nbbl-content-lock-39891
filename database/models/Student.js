const { DataTypes } = require("sequelize");
const sequelize = require("../config/db");
const studentSchema = sequelize.define("student", {
  id: {
    type: DataTypes.UUID,
    allowNull: false,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true,
  },
  rollNo: {
    type: DataTypes.INTEGER,
    allowNull:false,
    unique: {
      msg: "Roll No. Already Exist",
    },
    required: true,
  },
  name: {
    type: DataTypes.STRING,
    allowNull:false,
    required: true,
  },
  dob: {
    type: DataTypes.DATE,    
    allowNull:false,
    required: true,
  },
  score: {
    type: DataTypes.INTEGER,
    allowNull:false,
    required: true,
  },
});
module.exports = studentSchema;