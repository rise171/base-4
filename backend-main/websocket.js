const WebSocket = require('ws');

// Создаем WebSocket сервер
let connections = [];
const wss = new WebSocket.Server({ port: 5000 });

wss.on('connection', (ws) => {
    const clientID = Date.now();
    ws.clientID = clientID;
    connections.push(ws);
    console.log(`Новое соединение: ${clientID}`);

    // Обработка сообщений от клиента
    ws.on('message', message => {
        textMessage = message.toString();
        console.log("Получено сообщение: ", textMessage);
        // Отправляем сообщение всем подключенным клиентам
        connections.forEach((client) => {
            if (client.readyState === WebSocket.OPEN) {
                if (client === ws) {
                    client.send(`Вы (id ${clientID}): ${textMessage}`); 
                }
                else {
                   client.send(`Покупатель (id ${clientID}): ${textMessage}`); 
                }
                
            }
        });
    });

    // Обработка закрытия соединения
    ws.on('close', () => {
        connections = connections.filter(client => client !== ws);
        console.log(`Соединение закрыто ${clientID}`);
    });
});

console.log('Сервер запущен на http://localhost:5000');