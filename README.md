# 🚨  Protótipo SOS Localiza

Um protótipo funcional desenvolvido em **React Native com Expo**, voltado para auxiliar usuários a se manterem informados sobre **eventos adversos (como enchentes, deslizamentos e emergências climáticas)** em suas regiões.
O app permite **enviar SMS de emergência**, acessar **orientações de segurança** e visualizar um **mapa interativo** da localidade.

---

## 📱 **Objetivo do Projeto**

O **SOS Localiza** foi desenvolvido como parte do desafio da disciplina de **Desenvolvimento Mobile (FIAP)**, atendendo aos requisitos do trabalho de **prototipagem funcional com React Native + Expo Router**.

O aplicativo busca simular um sistema de alerta regional simples, unindo **IoT**, **Inteligência Artificial Generativa** (em fases futuras) e **boas práticas de arquitetura mobile**.

---

## 🧠 **Tecnologias Utilizadas**

### **Core**

- ⚛️ **React Native** (0.81.5) — framework base do aplicativo mobile
- 🚀 **Expo** (~54.0.22) — plataforma para desenvolvimento e empacotamento simplificado
- ⚛️ **React** (19.1.0) — biblioteca JavaScript para construção de interfaces
- 🧰 **TypeScript** (5.9.2) — tipagem estática e melhor manutenção de código

### **Navegação e Roteamento**

- 🧭 **Expo Router** (~6.0.14) — sistema de navegação baseado em arquivos (file-based routing)

### **Armazenamento e Persistência**

- 💾 **@react-native-async-storage/async-storage** (2.2.0) — armazenamento local persistente

### **UI e Componentes**

- 🎨 **StyleSheet / Flexbox** — construção do layout responsivo
- 🎯 **@expo/vector-icons** (^15.0.3) — biblioteca de ícones (Ionicons)
- 📱 **react-native-safe-area-context** (~5.6.0) — gerenciamento de áreas seguras em dispositivos
- 🖼️ **react-native-screens** (~4.16.0) — otimização de performance para telas nativas
- 🌐 **react-native-web** (^0.21.0) — suporte para plataforma web
- 🗺️ **react-native-webview** (^13.15.0) — componente WebView para renderizar conteúdo web (usado para Leaflet)

### **Utilitários**

- 📊 **expo-status-bar** (~3.0.8) — controle da barra de status do dispositivo
- 🔤 **react-native-vector-icons** (^10.3.0) — ícones vetoriais adicionais

---

## 📦 **Instalação e Configuração**

### **Pré-requisitos**

Antes de começar, certifique-se de ter instalado:

- **Node.js** (versão 18 ou superior)
- **npm** ou **yarn** como gerenciador de pacotes
- **Git** para clonar o repositório
- **Expo CLI** (instalado globalmente): `npm install -g expo-cli`

### **Instalação das Dependências**

1. **Clone o repositório**

```bash
git clone https://github.com/ggustavo05/sosLocal.git
cd sosLocal
```

2. **Instale as dependências do projeto**

```bash
npm install
```

Isso instalará automaticamente todas as dependências listadas no `package.json`:

- Dependências de produção (React Native, Expo, Expo Router, etc.)
- Dependências de desenvolvimento (TypeScript, tipos do React)

3. **Inicie o servidor de desenvolvimento**

```bash
npm start
# ou
npx expo start
```

### **Executando o Projeto**

Após iniciar o servidor, você terá as seguintes opções:

- **Web**: Pressione `w` ou acesse `http://localhost:8081`
- **Android**: Pressione `a` (requer Android SDK configurado)
- **iOS**: Pressione `i` (requer macOS e Xcode)
- **Expo Go**: Escaneie o QR code com o app Expo Go no seu dispositivo móvel

---

## 🔌 **Integração com APIs Backend**

O aplicativo **SOS Localiza** integra-se com múltiplas APIs para fornecer funcionalidades completas de autenticação, envio de SMS de emergência e visualização de áreas de risco.

### **📋 Arquitetura de APIs**

```
Frontend (React Native)
    ↓
API Services Layer
    ├── authService.ts (Login/Logout)
    ├── smsService.ts (Envio de SMS)
    └── riskAreasService.ts (Áreas de Risco)
    ↓
Backend APIs
    ├── Spring Boot (localhost:8082, perfil dev)
    │   ├── POST /login
    │   └── POST /api/sms
    └── Oracle APEX
        └── GET /ords/oracle_soslo/risco/areas
```

