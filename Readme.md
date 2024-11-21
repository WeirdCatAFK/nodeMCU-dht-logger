# Documentación

Documentación para el proyecto interdisciplinario de Diseño de bases de datos.

El proyecto consiste en una instancia de una ESP8266 que mande datos constantemente a la base de datos sobre la temperatura y humedad del ambiente.

## Materiales y Métodos

### Firebase

Para el desarrollo del proyecto creamos una instancia de un servicio de bases de datos no relacional llamada Firebase, servicio proveído por google donde instanciamos un servicio de `base de datos en tiempo real` y el servicio de `autenticación` de usuarios para preparar los datos, para el diseño de la entrada de datos planeamos que los datos se estructuraran de esta manera

*Diseño de la base de datos:*

```javascript
data = {
  instancia_de_la_base_de_datos: {
    datos: [
      { //Registro de la esp32
        timestamp: { //El valor del timestamp se registra como timestamp de unix
          t_amb: float,
          t_humedad: float,
        },
      },
	  { 
        timestamp: {
          t_amb: float,
          t_humedad: float,
        },
      },
	  
    ]
  },
};

```

### Arduino IDE y ESP8266

Para el código de la placa se utilizo Arduino IDE y se puede encontrar el código en la carpeta main de este repositorio donde se encuentra el archivo  `main.ino` que contiene un código el cúal solo se tiene que modificar para proveer las credenciales de la base de datos de firebase y la contraseña de la red donde se conecte la placa

```cpp
// WiFi credentials
#define WIFI_SSID ""
#define WIFI_PASSWORD ""

// Firebase credentials
#define API_KEY ""
#define DATABASE_URL ""
#define USER_EMAIL ""
#define USER_PASSWORD ""

// DHT sensor configuration
#define DHTPIN D2      // Pin donde está conectado el sensor DHT
#define DHTTYPE DHT11  // Tipo de sensor (puedes cambiar a DHT22 si es necesario)
```

### Frontend

Para el desarrollo del frontend se desarrollo utilizando REACT para facilitar la implementación de la conexión a la base de datos y el desarrollo de elementos web para la visualización de datos, este se encuentra en la carpeta `WebApp` del proyecto se puede probar utilizando el comando `npm start`

Para realizar la conexión del frontend con la base de datos en tiempo real se creo un hook para la conexión que contiene 2 funciones, useFirebaseCurret y useFirebaseHistorical, para conseguir los valores de la base de datos, para poder hacer la conexión

```cpp
// Firebase configuration
const firebaseConfig = {
  apiKey: "",
  authDomain: "",
  databaseURL: "",
  projectId: "",
  storageBucket: "",
  messagingSenderId: "",
  appId: "",
  measurementId: "",
};
```

Estos datos se pueden conseguir dentro de firebase en el apartado sobre implementaciones web
