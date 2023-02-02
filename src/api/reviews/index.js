import express from "express";
import ReviewsModel from "./model.js";

const reviewsRouter = express.Router();

reviewsRouter.post("/", async (req, res, next) => {
  try {
    const { id } = await ReviewsModel.create(req.body);
    res.status(201).send({ id });
  } catch (error) {
    next(error);
  }
});

reviewsRouter.get("/", async (req, res, next) => {
  try {
    const reviews = await ReviewsModel.findAll();
    res.send(reviews);
  } catch (error) {
    next(error);
  }
});

export default reviewsRouter;
