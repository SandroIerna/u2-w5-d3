import express from "express";
import createHttpError from "http-errors";
import { Op } from "sequelize";
import ReviewsModel from "../reviews/model.js";
import UsersModel from "./model.js";

const usersRouter = express.Router();

usersRouter.post("/", async (req, res, next) => {
  try {
    const { id } = await UsersModel.create(req.body);
    res.status(201).send({ id });
  } catch (error) {
    next(error);
  }
});

usersRouter.get("/", async (req, res, next) => {
  try {
    const query = {};
    if (req.query.firstName)
      query.firstName = { [Op.iLike]: `${req.query.firstName}%` };
    const users = await UsersModel.findAll({
      where: { ...query },
      attributes: ["firstName", "lastName", "id"],
    });
    res.send(users);
  } catch (error) {
    next(error);
  }
});

usersRouter.get("/:userId", async (req, res, next) => {
  try {
    const user = await UsersModel.findByPk(req.params.userId, {
      attributes: { exclude: ["createdAt", "updatedAt"] },
    });
    if (user) res.send(user);
    else
      next(
        createHttpError(404, `User with id ${req.params.userId} not found!`)
      );
  } catch (error) {
    next(error);
  }
});

usersRouter.put("/:userId", async (req, res, next) => {
  try {
    const [numberOfUpdatedRows, updatedRecords] = await UsersModel.update(
      req.body,
      { where: { id: req.params.userId }, returning: true }
    );
    if (numberOfUpdatedRows === 1) res.send(updatedRecords[0]);
    else
      next(
        createHttpError(404, `User with id ${req.params.userId} not found!`)
      );
  } catch (error) {
    next(error);
  }
});

usersRouter.delete("/:userId", async (req, res, next) => {
  try {
    const numberOfDeletedRows = await UsersModel.destroy({
      where: { id: req.params.userId },
    });
    if (numberOfDeletedRows === 1) res.status(204).send();
    else
      next(
        createHttpError(404, `User with id ${req.params.userId} not found!`)
      );
  } catch (error) {
    next(error);
  }
});

usersRouter.get("/:userId/reviews", async (req, res, next) => {
  try {
    const user = await UsersModel.findByPk(req.params.userId, {
      include: { model: ReviewsModel },
    });
    res.send(user);
  } catch (error) {
    next(error);
  }
});

export default usersRouter;
