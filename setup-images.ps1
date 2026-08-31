# Copie les images depuis frontend/images/ vers backend/images/
$root = Split-Path -Parent $MyInvocation.MyCommand.Path
$src = Join-Path $root "frontend\images"
$dst = Join-Path $root "backend\images"

if (-not (Test-Path $src)) {
    Write-Host "ERREUR : $src introuvable"
    exit 1
}

if (-not (Test-Path $dst)) {
    New-Item -ItemType Directory -Path $dst -Force | Out-Null
    Write-Host "Dossier cree : $dst"
}

Get-ChildItem -Path $src -File | ForEach-Object {
    $dest = Join-Path $dst $_.Name
    Copy-Item $_.FullName -Destination $dest -Force
    Write-Host "Copie : $($_.Name)"
}

Write-Host "`nTermine ! Images dans backend/images/"
