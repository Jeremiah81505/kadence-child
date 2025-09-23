<#
Animated 320x128 LED slideshow with crossfades, light motion, and stylized text bars.

Usage:
  cd "c:\Users\eleva\OneDrive\Desktop\Website Child Theme\kadence-child\video-tools"
  .\build-slideshow-animated.ps1 `
    -InputDir "C:\Path\To\Logos" `
    -Output "logos_animated_320x128.mp4" `
    -SecondsPerSlide 2.5 `
    -Transition 0.4 `
    -Fps 30

Notes:
 - Requires ffmpeg on PATH.
 - Overlays text from .\text\top.txt, mid.txt, bottom.txt (ASCII-safe recommended).
#>

param(
  [Parameter(Mandatory=$true)] [string] $InputDir,
  [string] $Output = "logos_animated_320x128.mp4",
  [double] $SecondsPerSlide = 2.5,
  [double] $Transition = 0.4,
  [int] $Fps = 30,
  [string] $TopTextFile = ".\text\top.txt",
  [string] $MidTextFile = ".\text\mid.txt",
  [string] $BottomTextFile = ".\text\bottom.txt"
)

if (!(Test-Path $InputDir)) { throw "InputDir not found: $InputDir" }

$files = Get-ChildItem -Path $InputDir -Recurse -File |
  Where-Object { $_.Extension -match '^(\.png|\.jpg|\.jpeg|\.webp)$' } |
  Sort-Object Name
if (($files | Measure-Object).Count -lt 2) {
  Write-Host "Found" (($files | Measure-Object).Count) "images under" $InputDir
  throw "Need at least 2 images for animated crossfades."
}

# Build input arguments (loop images)
$inputArgs = @()
foreach ($f in $files) { $inputArgs += @('-loop','1','-t',("{0:0.###}" -f $SecondsPerSlide),'-i', $f.FullName) }

# Build filter graph
$lines = @()
for ($i=0; $i -lt $files.Count; $i++) {
  $idx = $i
  $lines += "[${idx}:v]scale=320:128:force_original_aspect_ratio=decrease,pad=320:128:(ow-iw)/2:(oh-ih)/2,format=yuv420p,setsar=1,trim=0:d=$SecondsPerSlide,setpts=PTS-STARTPTS[v$idx]";
}

# Chain xfade with alternating transitions for variety
$transitions = @('smoothleft','fade','circleopen','squeezeh','slidedown','smoothup')
$last = "[v0]"
for ($i=1; $i -lt $files.Count; $i++) {
  $tname = $transitions[($i-1) % $transitions.Count]
  $out = "[mix$i]"
  # Use default offset (length of first input - duration)
  $lines += "$last[v$i]xfade=transition=$tname:duration=$Transition$out"
  $last = $out
}

# Stylized top/bottom bars + overlay text on the final chain
$final = "$last,drawbox=x=0:y=0:w=iw:h=24:color=black@0.55:t=fill,drawbox=x=0:y=ih-18:w=iw:h=18:color=black@0.55:t=fill,drawtext=font=Arial:fontsize=18:fontcolor=0xFFD700:textfile='"+
         ($TopTextFile.Replace('\\','/'))+"':x=(w-tw)/2:y=3:borderw=1:shadowx=1:shadowy=1,drawtext=font=Arial:fontsize=12:fontcolor=white:textfile='"+
         ($MidTextFile.Replace('\\','/'))+"':x=(w-tw)/2:y=24:borderw=1:shadowx=1:shadowy=1,drawtext=font=Arial:fontsize=11:fontcolor=white:textfile='"+
         ($BottomTextFile.Replace('\\','/'))+"':x=(w-tw)/2:y=h-15:borderw=1:shadowx=1:shadowy=1[final]"

$filter = ($lines -join "; ") + "; " + $final

# Compose ffmpeg command
$args = @('-y') + $inputArgs + @('-filter_complex', $filter, '-map', '[final]', '-r', "$Fps", '-c:v', 'libx264', '-profile:v', 'baseline', '-level', '3.1', '-pix_fmt', 'yuv420p', '-b:v', '1200k', '-movflags', '+faststart', '-an', $Output)

Write-Host "Running ffmpeg with" $files.Count "inputs..."
& ffmpeg @args
if ($LASTEXITCODE -ne 0) { throw "ffmpeg failed with code $LASTEXITCODE" }
Write-Host "Animated slideshow created: $Output"
