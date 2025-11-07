# Script para configurar Android SDK no Windows
# Execute como Administrador

Write-Host "🔧 Configurando Android SDK..." -ForegroundColor Cyan

# Caminho padrão do Android SDK
$sdkPath = "C:\Users\bruno.cantacini\AppData\Local\Android\Sdk"

# Verificar se o SDK existe
if (Test-Path $sdkPath) {
    Write-Host "✅ SDK encontrado em: $sdkPath" -ForegroundColor Green
} else {
    Write-Host "⚠️  SDK não encontrado no caminho padrão!" -ForegroundColor Yellow
    Write-Host "Por favor, informe o caminho do Android SDK:" -ForegroundColor Yellow
    $customPath = Read-Host "Caminho do SDK"
    if ($customPath -and (Test-Path $customPath)) {
        $sdkPath = $customPath
        Write-Host "✅ Usando SDK em: $sdkPath" -ForegroundColor Green
    } else {
        Write-Host "❌ Caminho inválido! Instale o Android SDK primeiro." -ForegroundColor Red
        Write-Host "Consulte o arquivo ANDROID_SDK_SETUP.md para instruções." -ForegroundColor Yellow
        exit 1
    }
}

# Verificar se está executando como Administrador
$isAdmin = ([Security.Principal.WindowsPrincipal] [Security.Principal.WindowsIdentity]::GetCurrent()).IsInRole([Security.Principal.WindowsBuiltInRole]::Administrator)

if (-not $isAdmin) {
    Write-Host "❌ Este script precisa ser executado como Administrador!" -ForegroundColor Red
    Write-Host "Clique com botão direito no PowerShell e selecione 'Executar como Administrador'" -ForegroundColor Yellow
    exit 1
}

# Configurar ANDROID_HOME
Write-Host "`n📝 Configurando variável ANDROID_HOME..." -ForegroundColor Cyan
[System.Environment]::SetEnvironmentVariable('ANDROID_HOME', $sdkPath, 'Machine')
Write-Host "✅ ANDROID_HOME configurado: $sdkPath" -ForegroundColor Green

# Adicionar ao PATH
Write-Host "`n📝 Adicionando ao PATH..." -ForegroundColor Cyan
$currentPath = [System.Environment]::GetEnvironmentVariable('Path', 'Machine')

$pathsToAdd = @(
    "$sdkPath\platform-tools",
    "$sdkPath\tools",
    "$sdkPath\tools\bin"
)

$pathsAdded = $false
foreach ($path in $pathsToAdd) {
    if ($currentPath -notlike "*$path*") {
        $currentPath += ";$path"
        $pathsAdded = $true
        Write-Host "✅ Adicionado ao PATH: $path" -ForegroundColor Green
    } else {
        Write-Host "ℹ️  Já existe no PATH: $path" -ForegroundColor Gray
    }
}

if ($pathsAdded) {
    [System.Environment]::SetEnvironmentVariable('Path', $currentPath, 'Machine')
    Write-Host "✅ PATH atualizado!" -ForegroundColor Green
} else {
    Write-Host "ℹ️  Todos os caminhos já estavam no PATH" -ForegroundColor Gray
}

# Verificar instalação
Write-Host "`n🔍 Verificando instalação..." -ForegroundColor Cyan

# Verificar adb
$adbPath = "$sdkPath\platform-tools\adb.exe"
if (Test-Path $adbPath) {
    Write-Host "✅ ADB encontrado" -ForegroundColor Green
} else {
    Write-Host "⚠️  ADB não encontrado. Instale o Android SDK Platform-Tools" -ForegroundColor Yellow
}

# Verificar se as variáveis foram configuradas
$envAndroidHome = [System.Environment]::GetEnvironmentVariable('ANDROID_HOME', 'Machine')
if ($envAndroidHome) {
    Write-Host "✅ Variável ANDROID_HOME configurada: $envAndroidHome" -ForegroundColor Green
} else {
    Write-Host "❌ Erro ao configurar ANDROID_HOME" -ForegroundColor Red
}

Write-Host "`n✨ Configuração concluída!" -ForegroundColor Green
Write-Host "`n⚠️  IMPORTANTE: Feche e reabra o terminal para que as mudanças tenham efeito." -ForegroundColor Yellow
Write-Host "`nPara verificar, execute:" -ForegroundColor Cyan
Write-Host "  echo `$env:ANDROID_HOME" -ForegroundColor White
Write-Host "  adb version" -ForegroundColor White

