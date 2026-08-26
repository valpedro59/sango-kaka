New-Item -ItemType Directory -Path "C:\Users\JP-PC08\sango-kaka\frontend\public\images" -Force

$src = "C:\Users\JP-PC08\sango-kaka\frontend\images"
$dst = "C:\Users\JP-PC08\sango-kaka\frontend\public\images"

Get-ChildItem -Path $src -File | ForEach-Object {
    $newName = $_.Name -replace ' ', '-'
    $newName = $newName -replace 'é', 'e'
    $newName = $newName -replace 'à', 'a'
    $newName = $newName -replace "'", ''
    Copy-Item $_.FullName -Destination (Join-Path $dst $newName) -Force
    Write-Host "$($_.Name) -> $newName"
}

Get-ChildItem -Path $dst
