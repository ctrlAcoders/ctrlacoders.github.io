var win = window,
    doc = document,
    docElem = doc.documentElement,
    body = doc.getElementsByTagName('body')[0],
    x = win.innerWidth || docElem.clientWidth || body.clientWidth,
    y = win.innerrHeight || docElem.clientHeight;

//=================Initialize Variables==============//
var interval;
var selectedImage;
var objectName;
var numArrLength;
var randomNum;
var level;

var createdObject;

var frameRate = 10;
var objectCount = 0;
var objectCreateTime = 0;
var totalLife = 3;
var correctObjects = 0;
var wrongObjects = 0;
var missedObjects = 0;

var isAudioPlaying = true;

var binImageArr = ['r.png', 'nr.png'];

var objectsNumArr = [];
var objectNameArr = [];
var objectIDArr = [];
var trashArr = ['t1.png', 't2.png', 't3.png', 't4.png', 't5.png', 't6.png', 't7.png', 't2.png', 't3.png', 't7.png', 't1.png', 't2.png', 't3.png', 't7.png', 't5.png', 't6.png', 't1.png', 't7.png', 't3.png', 't4.png', 't1.png', 't2.png', 't3.png', 't4.png', 't7.png', 't6.png', 't1.png', 't2.png', 't7.png', 't4.png', 't2.png'];
var recycleArr = ['r1.png', 'r2.png', 'r3.png', 'r4.png', 'r1.png', 'r1.png', 'r2.png', 'r3.png', 'r2.png', 'r4.png', 'r1.png', 'r2.png', 'r4.png', 'r2.png', 'r1.png', 'r4.png', 'r2.png', 'r3.png', 'r2.png', 'r4.png', 'r1.png', 'r4.png', 'r3.png', 'r2.png', 'r1.png', 'r4.png', 'r2.png', 'r3.png', 'r4.png', 'r1.png', 'r4.png']

var audio = document.getElementById("audioContainer");
var rightAudio = document.getElementById("rightDrag");

var wrongAudio = document.getElementById("wrongDrag");

var levelCompleteAudio = document.getElementById("levelComplete");

var gameOverAudio = document.getElementById("gameOver");

//=================HTML Div Initialize===============//
$('#cardPile').html('');
$('#cardSlots').show();

$('#contentOverlay').hide();
$('#gameOver_Overlay').hide();
$('#life1').hide();
$('#life2').hide();

$('.ui-draggable').draggable();

$('#successMessage').css({
    left: '580px',
    top: '250px',
    width: 0,
    height: 0
})
//=================HTML Div Initialization ENDS===============//

//=========Play Button On-click function Start=========//
function play() {

    $('#home').hide();
    audio.play();
    audio.loop = true;
    isPlaying = true;

    $(init);
}
//=========Play Button On-click function END==========//

//=========PlayPause Button On-click function Starts==========//
function audioControl() {
    if (isAudioPlaying == true) {
        audio.pause();
        isAudioPlaying = false;
    } else {
        audio.play();
        isAudioPlaying = true;
    }
}
//=========PlayPause Button On-click function END==========//

//=========Loading Bar Increasing Function Starts===========//
function loadingBar() {
    // Change the variable to modify the speed of the number increasing from 0 to (ms)
    let SPEED = 40;
    // Retrieve the percentage value
    let limit = parseInt(document.getElementById("value").innerHTML, 10);

    for (let i = 0; i <= limit; i++) {
        setTimeout(function () {
            document.getElementById("value").innerHTML = i + "%";
        }, SPEED * i);
    }
}
//==========Loading Bar Increasing Function END=============//

//===============Object Number Array Setup Starts=================//
function numberArrSetup() {

    objectCount = 0;

    for (var i = 1; i <= 30; i++) {
        objectsNumArr.push(i);

    }
}
//===============Object Number Array Setup ENDS=================//

//===============BinImage Div Setup Starts=================//
function binSetup() {
    console.log("IN BIN SETUP FUNCTION");
    for (var i = 0; i < binImageArr.length; i++) {
        if (i == 0) {
            console.log("IN BIN SETUP FUNCTION inside i 0");
            $('<div><img class="binImg" src="images/' + binImageArr[i] + '"></div>')
                .data('type', 'trash').appendTo('#cardSlots').droppable({
                    accept: '#cardPile div',
                    hoverClass: 'hovered',
                    drop: handleObjectDrop
                });
        } else {
            console.log("IN BIN SETUP FUNCTION 1");
            $('<div><img class="binImg" src="images/' + binImageArr[i] + '"></div>')
                .data('type', 'recycle').appendTo('#cardSlots').droppable({
                    accept: '#cardPile div',
                    hoverClass: 'hovered',
                    drop: handleObjectDrop
                });
        }
    }
}
//================BinImage Div Setup Ends==================//

