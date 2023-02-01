import express from "express";
import createHttpError from "http-errors";
import { Op } from "sequelize";
import ProductModel from "./model.js";

const productRouter = express.Router();

productRouter.post("/", async (req, res, next) => {
  try {
    const { id } = await ProductModel.create(req.body);
    res.status(201).send({ id });
  } catch (error) {
    next(error);
  }
});

productRouter.get("/", async (req, res, next) => {
  try {
    const query = {};
    if (req.query.name) query.name = { [Op.iLike]: `${req.query.name}%` };
    if (req.query.category)
      query.category = { [Op.iLike]: `${req.query.category}%` };
    if (req.query.priceMin && req.query.priceMax) {
      query.price = {
        [Op.and]: {
          [Op.gte]: req.query.priceMin,
          [Op.lte]: req.query.priceMax,
        },
      };
    }
    const products = await ProductModel.findAll({
      where: { ...query },
      attributes: ["id", "name", "category", "description", "price"],
    });
    res.send(products);
  } catch (error) {
    next(error);
  }
});

productRouter.get("/:productId", async (req, res, next) => {
  try {
    const product = await ProductModel.findByPk(req.params.productId, {
      attributes: { exlude: ["createdAt", "updatedAt"] },
    });
    if (product) {
      res.send(product);
    } else {
      next(
        createHttpError(
          404,
          `Product with id ${req.params.productId} not found!`
        )
      );
    }
  } catch (error) {
    next(error);
  }
});

productRouter.put("/:productId", async (req, res, next) => {
  try {
    const [numberOfUpdatedRows, updatedRecords] = await ProductModel.update(
      req.body,
      { where: { id: req.params.productId }, returning: true }
    );
    if (numberOfUpdatedRows === 1) {
      res.send(updatedRecords[0]);
    } else {
      next(
        createHttpError(
          404,
          `Product with id ${req.params.productId} not found!`
        )
      );
    }
  } catch (error) {
    next(error);
  }
});

productRouter.delete("/:productId", async (req, res, next) => {
  try {
    const numberOfDeletedRows = await ProductModel.destroy({
      where: { id: req.params.productId },
    });
    if (numberOfDeletedRows === 1) {
      res.status(204).send();
    } else {
      next(
        createHttpError(
          404,
          `Product with id ${req.params.productId} not found!`
        )
      );
    }
  } catch (error) {
    next(error);
  }
});

export default productRouter;
