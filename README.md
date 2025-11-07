# 🚨  Protótipo SOS Localiza

Um protótipo funcional desenvolvido em **React Native com Expo**, voltado para auxiliar usuários a se manterem informados sobre **eventos adversos (como enchentes, deslizamentos e emergências climáticas)** em suas regiões.
O app permite **registrar áreas de interesse pelo CEP**, acessar **orientações de segurança** e visualizar um **mapa interativo** da localidade.

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

## 🧭 **Expo Router - Sistema de Navegação**

### **O que é Expo Router?**

O **Expo Router** é um sistema de navegação baseado em arquivos (file-based routing) para aplicativos React Native com Expo. Ele funciona de forma similar ao Next.js, onde a estrutura de pastas define as rotas da aplicação.

### **Como Funciona no Projeto**

No **SOS Localiza**, o Expo Router está configurado da seguinte forma:

```
app/
├── _layout.tsx          # Layout raiz com Stack Navigator
├── index.tsx            # Tela inicial (autenticação)
├── hometela.tsx         # Tela principal do app
└── orientacoes.tsx      # Tela de orientações
```

### **Configuração no `_layout.tsx`**

```typescript
import { Stack } from 'expo-router';

export default function RootLayout() {
  return (
    <Stack>
      <Stack.Screen name="index"/>
      <Stack.Screen name="hometela"/>
    </Stack>
  );
}
```

### **Navegação entre Telas**

O projeto utiliza os seguintes métodos de navegação:

1. **`router.push()`** - Navega para uma nova tela (adiciona à pilha)

   ```typescript
   import { router } from 'expo-router';
   router.push('/orientacoes');
   ```
2. **`router.replace()`** - Substitui a tela atual (não adiciona à pilha)

   ```typescript
   router.replace('/hometela');
   ```
3. **`router.back()`** - Volta para a tela anterior

   ```typescript
   router.back();
   ```

### **Vantagens do Expo Router**

- ✅ **Roteamento baseado em arquivos** - Estrutura intuitiva e fácil de entender
- ✅ **TypeScript nativo** - Suporte completo a tipos e autocomplete
- ✅ **Deep linking** - Suporte automático a links profundos
- ✅ **Navegação nativa** - Performance otimizada com componentes nativos
- ✅ **Integração com Expo** - Funciona perfeitamente com o ecossistema Expo

---

## 🔄 **Context API - Gerenciamento de Estado**

### **O que é Context API?**

A **Context API** é uma funcionalidade nativa do React que permite compartilhar dados entre componentes sem precisar passar props manualmente através de cada nível da árvore de componentes (prop drilling).

### **Como Funciona**

A Context API consiste em três partes principais:

1. **`createContext()`** - Cria um novo contexto
2. **`Provider`** - Componente que fornece os dados para os componentes filhos
3. **`useContext()`** - Hook que consome os dados do contexto

### **Exemplo de Implementação**

Embora o projeto atual não utilize Context API, aqui está um exemplo de como poderia ser implementado para gerenciar o estado de autenticação:

```typescript
// contexts/AuthContext.tsx
import React, { createContext, useContext, useState } from 'react';

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);

  const login = async (email: string, password: string) => {
    // Lógica de autenticação
    setUser({ email, name: 'Usuário' });
  };

  const logout = () => {
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{
      user,
      isAuthenticated: !!user,
      login,
      logout
    }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth deve ser usado dentro de AuthProvider');
  }
  return context;
}
```

### **Uso no Projeto**

Para usar Context API no projeto, você precisaria:

1. **Criar o contexto** em `contexts/AuthContext.tsx`
2. **Envolver o app** com o Provider no `_layout.tsx`:
   ```typescript
   import { AuthProvider } from './contexts/AuthContext';

   export default function RootLayout() {
     return (
       <AuthProvider>
         <Stack>
           {/* suas telas */}
         </Stack>
       </AuthProvider>
     );
   }
   ```
3. **Consumir o contexto** em qualquer componente:
   ```typescript
   import { useAuth } from '../contexts/AuthContext';

   export default function HomeScreen() {
     const { user, logout } = useAuth();
     // usar user e logout
   }
   ```

### **Quando Usar Context API**

- ✅ **Estado global** - Dados que precisam ser acessados por múltiplos componentes
- ✅ **Autenticação** - Informações do usuário logado
- ✅ **Temas** - Configurações de tema/claro/escuro
- ✅ **Configurações** - Preferências do usuário

### **Alternativas no Projeto**

Atualmente, o projeto utiliza:

- **Props drilling** - Passagem de props entre componentes
- **AsyncStorage** - Para persistência de dados locais
- **useState** - Para estado local de componentes

---

## 🗺️ **Funcionalidades Adicionais**

### **Mapa Interativo (Leaflet)**

O projeto integra a biblioteca **Leaflet** para exibição de mapas interativos:

- Suporte para web (via DOM direto) e mobile (via WebView)
- Marcadores e popups personalizados
- Tiles do OpenStreetMap

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

---

## 🧑‍💻 **Desenvolvido por**

| Nome               | RM     |
| ------------------ | ------ |
| Amanda Galdino     | 560066 |
| Bruno Cantacini    | 560242 |
| Gustavo Gonçalves | 556823 |

---

## 📚 **Recursos e Documentação**

- [Documentação Expo](https://docs.expo.dev/)
- [Expo Router Docs](https://docs.expo.dev/router/introduction/)
- [React Native Docs](https://reactnative.dev/docs/getting-started)
- [Context API Docs](https://react.dev/reference/react/createContext)
- [Leaflet Docs](https://leafletjs.com/)
