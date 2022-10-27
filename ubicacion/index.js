const express = require("express");
const { Kafka } = require('kafkajs')
const client = require("./connect")


const port = process.env.PORT;
const app = express();

app.use(express.json());

const kafka = new Kafka({
    brokers: [process.env.kafkaHost]
});

var ub;
var pat;

const ubicacion = async () => {
    const consumer = kafka.consumer({ groupId: 'Ubicaciones', fromBeginning: true });
    await consumer.connect();
    await consumer.subscribe({ topic: 'nuevaVenta' });
    await consumer.run({
        eachMessage: async ({ topic, partition, message }) => {
            if (message.value){
                var data = JSON.parse(message.value.toString());
                ub = data.ubicacion;
                pat =  data.patente;
                console.log(`Ubicacion es: ${ub}`);
                console.log(`Patente es: ${pat}`);
            }
        },
      })
}


app.listen(port, () => {
    console.log(`Listening on port ${port}`);
    ubicacion();
});
