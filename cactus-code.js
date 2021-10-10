var levelArray = [];
var levelArraySecondary = [];
var imageArrayList = [];
var mapScreenTeleportsSet = [];
var cheatsStateList = [0];

var treasureInfoSet = [];
var cheatsInfoSet = [];
var cellNameList = [];

var levelWidth = 200;
var levelHeight = 200;


// pixelsEmpty stores 80 by 80 pixels.
var pixelsEmpty = [];
var pixelsEnemyEmpty = [];
var pixelsCurrent = [];
var pixelsLast = [];
var pixelsEnemy = [];

function draw()
{
    var canvas = document.getElementById("canvas");
    if (canvas.getContext)
    {
	var ctx = canvas.getContext("2d");
	// Draw all pixels in pixelsCurrent.
	pixelsDisplayed = pixelsEmpty.slice();
	var indexRow = 0;
	while (indexRow < 80)
	{
	    var indexColumn = 0;
	    while (indexColumn < 80)
	    {
		var number = pixelsCurrent[indexColumn + indexRow * 80];
		var widthTemp = 1;
		if (number != pixelsLast[indexColumn + indexRow * 80] && pixelsDisplayed[indexColumn + indexRow * 80] != 1)
		{
		    while (pixelsDisplayed[indexColumn + widthTemp + indexRow * 80] == 124 && number == pixelsCurrent[indexColumn + widthTemp + indexRow * 80] && indexColumn + widthTemp < 80)
		    {
			widthTemp += 1;
		    }
		    var heightTemp = 1;
		    var rowIsValid = 1;
		    while (rowIsValid == 1 && heightTemp + indexRow < 81)
		    {
			var indexTemp = indexColumn;
			while (indexTemp < indexColumn + widthTemp && rowIsValid == 1)
			{
			    if (pixelsCurrent[indexTemp + (indexRow + heightTemp) * 80] != number)
			    {
				rowIsValid = 0;
			    }
			    indexTemp += 1;
			}
			if (rowIsValid == 1)
			{
			    indexTemp = indexColumn;
			    while (indexTemp < indexColumn + widthTemp)
			    {
				pixelsDisplayed[indexTemp + (indexRow + heightTemp) * 80] = 1;
				indexTemp += 1;
			    }
			    heightTemp += 1;
			}
		    }
		    if (cheatsStateList[0] == 0)
		    {
			var color = D2C(number);
		    } else {
			var color = D2C(Math.round(Math.random() * 124));
		    }
		    ctx.fillStyle = "rgb(" + color[0] + "," + color[1] + "," + color[2] + ")";
		    if (cheatsStateList[0] == 0)
		    {
			ctx.fillRect (indexColumn * pixelSize, indexRow * pixelSize, widthTemp * pixelSize, heightTemp * pixelSize);
		    } else {
			ctx.fillRect (indexColumn * pixelSize + Math.round(5 - Math.random() * 10), indexRow * pixelSize + Math.round(5 - Math.random() * pixelSize), widthTemp * pixelSize - Math.round(2 - Math.random() * 4), heightTemp * pixelSize - Math.round(2 - Math.random() * 4));
		    }
		}
		indexColumn += widthTemp;
	    }
	    indexRow += 1;
	}
	pixelsLast = pixelsCurrent.slice();
    } else {
	document.getElementById("canvasErrorMessage").style.display = "block";
    }
}

var indexColumn = 0;
while (indexColumn < 80)
{
    var indexRow = 0;
    while (indexRow < 80)
    {
	pixelsEmpty[indexColumn + indexRow * 80] = 124;
	pixelsEnemyEmpty[indexColumn + indexRow * 80] = -1;
	indexRow += 1;
    }
    indexColumn += 1;
}
pixelsCurrent = pixelsEmpty.slice();
pixelsLast = pixelsCurrent.slice();
pixelsEnemy = pixelsEnemyEmpty.slice();

