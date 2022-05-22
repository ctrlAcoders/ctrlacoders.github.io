//initially, number of correct cards is 0;
var correctCards = 0;
var scoreCount=0;

//auto run the init() function;
$(init);

//here is the init() function
function init() {

  // Hide the success message
  $('#successMessage').hide();

  //this div has styles in the css file
  //still, set some css here
  $('#successMessage').css({
    left: '580px',
    top: '250px',
    width: 0,
    height: 0
  });

  // Reset the game
  //empty the 'cardPile' div
  //empty the 'cardSlots' div
  correctCards = 0;
  $('#cardPile').html('');
  $('#cardSlots').html('');

  // Create the pile of shuffled cards
  var numbers = ['trash', 'recycle', 'trash', 'recycle', 'trash', 'recycle', 'trash', 'recycle', 'trash', 'recycle'];
  
  //now randomize the numbers which are draggable and will be dragged
  numbers.sort(function () { return Math.random() - .5 });

  //now create
  for (var i = 0; i < 10; i++) {
    $('<div>' + numbers[i] + '</div>').data('number', numbers[i]).attr('id', 'card' + numbers[i]).appendTo('#cardPile').draggable({
      containment: '#content',
      stack: '#cardPile div',
      cursor: 'move',
      revert: true
    });
  }

 // Create the card slots
  var imagesArr = ['nr.png', 'r.png'];
  var wordsArr = ['trash', 'recycle'];
   //, 'three', 'four', 'five', 'six', 'seven', 'eight', 'nine', 'ten'
  

  for (var i = 1; i <= 2; i++) {
    $('<div><img class="binImg" src="images/' + imagesArr[i - 1] + '"></div>').data('number', wordsArr[i-1]).appendTo('#cardSlots').droppable({
      accept: '#cardPile div',
      hoverClass: 'hovered',
      drop: handleCardDrop
    });
  }

}

function handleCardDrop(event, ui) {

  //Grab the slot number and card number
  var slotNumber = $(this).data('number');
  var cardNumber = ui.draggable.data('number');

  //If the cards was dropped to the correct slot,
  //change the card colour, position it directly
  //on top of the slot and prevent it being dragged again

  if (slotNumber === cardNumber) {
    ui.draggable.addClass('correct');
    ui.draggable.draggable('disable');
    $(this).droppable('disable');
    ui.draggable.position({
      of: $(this), my: 'left top', at: 'left top'
    });
    //This prevents the card from being
    //pulled back to its initial position
    //once it has been dropped
    ui.draggable.draggable('option', 'revert', false);
    correctCards++;
    scoreCount++; //increment keep track correct cards
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



}