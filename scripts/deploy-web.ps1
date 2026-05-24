# Deploy web (Expo) -> Firebase Hosting (sos-localiza.web.app)
# Uso: .\scripts\deploy-web.ps1

$ErrorActionPreference = "Stop"
Set-Location $PSScriptRoot\..

if (Test-Path "public\index.html") {
  Write-Host "ERRO: public\index.html existe (pagina padrao do Firebase init)." -ForegroundColor Red
  Write-Host "Remova: Remove-Item public\index.html" -ForegroundColor Yellow
  exit 1
}

npm run generate-build-info
if (Test-Path dist) { Remove-Item -Recurse -Force dist }
npx expo export --platform web

$html = Get-Content dist\index.html -Raw
if ($html -match "Firebase Hosting Setup Complete") {
  Write-Host "ERRO: dist\index.html ainda e a pagina do Firebase. Apague public\index.html e rode de novo." -ForegroundColor Red
  exit 1
}

Write-Host "OK: index.html do Expo ($( (Get-Item dist\index.html).Length ) bytes)" -ForegroundColor Green

# Fonte Ionicons em caminho fixo + @font-face no HTML (ícones antes do JS hidratar)
$ionicons = Get-ChildItem -Recurse dist -Filter "Ionicons*.ttf" |
  Where-Object { $_.FullName -notlike "*\assets\fonts\*" } |
  Select-Object -First 1
if (-not $ionicons) {
  Write-Host "ERRO: Ionicons.ttf nao encontrado em dist." -ForegroundColor Red
  exit 1
}
$fontDir = Join-Path dist "assets/fonts"
New-Item -ItemType Directory -Force -Path $fontDir | Out-Null
Copy-Item $ionicons.FullName (Join-Path $fontDir "ionicons.ttf") -Force
$fontInject = @"
<link rel="preload" href="/assets/fonts/ionicons.ttf" as="font" type="font/ttf" />
<style id="sos-ionicons-font">@font-face{font-family:ionicons;src:url(/assets/fonts/ionicons.ttf) format('truetype');font-display:swap;}</style>
"@
$html = $html -replace '</head>', "$fontInject`n</head>"
[System.IO.File]::WriteAllText((Join-Path (Get-Location) "dist\index.html"), $html)
Write-Host "OK: @font-face ionicons em /assets/fonts/ionicons.ttf" -ForegroundColor Green

npx firebase-tools deploy --only hosting
Write-Host "Abra em aba anonima: https://sos-localiza.web.app/?v=$(Get-Date -Format 'yyyyMMddHHmmss')" -ForegroundColor Cyan