// Converts a decimal number (stored in a pixel) into a color array.
function D2C(number)
{
    var output = [];
    output[0] = number - number % 25;
    number -= output[0];
    output[0] *= 4;
    output[1] = number - number % 5;
    number -= output[1];
    output[1] *= 16;
    output[2] = number;
    output[2] *= 64;
    return output;
}

// Turns on an individual pixel.
function pixelChange(arrayTemp, posX, posY, number)
{
    if (number != -1 && posX > -1 && posX < 80 && posY > -1 && posY < 80)
    {
	arrayTemp[posX + posY * 80] = number;
    }
    return arrayTemp;
}

imageCharSet = "0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ";





// Sets the value of levelArray based on
// a code given. Note: levelArraySecondary
// stores special information for certain
// cells, like dialogue.
function levelArrayGetFromCode(codeTemp)
{
    var indexTemp = codeTemp.indexOf("|");
    if (indexTemp == -1)
    {
	indexTemp = codeTemp.length;
    }
    codeTemp = textDecompress(codeTemp.substring(0,indexTemp)) + codeTemp.substring(indexTemp, codeTemp.length);
    levelArray = [];
    levelArraySecondary = [];
    var indexRow = 0;
    var indexTemp = 0;
    while (indexRow < levelHeight)
    {
	var indexColumn = 0;
	while (indexColumn < levelWidth)
	{
	    var cellNameTemp = cellNameList[T2DP(codeTemp.substring(indexTemp, indexTemp + 2))];
	    if (cellNameTemp == "teleport")
	    {
		mapScreenTeleportsSet[mapScreenTeleportsSet.length] = [indexColumn, indexRow];
	    }
	    levelArray[indexColumn + indexRow * levelWidth] = cellNameTemp;
	    levelArraySecondary[indexColumn + indexRow * levelWidth] = "";
	    indexTemp += 2;
	    indexColumn += 1;
	}
	indexRow += 1;
    }
    var indexStart = indexTemp + 1;
    var separatorMode = 0;
    while (indexTemp < codeTemp.length)
    {
	if (codeTemp.substring(indexTemp, indexTemp + 1) == "~")
	{
	    if (separatorMode == 0)
	    {
		var posXCell = parseInt(codeTemp.substring(indexStart, indexTemp));
	    }
	    if (separatorMode == 1)
	    {
		var posYCell = parseInt(codeTemp.substring(indexStart, indexTemp));
	    }
	    if (separatorMode > 1)
	    {
		levelArraySecondary[posXCell + posYCell * levelWidth] = codeTemp.substring(indexStart, indexTemp);
		separatorMode = -1;
	    }
	    separatorMode += 1;
	    indexStart = indexTemp + 1;
	}
	indexTemp += 1;
    }
}

// Converts a color number into a pair of characters.
function D2T(number)
{
    if (number == -1)
    {
	number = 125;
    }
    var indexTemp = number % 62;
    var output = imageCharSet.substring(indexTemp, indexTemp + 1);
    number -= indexTemp;
    number /= 62;
    output = imageCharSet.substring(number, number + 1) + output;
    return output;
}

// Converts a pair of characters back into a color number.
function T2D(text)
{
    var output = imageCharSet.indexOf(text.substring(0,1)) * 62 + imageCharSet.indexOf(text.substring(1,2))
    if (output == 125)
    {
	output = -1;
    }
    return output;
}

// Converts a pair of characters into a number.
// Does not yield a negative number.
function T2DP(text)
{
    return imageCharSet.indexOf(text.substring(0,1)) * 62 + imageCharSet.indexOf(text.substring(1,2));
}

