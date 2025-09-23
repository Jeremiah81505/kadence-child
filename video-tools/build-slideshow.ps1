<#
Build a 320x128 looping MP4 slideshow from logo images.

Usage (PowerShell):
  cd "c:\Users\eleva\OneDrive\Desktop\Website Child Theme\kadence-child\video-tools"
  .\build-slideshow.ps1 -InputDir "C:\Path\To\Logos" -Output "slideshow_320x128.mp4" -SecondsPerSlide 2.5 -Fps 30

Requires: ffmpeg in PATH (install with winget).
#>

param(
  [Parameter(Mandatory=$true)] [string] $InputDir,
  [string] $Output = "slideshow_320x128.mp4",
  [double] $SecondsPerSlide = 2.5,
  [int] $Fps = 30
)

if (!(Test-Path $InputDir)) { throw "InputDir not found: $InputDir" }

$files = Get-ChildItem -Path $InputDir -Include *.png,*.jpg,*.jpeg,*.webp -File -Recurse | Sort-Object Name
if ($files.Count -eq 0) { throw "No images found in $InputDir" }

$tmp = Join-Path $env:TEMP ("ledslides_" + [guid]::NewGuid().ToString())
New-Item -ItemType Directory -Force -Path $tmp | Out-Null

# Preprocess each image: fit within 320x128, pad to full canvas, convert to yuv420p frames at target fps
$i = 0
foreach ($f in $files) {
  $i++
  $out = Join-Path $tmp ("slide_" + $i.ToString("0000") + ".mp4")
  # Scale to safe height, preserve aspect, pad to exactly 320x128
  & ffmpeg -y -r $Fps -loop 1 -t $SecondsPerSlide -i "$($f.FullName)" `
    -vf "scale=320:128:force_original_aspect_ratio=decrease,pad=320:128:(ow-iw)/2:(oh-ih)/2,format=yuv420p" `
    -c:v libx264 -profile:v baseline -level 3.1 -pix_fmt yuv420p -r $Fps -b:v 1000k -movflags +faststart -an "$out" | Out-Null
}

# Create concat list
$listPath = Join-Path $tmp "list.txt"
Remove-Item $listPath -ErrorAction Ignore
for ($j = 1; $j -le $i; $j++) {
  Add-Content -Path $listPath -Value ("file '" + (Join-Path $tmp ("slide_" + $j.ToString("0000") + ".mp4")) + "'")
}

# Concatenate slides
& ffmpeg -y -f concat -safe 0 -i "$listPath" `
  -c copy "$Output" | Out-Null

Write-Host "Slideshow created: $Output"

# Cleanup temp files
Remove-Item $tmp -Recurse -Force
