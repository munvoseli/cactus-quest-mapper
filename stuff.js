
pixelSize = 1;
canvas.width = canvas.height = 80 * pixelSize;
pixelsLast = [];
function renderAt(xo, yo)
{
    pixelsCurrent = pixelsEmpty.slice();
    for (var x = 0; x < 5; ++x)
    {
	for (var y = 0; y < 5; ++y)
	{
	    var i = (y + yo) * 200 + (x + xo);
	    //if (levelArraySecondary[i]) console.log(x, y, levelArraySecondary[i]);
	    if (levelArray[i])
		imageDraw(levelArray[i], x * 16, y * 16, 1, -1, 0);
	    var name = levelArray[i];
	    var tx = 4, ty = 9;
	    if (name.substring(0, 4) == "gate")
	    {
		switch (name)
		{
		    case "gateSwitch": break;
		    case "gateIndicator":
		    case "gateNormallyClosed":
		    case "gateNormallyOpen": ty = 4; break;
		}
		var data = levelArraySecondary[i];
		textDraw(data, x * 16 + tx, y * 16 + ty);
	    }
	}
    }
    //pixelsLast=[];
    draw();
}
var camx = 0;
var camy = 0;

//var health = 10;
for (var i = 0; i < levelArray.length; ++i)
{
    if (levelArray[i] == "chestTreasure")
    {
	camx = i % 200 - 2;
	camy = Math.floor(i/200 - 2);
	console.log(camx + 2, camy + 2, levelArraySecondary[i]);
	//health += 2;
    }
}
//console.log(health);

renderAt(camx, camy);
document.addEventListener("keydown", function(e) {
    switch (e.keyCode)
    {
	case 37: --camx; break;
	case 38: --camy; break;
	case 39: ++camx; break;
	case 40: ++camy; break;
    }
    switch (e.keyCode)
    {
	case 37:
	case 38:
	case 39:
	case 40:
	renderAt(camx, camy);
	e.preventDefault();
	//console.log(camx, camy);
    }
}, false);
/*imageDraw("gateIndicator", 0, 0, 0, -1, 0);
pixelsLast = [];
pixelSize = 8;
draw();*/

document.body.style.background = "#000";
//setInterval(t, 17);




function renderOnBig(xo, yo, ctx, canvas)
{
    renderAt(xo, yo);
    var pxo = xo * 16;
    var pyo = yo * 16;
    ctx.drawImage(canvas, pxo, pyo);
}

function renderAllOnBig()
{
    var big_canvas = document.getElementById("big-canvas");
    big_canvas.width = big_canvas.height = 200 * 16;
    var ctx = big_canvas.getContext("2d");
    
    var canvas = document.getElementById("canvas");
    for (var x = 0; x < 200; x += 5)
	for (var y = 0; y < 200; y += 5)
	    renderOnBig( x, y, ctx, canvas );
}

document.getElementById("big-canvas").addEventListener("click", function(e) {
    var x = e.clientX + window.scrollX - e.target.offsetTop
    var y = e.clientY + window.scrollY - e.target.offsetLeft;
    x = Math.floor(x / 16);
    y = Math.floor(y / 16);
    //console.log(e);
    console.log(x, y);
    var i = 200 * y + x;
    console.log(levelArray[i]);
    console.log(levelArraySecondary[i]);
    switch (levelArray[i])
    {
	case "chestTreasure":
	console.log(treasureInfoSet[parseInt(levelArraySecondary[i])]);
	break;
	case "tokenCheat":
	console.log(cheatsInfoSet[parseInt(levelArraySecondary[i]) >> 1]);
    }
}, false);

renderAllOnBig();