// Compresses text by finding repeated
// pairs of letters and crunching them
// together.
function textCompress(textTemp)
{
    var indexTemp = 0;
    var lengthTemp = textTemp.length;
    var outputTemp = "";
    var modeTemp = 1;
    var charTemp = textTemp.substring(indexTemp, indexTemp + 2);
    while (indexTemp < lengthTemp)
    {
	if (modeTemp == 1)
	{
	    var countTemp = 1;
	    var repeatHasEnded = 0;
	    while (countTemp < 5000 && repeatHasEnded == 0)
	    {
		indexTemp += 2;
		if (indexTemp > lengthTemp - 1)
		{
		    repeatHasEnded = 1;
		} else {
		    if (charTemp != textTemp.substring(indexTemp, indexTemp + 2))
		    {
			repeatHasEnded = 1;
		    } else {
			countTemp += 1;
		    }
		}
	    }
	    outputTemp = outputTemp + charTemp + D2T(countTemp);
	} else {
	    outputTemp = outputTemp + charTemp;
	    indexTemp += 2;
	}
	if (indexTemp < lengthTemp)
	{
	    charTemp = textTemp.substring(indexTemp, indexTemp + 2);
	    var countTemp = 1;
	    var repeatHasEnded = 0;
	    while (countTemp < 4 && repeatHasEnded == 0)
	    {
		if (indexTemp + countTemp * 2 > lengthTemp - 1)
		{
		    repeatHasEnded = 1;
		} else {
		    if (charTemp != textTemp.substring(indexTemp + countTemp * 2, indexTemp + countTemp * 2 + 2))
		    {
			repeatHasEnded = 1;
		    }
		    countTemp += 1;
		}
	    }
	    if (repeatHasEnded == 0)
	    {
		if (modeTemp == 0)
		{
		    outputTemp = outputTemp + ">";
		    modeTemp = 1;
		}
	    } else {
		if (modeTemp == 1)
		{
		    outputTemp = outputTemp + "<";
		    modeTemp = 0;
		}
	    }
	}
    }
    return outputTemp;
}

// Undoes the effect of textCompress().
function textDecompress(textTemp)
{
    var outputTemp = "";
    var modeTemp = 1;
    var indexTemp = 0;
    while (indexTemp < textTemp.length)
    {
	var charTemp = textTemp.substring(indexTemp, indexTemp + 2);
	var charOpenIsPresent = (charTemp.indexOf("<") == 0);
	var charCloseIsPresent = (charTemp.indexOf(">") == 0);
	if (charCloseIsPresent + charOpenIsPresent != 0)
	{
	    if (charOpenIsPresent == 1)
	    {
		modeTemp = 0;
	    } else {
		modeTemp = 1;
	    }
	    indexTemp += 1;
	} else {
	    if (modeTemp == 0)
	    {
		outputTemp = outputTemp + charTemp;
		indexTemp += 2;
	    } else {
		var charTemp2 = textTemp.substring(indexTemp + 2, indexTemp + 4);
		var countTemp = T2DP(charTemp2)
		while (countTemp > 0)
		{
		    outputTemp = outputTemp + charTemp;
		    countTemp -= 1;
		}
		indexTemp += 4;
	    }
	}
    }
    return outputTemp;
}

// Returns an image array based on the
// image code given. Also saves its width
// and height.
function imageArrayGetFromCode(code, width, height)
{
    var outputTemp = [];
    // Note: the width and height are stored
    // in the indexes -2 and -1 respectively.
    outputTemp[-2] = width;
    outputTemp[-1] = height;
    var indexTemp = 0;
    var indexRow = 0;
    while (indexTemp < code.length)
    {
	outputTemp[indexTemp / 2] = T2D(code.substring(indexTemp, indexTemp + 2));
	indexTemp += 2;
    }
    return outputTemp;
}

