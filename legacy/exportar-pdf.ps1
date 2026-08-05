# Exporta luigi-pizzas.html a PDF (Las-Luigi-Pizzas.pdf)
# Uso:  click derecho -> "Ejecutar con PowerShell"   o bien:  .\exportar-pdf.ps1

$dir    = $PSScriptRoot
$html   = Join-Path $dir "luigi-pizzas.html"
$tmp    = Join-Path $dir "_print-temp.html"
$pdf    = Join-Path $dir "Las-Luigi-Pizzas.pdf"

$chrome = @(
  "$env:ProgramFiles\Google\Chrome\Application\chrome.exe",
  "${env:ProgramFiles(x86)}\Google\Chrome\Application\chrome.exe",
  "$env:LOCALAPPDATA\Google\Chrome\Application\chrome.exe",
  "$env:ProgramFiles\Microsoft\Edge\Application\msedge.exe"
) | Where-Object { Test-Path $_ } | Select-Object -First 1

if (-not $chrome) { Write-Host "No encontre Chrome ni Edge." -ForegroundColor Red; exit 1 }

# Copia temporal sin lazy-loading: si no, los mapas no alcanzan a cargar al imprimir.
(Get-Content $html -Raw -Encoding UTF8) -replace ' loading="lazy"','' |
  Set-Content $tmp -Encoding UTF8

$uri = ([System.Uri]$tmp).AbsoluteUri

& $chrome --headless=new --disable-gpu --no-sandbox `
  --run-all-compositor-stages-before-draw `
  --virtual-time-budget=60000 `
  --allow-file-access-from-files --no-pdf-header-footer `
  --print-to-pdf="$pdf" $uri | Out-Null

Remove-Item $tmp -ErrorAction SilentlyContinue

if (Test-Path $pdf) {
  $mb = [math]::Round((Get-Item $pdf).Length / 1MB, 2)
  Write-Host "Listo: Las-Luigi-Pizzas.pdf ($mb MB)" -ForegroundColor Green
} else {
  Write-Host "No se pudo generar el PDF." -ForegroundColor Red
}
