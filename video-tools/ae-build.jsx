// After Effects ExtendScript to create a 320x128 comp and queue to AME
(function(){
    var proj = app.project || app.newProject();
    app.beginUndoGroup("Create 320x128 LED Comp");

    // Create comp
    var compName = "LED_320x128";
    var compW = 320;
    var compH = 128;
    var fps = 30;
    var duration = 10; // seconds
    var comp = proj.items.addComp(compName, compW, compH, 1.0, duration, fps);

    // Background solid
    var bg = proj.items.addSolid([0/255, 0/255, 0/255], "Background", compW, compH, 1.0, duration);
    comp.layers.add(bg);

    // Text layer
    var textLayer = comp.layers.addText("Your Message Here");
    var td = textLayer.property("Source Text").value;
    td.fontSize = 40;
    td.fillColor = [1,1,1];
    td.justification = ParagraphJustification.CENTER_JUSTIFY;
    textLayer.property("Source Text").setValue(td);
    textLayer.position.setValue([compW/2, compH/2]);

    // Simple scale pulse animation
    var scale = textLayer.property("Scale");
    scale.setValueAtTime(0, [95,95]);
    scale.setValueAtTime(duration/2, [105,105]);
    scale.setValueAtTime(duration, [95,95]);

    // Add to Render Queue (optional if you use AME export)
    var rqItem = proj.renderQueue.items.add(comp);
    rqItem.outputModule(1).file = new File(Folder.myDocuments.fsName + "/LED_320x128.mov");

    app.endUndoGroup();
})();