param([string]$Out = "screenshots/review/lh", [int]$Runs = 2)
# Lighthouse mobile (performance only) against the local production server; prints a one-line summary per run.
$env:CHROME_PATH = "C:\Users\imzee\AppData\Local\ms-playwright\chromium-1243\chrome-win64\chrome.exe"
New-Item -ItemType Directory -Force $Out | Out-Null
foreach ($i in 1..$Runs) {
  $json = "$Out/lh-mobile-$i.json"
  npx -y lighthouse@12 http://localhost:5180 --form-factor=mobile --only-categories=performance --chrome-flags="--headless=new" --output=json --output-path=$json --quiet 2>$null
  node scripts/lh-summary.cjs $json $i
}
