# Tarea 2 Sistemas Distribuidos

## Integrantes
- Maria José Erazo Gonzalez
- Catalina Gómez Zapkovic

## Kafka

En este repositorio se tiene el informe, video, código e instrucciones para poder ejecutar la tarea 2 sobre Kafka.

### Comandos a ejecutar

Como se utilizará contenedores de docker para la utilización de Kafka, se debe construir el docker-compose con el siguiente código.

```
docker-compose up -d --build
```
Una vez ejecutado el comando, estará listo para recibir solicitudes POST.


### Método POST

Para poder testear el código implementado, se utilizó la plataforma de API Postman para realizar los request, en esta se envía información a las siguientes rutas.

Para miembros nuevos:

```
http://localhost:3000/new
```

Para registro de ventas:

```
http://localhost:3000/venta
```

Para reportar un carrito prófugo:

```
http://localhost:3000/carritoperdido
```

Para enviar ubicación de un carrito:

```
http://localhost:3000/ubicacion
```

En estas rutas se envía data en formato Json a través del body, para venta será de la siguiente forma.

```
{
    "cliente": "cliente1",
    "cantidad": "4",
    "stockRestante": "36",
    "ubicacion": "ubicacionx",
    "patente": "patente1"
}
```
Para un reportar carrito perdido y para actualización de ubicación se utilizará un Json con ubicación y patente.
Esta información se recibe y procesa a través de Kafka.


### Anexos

[Video de funcionamiento del sistema e informe ☜](https://drive.google.com/drive/folders/1MjSuWQE1b1nd7w5L9C94pB_cDvNJwdno?usp=sharing)
