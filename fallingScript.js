var correctCards = 0;
var singleAnimation;
var $snowflakes;

$('#cardPile').html('');
$('#cardSlots').html('');


// Create the pile of shuffled cards
var numbers = 3;/* ['odd', 'even', 'even', 'odd', 'odd', 'odd', 'even', 'even', 'odd', 'even']; */
var trashArr = ['t1.png', 't2.png', 't3.png', 't3.png'];
var recycleArr = ['r1.png', 'r2.png', 'r3.png', 'r3.png'];

//auto run the init() function;
$(fallingSnow);
//$(myMove);
function fallingSnow() {
    $snowflakes = $(),
        createSnowflakes = function () {
            var qt = 4;
            for (var i = 0; i < qt; ++i) {
                var image;
                var cardName;

                if (i % 2 != 0) {
                    image = trashArr[i];
                    cardName = 'trash';
                } else {
                    image = recycleArr[i];
                    cardName = 'recycle';
                }
                var $snowflake = $('<div> <img class="trashImg" src="images/objects/' + image + '"></div>').data('number', i).attr('id', 'card' + cardName + i).appendTo('#cardPile').draggable({
                    containment: '#content',
                    stack: '#cardPile div',
                    cursor: 'none',
                    revert: true
                });
                $snowflake.css({
                    'left': (Math.random() * $('#site').width()) + 'px',
                    'top': (- Math.random() * $('#site').height()) + 'px'
                });
                // add this snowflake to the set of snowflakes
                $snowflakes = $snowflakes.add($snowflake);
            }
            $('#cardPile').prepend($snowflakes);
        },

        runSnowStorm = function () {
            $snowflakes.each(function () {

                singleAnimation = function ($flake) {
                    $flake.animate({
                        top: "1200px",
                        opacity: "0.2",
                    }, Math.random() + 6000, function () {
                        // this particular snow flake has finished, restart again
                        $flake.css({
                            'top': /* (- Math.random() * $('#site').height()) */ 0 + 'px',
                            'opacity': 1
                        });
                        singleAnimation($flake);
                    });
                };
                singleAnimation($(this));


            });
        };

    var imagesArr = ['nr.png', 'r.png'];
    //var wordsArr = ['trash', 'recycle'];


    for (var i = 1; i <= 2; i++) {
        if (i == 1) {
            $('<div><img class="binImg" src="images/' + imagesArr[i - 1] + '"></div>').data('number', 'trash').appendTo('#cardSlots').droppable({
                // $('<div>' + words[i - 1] + '</div>').data('number', 'odd').appendTo('#cardSlots').droppable({
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


    createSnowflakes();
    runSnowStorm();
}

function handleCardDrop(event, ui) {

    //Grab the slot number and card number
    var slotNumber = $(this).data('number');
    var cardNumber = ui.draggable.data('number');

    //If the cards was dropped to the correct slot,
    //change the card colour, position it directly
    //on top of the slot and prevent it being dragged again



    if (slotNumber == "trash" && cardNumber % 2 != 0) {
        ui.draggable.addClass('correct');
        ui.draggable.draggable('disable');
        //$(this).droppable('disable');
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
        ui.draggable.remove();
        correctCards++; //increment keep track correct cards
    }
    else if (slotNumber == "recycle" && cardNumber % 2 == 0) {
        ui.draggable.addClass('correct');
        ui.draggable.draggable('disable');
        //$(this).droppable('disable');
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
        ui.draggable.remove();
        correctCards++; //increment keep track correct cards
    }
    else {
        ui.draggable.addClass('incorrect');
        ui.draggable.draggable('disable');
        //$(this).droppable('disable');
        ui.draggable.position({
            of: $(this), my: 'left top', at: 'left top'
        });
        //This prevents the card from being
        //pulled back to its initial position
        //once it has been dropped
        ui.draggable.draggable('option', 'revert', false);

        ui.draggable.remove();
        correctCards--; //inc
        if (correctCards < 0) {
            correctCards = 0;
        }
    }

    //If all the cards have been placed correctly then
    //display a message and reset the cards for
    //another go
    if (correctCards === 10) {
        $('#successMessage').show();
        $('#successMessage').animate({
            left: '380px',
            top: '200px',
            width: '400px',
            height: '150px',
            opacity: 1
        });
    }

    document.getElementById("countScore").innerHTML = correctCards;





}

// These functions are declared outside of the elements
// because they are going to be reused in two different
// kind of events device: touch/mouse
function onDown(e) {
    // Stop bubbling, this is important to avoid 
    // unexpected behaviours on mobile browsers:
    e.preventDefault();
    

    // Get the correct event source regardless the device:
    // Btw, "e.changedTouches[0]" in this case for simplicity 
    // sake we'll use only the first touch event
    // because we won't move more elements.
    var evt = e.type === 'touchstart' ? e.changedTouches[0] : e;

    // "Get the distance of the x/y", formula:
    // A: Get current position x/y of the circle. 
    // Example: circle.offsetLeft
    // B: Get the new position x/y. 
    // Example: evt.clientX
    // That's all.
    state.distX = Math.abs(circle.offsetLeft - evt.clientX);
    state.distY = Math.abs(circle.offsetTop - evt.clientY);

    // Disable pointer events in the circle to avoid
    // a bug whenever it's moving.
    snowflake.style.pointerEvents = 'none';
};
function onUp(e) {
    // Re-enable the "pointerEvents" in the circle element.
    // If this is not enabled, then the element won't move.
    snowflake.style.pointerEvents = 'initial';
};
function onMove(e) {
    // Update the position x/y of the circle element
    // only if the "pointerEvents" are disabled, 
    // (check the "onDown" function for more details.)
    if (snowflake.style.pointerEvents === 'none') {

        // Get the correct event source regardless the device:
        // Btw, "e.changedTouches[0]" in this case for simplicity 
        // sake we'll use only the first touch event
        // because we won't move more elements.
        var evt = e.type === 'touchmove' ? e.changedTouches[0] : e;

        // Update top/left directly in the dom element:
        snowflake.style.left = `${evt.clientX - state.distX}px`;
        snowflake.style.top = `${evt.clientY - state.distY}px`;
    };
};

// FOR MOUSE DEVICES:
snowflake.addEventListener('mousedown', onDown);
snowflake.addEventListener('mousemove', onMove);
snowflake.addEventListener('mouseup', onUp);

// FOR TOUCH DEVICES:
snowflake.addEventListener('touchstart', onDown);
snowflake.addEventListener('touchmove', onMove);
snowflake.addEventListener('touchend', onUp);
//fallingSnow();