const mongoose = require('mongoose');
const Board = require('../models/Board');
const Column = require('../models/Column');

// Validador de formato ObjectId (24 caracteres hex)
const isValidObjectId = (id) => mongoose.Types.ObjectId.isValid(id) && String(new mongoose.Types.ObjectId(id)) === id;

const validateParams = (paramNames) => {
  return (req, res, next) => {
    for (const name of paramNames) {
      const id = req.params[name];
      if (id && !isValidObjectId(id)) {
        return res.status(400).json({ error: `El formato de ${name} es inválido (debe tener 24 caracteres hexadecimales)` });
      }
    }
    next();
  };
};

// Parent Check: verifica que el tablero exista
const checkBoardExists = async (req, res, next) => {
  try {
    const { boardId } = req.params;
    const board = await Board.findById(boardId);
    if (!board) {
      return res.status(404).json({ error: 'Tablero no encontrado' });
    }
    req.board = board;
    next();
  } catch (error) {
    next(error);
  }
};

// Parent Check: verifica que la columna exista y pertenezca a ese tablero (Aislamiento de rutas)
const checkColumnBelongsToBoard = async (req, res, next) => {
  try {
    const { columnId, boardId } = req.params;
    const column = await Column.findById(columnId);

    if (!column) {
      return res.status(404).json({ error: 'Columna no encontrada' });
    }

    // Si la columna pertenece a otro tablero, rechaza con 404
    if (column.board.toString() !== boardId) {
      return res.status(404).json({ error: 'La columna no pertenece al tablero indicado' });
    }

    req.column = column;
    next();
  } catch (error) {
    next(error);
  }
};

module.exports = {
  validateParams,
  checkBoardExists,
  checkColumnBelongsToBoard,
};