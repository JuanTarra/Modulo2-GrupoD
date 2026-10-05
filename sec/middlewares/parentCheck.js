const mongoose = require('mongoose');
const Board = require('../models/Board');
const Column = require('../models/Column');

const isValidObjectId = (id) => mongoose.Types.ObjectId.isValid(id);

// Middleware para verificar que el tablero existe
const validateBoardExists = async (req, res, next) => {
  const { boardId } = req.params;

  if (!isValidObjectId(boardId)) {
    return res.status(400).json({ error: 'El formato de boardId no es válido' });
  }

  const board = await Board.findById(boardId);
  if (!board) {
    return res.status(404).json({ error: 'Tablero no encontrado' });
  }

  req.board = board;
  next();
};

// Middleware para verificar que la columna existe y pertenece al tablero
const validateColumnBelongsToBoard = async (req, res, next) => {
  const { columnId } = req.params;

  if (!isValidObjectId(columnId)) {
    return res.status(400).json({ error: 'El formato de columnId no es válido' });
  }

  const column = await Column.findById(columnId);
  if (!column) {
    return res.status(404).json({ error: 'Columna no encontrada' });
  }

  if (column.board.toString() !== req.board._id.toString()) {
    return res.status(400).json({ error: 'La columna indicada no pertenece al tablero especificado' });
  }

  req.column = column;
  next();
};

module.exports = {
  validateBoardExists,
  validateColumnBelongsToBoard,
};