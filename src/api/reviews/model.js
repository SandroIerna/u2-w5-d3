import { DataTypes } from "sequelize";
import sequelize from "../../db.js";
import ProductModel from "../products/model.js";
import UsersModel from "../users/model.js";

const ReviewsModel = sequelize.define("review", {
  id: {
    type: DataTypes.UUID,
    primaryKey: true,
    defaultValue: DataTypes.UUIDV4,
  },
  content: { type: DataTypes.STRING, allowNull: false },
});

ProductModel.hasMany(ReviewsModel);
ReviewsModel.belongsTo(ProductModel, { foreignKey: { allowNull: false } });

UsersModel.hasMany(ReviewsModel);
ReviewsModel.belongsTo(UsersModel, { foreignKey: { allowNull: false } });

export default ReviewsModel;
