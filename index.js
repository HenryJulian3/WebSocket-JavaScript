const express = require('express');
const { WebSocketServer } = require('ws');
const swaggerUi = require('swagger-ui-express');
const swaggerJsdoc = require('swagger-jsdoc');

// Configuración del servidor
const app = express();
const PORT = 3000;

// Configuración de WebSocket
const wss = new WebSocketServer({ noServer: true });

// WebSocket: Evento de conexión
wss.on('connection', (ws) => {
    console.log('Cliente conectado');
    ws.on('message', (message) => {
        console.log(`Mensaje recibido: ${message}`);
        ws.send('¡Hola Mundo desde WebSocket!');
    });
});

// Integración de Express y WebSocket
const server = app.listen(PORT, () => {
    console.log(`Servidor escuchando en http://localhost:${PORT}`);
});

server.on('upgrade', (request, socket, head) => {
    wss.handleUpgrade(request, socket, head, (ws) => {
        wss.emit('connection', ws, request);
    });
});

// Configuración de Swagger
const swaggerDefinition = {
    openapi: '3.0.0',
    info: {
        title: 'API Hola Mundo WebSocket',
        version: '1.0.0',
        description: 'Ejemplo de una API WebSocket con documentación Swagger',
    },
    servers: [{ url: `http://localhost:${PORT}` }],
};

const options = {
    swaggerDefinition,
    apis: ['./index.js'], // Documentación en este archivo
};

const swaggerSpec = swaggerJsdoc(options);

app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));

/**
 * @swagger
 * /:
 *   get:
 *     summary: Prueba del servidor WebSocket
 *     description: Este endpoint confirma que el servidor está corriendo.
 *     responses:
 *       200:
 *         description: Servidor activo.
 */
app.get('/', (req, res) => {
    res.send('Servidor WebSocket activo. Visita /api-docs para la documentación.');
});
