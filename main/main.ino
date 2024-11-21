#include <Arduino.h>
#include <ESP8266WiFi.h>
#include <FirebaseESP8266.h>
#include <WiFiUdp.h>
#include <NTPClient.h>
#include <DHT.h> // Asumiendo que se usa un sensor DHT para obtener temperatura y humedad

// WiFi credentials
#define WIFI_SSID "Alumnos"
#define WIFI_PASSWORD "@@1umN05@@"

// Firebase credentials
#define API_KEY ""
#define DATABASE_URL ""
#define USER_EMAIL ""
#define USER_PASSWORD ""

// DHT sensor configuration
#define DHTPIN D2      // Pin donde está conectado el sensor DHT
#define DHTTYPE DHT11  // Tipo de sensor (puedes cambiar a DHT22 si es necesario)

// NTP configuration
WiFiUDP ntpUDP;
NTPClient timeClient(ntpUDP, "mx.pool.ntp.org", 0, 60000); // Actualiza cada 60 segundos

// Firebase objects
FirebaseData fbdo;
FirebaseAuth auth;
FirebaseConfig config;

// Sensor object
DHT dht(DHTPIN, DHTTYPE);

void setup()
{
  Serial.begin(115200);

  // Conectar a WiFi
  WiFi.begin(WIFI_SSID, WIFI_PASSWORD);
  while (WiFi.status() != WL_CONNECTED)
  {
    delay(500);
    Serial.print(".");
  }
  Serial.println("\nWiFi conectado.");

  // Inicializar NTP
  timeClient.begin();
  while (!timeClient.update())
  {
    timeClient.forceUpdate();
  }

  // Configurar Firebase
  config.api_key = API_KEY;
  auth.user.email = USER_EMAIL;
  auth.user.password = USER_PASSWORD;
  config.database_url = DATABASE_URL;
  Firebase.begin(&config, &auth);
  Firebase.reconnectNetwork(true);

  // Inicializar el sensor DHT
  dht.begin();

  Serial.println("Setup completado.");
}

void loop()
{
  // Verifica si Firebase está listo y si es momento de enviar datos
  static unsigned long lastSend = 0;
  if (Firebase.ready() && millis() - lastSend > 60000) // Cada 60 segundos
  {
    lastSend = millis();

    // Obtén temperatura y humedad del sensor
    float t_amb = dht.readTemperature();
    float h_amb = dht.readHumidity();

    if (isnan(t_amb) || isnan(h_amb))
    {
      Serial.println("Error al leer el sensor.");
      return;
    }

    // Obtén la hora actual del NTP
    timeClient.update();
    String timestamp = timeClient.getFormattedTime();


    // Formatea los datos para Firebase
    FirebaseJson json;
    json.set("t_amb", t_amb);
    json.set("h_amb", h_amb);

    // Envía los datos a Firebase
    String path = "/" + timestamp;
    if (Firebase.set(fbdo, path, json))
    {
      Serial.println("Datos enviados correctamente: ");
      Serial.println(json.raw());
    }
    else
    {
      Serial.print("Error al enviar los datos: ");
      Serial.println(fbdo.errorReason());
    }
  }
}
