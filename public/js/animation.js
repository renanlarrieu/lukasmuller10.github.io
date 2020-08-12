var width, height, center;
var points = 20;
var smooth = true;
var path = new Path();
var mousePos = view.center / 2;
var pathHeight = mousePos.y/10;
path.fillColor = 'darkblue';
var group1 = new Group();
var group2 = new Group();
var cloudsGroup = new Group();

initializePath();
initializeClouds();
initializeSun();

//WAVES
function initializePath() {
    center = view.center;
    width = view.size.width;
    height = view.size.height/1.05;
    path.segments = [];
    path.add(view.bounds.bottomLeft);
    for (var i = 1; i < points; i++) {
        var point = new Point(width / points * i, center.y);
        path.add(point);
    }
    path.add(view.bounds.bottomRight);
}

function onMouseMove(event) {
    mousePos = event.point;
}

function onMouseDown(event) {
    smooth = !smooth;
    if (!smooth) {
        // If smooth has been turned off, we need to reset
        // the handles of the path:
        for (var i = 0, l = path.segments.length; i < l; i++) {
            var segment = path.segments[i];
            segment.handleIn = segment.handleOut = null;
        }
    }
}

// SUN
function initializeSun() {
    group1.removeChildren();
    group2.removeChildren();

    var size = view.size.width;
    var factor;

    if(size<500){
        factor = 0.015;
    } else if(size>=500 && size<900 ){
        factor = 0.04;
    } else {
        factor = 0.08;
    }

    var decagon = new Path.RegularPolygon(new Point(view.size.width * factor, view.size.height * factor * 1.9), 10, 80);
    decagon.fillColor = '#f3f38d';
    decagon.selected = true;
    group1.addChild(decagon);

    var decagon2 = new Path.RegularPolygon(new Point(view.size.width * factor, view.size.height * factor * 1.9), 10, 80);
    decagon2.fillColor = '#f3f38d';
    decagon2.selected = true;
    decagon2.rotate(-90);
    group2.addChild(decagon2);

}

function initializeClouds() {
    cloudsGroup.removeChildren();
    //CLOUDS
    var raster = new Raster('clouds');

    cloudsGroup.addChild(raster);
    // Move the raster to the center of the view

    var size = view.size.width;

    if(size<500){
        raster.position = new Point(Math.ceil(view.size.width * 0.41), view.size.height * 0.09);
        raster.size = (view.size.width *0.3,view.size.width *0.3);
    } else if(size>=500 && size<900 ){
        raster.position = new Point(Math.ceil(view.size.width * 0.41), view.size.height * 0.12);
        raster.size = (view.size.width *0.2,view.size.width *0.2)
    } else {
        raster.position = new Point(Math.ceil(view.size.width * 0.41), view.size.height * 0.12);
        raster.size = (view.size.width *0.1,view.size.width *0.1)
    }

    var t = 0;
    var direction = 1;
    var move = setInterval(function() {
        if (raster.position.x === Math.ceil(view.size.width * 0.4)){
            direction = direction * -1;
        } else if (raster.position.x === Math.ceil(view.size.width * 0.7)) {
            direction = direction * -1;
        }
        raster.position = raster.position + new Point(1, Math.sin(t/10)/1.5) * direction;
        t=t+1;
    },75);
}


function onFrame(event) {
    pathHeight += (center.y - mousePos.y - pathHeight) / 100;
    for (var i = 1; i < points; i++) {
        var sinSeed = event.count + (i + i % 10) * 100;
        var sinHeight = Math.sin(sinSeed / 200) * pathHeight * 0.3;
        var yPos = Math.sin(sinSeed / 100) * sinHeight + height;
        path.segments[i].point.y = yPos;
    }
    if (smooth){
        path.smooth({ type: 'continuous' });
    }
    group1.rotate(0.3);
    group2.rotate(-0.3)
}

// Reposition the path whenever the window is resized:
function onResize(event) {
    initializePath();
    initializeClouds();
    initializeSun();
}
