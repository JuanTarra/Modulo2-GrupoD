const errorHandler = (err, req, res, next) => {
  // Errores de validación de esquemas Mongoose
  if (err.name === 'ValidationError') {
    const messages = Object.values(err.errors).map((e) => e.message).join(', ');
    return res.status(400).json({ error: messages });
  }

  // Errores de casteo interno de tipos
  if (err.name === 'CastError') {
    return res.status(400).json({ error: `Formato inválido para el campo: ${err.path}` });
  }

  // Error genérico no controlado
  return res.status(500).json({ error: 'Error interno del servidor' });
};

module.exports = errorHandler;