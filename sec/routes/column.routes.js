const express = require('express');
const router = express.Router({ mergeParams: true });
const columnController = require('../controllers/column.controller');
const ticketRoutes = require('./ticket.routes');
const { validateParams, checkBoardExists, checkColumnBelongsToBoard } = require('../middlewares/validate');

// POST /api/boards/:boardId/columns
router.post('/', validateParams(['boardId']), checkBoardExists, columnController.createColumn);

// DELETE /api/boards/:boardId/columns/:columnId
router.delete(
  '/:columnId',
  validateParams(['boardId', 'columnId']),
  checkBoardExists,
  checkColumnBelongsToBoard,
  columnController.deleteColumn
);

// Tickets anidados: /api/boards/:boardId/columns/:columnId/tickets
router.use('/:columnId/tickets', ticketRoutes);

module.exports = router;