//================Draggable Object Div Creation Starts==================//
function createObjects() {
    numArrLength = objectsNumArr.length;
    randomNum = Math.floor(Math.random() * (numArrLength - 1));

    console.log("Random Number: " + randomNum + " trash Image: " + trashArr[objectsNumArr[randomNum]]);

    if (objectsNumArr[randomNum] % 2 != 0) {
        selectedImage = trashArr[objectsNumArr[randomNum]];
        objectName = 'trash' + objectsNumArr[randomNum];
    } else {
        selectedImage = recycleArr[objectsNumArr[randomNum]];
        objectName = 'recycle' + objectsNumArr[randomNum];
    }

    createdObject = $('<div><img class="trashImg" src="images/objects/' + selectedImage + '"></div>')
        .data('number', objectsNumArr[randomNum]).attr('id', objectName).appendTo('#cardPile').draggable({
            containment: '#content',
            stack: '#cardPile div',
            cursor: 'none',
            revert: true,
            function: objectMove(objectName)
        });

    objectNameArr.push(objectName);
    objectCount++;
    objectsNumArr.splice(randomNum, 1);

    console.log("Array " + objectsNumArr);

    if (objectCount == 30) {
        clearInterval(interval);
    }

}
//=================Draggable Object Div Creation Ends===================//

//====================Object Faming Setup Starts======================//
function objectMove(id) {
    var elem = document.getElementById(id);
    var draggedElement = false;

    elem.style.position = "absolute";

    var leftNum = (Math.floor(Math.random() * (elem.parentNode.parentElement.clientWidth-190))+2);

    console.log("Random position : " + leftNum + ' '+ x);
    elem.style.top = 0 + 'px';
    elem.style.left  = leftNum+ 'px';

    var pos = 0;
    var posX = 0;
    var posY = 0;

    var endPos = parseInt(y * .7);

    clearInterval(id);

    var intrvlId = setInterval(frame, frameRate);

    console.log("Interval Id: " + intrvlId);

    objectIDArr.push(intrvlId);

    elem.addEventListener("mousedown", function (e) {
        var rect = document.getElementById(this.id).getBoundingClientRect();
        posX = rect.left;
        posY = rect.top;

        clearInterval(intrvlId);
        draggedElement = true;
    });

    elem.addEventListener("mouseup", function (e) {
        var rectInFrame = document.getElementById(this.id).getBoundingClientRect();
        posX = rectInFrame.left;
        posY = rectInFrame.top;

        elem.style.left = x + 'px';
        elem.style.top = posY + 'px';

        var index = objectIDArr.indexOf(intrvlId);

        intrvlId = setInterval(frame, frameRate);

        console.log("ReInterval Id: " + intrvlId);

        objectIDArr[index] = intrvlId;

        draggedElement = false;


    });

    function frame() {

        if (pos >= endPos) {
            clearInterval(intrvlId);
            missedObjects++;

            wrongAudio.play();

            document.getElementById(id).remove();
            
            objectIDArr.splice(objectNameArr.indexOf(id), 1);
            objectNameArr.splice(objectNameArr.indexOf(id), 1);

            switch (missedObjects) {
                case 1:
                    $('#life1').show();
                    break;
                case 2:
                    $('#life2').show();
                    missedObjects = 0;
                    setTimeout(function () {
                        $('#life1').hide();
                        $('#life2').hide();

                        totalLife--;
                        document.getElementById("wrongScoreText").innerHTML = totalLife;

                        if (totalLife == 0) {
                            clearInterval(interval);

                            objectIDArr.forEach(elem => {
                                clearInterval(elem);

                            });

                            $(gameOverScrn);

                        }
                    }, 500);
                    break;
            }
        } else {
            pos++;
            elem.style.top = pos + 'px';
        }

    }

}


//======================Object Faming Setup Ends======================//

//===============INIT function Starts================//
function init() {

    document.getElementById("wrongScoreText").innerHTML = totalLife;

    objectCreateTime = 2000;

    level = "first";

    $(binSetup);

    $(numberArrSetup);

    interval = setInterval(function () {
        console.log("Length " + objectsNumArr.length);
        $(createObjects);
    }, objectCreateTime);

}
//===============INIT function ENDS================//

