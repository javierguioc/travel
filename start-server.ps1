# Script para iniciar el servidor HTTP
Write-Host "Iniciando servidor HTTP en puerto 3000..." -ForegroundColor Green
Write-Host "Abre tu navegador en: http://localhost:3000" -ForegroundColor Yellow
Write-Host "Presiona Ctrl+C para detener el servidor" -ForegroundColor Gray
Write-Host ""

# Cambiar al directorio del proyecto
Set-Location $PSScriptRoot

# Iniciar servidor con http-server
npx --yes http-server -p 3000 -c-1
