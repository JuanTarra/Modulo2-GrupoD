const mongoose = require('mongoose');

const boardSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'El nombre del tablero es obligatorio'],
      trim: true,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Board', boardSchema);
