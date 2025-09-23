// Advanced After Effects ExtendScript: 320x128 LED sign motion graphic
// Creates a colorful animated background, cycles through logos, and overlays key messaging.
// How to use: After Effects → File → Scripts → Run Script File… (select this file). Then export via Media Encoder

(function(){
    app.beginUndoGroup("LED Sign Advanced 320x128");

    var proj = app.project || app.newProject();

    // ================= User settings =================
    var compW = 320, compH = 128, fps = 30, duration = 30; // seconds
    var logosFolderPath = "C:/Users/eleva/OneDrive - elevatedsurfacesgb.com/New Website/Logo and Photo/Website Logos"; // update if needed
    var headline = "5-Star Rated";
    var warranty = "Lifetime Warranty Available";
    var hours = "Mon–Fri 8–5";
    var phone = "920-784-0602";
    var website = "elevatedsurfacesgb.com"; // verify desired URL

    // Typography
    var primaryFont = "Arial-BoldMT"; // Fall back to Arial Bold
    var secondaryFont = "ArialMT";

    // ================= Create comp =================
    var comp = proj.items.addComp("LED_320x128_ADV", compW, compH, 1.0, duration, fps);

    // ================= Animated background =================
    // Enable motion blur globally for smoother movement
    try { app.executeCommand(app.findMenuCommandId("Enable Motion Blur")); } catch(e) {}

    var bgLayer = comp.layers.addSolid([0/255,0/255,0/255], "BG", compW, compH, 1.0, duration);
    var fractal = bgLayer.Effects.addProperty("ADBE Fractal Noise");
    fractal.property("ADBE Fractal Noise-0001").setValue(5); // Dynamic Twist
    fractal.property("ADBE Fractal Noise-0002").setValue(6); // Turbulent Smooth
    fractal.property("ADBE Fractal Noise-0003").setValue(8); // Contrast
    fractal.property("ADBE Fractal Noise-0004").setValue(-10); // Brightness
    fractal.property("ADBE Fractal Noise-0026").expression = "time*25"; // Evolution (slower, elegant)

    var tint = bgLayer.Effects.addProperty("ADBE 4 Color Gradient");
    // 4CG color points
    tint.property(1).setValue([40, 25]); // point 1
    tint.property(2).setValue([compW-40, 20]);
    tint.property(3).setValue([40, compH-20]);
    tint.property(4).setValue([compW-40, compH-25]);
    // Colors in RGB [0..1]
    tint.property(5).setValue([0.95, 0.20, 0.40]); // pink
    tint.property(6).setValue([0.10, 0.60, 0.95]); // blue
    tint.property(7).setValue([0.98, 0.80, 0.10]); // gold
    tint.property(8).setValue([0.20, 0.95, 0.65]); // teal
    bgLayer.blendingMode = BlendingMode.OVERLAY;

    var glow = bgLayer.Effects.addProperty("ADBE Glow");
    glow.property(2).setValue(45); // Glow Radius
    glow.property(3).setValue(0.45); // Glow Intensity

    // ================= Header/Footer bars for legibility =================
    var topBarH = 34, bottomBarH = 24;
    // Top bar
    var topLayer = comp.layers.addSolid([0.12,0.12,0.12], "Top Bar", compW, topBarH, 1.0, duration);
    topLayer.property("Position").setValue([compW/2, topBarH/2]);
    topLayer.opacity.setValue(90);
    var topRamp = topLayer.Effects.addProperty("ADBE Ramp");
    topRamp.property(1).setValue([0, 0]); // start point
    topRamp.property(2).setValue([compW, topBarH]); // end point
    topRamp.property(3).setValue([0.20,0.20,0.20]); // start color
    topRamp.property(4).setValue([0.05,0.05,0.05]); // end color
    topRamp.property(6).setValue(0.1); // blend with original

    // Bottom bar
    var botLayer = comp.layers.addSolid([0.12,0.12,0.12], "Bottom Bar", compW, bottomBarH, 1.0, duration);
    botLayer.property("Position").setValue([compW/2, compH - bottomBarH/2]);
    botLayer.opacity.setValue(90);
    var botRamp = botLayer.Effects.addProperty("ADBE Ramp");
    botRamp.property(1).setValue([0, 0]);
    botRamp.property(2).setValue([compW, bottomBarH]);
    botRamp.property(3).setValue([0.20,0.20,0.20]);
    botRamp.property(4).setValue([0.05,0.05,0.05]);
    botRamp.property(6).setValue(0.1);

    // ================= Utility: fit layer to safe area =================
    function fitLayerToBox(layer, maxW, maxH) {
        try {
            var src = layer.source;
            var w = src.width, h = src.height;
            if (!w || !h) return;
            var sx = (maxW / w) * 100.0;
            var sy = (maxH / h) * 100.0;
            var s = Math.min(sx, sy);
            layer.property("Scale").setValue([s, s]);
            layer.property("Position").setValue([compW/2, compH/2]);
        } catch(e) {}
    }

    // ================= Text overlays =================
    function addTextLine(txt, y, size, bold, color){
        var t = comp.layers.addText(txt);
        var td = t.property("Source Text").value;
        td.fontSize = size;
        td.font = bold ? primaryFont : secondaryFont;
        td.applyFill = true;
        td.fillColor = color || [1,1,1];
        td.applyStroke = true;
        td.strokeColor = [0,0,0];
        td.strokeWidth = 3;
        td.strokeOverFill = false;
        td.justification = ParagraphJustification.CENTER_JUSTIFY;
        t.property("Source Text").setValue(td);
        t.property("Position").setValue([compW/2, y]);
        // subtle shadow for legibility
        try {
            var ds = t.Effects.addProperty("ADBE Drop Shadow");
            ds.property(1).setValue([0,0,0]); // color
            ds.property(2).setValue(80);      // opacity
            ds.property(3).setValue(90);      // direction
            ds.property(4).setValue(2);       // distance
            ds.property(5).setValue(4);       // softness
        } catch(e) {}
        return t;
    }

    // Headline: stars + text
    var stars = addTextLine("★★★★★", 14, 14, true, [1.0, 0.84, 0.0]);
    stars.opacity.setValueAtTime(0, 0); stars.opacity.setValueAtTime(0.6, 100);
    try {
        var starGlow = stars.Effects.addProperty("ADBE Glow");
        starGlow.property(2).setValue(40);
        starGlow.property(3).setValue(0.8);
    } catch(e) {}
    var head = addTextLine(headline, 28, 16, true, [1,1,1]);
    head.opacity.setValueAtTime(0.2, 0); head.opacity.setValueAtTime(0.8, 100);

    // Footer info ticker-style (static placement for legibility)
    var info = addTextLine(hours + "  |  " + phone + "  |  " + website, compH-12, 11, false, [1,1,1]);
    // ultra subtle wiggle for life without harming legibility
    info.property("Position").expression = "p=value; p+[Math.sin(time*0.6)*0.3, 0]";

    // Warranty badge
    var warr = addTextLine(warranty, compH - bottomBarH - 10, 11, true, [1,1,1]);
    warr.opacity.setValueAtTime(1, 0); warr.opacity.setValueAtTime(2, 100);

    // ================= Import logos and animate =================
    var folder = new Folder(logosFolderPath);
    var logoItems = [];
    if (folder.exists) {
        var files = folder.getFiles(function(f){
            if (!(f instanceof File)) return false;
            var n = f.name.toLowerCase();
            return n.match(/\.(png|jpg|jpeg|webp)$/);
        });
        // Sort by filename for deterministic order
        try { files.sort(function(a,b){ var an=a.name.toLowerCase(), bn=b.name.toLowerCase(); return an<bn?-1:an>bn?1:0; }); } catch(e) {}
        for (var i=0; i<files.length; i++) {
            try {
                var io = new ImportOptions(files[i]);
                var footage = proj.importFile(io);
                logoItems.push(footage);
            } catch(e) {}
        }
    }

    var safeW = 300, safeH = Math.max(64, compH - (topBarH + bottomBarH) - 12); // safe area between bars
    var tPer = 2.4; // seconds per logo
    var t = 1.0; // start time offset
    for (var j=0; j<logoItems.length; j++) {
        var l = comp.layers.add(logoItems[j]);
        // Place logos above background but below overlays
        try { l.moveAfter(bgLayer); } catch(e) {}
        fitLayerToBox(l, safeW, safeH);
        // in/out timing
        l.startTime = t;
        l.inPoint = t;
        l.outPoint = Math.min(duration, t + tPer);
        // slide and fade
        var pos = l.property("Position");
        pos.setValueAtTime(t, [compW + 70, compH/2]);
        pos.setValueAtTime(t + 0.5, [compW/2, compH/2]);
        pos.setValueAtTime(l.outPoint - 0.45, [compW/2, compH/2]);
        pos.setValueAtTime(l.outPoint, [-70, compH/2]);
        var op = l.property("Opacity");
        op.setValueAtTime(t, 0);
        op.setValueAtTime(t + 0.3, 100);
        op.setValueAtTime(l.outPoint - 0.3, 100);
        op.setValueAtTime(l.outPoint, 0);
        // gentle scale overshoot for life
        var sc = l.property("Scale");
        var s = sc.value[0];
        sc.setValueAtTime(t + 0.5, [s*1.05, s*1.05]);
        sc.setValueAtTime(t + 0.9, [s, s]);
        // motion blur
        try { l.motionBlur = true; } catch(e) {}
        t += tPer - 0.2; // slight overlap for smoother flow
    }

    // ================= Queue to AME =================
    var rqItem = proj.renderQueue.items.add(comp);
    try { proj.renderQueue.queueInAME(true); } catch(e) {}

    app.endUndoGroup();
})();
