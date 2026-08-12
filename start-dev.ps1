# Script de démarrage Poketrako
# Usage: .\start-dev.ps1

Write-Host "🚀 Démarrage de Poketrako..." -ForegroundColor Cyan

# --- Backend avec PM2 ---
Write-Host "`n📦 Démarrage du backend (PM2)..." -ForegroundColor Yellow

# Libérer le port 5000 si occupé
$portProcess = netstat -ano | findstr ":5000" | Select-Object -First 1
if ($portProcess) {
    $pid5000 = ($portProcess -split '\s+')[-1]
    if ($pid5000 -match '^\d+$') {
        Stop-Process -Id $pid5000 -Force -ErrorAction SilentlyContinue
        Start-Sleep -Seconds 1
    }
}

# Démarrer ou redémarrer le backend
$pm2List = pm2 list 2>&1
if ($pm2List -match "poketrako-backend") {
    pm2 restart poketrako-backend
    Write-Host "✅ Backend redémarré" -ForegroundColor Green
} else {
    Set-Location "$PSScriptRoot\Backend"
    pm2 start server.js --name poketrako-backend
    pm2 save
    Write-Host "✅ Backend démarré" -ForegroundColor Green
}

# --- Frontend avec Vite ---
Write-Host "`n🎨 Démarrage du frontend (Vite)..." -ForegroundColor Yellow
Start-Process powershell -ArgumentList "-NoExit", "-Command", "Set-Location '$PSScriptRoot\frontend'; npm run dev"
Write-Host "✅ Frontend démarré dans une nouvelle fenêtre" -ForegroundColor Green

Write-Host "`n✨ Poketrako est prêt !" -ForegroundColor Cyan
Write-Host "   Frontend : http://localhost:5173" -ForegroundColor White
Write-Host "   Backend  : http://localhost:5000" -ForegroundColor White
Write-Host "`n💡 Commandes utiles :" -ForegroundColor DarkGray
Write-Host "   pm2 list              - Voir l'état du backend" -ForegroundColor DarkGray
Write-Host "   pm2 logs poketrako-backend  - Voir les logs" -ForegroundColor DarkGray
Write-Host "   pm2 stop poketrako-backend  - Arrêter le backend" -ForegroundColor DarkGray
