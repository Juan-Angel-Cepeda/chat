# Chat
## Configuración del Chat
Para hacer funcionar el chat, es necesario instalar los siguientes paquetes:

- Node
- SDK de AWS
- Cliente de sqs de amazon


```
npm install
npm install aws-sdk
npm install @awssdk/client-sqs
```
### Configuración de politicas de AWS

- Ir a AWS SQS y crear las colas de mensajes, en la politica estabelcer los usuarios que tienen acceso a la cola, ademas de obtener el url de las colas para enviar los mensajes

```
{
  "Version": "2012-10-17",
  "Id": "__default_policy_ID",
  "Statement": [
    {
      "Sid": "__owner_statement",
      "Effect": "Allow",
      "Principal": {
        "AWS": "arn:aws:iam::045065688865:root"
      },
      "Action": "SQS:*",
      "Resource": "arn:aws:sqs:us-east-1:045065688865:queue-user-1"
    }
  ]
}
```
```
https://sqs.us-east-1.amazonaws.com/<amazon-id>/<nombre-de-cola>
```
### Hacer set de las credenciales de acceso

Establecemos las credenciales de acceso para poder enviar mensajes a la cola con credentials.json

```
{
    "accessKeyId": "<yourKey>",
    "secretAccessKey": "<yourSecretAccesKey>",
    "region": "us-east-1"
}
```
### Ahora ejecutamos nuestos archivos de sender.js y reciver.js

```
node sender.js
node reciver.js
```

