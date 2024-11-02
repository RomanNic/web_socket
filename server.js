WebSocket = require("ws");
const server = new WebSocket.Server({ port: 8080 });
const clients = new Set();

server.on("connection", (ws) => {
  console.log("Новый клиент подключен");
  clients.add(ws);
  ws.send("Добро пожаловать в чат!");

  ws.on("message", (message) => {
    console.log(`Получено сообщение: ${message}`);

    if (!message.trim()) {
      ws.send("Сообщение не может быть пустым.");
      return;
    }
    if (message.length > 256) {
      ws.send("Сообщение слишком длинное, максимальная длина — 256 символов.");
      return;
    }

    clients.forEach((client) => {
      if (client !== ws && client.readyState === WebSocket.OPEN) {
        client.send(message);
      }
    });
  });

  ws.on("close", () => {
    console.log("Клиент отключился");
    clients.delete(ws);
  });

  ws.on("error", (error) => {
    console.error("Ошибка WebSocket:", error);
  });
});

console.log("Сервер запущен на ws://localhost:8080");
