# 📱 Guia de Instalação do Android SDK

## Opção 1: Instalar Android Studio (Recomendado - Mais Completo)

### Passo 1: Baixar o Android Studio
1. Acesse: https://developer.android.com/studio
2. Clique em "Download Android Studio"
3. Baixe o instalador para Windows

### Passo 2: Instalar o Android Studio
1. Execute o instalador baixado
2. Siga as instruções do assistente de instalação
3. **IMPORTANTE**: Durante a instalação, certifique-se de que a opção "Android SDK" está marcada
4. O SDK será instalado em: `C:\Users\bruno.cantacini\AppData\Local\Android\Sdk`

### Passo 3: Configurar Variáveis de Ambiente

#### Via Interface Gráfica (Recomendado):
1. Pressione `Win + R`, digite `sysdm.cpl` e pressione Enter
2. Vá na aba "Avançado"
3. Clique em "Variáveis de Ambiente"
4. Em "Variáveis do sistema", clique em "Novo"
5. Adicione:
   - **Nome**: `ANDROID_HOME`
   - **Valor**: `C:\Users\bruno.cantacini\AppData\Local\Android\Sdk`
6. Encontre a variável `Path` e clique em "Editar"
7. Adicione estas duas entradas:
   - `%ANDROID_HOME%\platform-tools`
   - `%ANDROID_HOME%\tools`
   - `%ANDROID_HOME%\tools\bin`
8. Clique em "OK" em todas as janelas

#### Via PowerShell (Como Administrador):
```powershell
# Definir ANDROID_HOME
[System.Environment]::SetEnvironmentVariable('ANDROID_HOME', 'C:\Users\bruno.cantacini\AppData\Local\Android\Sdk', 'Machine')

# Adicionar ao PATH
$currentPath = [System.Environment]::GetEnvironmentVariable('Path', 'Machine')
$newPath = $currentPath + ';%ANDROID_HOME%\platform-tools;%ANDROID_HOME%\tools;%ANDROID_HOME%\tools\bin'
[System.Environment]::SetEnvironmentVariable('Path', $newPath, 'Machine')
```

### Passo 4: Instalar Componentes do SDK
1. Abra o Android Studio
2. Vá em "More Actions" > "SDK Manager"
3. Na aba "SDK Platforms", instale:
   - Android 13.0 (Tiramisu) - API Level 33
   - Android 12.0 (S) - API Level 31
4. Na aba "SDK Tools", certifique-se de que estão instalados:
   - Android SDK Build-Tools
   - Android SDK Platform-Tools
   - Android SDK Command-line Tools
   - Google Play services
   - Intel x86 Emulator Accelerator (HAXM installer) - se usar emulador Intel

### Passo 5: Verificar Instalação
Abra um novo PowerShell e execute:
```powershell
adb version
echo $env:ANDROID_HOME
```

---

## Opção 2: Instalar apenas Android SDK Command Line Tools (Mais Leve)

### Passo 1: Baixar Command Line Tools
1. Acesse: https://developer.android.com/studio#command-tools
2. Baixe "Command line tools only" para Windows
3. Extraia o arquivo ZIP

### Passo 2: Criar Estrutura de Pastas
```powershell
# Criar pasta do SDK
New-Item -ItemType Directory -Path "C:\Users\bruno.cantacini\AppData\Local\Android\Sdk" -Force

# Criar subpastas necessárias
New-Item -ItemType Directory -Path "C:\Users\bruno.cantacini\AppData\Local\Android\Sdk\cmdline-tools" -Force
New-Item -ItemType Directory -Path "C:\Users\bruno.cantacini\AppData\Local\Android\Sdk\cmdline-tools\latest" -Force
```

### Passo 3: Mover Arquivos
1. Copie o conteúdo da pasta `cmdline-tools` extraída para:
   `C:\Users\bruno.cantacini\AppData\Local\Android\Sdk\cmdline-tools\latest\`

### Passo 4: Configurar Variáveis de Ambiente
Siga o Passo 3 da Opção 1 acima.

### Passo 5: Instalar Componentes via Linha de Comando
```powershell
# Aceitar licenças
sdkmanager --licenses

# Instalar componentes essenciais
sdkmanager "platform-tools" "platforms;android-33" "build-tools;33.0.0"
```

---

## Opção 3: Usar Expo Go (Mais Simples - Sem SDK)

Se você só quer testar o app rapidamente sem instalar o SDK:

1. Instale o app **Expo Go** no seu celular Android:
   - Google Play Store: https://play.google.com/store/apps/details?id=host.exp.exponent

2. Execute o projeto:
   ```bash
   npm start
   ```

3. Escaneie o QR code com o app Expo Go

**Vantagem**: Não precisa instalar Android SDK
**Desvantagem**: Algumas funcionalidades nativas podem não funcionar

---

## ✅ Verificação Final

Após configurar, feche e reabra o terminal/PowerShell e execute:

```powershell
# Verificar ANDROID_HOME
echo $env:ANDROID_HOME

# Verificar adb
adb version

# Verificar se o Expo encontra o SDK
npx expo-doctor
```

---

## 🔧 Solução de Problemas

### Erro: "adb não é reconhecido"
- Certifique-se de que adicionou `%ANDROID_HOME%\platform-tools` ao PATH
- Feche e reabra o terminal

### Erro: "SDK path not found"
- Verifique se o caminho `C:\Users\bruno.cantacini\AppData\Local\Android\Sdk` existe
- Verifique se a variável ANDROID_HOME está configurada corretamente

### Erro: "No Android devices found"
- Conecte um dispositivo Android via USB e ative "Depuração USB"
- Ou inicie um emulador Android pelo Android Studio

---

## 📚 Recursos Úteis

- Documentação oficial Expo: https://docs.expo.dev/get-started/installation/
- Documentação Android SDK: https://developer.android.com/studio/command-line
- Guia React Native: https://reactnative.dev/docs/environment-setup

