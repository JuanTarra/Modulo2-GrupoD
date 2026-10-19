const mongoose = require('mongoose');

const boardSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'El nombre del tablero es obligatorio'],
      trim: true,
    },
  },
  {
    timestamps: true,
    id: false,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

// Las columnas no se guardan en el tablero: cada Column apunta a su Board.
// Este virtual permite traerlas con populate('columns').
boardSchema.virtual('columns', {
  ref: 'Column',
  localField: '_id',
  foreignField: 'board',
  options: { sort: { createdAt: 1 } },
});

// Al borrar un tablero se borran sus columnas (y, por cada una, sus tickets).
boardSchema.pre('deleteOne', { document: true, query: false }, async function () {
  const Column = require('./Column');
  const columns = await Column.find({ board: this._id });
  for (const column of columns) {
    await column.deleteOne();
  }
});

module.exports = mongoose.model('Board', boardSchema);
