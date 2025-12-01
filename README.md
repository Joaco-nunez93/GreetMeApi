<div align="center">

# 👋 GreetMe API - AWS SAM

<img src="https://compote.slate.com/images/2119ff95-86f2-4546-a8fd-7b70ec58c9c6.jpeg?crop=1560%2C1040%2Cx0%2Cy0&width=370" alt="AWS Serverless" width="600"/>

### API REST serverless multiidioma construida con **AWS SAM** que implementa saludos personalizados utilizando **API Gateway**, **AWS Lambda**, y **Node.js 22.x** con optimización **esbuild**.

[![AWS SAM](https://img.shields.io/badge/AWS-SAM-orange?style=for-the-badge&logo=amazonaws)](https://aws.amazon.com/serverless/sam/)
[![Lambda](https://img.shields.io/badge/AWS-Lambda-orange?style=for-the-badge&logo=awslambda)](https://aws.amazon.com/lambda/)
[![Node.js](https://img.shields.io/badge/Node.js-22.x-339933?style=for-the-badge&logo=nodedotjs)](https://nodejs.org/)
[![API Gateway](https://img.shields.io/badge/API-Gateway-FF4F8B?style=for-the-badge&logo=amazonapigateway)](https://aws.amazon.com/api-gateway/)
[![esbuild](https://img.shields.io/badge/esbuild-Optimized-FFCF00?style=for-the-badge)](https://esbuild.github.io/)

</div>

---

## 📋 Overview

Este repositorio contiene un proyecto en el caul se construye una **API REST serverless** en AWS utilizando **AWS SAM (Serverless Application Model)**. El proyecto implementa dos endpoints que devuelven saludos personalizados en múltiples idiomas (inglés, español, francés, hindi), demostrando patrones de integración entre API Gateway y Lambda con validación de datos, manejo de errores, y optimización de bundle.

**Flujo de trabajo:**
1. Cliente hace una petición GET o POST al endpoint `/greet`
2. API Gateway recibe la petición y valida el request
3. API Gateway invoca la función Lambda con el evento completo
4. Lambda procesa los parámetros (path, query, body) y retorna un saludo personalizado
5. API Gateway retorna la respuesta al cliente con código HTTP apropiado (200, 400, 405, 500)

**Características principales:**
- ✅ **Arquitectura Serverless**: Sin servidores que administrar, escalado automático
- ✅ **Multi-idioma**: Soporte para 4 idiomas (en, es, fr, hi)
- ✅ **Dual Endpoints**: GET con path/query params + POST con body JSON
- ✅ **Validación Robusta**: Manejo de errores 400 (Bad Request), 405 (Method Not Allowed), 500 (Internal Server Error)
- ✅ **Optimización esbuild**: Bundle minificado y transpilado a ES2020
- ✅ **Logs Estructurados**: Headers correctos y responses bien formateadas
- ✅ **Infrastructure as Code**: Infraestructura completamente definida en `template.yaml`
- ✅ **Testing Local**: Desarrollo completo sin necesidad de deploy a AWS

## 🏗️ Arquitectura & Tecnologías

### **Core Technologies**

- **AWS SAM CLI** - Framework de desarrollo serverless basado en CloudFormation
- **AWS Lambda** - Función serverless para procesamiento de saludos
- **Amazon API Gateway** - API REST para exponer dos endpoints HTTP
- **AWS CloudFormation** - Motor subyacente para provisionamiento de recursos
- **CloudWatch Logs** - Monitoreo y logs de ejecución
- **Node.js 22.x** - Runtime moderno para Lambda con ES Modules
- **esbuild** - Empaquetador ultrarrápido para minificación y transpilación
- **JavaScript (ESM)** - ES Modules con sintaxis moderna

### **AWS Services**

| Servicio | Propósito | Configuración Clave |
|----------|-----------|---------------------|
| **API Gateway** | Endpoints REST `/greet/{name}` (GET) y `/greet` (POST) | Integración proxy con Lambda, path/query parameters |
| **Lambda Function** | Procesamiento de saludos multiidioma | 128 MB RAM, 10s timeout, esbuild minification |
| **IAM Role** | Permisos de Lambda | `AWSLambdaBasicExecutionRole` para CloudWatch Logs |
| **CloudWatch Log Group** | Almacenamiento de logs | Retención configurable, logs JSON |

### **Development Tools**

- **AWS SAM CLI** - Herramienta de desarrollo local y deployment
- **Mocha + Chai** - Framework de testing para pruebas unitarias
- **npm** - Gestor de paquetes para dependencias
- **AWS CLI** - Interacción con servicios AWS
- **esbuild** - Build tool integrado en SAM para optimización

## 📁 Estructura del Proyecto

```
lab-sam-greet-me/
├── greet-me/                       # Código de la función Lambda
│   ├── app.mjs                     # Handler principal de Lambda (ESM)
│   ├── package.json                # Dependencias de la función
│   ├── .npmignore                  # Archivos excluidos del deployment
│   └── tests/
│       └── unit/
│           └── test-handler.mjs    # Tests unitarios de la función
├── events/
│   ├── get-event.json              # Evento de prueba para GET /greet/{name}?lang=fr
│   ├── post-event.json             # Evento de prueba para POST /greet
│   └── event.json                  # Evento genérico (legacy)
├── .aws-sam/                       # Build output (gitignored)
│   ├── build/                      # Código empaquetado y minificado
│   │   ├── GreetMeFunction/        # Lambda optimizada con esbuild
│   │   └── template.yaml           # Template procesado
│   └── build.toml                  # Configuración de build
├── template.yaml                   # Plantilla SAM (infraestructura)
├── samconfig.toml                  # Configuración de deployment (generado)
├── .gitignore                      # Archivos ignorados por Git
└── README.md                       # Este archivo
```

### **Separación de Responsabilidades**

| Directorio | Propósito | Se despliega a AWS |
|------------|-----------|-------------------|
| `greet-me/` | Código fuente de Lambda | ✅ Sí (minificado con esbuild) |
| `events/` | Eventos de prueba local | ❌ No |
| `.aws-sam/` | Build artifacts | ❌ No (Git ignored) |
| `template.yaml` | Infraestructura | ✅ Sí (como CloudFormation) |
| `samconfig.toml` | Config de deploy | ⚠️ Opcional (puede tener secretos) |

## ✨ Componentes Clave

### **1️⃣ Template SAM** (`template.yaml`)

El archivo `template.yaml` define toda la infraestructura del proyecto usando la sintaxis de AWS SAM (extensión de CloudFormation).

#### **Configuración Global**

```yaml
AWSTemplateFormatVersion: "2010-09-09"
Transform: AWS::Serverless-2016-10-31
Description: AWS SAM Template for GreetMe API

Globals:
  Function:
    Timeout: 10
    MemorySize: 128
```

**Características:**
- **Timeout**: 10 segundos (suficiente para procesamiento de saludo)
- **MemorySize**: 128 MB (mínimo necesario para Node.js 22)
- **Transform**: Indica que usa SAM syntax (no CloudFormation puro)

---

### **2️⃣ Función Lambda** (`GreetMeFunction`)

```yaml
GreetMeFunction:
  Type: AWS::Serverless::Function
  Properties:
    CodeUri: greet-me/
    Handler: app.lambdaHandler
    Runtime: nodejs22.x
    Policies:
      - AWSLambdaBasicExecutionRole
    Events:
      GetGreetAPI:
        Type: Api
        Properties:
          Path: /greet/{name}
          Method: get
          RequestParameters:
            - method.request.querystring.lang
      PostGreetAPI:
        Type: Api
        Properties:
          Path: /greet
          Method: post
    Metadata:
      BuildMethod: esbuild
      BuildProperties:
        Minify: true
        Target: es2020
        EntryPoints:
          - app.mjs
```

**Configuración Detallada:**

| Propiedad | Valor | Explicación |
|-----------|-------|-------------|
| `CodeUri` | `greet-me/` | Directorio que contiene el código fuente |
| `Handler` | `app.lambdaHandler` | Función exportada en `app.mjs` |
| `Runtime` | `nodejs22.x` | Node.js 22 (LTS más reciente) |
| `Policies` | `AWSLambdaBasicExecutionRole` | Permisos para escribir logs a CloudWatch |
| `Events.GetGreetAPI` | GET `/greet/{name}` | Endpoint para saludos con path parameter |
| `Events.PostGreetAPI` | POST `/greet` | Endpoint para saludos con body JSON |
| `BuildMethod` | `esbuild` | Empaquetador moderno ultrarrápido |
| `Minify` | `true` | Reduce tamaño del código (~30-50%) |
| `Target` | `es2020` | Transpila a ES2020 para compatibilidad |

> [!IMPORTANT]
> **esbuild BuildMethod**: Esta configuración hace que SAM automáticamente:
> 1. Empaquete el código con esbuild
> 2. Minifique el código (elimina espacios, comments, shorten variables)
> 3. Transpile de ES modules a ES2020
> 4. Genere un bundle optimizado en `.aws-sam/build/`
> 
> **Beneficios**: ~40% reducción de tamaño → cold starts más rápidos → menor latencia

---

**Código de la Función** (`greet-me/app.mjs`):

```javascript
export const lambdaHandler = async (event, context) => {
  let response;

  try {
    if (event.httpMethod === "GET") {
      // Extrae {name} del path y ?lang= del query string
      const name = event.pathParameters?.name || "Guest";
      const lang = event.queryStringParameters?.lang || "en";

      const greetings = {
        en: `Hello ${name}!`,
        es: `¡Hola ${name}!`,
        fr: `Bonjour ${name}!`,
        hi: `Namaste ${name}!`,
      };

      response = {
        statusCode: 200,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: greetings[lang] || greetings.en }),
      };
    } else if (event.httpMethod === "POST") {
      // Parse el body JSON
      const body = JSON.parse(event.body || "{}");

      // Valida campos requeridos
      if (!body.name || !body.lang) {
        response = {
          statusCode: 400,
          body: JSON.stringify({ error: "Missing required fields: name, and/or lang" }),
        };
      } else {
        response = {
          statusCode: 200,
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            message: `Welcome, ${body.name}. Your preferred language is ${body.lang}.`,
          }),
        };
      }
    } else {
      // Otros métodos HTTP → 405
      response = {
        statusCode: 405,
        body: JSON.stringify({ error: "Method Not Allowed" }),
      };
    }
  } catch (err) {
    // Cualquier error → 500
    let errorMessage = "Unknown error occurred";
    if (err instanceof Error) {
      errorMessage = err.message;
    }

    response = {
      statusCode: 500,
      body: JSON.stringify({ error: "Internal Server Error", details: errorMessage }),
    };
  }

  return response;
};
```

**Características del Código:**
- ✅ **ESM (ES Modules)**: Usa `export` en lugar de `module.exports`
- ✅ **Dual method handling**: Diferencia GET vs POST con `event.httpMethod`
- ✅ **Path parameters**: Extrae `{name}` de `event.pathParameters.name`
- ✅ **Query parameters**: Extrae `?lang=` de `event.queryStringParameters.lang`
- ✅ **Body parsing**: Parse JSON del body en POST requests
- ✅ **Validación**: Retorna 400 si faltan campos requeridos
- ✅ **Optional chaining**: Usa `?.` para evitar errors si parámetros no existen
- ✅ **Fallbacks**: Valores por defecto ("Guest", "en")
- ✅ **Error handling**: Try-catch con respuesta 500 en caso de error
- ✅ **Headers correctos**: Content-Type apropiado para JSON

---

### **3️⃣ API Gateway Events**

El template define dos eventos que crean automáticamente dos endpoints en API Gateway:

#### **Evento 1: GET /greet/{name}**

```yaml
GetGreetAPI:
  Type: Api
  Properties:
    Path: /greet/{name}
    Method: get
    RequestParameters:
      - method.request.querystring.lang
```

**URL resultante:**
```
https://abc123xyz.execute-api.us-east-1.amazonaws.com/Prod/greet/Joaquin?lang=es
```

**Event recibido por Lambda:**
```json
{
  "httpMethod": "GET",
  "path": "/greet/Joaquin",
  "pathParameters": {
    "name": "Joaquin"
  },
  "queryStringParameters": {
    "lang": "es"
  },
  "headers": { ... },
  "requestContext": { ... }
}
```

**Response:**
```json
{
  "message": "¡Hola Joaquin!"
}
```

---

#### **Evento 2: POST /greet**

```yaml
PostGreetAPI:
  Type: Api
  Properties:
    Path: /greet
    Method: post
```

**URL resultante:**
```
https://abc123xyz.execute-api.us-east-1.amazonaws.com/Prod/greet
```

**Request:**
```bash
curl -X POST https://abc123xyz.execute-api.../Prod/greet \
  -H "Content-Type: application/json" \
  -d '{"name":"Joaquin","lang":"fr"}'
```

**Event recibido por Lambda:**
```json
{
  "httpMethod": "POST",
  "path": "/greet",
  "body": "{\"name\":\"Joaquin\",\"lang\":\"fr\"}",
  "headers": {
    "Content-Type": "application/json"
  },
  "requestContext": { ... }
}
```

**Response:**
```json
{
  "message": "Welcome, Joaquin. Your preferred language is fr."
}
```

---

### **4️⃣ CloudFormation Outputs**

```yaml
Outputs:
  GreetMeApi:
    Description: "API Gateway endpoint URL for GreetMe API"
    Value: !Sub "https://${ServerlessRestApi}.execute-api.${AWS::Region}.amazonaws.com/Prod/greet/"
  GreetMeFunctionArn:
    Description: "ARN of the GreetMe Lambda Function"
    Value: !GetAtt GreetMeFunction.Arn
```

**Outputs mostrados después del deployment:**
```bash
---------------------------------------------------------
Outputs
---------------------------------------------------------
Key                 GreetMeApi
Description         API Gateway endpoint URL for GreetMe API
Value               https://abc123xyz.execute-api.us-east-1.amazonaws.com/Prod/greet/

Key                 GreetMeFunctionArn
Description         ARN of the GreetMe Lambda Function
Value               arn:aws:lambda:us-east-1:123456789012:function:lab-sam-greet-me-GreetMeFunction-ABC123
---------------------------------------------------------
```

## ☁️ Recursos AWS Creados

Al ejecutar `sam deploy`, se crean los siguientes recursos en tu cuenta de AWS:

| Recurso | Tipo AWS | Propósito | Costo Estimado |
|---------|----------|-----------|----------------|
| **Lambda Function** | `AWS::Lambda::Function` | Procesar saludos en 4 idiomas | Gratis (1M invocaciones/mes) |
| **API Gateway REST API** | `AWS::ApiGateway::RestApi` | API REST pública con 2 endpoints | Gratis (1M requests/mes) |
| **API Gateway Stage** | `AWS::ApiGateway::Stage` | Stage "Prod" para deployment | Incluido |
| **API Gateway Resources** | `AWS::ApiGateway::Resource` | Recursos `/greet` y `/greet/{name}` | Incluido |
| **API Gateway Methods** | `AWS::ApiGateway::Method` | GET y POST methods | Incluido |
| **Lambda Permission** | `AWS::Lambda::Permission` | Permite a API Gateway invocar Lambda | Gratis |
| **Lambda Execution Role** | `AWS::IAM::Role` | Permisos de Lambda (CloudWatch Logs) | Gratis |
| **CloudWatch Log Group** | `AWS::Logs::LogGroup` | Logs de Lambda `/aws/lambda/...` | $0.50/GB almacenado |

**💰 Costo Total Estimado**: 
- **Free Tier**: Completamente gratis (1M invocaciones Lambda + 1M requests API Gateway)
- **Post Free Tier**: ~$0.20-$1/mes con uso ligero (100-500 requests/día)

**Desglose de Costos (Post Free Tier):**
- Lambda: $0.20 por 1 millón de invocaciones + $0.0000166667 por GB-segundo
- API Gateway: $3.50 por millón de requests
- CloudWatch Logs: $0.50 por GB almacenado (típicamente <100MB/mes para este proyecto)

## 🔄 Flujo de Funcionamiento

### **Escenario 1: GET Request con Path y Query Parameters**

```
┌──────────┐  GET /greet/Joaquin?lang=es  ┌─────────────┐  Invoke Lambda   ┌────────────┐  Execute Handler  ┌────────────┐
│          │  (HTTP)                      │             │  with event      │            │  with params      │            │
│ Cliente  │ ──────────────────────────▶ │ API Gateway │ ───────────────▶ │   Lambda   │ ────────────────▶ │   app.mjs  │
│          │                              │   (Prod)    │                  │ GreetMe    │                   │ lambdaHandler│
└──────────┘                              └─────────────┘                  └────────────┘                   └──────┬─────┘
     ▲                                           │                              │                                   │
     │                                           │                              │                                   │
     │         JSON Response                     │                              │                                   │
     │         {"message":"¡Hola Joaquin!"}      │                              │                                   ▼
     │         200 OK                            │                              │                            ┌──────────────┐
     └───────────────────────────────────────────┴──────────────────────────────┴────────────────────────────│  CloudWatch  │
                                                                                                             │     Logs     │
                                                                                                             └──────────────┘
```

**Paso a Paso:**

1. **Request** (0ms): Cliente envía `GET https://.../Prod/greet/Joaquin?lang=es`
2. **API Gateway Routing** (~5-10ms): 
   - Matchea ruta `/greet/{name}` con method GET
   - Extrae `name=Joaquin` del path
   - Extrae `lang=es` del query string
3. **Lambda Invocation** (~10-20ms): API Gateway invoca Lambda con evento proxy
4. **Cold Start** (~100-200ms primera vez): Lambda inicializa runtime Node.js 22
5. **Handler Execution** (~1-5ms): 
   - Extrae `name` y `lang` del evento
   - Busca greeting en diccionario: `greetings["es"]`
   - Formatea mensaje: `"¡Hola Joaquin!"`
6. **Response** (~10ms): API Gateway retorna JSON al cliente
7. **Logging** (~5ms): Lambda escribe logs a CloudWatch
8. **Total Latency**: 
   - **Cold start**: ~150-250ms
   - **Warm execution**: ~20-50ms

---

### **Escenario 2: POST Request con Body JSON**

```
┌──────────┐  POST /greet                 ┌─────────────┐                  ┌────────────┐                   ┌────────────┐
│          │  Body: {"name":"Maria",      │             │                  │            │                   │            │
│ Cliente  │        "lang":"fr"}          │ API Gateway │                  │   Lambda   │                   │   app.mjs  │
│          │ ──────────────────────────▶ │   (Prod)    │ ───────────────▶ │ GreetMe    │ ────────────────▶ │ lambdaHandler│
│          │                              │             │                  │            │                   │ (POST)     │
└──────────┘                              └─────────────┘                  └────────────┘                   └──────┬─────┘
     ▲                                           │                              │                                   │
     │                                           │                              │                                   │
     │  {"message":"Welcome, Maria.             │                              │                                   │
     │    Your preferred language is fr."}      │                              │                                   │
     │  200 OK                                   │                              │                                   │
     └───────────────────────────────────────────┴──────────────────────────────┴───────────────────────────────────┘
```

**Paso a Paso:**

1. **Request**: Cliente envía POST con JSON body
2. **API Gateway**: Valida Content-Type, pasa body como string
3. **Lambda**: 
   - Parsea `event.body` con `JSON.parse()`
   - Valida que `name` y `lang` existan
   - Si faltan → retorna 400 Bad Request
   - Si existen → formatea mensaje personalizado
4. **Response**: Retorna mensaje de bienvenida

---

### **Escenario 3: Error Handling (400 Bad Request)**

```
POST /greet
Body: {"name":"Pedro"}  ← Falta "lang"

┌─────────┐  ──────▶  ┌──────────┐  ──────▶  ┌────────┐  Parse & Validate  ┌────────────┐
│ Cliente │           │ Gateway  │           │ Lambda │  ─────────────────▶ │ Validation │
└─────────┘           └──────────┘           └────────┘                     │ Error!     │
     ▲                                             │                         └────────────┘
     │                                             │ 
     │  {"error":"Missing required fields:        │
     │   name, and/or lang"}                      │
     │  400 Bad Request                            │
     └─────────────────────────────────────────────┘
```

## 🚀 Comandos Útiles

### **Instalación Inicial**

```bash
# Verificar que SAM CLI esté instalado
sam --version

# Verificar AWS CLI y configuración
aws --version
aws configure

# Verificar Node.js
node --version  # Debe ser >=18

# Verificar Docker (necesario para sam local)
docker --version
docker ps
```

### **Instalación de Dependencias**

```bash
# Instalar dependencias de la función Lambda
cd greet-me
npm install
cd ..
```

### **Development & Testing Local**

```bash
# Construir la aplicación (genera .aws-sam/build/ con esbuild)
sam build

# Invocar función localmente con evento GET
sam local invoke GreetMeFunction --event events/get-event.json

# Invocar función localmente con evento POST
sam local invoke GreetMeFunction --event events/post-event.json

# Iniciar API Gateway local (http://localhost:3000)
sam local start-api

# Probar endpoint GET local
curl "http://localhost:3000/greet/Joaquin?lang=es"

# Probar endpoint POST local (PowerShell)
curl -X POST "http://localhost:3000/greet" `
  -H "Content-Type: application/json" `
  -d "{\"name\":\"Joaquin\",\"lang\":\"fr\"}"

# Probar endpoint POST local (Git Bash)
curl -X POST "http://localhost:3000/greet" \
  -H "Content-Type: application/json" \
  -d '{"name":"Joaquin","lang":"fr"}'

# Ejecutar tests unitarios
cd greet-me
npm test
cd ..
```

### **Validación de Template**

```bash
# Validar sintaxis de template.yaml
sam validate

# Validar con linting estricto
sam validate --lint
```

### **Deployment**

#### **Opción 1: Guided Deployment (primera vez)**

```bash
# Deployment interactivo (guiado)
sam deploy --guided
```

**Preguntas que hará:**
```
Stack Name [sam-app]: greet-me-stack
AWS Region [us-east-1]: us-east-1
Confirm changes before deploy [y/N]: y
Allow SAM CLI IAM role creation [Y/n]: Y
GreetMeFunction has no authentication. Is this okay? [y/N]: y
Save arguments to samconfig.toml [Y/n]: Y
```

Esto creará un archivo `samconfig.toml` con tu configuración guardada.

---

#### **Opción 2: Subsequent Deployments (usando config guardada)**

```bash
# Deployment rápido usando samconfig.toml
sam build && sam deploy

# Rebuild y deploy en un comando
sam build && sam deploy

# Deployment sin confirmación (CI/CD)
sam build && sam deploy --no-confirm-changeset
```

---

#### **Opción 3: Deployment Directo (sin guided)**

```bash
# Deployment completo en un comando
sam build && sam deploy \
  --stack-name greet-me-stack \
  --region us-east-1 \
  --capabilities CAPABILITY_IAM \
  --resolve-s3 \
  --no-confirm-changeset
```

**Parámetros importantes:**
- `--stack-name`: Nombre del stack CloudFormation
- `--region`: Región AWS donde desplegar
- `--capabilities CAPABILITY_IAM`: Permite crear IAM roles
- `--resolve-s3`: SAM crea automáticamente un bucket S3 para artefactos
- `--no-confirm-changeset`: Skip confirmación (útil para CI/CD)

---

### **Monitoreo y Logs**

```bash
# Ver logs de la función en tiempo real
sam logs --stack-name greet-me-stack --name GreetMeFunction --tail

# Ver logs de los últimos 10 minutos
sam logs --stack-name greet-me-stack --name GreetMeFunction --start-time '10min ago'

# Filtrar logs por patrón
sam logs --stack-name greet-me-stack --name GreetMeFunction --filter "ERROR"

# Ver logs en CloudWatch (PowerShell)
aws logs tail `
  $(aws logs describe-log-groups --query "logGroups[?contains(logGroupName, 'GreetMeFunction')].logGroupName" --output text) `
  --follow

# Ver logs en CloudWatch (Git Bash)
aws logs tail \
  $(aws logs describe-log-groups \
    --query "logGroups[?contains(logGroupName, 'GreetMeFunction')].logGroupName" \
    --output text) \
  --follow
```

---

### **Testing del Sistema Desplegado**

```bash
# Obtener URL de la API desde CloudFormation outputs
aws cloudformation describe-stacks \
  --stack-name greet-me-stack \
  --query 'Stacks[0].Outputs[?OutputKey==`GreetMeApi`].OutputValue' \
  --output text

# Guardar endpoint en variable (PowerShell)
$API_ENDPOINT = "https://abc123xyz.execute-api.us-east-1.amazonaws.com/Prod/greet"

# Guardar endpoint en variable (Bash)
API_ENDPOINT="https://abc123xyz.execute-api.us-east-1.amazonaws.com/Prod/greet"

# Probar GET con diferentes idiomas
curl "$API_ENDPOINT/Joaquin?lang=en"  # Hello Joaquin!
curl "$API_ENDPOINT/Joaquin?lang=es"  # ¡Hola Joaquin!
curl "$API_ENDPOINT/Joaquin?lang=fr"  # Bonjour Joaquin!
curl "$API_ENDPOINT/Joaquin?lang=hi"  # Namaste Joaquin!

# Probar GET sin lang (default: en)
curl "$API_ENDPOINT/Joaquin"  # Hello Joaquin!

# Probar GET sin name (default: Guest)
curl "$API_ENDPOINT/?lang=es"  # ¡Hola Guest!

# Probar POST (PowerShell)
curl -X POST $API_ENDPOINT `
  -H "Content-Type: application/json" `
  -d "{\"name\":\"Joaquin\",\"lang\":\"es\"}"

# Probar POST (Bash)
curl -X POST "${API_ENDPOINT}" \
  -H "Content-Type: application/json" \
  -d '{"name":"Joaquin","lang":"es"}'

# Probar POST con campos faltantes (debe retornar 400)
curl -X POST "${API_ENDPOINT}" \
  -H "Content-Type: application/json" \
  -d '{"name":"Joaquin"}'

# Probar método no soportado (debe retornar 405)
curl -X DELETE "${API_ENDPOINT}/Joaquin"

# Probar con verbose para ver headers
curl -v "$API_ENDPOINT/Joaquin?lang=es"
```

**Respuestas esperadas:**

```bash
# GET /greet/Joaquin?lang=es
{"message":"¡Hola Joaquin!"}

# POST /greet con {"name":"Joaquin","lang":"fr"}
{"message":"Welcome, Joaquin. Your preferred language is fr."}

# POST /greet con {"name":"Joaquin"} (falta lang)
{"error":"Missing required fields: name, and/or lang"}

# DELETE /greet/Joaquin (método no permitido)
{"error":"Method Not Allowed"}
```

---

### **Cleanup (Eliminar Stack)**

```bash
# Eliminar todos los recursos creados
sam delete

# Eliminar sin confirmación (CI/CD)
sam delete --no-prompts

# Eliminar stack específico
sam delete --stack-name greet-me-stack --region us-east-1
```

> [!WARNING]
> `sam delete` eliminará permanentemente todos los recursos del stack. Los logs de CloudWatch **se conservan** por defecto. Si quieres eliminarlos también, hazlo manualmente desde la consola AWS.

---

### **Debugging Avanzado**

```bash
# Generar eventos de prueba desde esquemas SAM
sam local generate-event apigateway aws-proxy > events/api-gateway-event.json

# Invocar con debugger (Node.js)
sam local invoke GreetMeFunction \
  --event events/get-event.json \
  --debug-port 5858

# Iniciar API local con debugging
sam local start-api --debug-port 5858

# Ver estructura del build
tree .aws-sam/build/GreetMeFunction  # Linux/Mac
dir .aws-sam\build\GreetMeFunction /s  # Windows

# Inspeccionar bundle minificado de esbuild
cat .aws-sam/build/GreetMeFunction/app.mjs
```

---

### **CloudWatch Insights Queries**

Para analizar logs en CloudWatch Insights:

```bash
# Query para contar invocaciones por método HTTP
fields @timestamp, httpMethod
| stats count() by httpMethod

# Query para contar saludos por idioma
fields @timestamp, lang
| parse @message /lang:\s*"(?<lang>[^"]+)"/
| stats count() by lang

# Query para analizar latencias
fields @timestamp, @duration
| sort @duration desc
| limit 20

# Query para buscar errores
fields @timestamp, @message
| filter @message like /ERROR/
| sort @timestamp desc

# Query para requests con error 400
fields @timestamp, @message
| filter statusCode = 400
```

## 💡 Ventajas del Proyecto

| Ventaja | Descripción |
|---------|-------------|
| **🚀 Serverless** | Sin servidores que administrar, pago solo por uso real (~$0.20/1M invocaciones) |
| **📈 Escalabilidad Automática** | AWS escala de 0 a 1000s de invocaciones concurrentes automáticamente |
| **🌍 Multi-idioma** | Soporte fácilmente extensible a más idiomas (cambiar diccionario) |
| **✅ Validación Robusta** | Manejo de errores HTTP estándar (400, 405, 500) |
| **⚡ esbuild Optimization** | Bundle minificado (~40% más pequeño) → cold starts más rápidos |
| **💰 Bajo Costo** | Free Tier cubre 1M invocaciones Lambda + 1M requests API Gateway |
| **📝 Infrastructure as Code** | Infraestructura reproducible, versionable y auditable con SAM |
| **🔍 Observabilidad** | Logs bien estructurados en CloudWatch con headers correctos |
| **🏗️ Desarrollo Local** | SAM CLI permite testing 100% local sin deployments |
| **🔒 Seguridad** | IAM roles con permisos mínimos (least privilege) |
| **⚡ Latencia Baja** | API Gateway + Lambda en la misma región (~20-50ms warm) |
| **🎯 Dual Endpoints** | GET y POST en una sola función → gestión simplificada |
| **📦 ES Modules** | Código moderno con `import`/`export` |

## 📚 Casos de Uso

Este patrón arquitectónico es ideal para:

| Caso de Uso | Descripción | Ejemplo de Extensión |
|-------------|-------------|----------------------|
| 🌐 **I18n APIs** | APIs con respuestas multiidioma | Agregar traducciones de contenido |
| 🤖 **Chatbots** | Bots de Slack/Telegram con saludos personalizados | Integrar con Slack Events API |
| 📧 **Email Personalization** | Generar saludos para emails masivos | Agregar templates de email |
| 🎮 **Gaming APIs** | Mensajes de bienvenida en juegos | Agregar achievements multiidioma |
| 📱 **Mobile Apps** | Backends para apps iOS/Android | Agregar preferencias de usuario |
| 🔔 **Notificaciones** | Push notifications personalizadas | Integrar con SNS/FCM |
| 🎯 **A/B Testing** | Testear diferentes mensajes | Agregar variantes de mensajes |
| 📊 **Analytics** | Trackear idiomas preferidos de usuarios | Agregar eventos a Analytics |

## 🛠️ Próximos Pasos Sugeridos

### **Nivel Básico**
- [ ] Agregar más idiomas (alemán, italiano, portugués, japonés)
- [ ] Implementar CORS para permitir requests desde navegadores
- [ ] Agregar endpoint `GET /languages` para listar idiomas soportados
- [ ] Implementar variables de entorno para configuración
- [ ] Agregar timestamp a las respuestas
- [ ] Crear tests unitarios completos con Mocha/Chai

### **Nivel Intermedio**
- [ ] **DynamoDB**: Persistir saludos registrados con timestamp
  ```yaml
  GreetingsTable:
    Type: AWS::Serverless::SimpleTable
    Properties:
      PrimaryKey:
        Name: id
        Type: String
  ```
- [ ] **Autenticación**: Agregar API Key o Lambda Authorizer (JWT)
- [ ] **Validación OpenAPI**: Agregar modelos de request/response en API Gateway
- [ ] **Rate Limiting**: Throttling en API Gateway (10 req/s por usuario)
- [ ] **Caching**: Habilitar API Gateway caching para idiomas frecuentes
- [ ] **Custom Domain**: Asociar dominio personalizado (`api.greet.me`)
- [ ] **CloudWatch Alarms**: Alertas para errores 4xx/5xx
- [ ] **Métricas Custom**: Contar saludos por idioma con CloudWatch Metrics
- [ ] **Parámetros SSM**: Almacenar configuración en Parameter Store

### **Nivel Avanzado**
- [ ] **CI/CD Pipeline**: GitHub Actions para deploy automático en push
  ```yaml
  # .github/workflows/deploy.yml
  on:
    push:
      branches: [main]
  jobs:
    deploy:
      runs-on: ubuntu-latest
      steps:
        - uses: actions/checkout@v2
        - uses: aws-actions/setup-sam@v2
        - run: sam build
        - run: sam deploy --no-confirm-changeset
  ```
- [ ] **Lambda Layers**: Layer compartido para traducciones
- [ ] **Canary Deployments**: 
  ```yaml
  AutoPublishAlias: prod
  DeploymentPreference:
    Type: Canary10Percent5Minutes
  ```
- [ ] **X-Ray Tracing**: Habilitar distributed tracing
- [ ] **VPC Integration**: Conectar a RDS para almacenar traducciones
- [ ] **SQS Integration**: Encolar saludos para procesamiento asíncrono
- [ ] **EventBridge**: Trigger eventos por idioma usado
- [ ] **WebSocket API**: Versión real-time de saludos
- [ ] **GraphQL**: Migrar a AppSync para queries flexibles
- [ ] **Multi-región**: Deploy en us-east-1 y eu-west-1 con Route53

## 🎨 Extensión: Agregar Más Funcionalidades

### **1. Agregar Validación de Idioma**

```javascript
// greet-me/app.mjs
const SUPPORTED_LANGUAGES = ["en", "es", "fr", "hi"];

export const lambdaHandler = async (event, context) => {
  // ... código existente ...
  
  if (event.httpMethod === "GET") {
    const lang = event.queryStringParameters?.lang || "en";
    
    // Validar que el idioma esté soportado
    if (!SUPPORTED_LANGUAGES.includes(lang)) {
      return {
        statusCode: 400,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          error: "Unsupported language",
          supported: SUPPORTED_LANGUAGES
        }),
      };
    }
    
    // ... resto del código ...
  }
};
```

---

### **2. Agregar Endpoint de Idiomas Soportados**

**Template (agregar evento):**
```yaml
GetLanguagesAPI:
  Type: Api
  Properties:
    Path: /languages
    Method: get
```

**Handler:**
```javascript
else if (event.path === "/languages") {
  return {
    statusCode: 200,
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      languages: [
        { code: "en", name: "English" },
        { code: "es", name: "Español" },
        { code: "fr", name: "Français" },
        { code: "hi", name: "हिन्दी" }
      ]
    }),
  };
}
```

---

### **3. Integrar DynamoDB para Persistir Saludos**

**Template:**
```yaml
Resources:
  GreetingsTable:
    Type: AWS::Serverless::SimpleTable
    Properties:
      PrimaryKey:
        Name: id
        Type: String
      TableName: greetings-table

  GreetMeFunction:
    Type: AWS::Serverless::Function
    Properties:
      # ... propiedades existentes ...
      Policies:
        - AWSLambdaBasicExecutionRole
        - DynamoDBCrudPolicy:
            TableName: !Ref GreetingsTable
      Environment:
        Variables:
          TABLE_NAME: !Ref GreetingsTable
```

**Handler:**
```javascript
import { DynamoDBClient } from "@aws-sdk/client-dynamodb";
import { DynamoDBDocumentClient, PutCommand } from "@aws-sdk/lib-dynamodb";

const client = new DynamoDBClient({});
const docClient = DynamoDBDocumentClient.from(client);

export const lambdaHandler = async (event, context) => {
  // ... código de greeting ...
  
  // Guardar en DynamoDB
  await docClient.send(new PutCommand({
    TableName: process.env.TABLE_NAME,
    Item: {
      id: context.requestId,
      name: name,
      lang: lang,
      timestamp: new Date().toISOString(),
      message: greetings[lang]
    }
  }));
  
  // ... retornar response ...
};
```

---

### **4. Agregar CORS**

**Template:**
```yaml
Globals:
  Api:
    Cors:
      AllowMethods: "'GET, POST, OPTIONS'"
      AllowHeaders: "'Content-Type,X-Amz-Date,Authorization,X-Api-Key'"
      AllowOrigin: "'*'"  # En producción, especifica tu dominio
```

**Handler (agregar headers CORS a responses):**
```javascript
response = {
  statusCode: 200,
  headers: {
    "Content-Type": "application/json",
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Headers": "Content-Type",
    "Access-Control-Allow-Methods": "GET, POST, OPTIONS"
  },
  body: JSON.stringify({ message: greetings[lang] }),
};
```

## 📖 Recursos Adicionales

### **Documentación Oficial**
- [AWS SAM Documentation](https://docs.aws.amazon.com/serverless-application-model/)
- [AWS SAM CLI Reference](https://docs.aws.amazon.com/serverless-application-model/latest/developerguide/serverless-sam-cli-command-reference.html)
- [AWS Lambda Developer Guide](https://docs.aws.amazon.com/lambda/)
- [Amazon API Gateway Documentation](https://docs.aws.amazon.com/apigateway/)
- [esbuild Documentation](https://esbuild.github.io/)

### **Tutoriales**
- [AWS SAM Workshop](https://catalog.workshops.aws/complete-aws-sam/)
- [Serverless Patterns Collection](https://serverlessland.com/patterns)
- [AWS Lambda Power Tuning](https://github.com/alexcasalboni/aws-lambda-power-tuning)
- [Node.js on AWS Lambda Best Practices](https://docs.aws.amazon.com/lambda/latest/dg/lambda-nodejs.html)

### **Best Practices**
- [SAM Best Practices](https://docs.aws.amazon.com/serverless-application-model/latest/developerguide/serverless-sam-template-best-practices.html)
- [Lambda Best Practices](https://docs.aws.amazon.com/lambda/latest/dg/best-practices.html)
- [API Gateway Best Practices](https://docs.aws.amazon.com/apigateway/latest/developerguide/best-practices.html)
- [Well-Architected Serverless Lens](https://docs.aws.amazon.com/wellarchitected/latest/serverless-applications-lens/welcome.html)

### **Herramientas Útiles**
- [AWS SAM CLI](https://github.com/aws/aws-sam-cli)
- [LocalStack](https://localstack.cloud/) - Emulador AWS local completo
- [SAM Policy Templates](https://docs.aws.amazon.com/serverless-application-model/latest/developerguide/serverless-policy-templates.html)
- [Serverless Framework](https://www.serverless.com/) - Alternativa a SAM
- [AWS Toolkit for VS Code](https://aws.amazon.com/visualstudiocode/)

## ⚠️ Troubleshooting

### **Problema: `sam build` falla con "Runtime Not Supported"**

**Causa**: Node.js 22.x es muy reciente, algunas versiones de SAM CLI no lo soportan.

**Solución**:
```bash
# Actualizar SAM CLI a la última versión
pip install --upgrade aws-sam-cli

# O con Homebrew (Mac)
brew upgrade aws-sam-cli

# Verificar versión (debe ser >= 1.100.0)
sam --version
```

---

### **Problema: "Unable to upload artifact ... Access Denied"**

**Causa**: SAM necesita crear/acceder a un bucket S3 para artefactos de deployment.

**Solución**:
```bash
# Usar --guided para configurar bucket automáticamente
sam deploy --guided

# O usar --resolve-s3 para crear bucket automático
sam deploy --resolve-s3

# O especificar bucket manualmente
sam deploy --s3-bucket mi-bucket-sam-artifacts
```

---

### **Problema: API Gateway retorna 500 Internal Server Error**

**Causa**: Error en el código Lambda o permisos incorrectos.

**Verificación**:
```bash
# Ver logs de Lambda
sam logs --stack-name greet-me-stack --name GreetMeFunction --tail

# Test directo de Lambda (bypass API Gateway)
sam local invoke GreetMeFunction --event events/get-event.json
```

**Solución**:
- Revisar logs de CloudWatch para ver el error específico
- Verificar que el handler retorne objeto con `statusCode` y `body`
- Asegurar que `body` sea un string JSON (usar `JSON.stringify()`)

---

### **Problema: "Cannot find module 'axios'" en Lambda**

**Causa**: Dependencias no instaladas o no incluidas en el deployment package.

**Solución**:
```bash
cd greet-me
npm install
cd ..
sam build
sam deploy
```

> [!TIP]
> **SAM Build**: `sam build` automáticamente ejecuta `npm install` en cada función y empaqueta `node_modules/` en el deployment package con esbuild.

---

### **Problema: Cold starts muy lentos (>500ms)**

**Causa**: Node.js 22.x tiene overhead de inicialización mayor que versiones anteriores.

**Soluciones**:
1. **Aumentar memoria** (más RAM = más CPU):
   ```yaml
   MemorySize: 256  # De 128 a 256
   ```

2. **Provisioned Concurrency**:
   ```yaml
   ProvisionedConcurrencyConfig:
     ProvisionedConcurrentExecutions: 2
   ```
   **Nota**: Esto tiene costo adicional (~$10/mes por 2 instancias warm)

3. **Reducir dependencias**:
   ```bash
   # Eliminar axios si no se usa
   npm uninstall axios
   ```

4. **Usar ARM64 (Graviton2)** para mejor performance:
   ```yaml
   Architectures:
     - arm64  # En lugar de x86_64
   ```

---

### **Problema: esbuild no minifica el código**

**Causa**: Configuración incorrecta de Metadata.

**Verificación**:
```yaml
Metadata:
  BuildMethod: esbuild  # ✅ Debe estar presente
  BuildProperties:
    Minify: true        # ✅ Debe ser true
    Target: es2020
    EntryPoints:
      - app.mjs
```

**Verificar que minificó correctamente**:
```bash
# Ver tamaño del bundle
ls -lh .aws-sam/build/GreetMeFunction/app.mjs

# Ver contenido minificado
cat .aws-sam/build/GreetMeFunction/app.mjs
```

---

### **Problema: `sam local start-api` falla con "Docker not found"**

**Causa**: SAM CLI requiere Docker para emular Lambda localmente.

**Solución**:
```bash
# Instalar Docker Desktop
# Windows: https://docs.docker.com/desktop/install/windows-install/
# Mac: https://docs.docker.com/desktop/install/mac-install/

# Verificar que Docker esté corriendo
docker --version
docker ps

# Reiniciar SAM local
sam local start-api
```

---

### **Problema: POST devuelve 400 con body válido**

**Causa**: Formato del body JSON incorrecto en el evento de prueba.

**Verificación**:
```json
// events/post-event.json
{
  "httpMethod": "POST",
  "body": "{\"name\":\"Joaco\",\"lang\":\"es\"}"  // ✅ Debe ser string escapado
}
```

**NO hacer**:
```json
{
  "httpMethod": "POST",
  "body": {"name":"Joaco","lang":"es"}  // ❌ NO es válido, debe ser string
}
```

---

### **Problema: Response no tiene headers CORS**

**Causa**: Headers CORS no agregados en la respuesta Lambda.

**Solución**:
```javascript
response = {
  statusCode: 200,
  headers: {
    "Content-Type": "application/json",
    "Access-Control-Allow-Origin": "*",  // Agregar CORS
    "Access-Control-Allow-Headers": "Content-Type",
    "Access-Control-Allow-Methods": "GET, POST, OPTIONS"
  },
  body: JSON.stringify({ message: greetings[lang] }),
};
```

## 📊 Comparación: SAM vs CDK vs Serverless Framework

| Característica | AWS SAM | AWS CDK | Serverless Framework |
|----------------|---------|---------|----------------------|
| **Lenguaje** | YAML/JSON | TypeScript/Python/Java | YAML |
| **Curva de aprendización** | 🟢 Baja | 🟡 Media | 🟢 Baja |
| **Desarrollo local** | ✅ Excelente | ⚠️ Limitado | ✅ Bueno |
| **Multi-cloud** | ❌ Solo AWS | ❌ Solo AWS | ✅ AWS/Azure/GCP |
| **Comunidad** | 🟡 Media | 🟢 Grande | 🟢 Grande |
| **Abstracción** | 🟡 Media | 🟢 Alta | 🟡 Media |
| **Debugging local** | ✅ Nativo | ⚠️ Requiere setup | ✅ Plugin |
| **IDE Support** | 🟡 Limitado | ✅ Excelente (VSCode) | 🟡 Limitado |
| **esbuild Support** | ✅ Nativo | ✅ Nativo | ⚠️ Plugin |
| **Best for** | APIs simples | Infra compleja | Multi-cloud |

**Recomendación**:
- **SAM**: APIs y funciones Lambda simples a medianas (**este proyecto** ✅)
- **CDK**: Aplicaciones con múltiples servicios AWS y lógica compleja
- **Serverless Framework**: Necesidad de portabilidad multi-cloud

---

## 📝 Licencia

Este proyecto es de código abierto y está disponible para fines educativos.

---

## 📮 Contacto

¿Preguntas o sugerencias? Abre un issue en el repositorio.

---

**⭐ Si este proyecto te resultó útil, considera darle una estrella en GitHub!**

---

## 📚 Apéndice: Comandos Rápidos de Referencia

```bash
# 🔨 Build & Deploy
sam build                              # Construir con esbuild
sam deploy                             # Desplegar (requiere samconfig.toml)
sam deploy --guided                    # Deployment guiado (primera vez)

# 🧪 Testing Local
sam local invoke GreetMeFunction -e events/get-event.json   # GET test
sam local invoke GreetMeFunction -e events/post-event.json  # POST test
sam local start-api                    # API local (http://localhost:3000)

# 🌐 Testing API Local
curl "http://localhost:3000/greet/Joaquin?lang=es"
curl -X POST "http://localhost:3000/greet" -H "Content-Type: application/json" -d '{"name":"Joaquin","lang":"fr"}'

# 📊 Logs & Monitoring
sam logs --tail                        # Ver logs en tiempo real
sam logs --name GreetMeFunction        # Logs de función específica

# ✅ Validation
sam validate                           # Validar template.yaml
sam validate --lint                    # Validar con linting

# 🗑️ Cleanup
sam delete                             # Eliminar stack y recursos

# 🔍 Info
sam list resources                     # Listar recursos del stack
sam list endpoints                     # Listar endpoints de API Gateway
```

---

## 🎯 Checklist de Deployment

**Antes de hacer `sam deploy --guided` por primera vez:**

- [ ] AWS CLI configurado (`aws configure`)
- [ ] SAM CLI instalado (`sam --version >= 1.100.0`)
- [ ] Dependencias instaladas (`cd greet-me && npm install`)
- [ ] Template validado (`sam validate`)
- [ ] Tests pasando (`cd greet-me && npm test`)
- [ ] Docker corriendo (para `sam local`)
- [ ] Región AWS decidida (ej: `us-east-1`)
- [ ] Stack name decidido (ej: `greet-me-stack`)

**Después del deployment:**

- [ ] API URL copiada desde Outputs
- [ ] Endpoint GET probado con curl
- [ ] Endpoint POST probado con curl
- [ ] Logs verificados en CloudWatch
- [ ] Costo estimado revisado en Cost Explorer
- [ ] Endpoint agregado a documentación/Postman

---

## 🔬 Event Structure Reference

### **GET /greet/{name}?lang=es**

**Event recibido por Lambda:**
```json
{
  "resource": "/greet/{name}",
  "path": "/greet/Joaquin",
  "httpMethod": "GET",
  "headers": {
    "Accept": "*/*",
    "Host": "abc123xyz.execute-api.us-east-1.amazonaws.com",
    "User-Agent": "curl/7.64.1"
  },
  "queryStringParameters": {
    "lang": "es"
  },
  "pathParameters": {
    "name": "Joaquin"
  },
  "requestContext": {
    "requestId": "abc-123-def-456",
    "apiId": "abc123xyz",
    "stage": "Prod"
  },
  "body": null,
  "isBase64Encoded": false
}
```

### **POST /greet**

**Event recibido por Lambda:**
```json
{
  "resource": "/greet",
  "path": "/greet",
  "httpMethod": "POST",
  "headers": {
    "Accept": "*/*",
    "Content-Type": "application/json",
    "Host": "abc123xyz.execute-api.us-east-1.amazonaws.com"
  },
  "queryStringParameters": null,
  "pathParameters": null,
  "requestContext": {
    "requestId": "xyz-789-abc-012",
    "apiId": "abc123xyz",
    "stage": "Prod"
  },
  "body": "{\"name\":\"Joaquin\",\"lang\":\"fr\"}",
  "isBase64Encoded": false
}
```

---

<div align="center">

**Hecho con ❤️ usando AWS SAM**

[⬆ Volver arriba](#-greetme-api---aws-sam)

</div>
