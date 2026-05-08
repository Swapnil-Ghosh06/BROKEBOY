Write-Host ""
Write-Host "=== MongoDB .env Setup ===" -ForegroundColor Cyan
Write-Host ""
Write-Host "Go to MongoDB Atlas -> Your Cluster -> Connect -> Drivers" -ForegroundColor Yellow
Write-Host "Copy the connection string (looks like mongodb+srv://...)" -ForegroundColor Yellow
Write-Host ""

$uri = Read-Host "Paste your MongoDB connection string here"

if ([string]::IsNullOrWhiteSpace($uri)) {
    Write-Host "No URI entered. Exiting." -ForegroundColor Red
    exit 1
}

if (-not $uri.StartsWith("mongodb")) {
    Write-Host "That doesn't look like a MongoDB URI. It should start with 'mongodb+srv://' or 'mongodb://'" -ForegroundColor Red
    exit 1
}

Write-Host ""
$username = Read-Host "Enter your MongoDB Atlas username (to replace <username> if needed)"
$password = Read-Host "Enter your MongoDB Atlas password (to replace <password> if needed)"

if ($uri -match "<username>") {
    $uri = $uri -replace "<username>", $username
}
if ($uri -match "<password>") {
    $uri = $uri -replace "<password>", $password
}

$envContent = "PORT=5000`nMONGO_URI=$uri"
$envPath = Join-Path $PSScriptRoot "server\.env"

Set-Content -Path $envPath -Value $envContent -Encoding utf8

Write-Host ""
Write-Host "Created server/.env successfully!" -ForegroundColor Green
Write-Host ""
Write-Host "Next step: Make sure your IP is whitelisted in Atlas" -ForegroundColor Yellow
Write-Host "Atlas -> Network Access -> Add IP Address -> Add Current IP" -ForegroundColor Yellow
Write-Host ""
Write-Host "Then restart your server. Mock mode should be gone." -ForegroundColor Green
