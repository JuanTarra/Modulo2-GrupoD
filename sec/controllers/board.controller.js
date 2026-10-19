const Board = require('../models/Board');

// POST /api/boards
const createBoard = async (req, res, next) => {
  try {
    const { name } = req.body || {};

    if (typeof name !== 'string' || name.trim() === '') {
      return res.status(400).json({ error: 'El nombre del tablero es obligatorio' });
    }

    const board = await Board.create({ name: name.trim() });
    return res.status(201).json(board);
  } catch (error) {
    next(error);
  }
};

// GET /api/boards/:boardId
// Devuelve el tablero con sus columnas pobladas (y los tickets de cada columna).
const getBoard = async (req, res, next) => {
  try {
    const board = await Board.findById(req.params.boardId).populate({
      path: 'columns',
      populate: { path: 'tickets' },
    });

    if (!board) {
      return res.status(404).json({ error: 'Tablero no encontrado' });
    }

    return res.status(200).json(board);
  } catch (error) {
    next(error);
  }
};

module.exports = {
  createBoard,
  getBoard,
};