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

var ub;
var pat;

const ubicacion = async () => {
    const consumer = kafka.consumer({ groupId: 'Ubicaciones', fromBeginning: true });
    await consumer.connect();
    await consumer.subscribe({ topic: 'Ubicaciones' });
    await consumer.run({
        eachMessage: async ({ topic, partition, message }) => {
            if (message.value && partition == 0){
                var data = JSON.parse(message.value.toString());
                ub = data.ubicacion;
                pat =  data.patente;
                pool.query('INSERT INTO carritos(ubicacion, patente) VALUES($1, $2);',
                    [
                        data.ubicacion, data.patente
                    ], (error, results) => {
                    if (error) {
                        throw error
                    }
                    })
                console.log(`Ubicacion es: ${ub}`);
                console.log(`Patente es: ${pat}`);

            }
            if (partition == 1 && message.value){
                var data = JSON.parse(message.value.toString());
                ub = data.ubicacion;
                pool.query('INSERT INTO profugos(ubicacion, patente) VALUES($1, $2);',
                    [
                        data.ubicacion, data.patente
                    ], (error, results) => {
                    if (error) {
                        throw error  
                    }
                    })
                console.log(`Los carritos con las siguientes ubicaciones estan profugos `);
                pool.query('SELECT * FROM  profugos;', (error, results) => {
                    if (error) {
                        console.log(results.rows)
                        throw error
                    }
                    console.log(results.rows)
                    })
            }
        },
      })
}
setTimeout(() => {
    console.log("Delayed for 60 second.");
  }, 6000)

app.listen(port, () => {
    console.log(`Listening on port ${port}`);
    ubicacion();
});
