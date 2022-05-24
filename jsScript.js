
$('.ui-draggable').draggable();


//initially, number of correct cards is 0;
var correctCards = 0;

var wrongCards = 0;

var totalLife = 10;


var objectCreated = 0;

// Reset the game
correctCards = 0;
wrongCards = 0;

var level = "first";

var snowflake;
$('#cardPile').html('');
$('#cardSlots').html('');

var win = window,
    doc = document,
    docElem = doc.documentElement,
    body = doc.getElementsByTagName('body')[0],
    x = win.innerWidth || docElem.clientWidth || body.clientWidth,
    y = win.innerHeight|| docElem.clientHeight|| body.clientHeight;




// Create the pile of shuffled cards
var numbers = [1, 2, 3, 4];/* ['odd', 'even', 'even', 'odd', 'odd', 'odd', 'even', 'even', 'odd', 'even']; */
var trashArr = ['t1.png', 't2.png', 't3.png', 't4.png', 't5.png', 't6.png'];
var recycleArr = ['r1.png', 'r2.png', 'r3.png', 'r4.png', 'r2.png', 'r3.png'];

var cardNameArr = [];
var idArr = [];

$(init);

var id = null;
var flakesCount = null;

function myMove(id) {

    var elem = document.getElementById(id);
    var clickElm;
    var draggedElement = 1;

    var pos = 0;
    var posX = 0;
    var posY = 0;
    //console.log("screen Height "+ height +"   " + height*0.6.toString() +"   " + height*0.7.toString())

    var endPos = parseInt(y*.76);

    clearInterval(id);

    id = setInterval(frame, 10);

    idArr.push(id);

    elem.addEventListener("mousedown", function (e) {

        clickElm = document.getElementById(this.id);
       
        var rect = document.getElementById(this.id).getBoundingClientRect();

        posX = rect.left;
        posY = rect.top;
        console.log(posX);
        console.log(posY);

        elem = clearInterval(clickElm);
        draggedElement = 2;

    });

    elem.addEventListener("mouseup", function (e) {
        
        var eId = this.id;

        console.log(eId);
        
        elem = document.getElementById(eId);
        var rect = document.getElementById(this.id).getBoundingClientRect();
        var x = rect.left;
        var y = rect.top;

        if(posX != x ){
            var eM= document.getElementById(this.id);
            eM.style.left = x + 'px';
            var afterX = rect.left;
            console.log(afterX);
        }
       
        if(posY != y){
            var eM= document.getElementById(this.id);
            eM.style.top = posY + 'px';
            var afterY = rect.top;
            console.log(afterY);  
        }
       
        draggedElement = 1;
        
    });

    function frame() {

        if(draggedElement == 1){
            if (pos == endPos) {
                clearInterval(id);
                elem.remove();
                pos = 0;
                flakesCount--;
                console.log("Count "+flakesCount);

                if(flakesCount==0){
                    idArr = [];
                    $(createTrashObjects);
                }
    
            } else {
    
                pos++;
                elem.style.top = pos + 'px';
            }
        }

    }
}

function createTrashObjects(){

    objectCreated++;

    //var indx = cardNameArr.indexOf("")

    for(var i = 0; i<cardNameArr.length; i++){
        console.log("CardName "+cardNameArr[i]);

        $("#"+cardNameArr[i]).remove();
        if(i==cardNameArr.length-1){
            cardNameArr = [];
        }
    }

    numbers.sort(function () { return Math.random() - .5 });
    trashArr.sort(function () { return 0.5 - Math.random() });
    recycleArr.sort(function () { return 0.5 - Math.random() });

    for (var i = 0; i < numbers.length; i++) {

        var image;
        var cardName;

        if (numbers[i] % 2 != 0) {
            image = trashArr[i];
            cardName = 'trash';
        } else {
            image = recycleArr[i];
            cardName = 'recycle';
        }
        snowflake = $('<div> <img class="trashImg" src="images/objects/' + image + '"></div>').data('number', numbers[i]).attr('id', 'card' + cardName + i).appendTo('#cardPile').draggable({
            containment: '#content',
            stack: '#cardPile div',
            cursor: 'none',
            revert: true,
            function: myMove('card' + cardName + i)
        });

        cardNameArr.push('card' + cardName + i);
        flakesCount++;
    }
}

function increase() {
    // Change the variable to modify the speed of the number increasing from 0 to (ms)
    let SPEED = 40;
    // Retrieve the percentage value
    let limit = parseInt(document.getElementById("value1").innerHTML, 10);

    for(let i = 0; i <= limit; i++) {
        setTimeout(function () {
            document.getElementById("value1").innerHTML = i + "%";
        }, SPEED * i);
    }
}

//here is the init() function
function init() {
    /* var sound = new buzz.sound("sound/background", {
        formats: [ "mp3"]
    });
    
    sound.play()
         .fadeIn()
         .loop() */

    /* document.getElementById("audioContainer").play(); */

    document.getElementById("wrongScoreText").innerHTML = totalLife;
    $(createTrashObjects);

    document.getElementById("cardPile").style.bottom = y*0.25;
    // Hide the success message
    $('#contentOverlay').hide();
    
    $('#life1').hide();
    $('#life2').hide();
    //
    $('#successMessage').css({
        left: '580px',
        top: '250px',
        width: 0,
        height: 0
    });

    // Create the card slots
   
    var imagesArr = ['nr.png', 'r.png'];
    
    for (var i = 1; i <= 2; i++) {
        if (i == 1) {
            $('<div><img class="binImg" src="images/' + imagesArr[i - 1] + '"></div>').data('number', 'trash').appendTo('#cardSlots').droppable({
                accept: '#cardPile div',
                hoverClass: 'hovered',
                drop: handleCardDrop
            });
        } else {
            $('<div><img class="binImg" src="images/' + imagesArr[i - 1] + '"></div>').data('number', 'recycle').appendTo('#cardSlots').droppable({
                accept: '#cardPile div',
                hoverClass: 'hovered',
                drop: handleCardDrop
            });
        }
    }

}

