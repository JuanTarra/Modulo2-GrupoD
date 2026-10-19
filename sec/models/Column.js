const mongoose = require('mongoose');

const columnSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, 'El título de la columna es obligatorio'],
      trim: true,
    },
    board: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Board',
      required: [true, 'La columna debe pertenecer a un tablero'],
      index: true,
    },
  },
  { timestamps: true }
);
// Al borrar una columna se borran sus tickets.
columnSchema.pre('deleteOne', { document: true, query: false }, async function () {
  const Ticket = require('./Ticket');
  await Ticket.deleteMany({ column: this._id });
});
module.exports = mongoose.model('Column', columnSchema);