// Draws an image on screen based on an
// image array stored in the imageArrayList
// variable. Can do some other things related
// to enemies.
function imageDraw(name, posX, posY, flipX, pixelEnemy, enemyCheck)
{
    if (name == undefined | imageArrayList[name] == undefined)
    {
	name = "char0";
    }
    if (enemyCheck == 1)
    {
	var outputArray = [0,0,0];
    }
    var widthTemp = imageArrayList[name][-2];
    var heightTemp = imageArrayList[name][-1];
    var indexRow = 0;
    var indexTemp = 0;
    while (indexRow < heightTemp)
    {
	var indexColumn = 0;
	while (indexColumn < widthTemp)
	{
	    if (flipX == 1)
	    {
		var posXTemp = posX + indexColumn;
	    } else {
		var posXTemp = posX + widthTemp - 1 - indexColumn;
	    }
	    var number = imageArrayList[name][indexTemp];
	    pixelsCurrent = pixelChange(pixelsCurrent, posXTemp, posY + indexRow, number);
	    if (pixelEnemy != -1 && number != -1)
	    {
		pixelsEnemy = pixelChange(pixelsEnemy, posXTemp, posY + indexRow, pixelEnemy);
	    }
	    if (enemyCheck == 1 && number != -1 && posXTemp > -1 && posXTemp < 80 && posY + indexRow > -1 && posY + indexRow < 80)
	    {
		var numberTemp = pixelsEnemy[posXTemp + (posY + indexRow) * 80];
		if (numberTemp != -1)
		{
		    outputArray[0] = numberTemp;
		    outputArray[1] += ((posX + widthTemp / 2) - posXTemp) * 3;
		    outputArray[2] += (heightTemp / 2 - indexRow) * 3;
		}
	    }
	    indexColumn += 1;
	    indexTemp += 1;
	}
	indexRow += 1;
    }
    if (enemyCheck == 1)
    {
	return outputArray;
    }
}


// Draws text on the screen.
function textDraw(text, posX, posY)
{
    var indexText = 0
    var posXChar = posX;
    while (indexText < text.length)
    {
	var charTemp = text.substring(indexText, indexText + 1);
	imageDraw("char" + charTemp, posXChar, posY, 1, -1, 0);
	posXChar += imageArrayList["char" + charTemp][-2] - 1;
	indexText += 1;
    }
}


// Adds an image array to the imageArrayList
// variable.
function imageArrayListAdd(name, width, height, code)
{
    imageArrayList[name] = imageArrayGetFromCode(textDecompress(code), width, height);
}



