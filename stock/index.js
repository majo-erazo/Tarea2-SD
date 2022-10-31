const express = require("express");
const { Kafka } = require('kafkajs')
//const client = require("./connect")

// Conexion con la Base de Datos
const Pool = require('pg').Pool;

const pool = new Pool({
    user: 'postgres',
    password: 'postgres',
    host: 'database',
    port: 5432,
});

const port = process.env.PORT;
const app = express();

app.use(express.json());

const kafka = new Kafka({
    brokers: [process.env.kafkaHost]
});

var arr = []

const stock = async () => {
    const consumer = kafka.consumer({ groupId: 'Stock', fromBeginning: true });
    await consumer.connect();
    await consumer.subscribe({ topic: 'nuevaVenta' });
    await consumer.run({
        eachMessage: async ({ topic, partition, message }) => {
            if (message.value){
                var data = JSON.parse(message.value.toString());
                arr.push(data)
                if (arr.length == 5){
                    for (i=0; i<5; i++){
                        if (arr[i].stockRestante < 20){
                            console.log('Stock restante es menor a 20!!!')
                            console.log('Carrito ubicacion ', arr[i].ubicacion);
                        }
                    }
                    // guardar datos del arreglo en una base de datos c:
                    arr = [];
                }
                
                
            }
        },
      })
}


app.listen(port, () => {
    console.log(`Listening on port ${port}`);
    stock();
});
