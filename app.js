require('dotenv').config();

const express = require('express');
const cors = require('cors')
const { swaggerSpec, swaggerUi } = require('./swagger')

const remitosRoutes = require('./routes/remitos.js')

const port = process.env.PORT ?? 3000;

const app = express();

app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec));
// Logging middleware
const logMiddleware = (req, res, next) => {
  console.log(`[${new Date().toISOString()}] ${req.method} ${req.url}`);
  console.log('Headers:', req.headers);
  console.log('Body:', req.body);
  next();
};

// Add the logging middleware to all routes
app.use(cors())
app.use(express.json());
app.use(logMiddleware);

app.use("/", remitosRoutes);

app.listen(port, () => {
  console.log(`Servidor Express en ejecución en el puerto ${port}`);
});