cellNameList = ["", "blockRandom", "zapBlock", "zapBox", "zapDish", "zapCannon", "zapTorpedo", "zapSpring", "platformOneWay", "signGeneric", "healthOrbIncrease", "pebbleRandom", "cactusSage", "toastRunner", "shredderFly", "logPile", "grillCan", "floatSaw", "balloonShield", "balloonCannon", "balloonWreckingBall", "gateIndicator", "gateNormallyOpen", "gateNormallyClosed", "gateSwitch", "flagCheckpoint", "blockSand", "blockSandEdgeTop", "blockSandEdgeBottom", "blockSandEdgeRight", "blockSandEdgeLeft", "blockSandRocks", "blockSandRocksSmall", "mushroomPurple", "blockSandBetween", "blockSandLight", "blockSandLightEdgeTop", "blockSandLightCornerTopLeft", "blockSandLightCornerTopRight", "cabinetRandom", "bedRandom", "noobInstruction1", "noobInstruction2", "pileRock", "pileRockSmall", "pillarVertical", "roofRedLeft", "roofRedCentre", "roofRedRight", "cactusCivilian", "blockLogHorizontalCentre", "blockLogHorizontalRight", "blockLogHorizontalLeft", "cactusGuard", "crateRandom", "blockSandGrassCentre", "blockSandGrassLeft", "blockSandGrassRight", "grassTall", "vineCentre", "vineTop", "blockLogVerticalCentre", "blockLogVerticalTop", "blockLogVerticalPlatformCentre", "blockLogVerticalPlatformRight", "blockLogVerticalPlatformLeft", "blockChair", "blockChairTop", "blockChairBottom", "blockChairLeft", "blockChairRight", "blockChairTopLeft", "blockChairTopRight", "blockChairBottomLeft", "blockChairBottomRight", "rotarySaw", "blockMetalRustyLeft", "blockMetalRustyCentre", "blockMetalRustyRight", "blockLogLeft", "blockLogCentre", "blockLogRight", "blockWarning", "blockGranite", "blockGraniteEdgeTop", "blockGraniteEdgeBottom", "blockGraniteBetweenLeft", "blockGraniteBetweenRight", "blockSandGemsPurpleSmall", "blockSandGemsPurple", "blockSandWallMetalRight", "blockSandWallMetalLeft", "blockGraniteWallMetalRight", "blockGraniteWallMetalLeft", "blockGraniteGemsBlue", "blockGraniteGemsBlueSmall", "blockWallMetal", "mysterioClimber", "stalactiteLoose", "mysterioPuddle1", "mysterioPuddle2", "blockMetalHorizontalLeft", "blockMetalHorizontalCentre", "blockMetalHorizontalRight", "toasterObstacle", "heatingElement", "blockToaster", "blockToasterTop", "blockToasterLeft", "blockToasterRight", "blockToasterBottom", "blockToasterTopLeft", "blockToasterTopRight", "blockToasterBottomLeft", "blockToasterBottomRight", "blockTechnologic1", "blockTechnologic2", "blockTechnologic3", "blockTechnologic4", "blockOven1", "blockOven2", "blockOven3", "blockOven4", "gateBoss", "gateBossSwitch", "gateBossIndicator", "bossToaster", "toasterRogue", "battery", "spikeDeadly", "blockBeamLeft", "blockBeamCentre", "blockBeamRight", "blockBeamPlatform1", "blockBeamPlatform2", "blockLoopLeft", "blockLoopCentre", "blockLoopRight", "blockBeam", "beamPillarVertical", "propellerRandom", "propellerTop", "portal", "blockIgneous", "blockIgneousEdgeTop", "blockIgneousEdgeLeft", "blockIgneousEdgeRight", "blockIgneousEdgeBottom", "blockIgneousCornerTopLeft", "blockIgneousCornerTopRight", "blockIgneousCornerBottomLeft", "blockIgneousCornerBottomRight", "lavaPool", "lavaPoolTop", "bombJet", "lavaPoolCorner", "bossMagma", "flame", "blockBalloon", "blockBalloonEdgeTop", "blockBalloonEdgeLeft", "blockBalloonEdgeRight", "blockBalloonEdgeBottom", "blockBalloonCornerTopLeft", "blockBalloonCornerTopRight", "blockBalloonCornerBottomLeft", "blockBalloonCornerBottomRight", "blockFortressSmall", "blockFortressLargeTopLeft", "blockFortressLargeTopRight", "blockFortressLargeBottomLeft", "blockFortressLargeBottomRight", "blockFortressHorizontalLeft", "blockFortressHorizontalRight", "blockFortressVerticalTop", "blockFortressVerticalBottom", "pillarFortressVertical", "pillarFortressHorizontal", "blockHelium", "blockTape", "pumpAir", "signArrowUp", "boxsimilator", "bossBalloon", "pipeDuctVertical", "teleport", "chestTreasure", "tokenCheat", "toasterCivilian", "gemCivilian", "chairCivilian", "copterCivilian", "blobCivilian", "cactusScientist", "cactusProfessor", "corruptor", "discus", "portalMachine"];


