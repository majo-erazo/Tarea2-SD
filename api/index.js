// tiene las peticiones va solo los producer
// se tienen tres rutas
// Topic newMember-nuevaVenta-Agente
const express = require("express");
const { Kafka } = require('kafkajs')



const port = process.env.PORT || 3000;
const app = express();

app.use(express.json());

const kafka = new Kafka({
  brokers: [process.env.kafkaHost]
});


const producer = kafka.producer();

app.post("/new", async (req, res) => {
    await producer.connect();
    if (req.body.premium == true){
      await producer.send({
        topic: 'newMember',
        messages: [{value: JSON.stringify(req.body), partition: 1}]
      })
      console.log("Se ha registrado un sopaipillero premium!");
    }else{
      await producer.send({
        topic: 'newMember',
        messages: [{value: JSON.stringify(req.body), partition: 0}]
      })
      console.log("Se ha registrado un sopaipillero, pero no es premium :(");
    }
    await producer.disconnect().then(
        res.status(200).json({
            data: req.body
        })
    )
});

// Ruta a topic 2: nuevaVenta
app.post("/venta", async (req, res) => {
    await producer.connect();
    //Se envia para ser procesado como venta
    await producer.send({
        topic: 'nuevaVenta',
        messages: [{value: JSON.stringify(req.body)}]
    })
    
    
    // Se envia para procesar la ubicación
    await producer.send({
      topic: 'Ubicaciones',
      messages: [{value: JSON.stringify(req.body), partition: 0}]
    })
    await producer.disconnect().then(
        res.status(200).json({
            data: req.body
        })
    )
})


app.post("/carritoPerdido", async (req, res) => {
  await producer.connect();
  await producer.send({
    topic: 'Ubicaciones',
    messages: [{value: JSON.stringify(req.body), partition: 1}]
  })
  await producer.disconnect().then(
      res.status(200).json({
          data: req.body
      })
  )
})

app.post("/ubicacion", async (req, res) => {
  await producer.connect();
  await producer.send({
    topic: 'Ubicaciones',
    messages: [{value: JSON.stringify(req.body), partition: 0}]
  })
  await producer.disconnect().then(
      res.status(200).json({
          data: req.body
      })
  )
})


app.get("/", (req,res) =>{
  res.send("hola mundo");
});

app.listen(port, () => {
  console.log(`La API esta corriendo en  http://localhost:${port}`);
});