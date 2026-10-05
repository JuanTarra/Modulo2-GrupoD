require('dotenv').config();
const express = require('express');
const connectDB = require('./config/db');

const app = express();
app.use(express.json());

app.get('/api/health', (req, res) => {
  res.status(200).json({ status: 'ok' });
});

// TODO: descomentar cuando las rutas y el errorHandler estén listos
// const boardRoutes = require('./routes/board.routes');
// const errorHandler = require('./middlewares/errorHandler');
// app.use('/api/boards', boardRoutes);
// app.use(errorHandler);

const PORT = process.env.PORT || 3000;

connectDB().then(() => {
  app.listen(PORT, () => console.log(`Servidor escuchando en el puerto ${PORT}`));
});
