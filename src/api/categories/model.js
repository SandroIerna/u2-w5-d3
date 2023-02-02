import { DataTypes } from "sequelize";
import sequelize from "../../db.js";

const CategoriesModel = sequelize.define("category", {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true,
  },
  name: { type: DataTypes.STRING, allowNull: true, unique: true },
});

export default CategoriesModel;
