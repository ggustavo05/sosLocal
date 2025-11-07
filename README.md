# 🚨  Protótipo SOS Localiza 

Um protótipo funcional desenvolvido em **React Native com Expo**, voltado para auxiliar usuários a se manterem informados sobre **eventos adversos (como enchentes, deslizamentos e emergências climáticas)** em suas regiões.  
O app permite **registrar áreas de interesse pelo CEP**, acessar **orientações de segurança** e visualizar um **mapa interativo** da localidade.

---

## 📱 **Objetivo do Projeto**

O **SOS Localiza** foi desenvolvido como parte do desafio da disciplina de **Desenvolvimento Mobile (FIAP)**, atendendo aos requisitos do trabalho de **prototipagem funcional com React Native + Expo Router**.

O aplicativo busca simular um sistema de alerta regional simples, unindo **IoT**, **Inteligência Artificial Generativa** (em fases futuras) e **boas práticas de arquitetura mobile**.

---

## 🧠 **Tecnologias Utilizadas**

- ⚛️ **React Native** — base do aplicativo.
- 🚀 **Expo** — execução e empacotamento simplificado.
- 🧭 **Expo Router** — navegação entre telas.
- 💾 **AsyncStorage** — armazenamento local persistente.
- 🎨 **StyleSheet / Flexbox** — construção do layout.
- 🧰 **TypeScript** — tipagem estática e melhor manutenção de código.

---

## ⚙️ **Como Executar o Projeto**

### 1️⃣ Clonar o repositório
```bash
git clone https://github.com/SEU_USUARIO/sos-localiza.git
cd sos-localiza
```
### 2️⃣ Instalar as dependências
```bash
npm install
```
### 3️⃣ Iniciar o servidor Expo
```bash
npm expo start
```

### 🧭 Fluxo de Navegação

- Tela Inicial (index.tsx)

`Exibe o logo.`

`Botões “Adicionar Área” e “Orientações”.`

`Espaço reservado para o mapa.`

- Tela Adicionar Área (adicionar-area.tsx)

`Formulário controlado com useState.`

`Salvamento e listagem com AsyncStorage.`

- Tela Orientações (orientacoes.tsx)

`Mostra recomendações e boas práticas em situações de emergência.`

---

### 🧑‍💻 Desenvolvido por

| Nome               | RM       |
|--------------------|----------|
| Amanda Galdino     | 560066   |
| Bruno Cantacini    | 560242   |
| Gustavo Gonçalves  | 556823   |
