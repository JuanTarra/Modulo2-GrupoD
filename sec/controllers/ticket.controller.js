const mongoose = require('mongoose');
const Ticket = require('../models/Ticket');
const Column = require('../models/Column');

// POST /api/boards/:boardId/columns/:columnId/tickets
const createTicket = async (req, res, next) => {
  try {
    const { title, description } = req.body;

    if (!title || typeof title !== 'string' || title.trim() === '') {
      return res.status(400).json({ error: 'El título del ticket es obligatorio' });
    }

    const ticket = await Ticket.create({
      title: title.trim(),
      description: description ? description.trim() : '',
      column: req.column._id,
    });

    return res.status(201).json(ticket);
  } catch (error) {
    next(error);
  }
};

// PATCH /api/boards/:boardId/columns/:columnId/tickets/:ticketId (Idempotente)
const updateTicket = async (req, res, next) => {
  try {
    const { ticketId, boardId } = req.params;
    const { title, description, targetColumnId } = req.body;

    // Verificar formato del ticketId
    if (!mongoose.Types.ObjectId.isValid(ticketId)) {
      return res.status(400).json({ error: 'El formato de ticketId es inválido' });
    }

    // Buscar el ticket asegurando que pertenece a la columna actual
    const ticket = await Ticket.findOne({
      _id: ticketId,
      column: req.column._id,
    });

    if (!ticket) {
      return res.status(404).json({ error: 'Ticket no encontrado en la columna especificada' });
    }

    // Si se envía una nueva columna destino
    if (targetColumnId !== undefined) {
      if (!mongoose.Types.ObjectId.isValid(targetColumnId)) {
        return res.status(400).json({ error: 'El formato de targetColumnId es inválido' });
      }

      // Validar que la nueva columna exista y pertenezca al mismo tablero
      const targetColumn = await Column.findOne({
        _id: targetColumnId,
        board: boardId,
      });

      if (!targetColumn) {
        return res.status(404).json({ error: 'La columna destino no existe en este tablero' });
      }

      ticket.column = targetColumn._id;
    }

    // Actualización idempotente con valores absolutos
    if (title !== undefined) {
      if (typeof title !== 'string' || title.trim() === '') {
        return res.status(400).json({ error: 'El título no puede estar vacío' });
      }
      ticket.title = title.trim();
    }

    if (description !== undefined) {
      ticket.description = description.trim();
    }

    await ticket.save();
    return res.status(200).json(ticket);
  } catch (error) {
    next(error);
  }
};

module.exports = {
  createTicket,
  updateTicket,
};