---

### **🔐 API de Login e Autenticação**

#### **Endpoint**
```
POST http://localhost:8082/login
```

#### **Método de Autenticação**
O sistema utiliza **HTTP Basic Authentication** com credenciais codificadas em Base64.

#### **Como Funciona**

1. **Usuário insere credenciais** na tela de login
2. **Frontend cria header Authorization** com formato: `Basic base64(username:password)`
3. **Backend valida** as credenciais contra o banco de dados
4. **Resposta de sucesso** retorna status 200
5. **Credenciais são armazenadas** localmente com AsyncStorage

---

### **📱 API de Cadastro**

#### **Endpoint**
```
POST http://localhost:8082/api/mobile/cadastro
```

#### **Como Funciona**

1. **Usuário preenche formulário** de cadastro
2. **Frontend valida** os dados (email, senha, confirmação)
3. **Requisição enviada** ao backend com dados do novo usuário
4. **Backend cria** novo registro no banco de dados
5. **Resposta de sucesso** permite login automático

#### **Exemplo de Payload**

```json
{
  "nome": "João Silva",
  "email": "joao@email.com",
  "senha": "senha123",
  "telefone": "11999999999",
  "cep": "01310-100"
}
```

#### **Validações Frontend**

```typescript
// Validações implementadas
- Email válido (formato)
- Senha mínima de 6 caracteres
- Confirmação de senha igual à senha
- Campos obrigatórios preenchidos
```

---

### **📨 API de Envio de SMS (Twilio)**

#### **Endpoint**
```
POST http://localhost:8082/api/sms
```

#### **Como Funciona**

O sistema utiliza **Twilio** para envio de SMS de emergência:

1. **Usuário clica** no botão "Enviar SMS de Emergência"
2. **Modal abre** com formulário pré-preenchido
3. **Usuário seleciona** tipo de emergência (Enchente, Deslizamento, etc.)
4. **Usuário confirma** o envio
5. **Frontend envia** requisição para backend
6. **Backend processa** via Twilio API
7. **SMS é enviado** para o número configurado
8. **Confirmação** é exibida ao usuário

#### **Estrutura da Requisição**

```typescript
// Payload enviado ao backend
{
  "numeroDestino": "+5511999999999",
  "mensagem": "🚨 ALERTA DE EMERGÊNCIA: Enchente detectada na região...",
  "idEvento": 1  // ID do tipo de emergência
}
```

#### **Exemplo de Implementação**

```typescript
// smsService.ts
async sendEmergencySMS(data: EmergencySMSData): Promise<SMSResponse> {
  const credentials = await authService.getStoredCredentials();
  const authHeader = 'Basic ' + btoa(`${credentials.username}:${credentials.password}`);
  
  const response = await fetch(`${API_CONFIG.BASE_URL}/api/sms`, {
    method: 'POST',
    headers: {
      'Authorization': authHeader,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      numeroDestino: data.phoneNumber,
      mensagem: data.message,
      idEvento: data.eventType,
    }),
  });
  
  if (!response.ok) {
    throw new Error('Falha ao enviar SMS');
  }
  
  return await response.json();
}
```

#### **Tipos de Emergência**

```typescript
const EMERGENCY_TYPES = [
  { id: 1, name: 'Enchente', description: 'Alagamento ou inundação' },
  { id: 2, name: 'Deslizamento', description: 'Deslizamento de terra' },
  { id: 3, name: 'Tempestade', description: 'Tempestade severa' },
  { id: 4, name: 'Incêndio', description: 'Incêndio florestal ou urbano' },
  { id: 5, name: 'Outro', description: 'Outra emergência' },
];
```

#### **Fluxo Completo**

```
1. Usuário → Clica "Enviar SMS"
2. Modal → Abre com formulário
3. Usuário → Seleciona tipo de emergência
4. Usuário → Edita número/mensagem (opcional)
5. Usuário → Clica "Enviar"
6. Popup → Confirmação "Tem certeza?"
7. Modal → Fecha imediatamente
8. Frontend → POST /api/sms
9. Backend → Processa via Twilio
10. Twilio → Envia SMS
```

---

### **🗺️ API Oracle APEX - Áreas de Risco**

#### **Endpoint**
```
GET https://oracleapex.com/ords/oracle_soslo/risco/areas
```

