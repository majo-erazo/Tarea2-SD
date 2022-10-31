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
var contador_clientes = 0;
var contador_ventas = 0;
var promedio = 0;

const ventas = async () => {
    const now = new Date(); 
    const consumer = kafka.consumer({ groupId: 'VentasDiarias', fromBeginning: true });
    await consumer.connect();
    await consumer.subscribe({ topic: 'nuevaVenta' });
    await consumer.run({
        eachMessage: async ({ topic, partition, message }) => {
            if (message.value){

                var data = JSON.parse(message.value.toString());

                pool.query('INSERT INTO Venta(cantidad, stockRestante, ubicacion, patente) VALUES($1, $2, $3, $4);',
                    [
                        Number(data.cantidad), Number(data.stockRestante), data.ubicacion, data.patente
                    ], (error, results) => {
                    if (error) {
                        throw error
                    }

                    })

                contador_clientes += 1;
                contador_ventas = Number(contador_ventas) + Number(data.cantidad);
                console.log(`Cantidad de clientes es: ${contador_clientes}`);
                console.log(`Cantidad de ventas es: ${contador_ventas}`);

                pool.query('SELECT cliente, cantidad FROM Venta;', (error, results) => {
                    if (error) {
                        throw error
                    }
                    console.log(results.rows);
                    })

            }
            
        },
      })
}

promedio = contador_ventas/contador_clientes;

app.listen(port, () => {
    console.log(`Listening on port ${port}`);
    ventas();
});