// Stores the image names, dialogue
// to display, and text to show in
// the pause screen for each treasure.
// The ordering of the elements
// determines 
treasureInfoSet = [
    ["treasureSporkSilver", "YOU GOT A SILVERnSPORK. GREAT FORnSOUPS AND PASTA!", "SILVER SPORK"],
    ["treasureDictionary", "YOU GOT AnDICTIONARY!nHOW HANDY.", "DICTIONARY"],
    ["treasurePhone", "YOU GOT A PHONE!nAN OLD, ROTARYnMODEL.", "TELEPHONE"],
    ["treasureTurnip", "YOU GOT A TURNIP!nA BITTER VEGGIEnINDEED.", "TURNIP"],
    ["treasureCubePuzzle", "YOU GOT A PUZZLEnCUBE! WHAT METHODnWILL YOU USE?", "PUZZLE CUBE"],
    ["treasureGlobeSnow", "YOU GOT A SNOWnGLOBE! FILLEDnWITH FLURRIES.", "SNOW GLOBE"],
    ["treasureRuby", "YOU GOT A RUBY!nNO, IT'S NOT ONnRAILS.", "RUBY"],
    ["treasureNuggetGold", "YOU GOT A GOLDnNUGGET! EUREKA!n", "GOLD NUGGET"],
    ["treasureBlokSoviet", "YOU GOT A SOVIETnBLOK! IN SOVIETnRUSSIA...", "SOVIET BLOK"],
    ["treasureClock", "YOU GOT A CLOCK!nIT'S TIME TO FIGHTnBALLOONS!", "CLOCK"],
    ["treasureCalculatorGraphing", "YOU GOT AnGRAPHINGnCALCULATOR!", "GRAPHING CALC"],
    ["treasureShellSnail", "YOU GOT A SNAILnSHELL! IT HAS LONGnSINCE BEEN EMPTY.", "SNAIL SHELL"],
    ["treasureCandle", "YOU GOT A CANDLE!nWATCH OUT FORnHOT WAX!", "CANDLE"],
    ["treasureBrowserGood", "YOU GOT A GOODnBROWSER! ZIPPYnJAVASCRIPT!", "GOOD BROWSER"],
    ["treasureGhostSpooky", "YOU GOT A SPOOKYnGHOST! HE DOESN'TnLOOK TOO MEAN.", "SPOOKY GHOST"],
    ["treasureScrollAncient", "YOU GOT ANnANCIENT SCROLL!nQUITE DUSTY.", "ANCIENT SCROLL"],
    ["treasureBulbLight", "YOU GOT A LIGHTnBULB! CAREFUL, ORnIT MAY BREAK!", "LIGHT BULB"],
    ["treasurePitchman", "YOU GOT A GREATnPITCHMAN! R.I.P.nBILLY MAYS!", "PITCHMAN"],
    ["treasureWellInk", "YOU GOT AN INKnWELL! IF ONLYnYOU HAD A QUILL...", "INK WELL"],
    ["treasureMuffin", "YOU GOT A MUFFIN!nEMBEDDED WITHnCHOCO CHIPS!", "MUFFIN"],
    ["treasureChestSmaller", "YOU GOT AN EVENnSMALLER CHEST!nIT'S LOCKED.", "SMALL CHEST"],
    ["treasureHorn", "YOU GOT A HORN!nGREAT FOR ANnOLD CAR.", "HORN"]
];

cheatsInfoSet = [
    ["YOU GOT A TOKENnFOR PSYCHEDELICnMODE!nTHIS WILL MAKEnEVERYTHING LOOKnCOLORFUL.", "PSYCHEDELIC"],
    ["YOU GOT A TOKENnFOR NO COLLIDEnMODE!nTHIS ALLOWS YOUnTO FLY THROUGHnBLOCKS.", "NO COLLIDE"],
    ["YOU GOT A TOKENnFOR INVINCIBLEnMODE!", "INVINCIBLE"],
    ["YOU GOT A TOKENnFOR CLEAR MAPnMODE!nCLEARS THE MAPnCOVERING ON THEnPAUSE SCREEN.", "CLEAR MAP"],
    ["YOU GOT A TOKENnFOR LEVEL EDITnMODE!nALLOWS YOU TOnEDIT OBJECTS.n", "EDITOR"],
    ["YOU GOT A TOKENnFOR ZAP SPRINGnMODE!nCHANGES YOURnAPPEARANCE TOnA ZAP SPRING.", "ZAP SPRING"],
    ["YOU GOT A TOKENnFOR TOAST RUNNERnMODE!nCHANGES YOUnINTO A RUNNINGnPIECE OF TOAST.", "TOAST"]
];
