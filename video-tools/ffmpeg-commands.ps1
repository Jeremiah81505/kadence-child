<#
Install FFmpeg (winget) and create MP4s for a 320x128 LED sign.
Run in Windows PowerShell.

Install (one-time):
	winget install --id=Gyan.FFmpeg -e --source winget
#>

# 1) Generate a 10s demo with scrolling text (no audio)
ffmpeg -y -f lavfi -i color=c=black:s=320x128:d=10 `
	-vf "drawtext=font=Arial:text='YOUR MESSAGE HERE':fontcolor=white:fontsize=28:x=w-t*40:y=h/2-14,format=yuv420p" `
	-c:v libx264 -profile:v baseline -level 3.1 -pix_fmt yuv420p -r 30 -b:v 1200k -movflags +faststart -an demo_320x128.mp4

# 2) Convert any source video to 320x128 by center-cropping (keeps content full height)
#    - Scales input to height=128, then crops width=320 from the center
ffmpeg -y -i "input.mp4" `
	-vf "scale=-2:128,crop=320:128,format=yuv420p" `
	-c:v libx264 -profile:v baseline -level 3.1 -pix_fmt yuv420p -r 30 -b:v 1200k -movflags +faststart -an output_320x128_crop.mp4

# 3) Convert with letterbox/pillarbox to preserve full frame without cropping
#    - Scales to fit within 320x128, pads remaining area with black
ffmpeg -y -i "input.mp4" `
	-vf "scale=320:128:force_original_aspect_ratio=decrease,pad=320:128:(ow-iw)/2:(oh-ih)/2,format=yuv420p" `
	-c:v libx264 -profile:v baseline -level 3.1 -pix_fmt yuv420p -r 30 -b:v 1200k -movflags +faststart -an output_320x128_pad.mp4
