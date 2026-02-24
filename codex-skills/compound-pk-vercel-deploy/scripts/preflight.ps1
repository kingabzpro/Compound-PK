param(
  [switch]$SkipInstall
)

$ErrorActionPreference = "Stop"

function Test-Command {
  param([string]$Name)
  if (-not (Get-Command $Name -ErrorAction SilentlyContinue)) {
    throw "Required command '$Name' is not installed or not on PATH."
  }
}

Write-Host "Running Compound PK preflight checks..."
Test-Command node
Test-Command npm

if (-not $SkipInstall) {
  Write-Host "Installing dependencies..."
  npm install
}

Write-Host "Running type/content checks..."
npm run check

Write-Host "Building project..."
npm run build

Write-Host "Preflight passed."
