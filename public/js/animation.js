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
var decagon = new Path.RegularPolygon(new Point(view.size.width * 0.08,200), 10, 80);
decagon.fillColor = '#f3f38d';
decagon.selected = true;

var decagon2 = decagon.clone();
decagon2.rotate(-90);

//CLOUDS
var raster = new Raster('clouds');

// Move the raster to the center of the view
raster.position = new Point(Math.ceil(view.size.width * 0.31), 100);
raster.size = (200,200)


var t = 0;
var direction = 1;
var move = setInterval(function() {
    if (raster.position.x === Math.ceil(view.size.width * 0.3)){
        direction = direction * -1;
    } else if (raster.position.x === Math.ceil(view.size.width * 0.7)) {
        direction = direction * -1;
    }
    raster.position = raster.position + new Point(1, Math.sin(t/10)/1.5) * direction;
    t=t+1;
},75); 

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
    decagon.position = (view.size.width * 0.08,120);
    decagon2.position = (view.size.width * 0.08,120);
}