//===============Drop Handle Function Starts==============//
function handleObjectDrop(event, ui) {

    //Grab the bin number and object number

    var binType = $(this).data('type');
    var dragItemId = ui.draggable.attr('id');
    var dragItemNumber = ui.draggable.data('number');
    var idIndx = objectNameArr.indexOf(dragItemId);

    console.log("Drag Item Number :" + dragItemNumber);

    clearInterval(objectIDArr[idIndx]);
    document.getElementById(dragItemId).remove();

    if (binType == "trash" && dragItemNumber % 2 != 0) {
        ui.draggable.draggable('disable');
        rightAudio.play();
        correctObjects++;

    } else if (binType == "recycle" && dragItemNumber % 2 == 0) {
        ui.draggable.draggable('disable');
        rightAudio.play();
        correctObjects++;

    } else {
        ui.draggable.draggable('disable');
        wrongAudio.play();
        wrongObjects++;
    }

    objectIDArr.splice(idIndx, 1);
    objectNameArr.splice(idIndx, 1);

    switch (wrongObjects) {
        case 1:
            $('#life1').show();
            break;
        case 2:
            $('#life2').show();
            wrongObjects = 0;
            setTimeout(function () {
                $('#life1').hide();
                $('#life2').hide();

                totalLife--;
                document.getElementById("wrongScoreText").innerHTML = totalLife;

                if (totalLife == 0) {
                    clearInterval(interval);

                    objectIDArr.forEach(elem => {
                        clearInterval(elem);

                    });

                    $(gameOverScrn);

                }
            }, 500);
            break;
    }

    if (level === "first" && correctObjects == 10) {
        clearInterval(interval);
        levelCompleteAudio.play();
        level = "second";
        objectCreateTime = 1500;
        frameRate = 5;

        $(removeArrayData);
        $(levelCompleteScrn);

        document.getElementById("content").style.backgroundImage = "url(images/park-min.png)";

    } else if (level === "second" && correctObjects == 20) {
        clearInterval(interval);
        levelCompleteAudio.play();
        level = "last";
        objectCreateTime = 1200;
        frameRate = 2;

        $(removeArrayData);
        $(levelCompleteScrn);

        document.getElementById("content").style.backgroundImage = "url(images/office_shadow-min.png)";

    }else if (level === "last" && correctObjects == 30) {
        clearInterval(interval);
        levelCompleteAudio.play();
        level = "end";
        objectCreateTime = 1500;
        frameRate = 1;

        $(removeArrayData);
        $(levelCompleteScrn);

        document.getElementById("content").style.backgroundImage = "url(images/Kitchen.png)";

    }


    document.getElementById("scoreText").innerHTML = correctObjects;

}
//===============Drop Handle Function ENDS==============//

//================Game Over Screen Show Strats=================//
function gameOverScrn() {
    audio.pause();
    gameOverAudio.play();

    $('#gameOver_Overlay').show();
    $('#gameOverCard').animate({
        left: '15%',
        top: '30%',
        position: 'absolute',
        width: '700px',
        height: '700px',
        opacity: 1
    });
}
//=================Game Over Screen Show Ends==================//

//================Level Complete Screen Show Strats=================//
function levelCompleteScrn() {
    levelComplete.play();

    $('#contentOverlay').show();
    $('#successMessage').animate({
        left: '15%',
        top: '30%',
        position: 'absolute',
        width: '700px',
        height: '700px',
        opacity: 1
    });

    //$(increase);

    objectsNumArr = [];
    $(numberArrSetup);

    setTimeout(() => {

        $('#contentOverlay').hide();
        $(createObjects);
        interval = setInterval(() => {
            $(createObjects);
        }, objectCreateTime);


    }, 4000);

}
//=================Level Complete Screen Show Ends==================//

//====================Remove Array Data Starts=======================//
function removeArrayData() {
    if (objectIDArr.length > 0) {
        for (var i = 0; i < objectIDArr.length; i++) {
            clearInterval(objectIDArr[i]);
            if (i == (objectIDArr.length - 1)) {
                objectIDArr = [];
            }
        }
    }

    if (objectNameArr.length > 0) {
        for (var i = 0; i < objectNameArr.length; i++) {
            document.getElementById(objectNameArr[i]).remove();
            if (i == (objectNameArr.length - 1)) {
                objectNameArr = [];
            }
        }
    }

}
//====================Remove Array Data END=======================//
