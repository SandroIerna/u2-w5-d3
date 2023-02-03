import express from "express";
import createHttpError from "http-errors";
import { Op } from "sequelize";
import ReviewsModel from "../reviews/model.js";
import ProductModel from "./model.js";
import ProductsCategoriesModel from "./productsCategoriesModel.js";

const productRouter = express.Router();

productRouter.post("/", async (req, res, next) => {
  try {
    const { id } = await ProductModel.create(req.body);
    if (req.body.categories) {
      await ProductsCategoriesModel.bulkCreate(
        req.body.categories.map((category) => {
          return { categoryId: category, productId: id };
        })
      );
    }
    res.status(201).send({ id });
  } catch (error) {
    next(error);
  }
});

productRouter.get("/", async (req, res, next) => {
  try {
    const query = {};
    if (req.query.name) query.name = { [Op.iLike]: `${req.query.name}%` };
    if (req.query.categories)
      query.categories = { [Op.iLike]: `${req.query.categories}%` };
    if (req.query.priceMin) query.price = { [Op.gte]: req.query.priceMin };
    if (req.query.priceMax)
      query.price = { ...query.price, [Op.lte]: req.query.priceMax };

    const products = await ProductModel.findAll({
      where: { ...query },
      attributes: ["id", "name", "description", "price"],
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

productRouter.get("/:productId/reviews", async (req, res, next) => {
  try {
    const product = await ProductModel.findByPk(req.params.productId, {
      include: {
        model: ReviewsModel,
        attributes: { exclude: ["createdAT", "updatedAt"] },
      },
    });
    res.send(product);
  } catch (error) {
    next(error);
  }
});

productRouter.put("/:productId/addCategory", async (req, res, next) => {
  try {
    const { id } = await ProductsCategoriesModel.create({
      productId: req.params.productId,
      categoryId: req.body.category,
    });
    res.send({ id });
  } catch (error) {
    next(error);
  }
});

productRouter.delete(
  "/:productId/removeCategory/:categoryId",
  async (req, res, next) => {
    try {
      const numberOfDeletedRows = await ProductsCategoriesModel.destroy({
        where: {
          categoryId: req.params.categoryId,
          productId: req.params.productId,
        },
      });
      if (numberOfDeletedRows === 1) res.status(204).send();
      else next(createHttpError(404, `Catego`));
    } catch (error) {
      next(error);
    }
  }
);

export default productRouter;
