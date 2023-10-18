const AWS = require('aws-sdk'),
      {
        SQS
      } = require("@aws-sdk/client-sqs");

AWS.config.update({ region: 'us-east-1' });

const sqs = new SQS({ apiVersion: '2012-11-05' });

async function recibirMensaje(colaUrl) {
  const params = {
    AttributeNames: ['All'],
    MaxNumberOfMessages: 1,
    MessageAttributeNames: ['All'],
    QueueUrl: colaUrl,
    VisibilityTimeout: 0,
    WaitTimeSeconds: 20,
  };

  await sqs.receiveMessage(params, (err, data) => {
    if (err) {
      console.log('Error al recibir mensajes:', err);
    } else if (data.Messages) {
      const mensaje = data.Messages[0];
      console.log(`Mensaje recibido: ${mensaje.Body}`);

      const deleteParams = {
        QueueUrl: colaUrl,
        ReceiptHandle: mensaje.ReceiptHandle
      };

      sqs.deleteMessage(deleteParams, (err, data) => {
        if (err) {
          console.log('Error al eliminar el mensaje:', err);
        } else {
          console.log('Mensaje eliminado de la cola', data);
        }

        enviarMensaje(colaUrl); // Enviar un mensaje de vuelta
      });
    } else {
      recibirMensaje(colaUrl); // Esperar mensaje si no hay mensajes
    }
  });
}

function enviarMensaje(colaUrl) {
  const readline = require('readline');
  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
  });

  rl.question('Escribe tu mensaje: ', (mensaje) => {
    const params = {
      MessageBody: mensaje,
      QueueUrl: colaUrl
    };

    sqs.sendMessage(params, (err, data) => {
      if (err) {
        console.log('Error al enviar el mensaje:', err);
      } else {
        console.log('Mensaje enviado con éxito');
        recibirMensaje(colaUrl); // Esperar mensaje de vuelta
      }
    });
  });
}

const colaUrl = 'https://sqs.us-east-1.amazonaws.com/045065688865/queue-chat-user-2'; // Reemplaza con la URL de tu cola

recibirMensaje(colaUrl); // Iniciar el bucle para recibir mensajes
