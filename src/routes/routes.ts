import express from 'express';
const router = express.Router();
import Controller from '../controllers/controller.ts';
import asyncErrorHandler from '../middlewares/async-error-handler.ts';

/**
 * @openapi
 * /:
 *   get:
 *     summary: Get all documents from database
 *     responses:
 *       200:
 *         description: Ok
 *   post:
 *     summary: Create new document
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               index:
 *                 type: string
 *               sparseIndex:
 *                 type: string
 *               string:
 *                 type: string
 *               number:
 *                 type: number
 *               boolean:
 *                 type: boolean
 *               date:
 *                 type: string
 *                 format: date
 *               stringsArray:
 *                 type: array
 *                 items:
 *                   type: string
 *               objectsArray:
 *                 type: array
 *                 items:
 *                   type: object
 *                   properties:
 *                     string:
 *                       type: string
 *                     date:
 *                       type: string
 *                       format: date
 *               embedded:
 *                 type: object
 *                 properties:
 *                   string:
 *                     type: string
 *                   number:
 *                     type: number
 *               object:
 *                 type: object
 *               default:
 *                 type: string
 *               lang:
 *                 type: string
 *                 enum: [en, es, fr]
 *               languages:
 *                 type: array
 *                 items:
 *                   type: string
 *                   enum: [en, es, fr]
 *             required:
 *               - index
 *     responses:
 *       201:
 *         description: Created
 *       400:
 *         description: Validation Error
 */
router
  .get('/', asyncErrorHandler(Controller.getAll))
  .post('/', asyncErrorHandler(Controller.create));

export default router;
