const mongoose = require('mongoose');

const ticketSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, 'El título del ticket es obligatorio'],
      trim: true,
    },
    description: {
      type: String,
      default: '',
      trim: true,
    },
    column: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Column',
      required: [true, 'El ticket debe pertenecer a una columna'],
      index: true,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Ticket', ticketSchema);