function handleCardDrop(event, ui) {

    //Grab the slot number and card number
    var slotNumber = $(this).data('number');
    var cardNumber = ui.draggable.data('number');
    var dragItemId= ui.draggable.attr('id');
    var item = document.getElementById(dragItemId);

    var index = cardNameArr.indexOf(dragItemId);

    //If the cards was dropped to the correct slot,
    //change the card colour, position it directly
    //on top of the slot and prevent it being dragged again

    if (slotNumber == "trash" && cardNumber % 2 != 0) {
        ui.draggable.addClass('correct');
        ui.draggable.draggable('disable');        
        ui.draggable.position({
            of: $(this), my: 'left top', at: 'left top'
        });

        //This prevents the card from being
        //pulled back to its initial position
        //once it has been dropped
        ui.draggable.position({
            of: $(this),
            my: 'left top',
            at: 'left top',
            using: function (css, calc) {
                $(this).animate(css, 200, "linear");
            }
        });

        clearInterval(idArr[index]);

        item.remove();
       
        console.log(dragItemId);
      
        correctCards++; //increment keep track correct cards

        idArr.splice(index, 1);

        cardNameArr.splice(index,1);
        
        flakesCount--;
    }
    else if (slotNumber == "recycle" && cardNumber % 2 == 0) {

        ui.draggable.addClass('correct');
        ui.draggable.draggable('disable');
        
        ui.draggable.position({
            of: $(this), my: 'left top', at: 'left top'
        });

        //This prevents the card from being
        //pulled back to its initial position
        //once it has been dropped
        ui.draggable.position({
            of: $(this),
            my: 'left top',
            at: 'left top',
            using: function (css, calc) {
                $(this).animate(css, 200, "linear");
            }
        });
        ui.draggable.draggable('option', 'revert', false);
        
        clearInterval(idArr[index]);

        item.remove();
     
        console.log(dragItemId);
        
        correctCards++; //increment keep track correct cards

        idArr.splice(index, 1);

        cardNameArr.splice(index, 1);
        
        flakesCount--;
    }
    else {

        ui.draggable.addClass('incorrect');

        ui.draggable.draggable('disable');
        
        ui.draggable.position({
            of: $(this), my: 'left top', at: 'left top'
        });

        //This prevents the card from being
        //pulled back to its initial position
        //once it has been dropped
        ui.draggable.draggable('option', 'revert', false);

        clearInterval(idArr[index]);

        item.remove();
 
        console.log(dragItemId);
       
        //correctCards--; //increment keep track correct cards

        wrongCards++;

        idArr.splice(index, 1);

        cardNameArr.splice(index,1);
        
        flakesCount--;
    }

    /* if (wrongCards === 2){
        document.getElementById("life1").remove();
    }
    else if(wrongCards === 4){
        document.getElementById("life2").remove();
    }
    else if(wrongCards === 6){
        document.getElementById("life3").remove();
    }
    else if(wrongCards === 8){
        document.getElementById("life4").remove();
    }
    else if(wrongCards === 10){
        document.getElementById("life5").remove();
    }
    else if(wrongCards === 12){
        document.getElementById("life6").remove();
    }
    else if(wrongCards === 14){
        document.getElementById("life7").remove();
    }
    else if(wrongCards === 16){
        document.getElementById("life8").remove();
    }
    else if(wrongCards === 18){
        document.getElementById("life9").remove();
    }
    else if(wrongCards === 20){
        document.getElementById("life10").remove();
    }
 */

    //If all the cards have been placed correctly then
    //display a message and reset the cards for
    //another go

    if(wrongCards === 1){
        $('#life1').show();
    }
    else if(wrongCards === 2){

        $('#life2').show();
        wrongCards = 0;
        setTimeout(() => {

            $('#life1').hide();
            $('#life2').hide();

            totalLife--;

            document.getElementById("wrongScoreText").innerHTML = totalLife;

        }, 500);
    }


    if (level === "first" && correctCards === 10  ) {
       
        level = "second";
        $('#contentOverlay').show();
        $('#successMessage').animate({
            left: '15%',
            top: '30%',
            position: 'absolute',
            width: '700px',
            height: '700px',
            opacity: 1
        });

        increase();

        document.getElementById("content").style.backgroundImage = "url(images/park-min.png)";

        setTimeout(() => {

            $('#contentOverlay').hide();
        }, 4000);
    }
    else if(level === "second" && correctCards === 20){
        level = "third";
        $('#contentOverlay').show();
        $('#successMessage').animate({
            left: '15%',
            top: '30%',
            position: 'absolute',
            width: '700px',
            height: '700px',
            opacity: 1
        });

        increase();

        document.getElementById("content").style.backgroundImage = "url(images/office_shadow-min.png)";

        setTimeout(() => {

            document.getElementById("contentOverlay").remove();
        }, 4000);
    }

    document.getElementById("scoreText").innerHTML = correctCards;
    //document.getElementById("wrongScoreText").innerHTML = wrongCards;


    if(cardNameArr.length==0){

        idArr = [];
        $(createTrashObjects);
    }

}


