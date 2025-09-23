LED Sign Video Toolkit

This folder contains optional helpers to make a 320x128 MP4 for outdoor LED signs.

Contents
- after-effects-template.aepx (instructions to create)
- ae-build.jsx (AE ExtendScript that builds a comp and renders via Adobe Media Encoder queue)
- ffmpeg-commands.ps1 (handy Windows commands)
- build-slideshow.ps1 (turn a folder of logos into a 320x128 MP4)

Note: These are optional helpers, they don't affect your WordPress theme.

Adobe recommended workflow
- After Effects: Composition 320x128, 30 fps, Duration as desired (e.g., 10s). Design big, high contrast, minimal detail. Avoid thin lines or serif fonts.
- Media Encoder export: H.264, Profile Baseline, Level 3.1, 320x128, 30 fps, CBR 1.2–2.0 Mbps, Keyframe distance 30–60, No audio, Pixel format yuv420p (default in AME). Enable “Render at Maximum Depth” off, “Use Maximum Render Quality” optional.
- Premiere Pro alternative: Sequence 320x128, 30 fps. Export with the same H.264 settings as above.

Controller compatibility checklist
- Confirm your sign’s controller brand (Watchfire, Daktronics, Novastar/Colorlight, Linsn, etc.). Some require specific frame rates (25/30/60) or containers (MP4, MOV, AVI) and may dislike B‑frames or high profiles.
- If playback is choppy, re-export with lower bitrate (0.8–1.2 Mbps), Baseline profile, shorter GOP (keyframes every 30), and 30 fps.
- Most signs ignore audio; keep it disabled.

Usage
- After Effects: File → Scripts → Run Script File… → select ae-build.jsx. Edit the text layer, then export via AME.
- FFmpeg: Open PowerShell, run commands in ffmpeg-commands.ps1 to make quick drafts or convert existing videos.
- Slideshow: Use build-slideshow.ps1 to convert a folder of logos into a looping 320x128 MP4.

Slideshow builder (PowerShell)
1) Put all logos in a folder (PNGs/JPGs/WebP). Transparent PNGs work — background will be black.
2) Run:
	cd "c:\Users\eleva\OneDrive\Desktop\Website Child Theme\kadence-child\video-tools"
	.\build-slideshow.ps1 -InputDir "C:\Path\To\Logos" -Output "logos_320x128.mp4" -SecondsPerSlide 2.5 -Fps 30

Controller limits
- You mentioned MP4 with built-in loop and max resolution 1024x256. Our 320x128 videos are well within this.
- If the controller supports higher res and you upgrade later, you can change the scripts to match (e.g., 640x256 or 1024x256) — keep H.264 Baseline for compatibility.
