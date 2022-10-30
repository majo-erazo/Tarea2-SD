const express = require("express");
const { Kafka } = require('kafkajs')
//const client = require("./connect")

const port = process.env.PORT;
const app = express();

app.use(express.json());

const kafka = new Kafka({
    brokers: [process.env.kafkaHost]
});

var arr = []
var contador_clientes = 0;
var contador_ventas = 0;
var promedio = 0;

const ventas = async () => {
    const consumer = kafka.consumer({ groupId: 'VentasDiarias', fromBeginning: true });
    await consumer.connect();
    await consumer.subscribe({ topic: 'nuevaVenta' });
    await consumer.run({
        eachMessage: async ({ topic, partition, message }) => {
            if (message.value){

                var data = JSON.parse(message.value.toString());
                //await client.db('sopaipilleros').collection('ventas').insertOne({data});

                contador_clientes += 1;
                contador_ventas = Number(contador_ventas) + Number(data.cantidad);
                console.log(`Cantidad de clientes es: ${contador_clientes}`);
                console.log(`Cantidad de ventas es: ${contador_ventas}`);
            }
            
        },
      })
}

promedio = contador_ventas/contador_clientes;

app.listen(port, () => {
    console.log(`Listening on port ${port}`);
    ventas();
});
