import express from "express";
import createHttpError from "http-errors";
import CategoriesModel from "./model.js";

const categoriesRouter = express.Router();

categoriesRouter.post("/", async (req, res, next) => {
  try {
    const { id } = await CategoriesModel.create(req.body);
    res.status(201).send({ id });
  } catch (error) {
    next(error);
  }
});

categoriesRouter.get("/", async (req, res, next) => {
  try {
    const categories = await CategoriesModel.findAll();
    res.send(categories);
  } catch (error) {
    next(error);
  }
});

categoriesRouter.delete("/:categoryId", async (req, res, next) => {
  try {
    const numberOfDeletedRows = await CategoriesModel.destroy({
      where: { id: req.params.categoryId },
    });
    if (numberOfDeletedRows === 1) res.status(204).send();
    else
      next(
        createHttpError(
          404,
          `Category with id ${req.params.categoryId} not found!`
        )
      );
  } catch (error) {
    next(error);
  }
});

export default categoriesRouter;
