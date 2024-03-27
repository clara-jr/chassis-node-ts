import express from 'express';
const router = express.Router();
import Controller from '../controllers/controller.ts';
import asyncErrorHandler from '../middlewares/async-error-handler.ts';

router
  .get('/', asyncErrorHandler(Controller.getAll))
  .post('/', asyncErrorHandler(Controller.create));

export default router;
