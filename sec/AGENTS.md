# AGENTS.md

Reglas del proyecto para cualquier agente de IA. Leer completo antes de escribir código.

## Proyecto
API RESTful estilo Kanban: Tableros (Board) > Columnas (Column) > Tickets (Ticket). Solo backend, solo JSON. Sin autenticación en esta etapa.

## Stack estricto
- Node.js 20
- Express 4 (no usar Express 5)
- Mongoose 8
- dotenv para variables de entorno
- nodemon solo en desarrollo
- No agregar otras librerías sin consultar al equipo.

## Estructura (todo el código vive en la carpeta sec/)
- app.js: arma Express, monta rutas y errorHandler, levanta el servidor.
- config/db.js: conexión a MongoDB.
- models/: Board.js, Column.js, Ticket.js.
- controllers/: board.controller.js, column.controller.js, ticket.controller.js.
- routes/: board.routes.js, column.routes.js, ticket.routes.js.
- middlewares/: validate.js (formato de ID y payload), parentCheck.js (existencia y pertenencia del padre), errorHandler.js (errores globales).

## Patrones de diseño
- Responsabilidad única: modelos definen datos, controladores tienen la lógica, rutas solo conectan URL con controlador y middlewares.
- No mezclar lógica de base de datos en los archivos de rutas.
- Un archivo, una responsabilidad.

## Modelos (nombres de campos acordados)
- Board: name (obligatorio).
- Column: title (obligatorio), board (ref a Board).
- Ticket: title (obligatorio), description, column (ref a Column).
- Usar referencias con ObjectId, no arrays de tickets embebidos en las columnas.
- Borrado en cascada: borrar un tablero elimina sus columnas y tickets; borrar una columna elimina sus tickets.

## Contrato de la API (fuente de la verdad)
- POST /api/boards: crea un tablero. 201.
- GET /api/boards/:boardId: tablero con sus columnas pobladas. 200.
- POST /api/boards/:boardId/columns: crea una columna. 201.
- DELETE /api/boards/:boardId/columns/:columnId: elimina una columna. 204.
- POST /api/boards/:boardId/columns/:columnId/tickets: crea un ticket. 201.
- PATCH /api/boards/:boardId/columns/:columnId/tickets/:ticketId: mueve o actualiza un ticket. 200.
No existen rutas planas como /api/tickets. Todo ticket nace dentro de una columna y un tablero.

## Reglas de negocio
- Parent check: antes de crear una columna, verificar que el boardId existe; antes de crear un ticket, verificar que el columnId existe. Si no existe, 404.
- Aislamiento: si la columna existe pero pertenece a otro tablero, responder 404.
- 400 si el payload no valida (por ejemplo, falta el título del ticket).
- 400 si un ID no tiene formato de ObjectId (24 caracteres hexadecimales).
- 404 si el ID tiene formato válido pero no existe.

## Manejo de errores
- Siempre responder los fallos con { "error": "mensaje" }.
- Un único errorHandler global al final de app.js.

## Límites negativos (lo que NO se debe hacer)
- NO devolver un 500 genérico si el boardId o columnId no existe: capturar y devolver 404.
- NO usar findByIdAndDelete ni deleteMany sin disparar el borrado en cascada: usar doc.deleteOne() con el hook pre('deleteOne', { document: true, query: false }).
- NO anidar tickets en arrays dentro de las columnas.
- NO crear rutas planas para tickets o columnas.
- NO poner lógica de base de datos en las rutas.
- NO subir el archivo .env ni credenciales al repositorio.
- NO actualizar dependencias ni cambiar versiones del stack.
- NO escribir todo en un solo paso: seguir las fases de abajo.

## Idempotencia
El PATCH de ticket debe ser idempotente: la misma petición enviada dos veces deja la base igual que enviada una vez. Usar valores absolutos, nunca incrementos, y no duplicar datos ni alterar el orden.

## Forma de trabajo por fases
1. Fase 1 (datos): solo los esquemas de Mongoose con referencias y el hook de borrado en cascada.
2. Fase 2 (validación): middlewares de validación de ID, parent check y errorHandler.
3. Fase 3 (controladores): un recurso por vez, usando los modelos y middlewares ya generados.
Revisar y validar cada fase antes de pasar a la siguiente.

## Pruebas
La colección de ThunderClient (thunder-collection.json) define cómo se evalúa el trabajo. Todas las peticiones deben pasar.

## Convenciones
- Conventional commits: feat:, fix:, docs:, chore:, refactor:, test:.
- No pushear directo a main cuando el equipo trabaje con ramas.