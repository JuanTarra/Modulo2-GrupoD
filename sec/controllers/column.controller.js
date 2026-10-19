const Column = require('../models/Column');

// POST /api/boards/:boardId/columns
const createColumn = async (req, res, next) => {
  try {
    const { title } = req.body || {};

    if (typeof title !== 'string' || title.trim() === '') {
      return res.status(400).json({ error: 'El título de la columna es obligatorio' });
    }

    const column = await Column.create({
      title: title.trim(),
      board: req.board._id,
    });

    return res.status(201).json(column);
  } catch (error) {
    next(error);
  }
};

// DELETE /api/boards/:boardId/columns/:columnId
const deleteColumn = async (req, res, next) => {
  try {
    await req.column.deleteOne();
    return res.status(204).send();
  } catch (error) {
    next(error);
  }
};

module.exports = {
  createColumn,
  deleteColumn,
};