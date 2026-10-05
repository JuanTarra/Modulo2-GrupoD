const express = require('express');
const router = express.Router({ mergeParams: true });
const ticketController = require('../controllers/ticket.controller');
const { validateParams, checkBoardExists, checkColumnBelongsToBoard } = require('../middlewares/validate');

// Validar parámetros y jerarquía antes de ejecutar el controlador
router.use(
  validateParams(['boardId', 'columnId']),
  checkBoardExists,
  checkColumnBelongsToBoard
);

router.post('/', ticketController.createTicket);
router.patch('/:ticketId', ticketController.updateTicket);

module.exports = router;