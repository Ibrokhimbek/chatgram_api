import { RequestHandler } from "express";

export const errorHandler =
  (fn: Function): RequestHandler =>
  (req, res, next) =>
    Promise.resolve(fn(req, res, next)).catch((error) => {
      return res.status(500).send({
        success: false,
        message:
          error && error.message ? error.message : "Internal Server Error",
      });
    });
