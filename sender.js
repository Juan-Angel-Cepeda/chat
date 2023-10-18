const AWS = require('aws-sdk');
const fs = require('fs');

const credentials = JSON.parse(fs.readFileSync('credentials.json', 'utf8'));
AWS.config.update({
    accessKeyId: credentials.accessKeyId,
    secretAccessKey: credentials.secretAccessKey,
    region: credentials.region
});

const sqs = new AWS.SQS({ apiVersion: '2012-11-05' });

const participante1 = "Angel";
const participante2 = "Legna";
const senderQueueUrl = "https://sqs.us-east-1.amazonaws.com/045065688865/queue-user-2"; 
const receiverQueueUrl = "https://sqs.us-east-1.amazonaws.com/045065688865/queue-user-1"; 

process.stdin.on('data', (data) => {
    const message = data.toString().trim();
    const params = {
        MessageBody: `${participante1}: ${message}`,
        QueueUrl: senderQueueUrl
    };

    sqs.sendMessage(params, (err, data) => {
        if (err) {
            console.error("Error al enviar el mensaje:", err);
        } else {
            console.log(`Mensaje enviado: ${participante1}: ${message}`);
        }
    });
});

const receiveParams = {
    QueueUrl: receiverQueueUrl,
    WaitTimeSeconds: 20
};

function receiveMessages() {
    sqs.receiveMessage(receiveParams, (err, data) => {
        if (err) {
            console.error("Error al recibir mensajes:", err);
        } else if (data.Messages) {
            const message = data.Messages[0];
            console.log(`Recibido del remitente: ${message.Body}`);
            const deleteParams = {
                QueueUrl: receiverQueueUrl,
                ReceiptHandle: message.ReceiptHandle
            };
            
        } else {
            console.log("No hay mensajes en la cola.");
            receiveMessages();
        }
    });
}

receiveMessages();