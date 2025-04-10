#include <WiFi.h>
#include <ESPAsyncWebServer.h>

// CONFIGURAÇÃO DA REDE WI-FI
const char* ssid = "Siv-2G";
const char* password = "vM3kC47Hx9";

// Inicializa o servidor
AsyncWebServer server(80);

// Função para gerar valores simulados
float getRandomValue(float minVal, float maxVal) {
    return minVal + ((float)rand() / RAND_MAX) * (maxVal - minVal);
}

void setup() {
    Serial.begin(115200);

    // Conectando ao Wi-Fi
    WiFi.begin(ssid, password);
    Serial.print("Conectando ao Wi-Fi");
    while (WiFi.status() != WL_CONNECTED) {
        Serial.print(".");
        delay(1000);
    }
    Serial.println("\nWi-Fi Conectado!");
    Serial.print("IP do ESP32: ");
    Serial.println(WiFi.localIP());

    // Definição da API JSON com CORS
    server.on("/dados", HTTP_GET, [](AsyncWebServerRequest *request) {
        float corrente = getRandomValue(0.1, 10.0);  // Simula corrente entre 0.1A e 10A
        float tensao = getRandomValue(200.0, 240.0);  // Simula tensão entre 200V e 240V
        float fp = getRandomValue(0.7, 1.0);  // Simula FP entre 0.7 e 1.0

        // Cria o JSON com os dados
        String jsonResponse = "{";
        jsonResponse += "\"corrente\":" + String(corrente, 2) + ",";
        jsonResponse += "\"tensao\":" + String(tensao, 2) + ",";
        jsonResponse += "\"fp\":" + String(fp, 2);
        jsonResponse += "}";

        // Criar resposta com cabeçalhos CORS
        AsyncWebServerResponse *response = request->beginResponse(200, "application/json", jsonResponse);
        response->addHeader("Access-Control-Allow-Origin", "*");
        response->addHeader("Access-Control-Allow-Methods", "GET, POST, OPTIONS");
        response->addHeader("Access-Control-Allow-Headers", "Content-Type");
        request->send(response);
    });

    // Lida com requisições OPTIONS (para evitar bloqueios CORS em métodos diferentes de GET)
    server.on("/", HTTP_OPTIONS, [](AsyncWebServerRequest *request){
        AsyncWebServerResponse *response = request->beginResponse(204);
        response->addHeader("Access-Control-Allow-Origin", "*");
        response->addHeader("Access-Control-Allow-Methods", "GET, POST, OPTIONS");
        response->addHeader("Access-Control-Allow-Headers", "Content-Type");
        request->send(response);
    });

    // Inicia o servidor
    server.begin();
}

void loop() {
    // Nada no loop, apenas esperando requisições
}
