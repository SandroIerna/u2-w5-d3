import { DataTypes } from "sequelize";
import sequelize from "../../db";

const ShoppingCartModel = sequelize.define("shoppingCart", {
  id: {
    type: DataTypes.UUID,
    primaryKey: true,
    defaultValue: DataTypes.UUIDV4,
  },
});

export default ShoppingCartModel;
