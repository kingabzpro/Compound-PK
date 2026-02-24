param(
  [switch]$Prod
)

$ErrorActionPreference = "Stop"

function Test-Command {
  param([string]$Name)
  if (-not (Get-Command $Name -ErrorAction SilentlyContinue)) {
    throw "Required command '$Name' is not installed or not on PATH."
  }
}

Test-Command node
Test-Command npm
Test-Command npx

$environment = if ($Prod) { "production" } else { "preview" }

Write-Host "Pulling Vercel project settings for $environment..."
npx vercel pull --yes --environment=$environment

Write-Host "Building with Vercel build pipeline..."
npx vercel build

if ($Prod) {
  Write-Host "Deploying to production..."
  npx vercel deploy --prebuilt --prod
} else {
  Write-Host "Deploying preview..."
  npx vercel deploy --prebuilt
}
