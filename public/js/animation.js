var width, height, center;
var points = 20;
var smooth = true;
var path = new Path();
var mousePos = view.center / 2;
var pathHeight = mousePos.y/10;
path.fillColor = 'darkblue';
initializePath();

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

var group = []

var decagon = new Path.RegularPolygon(new Point(120,120), 10, 80);
decagon.fillColor = '#f3f38d';
decagon.selected = true;

var decagon2 = decagon.clone();
decagon2.rotate(-90);




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
    decagon.rotate(0.3);
    decagon2.rotate(-0.3);
}

// Reposition the path whenever the window is resized:
function onResize(event) {
    initializePath(); 
}