#### **Como Funciona**

A API Oracle APEX fornece dados de áreas de risco previstas para exibição no mapa:

1. **Componente MapSection** monta na tela
2. **useEffect dispara** busca automática
3. **Frontend consulta** API Oracle APEX
4. **API retorna** lista de coordenadas com níveis de risco
5. **Dados são validados** (lat/lng válidos, risco válido)
6. **Marcadores coloridos** são plotados no mapa Leaflet
7. **Usuário interage** clicando nos marcadores

#### **Formato de Resposta**

```json
[
  {
    "latitude": -23.504561,
    "longitude": -46.638034,
    "risco_previsto": "alto"
  },
  {
    "latitude": -23.550520,
    "longitude": -46.633308,
    "risco_previsto": "medio"
  },
  {
    "latitude": -23.561684,
    "longitude": -46.656139,
    "risco_previsto": "baixo"
  }
]
```

#### **Níveis de Risco**

| Nível | Cor | Código Hex | Descrição |
|-------|-----|------------|-----------|
| **alto** | 🔴 Vermelho | #dc3545 | Risco elevado - Atenção máxima |
| **medio** | 🟡 Amarelo | #ffc107 | Risco moderado - Cautela |
| **baixo** | 🟢 Verde | #28a745 | Risco baixo - Monitoramento |

---

### **🔍 Logs e Debugging**

Todos os serviços implementam logging detalhado:

```javascript
// Exemplo de logs no console
=== BUSCANDO ÁREAS DE RISCO DA API ORACLE APEX ===
URL: https://oracleapex.com/ords/oracle_soslo/risco/areas
✅ Dados recebidos da API
✅ 25 áreas de risco válidas encontradas
📊 Estatísticas: { alto: 8, medio: 12, baixo: 5 }

=== INICIANDO ENVIO DE SMS DE EMERGÊNCIA ===
Tipo de Emergência: Enchente
Número de Destino: +55 11 999999999
Mensagem: 🚨 ALERTA DE EMERGÊNCIA...
✅ SMS ENVIADO COM SUCESSO!
```

---

## 🗺️ **Funcionalidades Adicionais**

### **Mapa Interativo (Leaflet)**

O projeto integra a biblioteca **Leaflet** para exibição de mapas interativos:

- Suporte para web (via DOM direto) e mobile (via WebView)
- Marcadores coloridos por nível de risco
- Popups informativos interativos
- Tiles do OpenStreetMap
- Zoom automático baseado nas áreas
- Legenda visual de níveis de risco

### **Layout Responsivo**

O app possui layout responsivo que se adapta a diferentes tamanhos de tela:

- Breakpoint em 600px para mobile
- Layout em coluna para dispositivos móveis
- Layout em linha para tablets e desktop

---

## 🧭 **Fluxo de Navegação**

### **Estrutura de Telas**

```
index.tsx (Autenticação)
    ↓
hometela.tsx (Tela Principal)
    ├── GuidanceSection → orientacoes.tsx
    ├── MapSection (Mapa Leaflet)
    └── RiskAreaSection
```

### **Navegação Implementada**

- **Tela Inicial** (`index.tsx`): Tela de login/cadastro com tabs
- **Tela Home** (`hometela.tsx`): Dashboard principal com seções de orientações, mapa e áreas de risco
- **Tela Orientações** (`orientacoes.tsx`): Guia completo sobre como agir em situações de enchentes

## Vídeo de demonstração
Segue abaixo o link do vídeo demonstrando o funcionamento do projeto: 

> 🎬 Clique na imagem abaixo para assistir no YouTube

[![Assista ao vídeo](./assets/capa-video.png)](https://youtu.be/s1n1HTfvzBU)

## 🧑‍💻 **Desenvolvido por**

| Nome               | RM     |
| ------------------ | ------ |
| Amanda Galdino     | 560066 |
| Bruno Cantacini    | 560242 |
| Gustavo Gonçalves | 556823 |


## 📚 **Recursos e Documentação**

- [Documentação Expo](https://docs.expo.dev/)
- [Expo Router Docs](https://docs.expo.dev/router/introduction/)
- [React Native Docs](https://reactnative.dev/docs/getting-started)
- [Context API Docs](https://react.dev/reference/react/createContext)
- [Leaflet Docs](https://leafletjs.com/)
