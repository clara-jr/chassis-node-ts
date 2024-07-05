import express from 'express';
const router = express.Router();
import AuthController from '../controllers/authentication.controller.ts';
import asyncErrorHandler from '../middlewares/async-error-handler.ts';

router
  .post('/login', asyncErrorHandler(AuthController.login))
  .post('/refresh', asyncErrorHandler(AuthController.refreshSession))
  .post('/logout', asyncErrorHandler(AuthController.logout));

export default router;
