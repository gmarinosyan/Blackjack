var playerCards = [];
var dealerCards = [];
var playerBust;
var dealerBust;
var playerChips = [];
var betChips = [];
var playerCash = 0;
var playerBet = 0;
var deck;
var value;
var test;
var zIndex = 1;

$(document).ready(function() {
    // Initial setup of elements
    $('#playArea').hide();
    $('#hit').hide();
    $('#hitAfterDouble').hide();
    $('#stand').hide();
    $('#double').hide();
    $('#bet').hide();
    $('#playAgain').hide();
    $('#dealerCards').hide();
    $('#playerCards').hide();
    $('#instructions').hide();
    $('#playBankrupt').hide();
    $('#allIn').hide();
    $('#gameOverBG').hide();

    // Play button styling
    $("#play").mouseenter(function() {
        $(this).animate({
            'background-color': '#e74c3c',
            color: '#FFFFFF'
        }, 200);
    });
    $("#play").mouseleave(function() {
        $(this).animate({
            'background-color': '#FFFFFF',
            color: '#e74c3c'
        }, 200);
    });
    $("#double").tooltip({
        disabled: true,
        track: true
    });

    $("#bet").tooltip({
        disabled: false,
        track: true
    });

    // Button onclick commands
    $('#play').click(function() {
        play();
    });

    $('#playBankrupt').click(function() {
        $('#gameOverBG').fadeOut(500);
        $('#statusBarText').html('Please place your bet.');
        $('#dealerCards').fadeOut(500);
        $('#playerCards').fadeOut(500);
        play();
    });

    $('#playAgain').click(function() {
        // Reset all elements except for money back to initial values
        $('#playAgain').hide();
        $('#play').hide();
        playerCards.length = 0;
        dealerCards.length = 0;
        playerBust = false;
        dealerBust = false;

        $('#dealerCards').fadeOut(1000);
        $('#playerCards').fadeOut(1000);

        $('#playerResult').empty();
        $('#dealerResult').empty();
        deck = new Deck();
        setTimeout(function() {
            refreshCards('player');
        }, 1000);
        setTimeout(function() {
            refreshCards('dealer');
        }, 1000);
        refreshChipImage();
        updateMoney();

        // Enable droppable elements (bet area)
        $('.droppableBet').droppable({
            drop: function(event, ui) {
                $(ui.draggable).appendTo("#chipDrop");
                updateMoney();
                refreshChipArray();
                refreshChipImage();
                $(ui.draggable).remove();
                if(playerBet == 0){
                    $('#bet').tooltip("enable");
                }
                else{
                    $('#bet').tooltip("disable");
                }
                $('.draggable').draggable({
                    revert: "invalid"
                });
            }
        });

        // Enable droppable elements (wallet)
        $('.droppableChips').droppable({
            drop: function(event, ui) {
                $(ui.draggable).appendTo("#playerChips");
                updateMoney();
                refreshChipArray();
                refreshChipImage();
                $(ui.draggable).remove();
                if(playerBet == 0){
                    $('#bet').tooltip("enable");
                }
                else{
                    $('#bet').tooltip("disable");
                }
                $('.draggable').draggable({
                    revert: "invalid"
                });

            }
        });

        //Enable draggable elements (chips)
        $('.draggable').draggable({
            revert: "invalid",
            cursor: "move"
        });

        $('#chipDrop').animate({
            'width': '300px',
            'left': '0',
            'right': '0'
        }, 1000);

        $('#instructions').delay(1000).fadeIn(300);

        $('#bet').delay(1000).fadeIn(300);
        $('#allIn').delay(1000).fadeIn(300);

        $('#statusBarText').html('Please place your bet.');

    });

    $('#bet').click(function() {
        if(playerBet == 0){

        }else{
        for (var i = 0; i < 2; i++) {
            dealerCards.push(dealCard());
        }
        for (i = 0; i < 2; i++) {
            playerCards.push(dealCard());
        }
        dealerCards[0].visible = false;

        refreshCards('dealer');
        refreshCards('player');

        $('.draggable').draggable('destroy');
        $('.droppableChips').droppable('destroy');
        $('.droppableBet').droppable('destroy');

        $('#bet').hide();

        // If it is impossiible to double down, enable tooltip telling player so
        if (playerBet > playerCash) {
            $('#double').tooltip("enable");
        }

        $('#instructions').fadeOut(300);

        // Slide bet area out of the way
        $('#chipDrop').delay(300).animate({
            'width': '100px',
            'left': '30px',
            'right': '100%'
        }, 1000);

        // Fade in game elements
        $('#dealerCards').delay(600).fadeIn(1000);
        $('#playerCards').delay(600).fadeIn(1000);
        $('#hit').delay(600).fadeIn(1000);
        $('#stand').delay(600).fadeIn(1000);
        $('#double').delay(600).fadeIn(1000);
        $('#allIn').fadeOut(500);

        $('#statusBarText').html('The game begins!');
    }

    });


    $('#hit').click(function() {
        hit();
    });

    // Double down procedure
    $('#double').click(function() {
        if (playerCash >= playerBet) {
            // Double player's bet and append appropriate chips to bet area
            playerCash -= playerBet;

            $.each(betChips[0], function(index, value) {
                addChipBet(10);
            });
            $.each(betChips[1], function(index, value) {
                addChipBet(20);
            });
            $.each(betChips[2], function(index, value) {
                addChipBet(50);
            });
            $.each(betChips[3], function(index, value) {
                addChipBet(100);
            });

            var money = 0;
            var values = [];

            // Recount player's remaining chips
            while (money <= playerCash) {
                money += 100;
                values.push(100);
                if (money > playerCash) {
                    money -= 100;
                    values.splice(values.length - 1, 1);
                    break;
                }
            }
            while (money <= playerCash) {
                money += 50;
                values.push(50);
                if (money > playerCash) {
                    money -= 50;
                    values.splice(values.length - 1, 1);
                    break;
                }
            }

            while (money <= playerCash) {
                money += 20;
                values.push(20);
                if (money > playerCash) {
                    money -= 20;
                    values.splice(values.length - 1, 1);
                    break;
                }
            }


            while (money <= playerCash) {
                money += 10;
                values.push(10);
                if (money > playerCash) {
                    money -= 10;
                    values.splice(values.length - 1, 1);
                    break;
                }
            }

            playerChips[0] = [];
            playerChips[1] = [];
            playerChips[2] = [];
            playerChips[3] = [];


            imageString = '';
            $.each(values, function(index, value) {
                addChip(value);
            });

            refreshChipImage();
            updateMoney();
            $('#hitAfterDouble').show();
            $('#hit').hide();
            $('#stand').hide();
            $('#double').hide();

        } else {}
    });

    $('#stand').click(function() {
        stand();
    });

    // Modified version of hit, used only after a double down (displays only stand option after execution)
    $('#hitAfterDouble').click(function() {
        hit(true);
    });

    $('#allIn').click(function() {

        // Append all chips from player's wallet to bet area and clear wallet
        $.each(playerChips[0], function(index, value) {
            addChipBet(10);
        });
        $.each(playerChips[1], function(index, value) {
            addChipBet(20);
        });
        $.each(playerChips[2], function(index, value) {
            addChipBet(50);
        });
        $.each(playerChips[3], function(index, value) {
            addChipBet(100);
        });
        playerChips[0] = [];
        playerChips[1] = [];
        playerChips[2] = [];
        playerChips[3] = [];
        refreshChipImage();
        updateMoney();
        $('.draggable').draggable({
            revert: "invalid"
        });
    });

    if (parseInt($('#bgText').css("fontSize")) < 100) {
        $('#bgText').css({
            "font-size": "100px"
        });
    }

    // A timer which sets the appropriate height for the dealer's card container (allows proper positioning)
    setInterval(function() {
        $('#dealerCards').css("height", $('.card').first().height() + "px");
    }, 100);


});

function play() {
    // Set up game parameters
    $('#playArea').delay('fast').fadeIn('slow');
    $('#colorOverlay').fadeOut('slow');
    $('#introArea').fadeOut('fast');
    $('h1').fadeOut('slow');
    $('#playBankrupt').hide();
    $('#startButton').hide();
    $('#playAgain').hide();
    playerCards.length = 0;
    dealerCards.length = 0;
    playerBust = false;
    dealerBust = false;

    $('#playerResult').empty();
    $('#dealerResult').empty();
    deck = new Deck();
    refreshCards('player');
    refreshCards('dealer');
    initializeChips();
    refreshChipImage();
    updateMoney();

    // Enable draggables and droppables
    $('.droppableBet').droppable({
        drop: function(event, ui) {
            $(ui.draggable).appendTo("#chipDrop");
            updateMoney();
            refreshChipArray();
            refreshChipImage();
            $(ui.draggable).remove();
            if(playerBet == 0){
                    $('#bet').tooltip("enable");
                }
                else{
                    $('#bet').tooltip("disable");
                }
            $('.draggable').draggable({
                revert: "invalid"
            });
        }
    });

    $('.droppableChips').droppable({
        drop: function(event, ui) {
            $(ui.draggable).appendTo("#playerChips");
            updateMoney();
            refreshChipArray();
            refreshChipImage();
            $(ui.draggable).remove();
            if(playerBet == 0){
                    $('#bet').tooltip("enable");
                }
                else{
                    $('#bet').tooltip("disable");
                }
            $('.draggable').draggable({
                revert: "invalid"
            });

        }
    });

    $('.draggable').draggable({
        revert: "invalid",
        cursor: "move"
    });

    $('#play').hide();

    // Slide bet area into center
    $('#chipDrop').animate({
        'width': '300px',
        'left': '0',
        'right': '0'
    }, 1000);

    $('#instructions').delay(1000).fadeIn(300);
    $('#bet').delay(1000).fadeIn(300);
    $('#allIn').show();
}

function stand() {
    // End player's turn and begin dealer's
    $('#statusBarText').html("The player stands. It is now the dealer's turn to play.");
    while (getHandValue('dealer') < 17) {
        dealerMove();
    }
    checkSum('dealer');
    endGame();
}

function hit(afterDouble) {
    // Deal card to player and check the sum of all cards
    $('#double').hide();
    playerCards.push(dealCard());
    refreshCards('player');
    checkSum('player');

    // If player busted, end the game
    if (playerBust) {
        endGame();
        $('#hitAfterDouble').hide();
        return false;
    }

    // If the hit is following a double down, only show the Stand button after execution
    if (afterDouble) {
        $('#hitAfterDouble').hide();
        $('#stand').show();
    }
    $('#statusBarText').html('The player hits!');
}

function Card(suit, value) {
    this.suit = suit;
    this.value = value;
    this.visible = true;
    this.getImageURL = getURL;
    this.getValue = getCardValue;
}

function Chip(value) {
    this.value = value;
    this.getChipURL = getChipImageURL;
}

function getURL() {
    if (this.visible) {
        return "images/cards/" + this.suit + this.value + ".png";
    } else {
        return "images/cards/back.png";
    }
}

function getChipImageURL() {
    return "images/chips/" + this.value + ".png";
}

function getCardValue(target) {
    if (this.value == "K" || this.value == "Q" || this.value == "J") {
        return 10;
    } else if (this.value == "A") {
        return 'A';
    } else {
        return parseInt(this.value);
    }
}

// Calculate total value of the player's or dealer's hand. 
function getHandValue(target) {
    var total = 0;
    var count = 0;
    if (target == 'player') {
        $.each(playerCards, function(index, value) {
            if (value.getValue(target) != 'A') {
                total += value.getValue(target);
            } else {
                total += 1;
                count++;
            }
        });
    } else if (target == 'dealer') {
        $.each(dealerCards, function(index, value) {
            if (value.getValue(target) != 'A') {
                total += value.getValue(target);
            } else {
                total += 1;
                count++;
            }
        });
    }

    // Account for the fact that aces could equal either 1 or 11
    if (count === 0) {
        return total;
    } else {
        counter = 0;
        while (counter < count) {
            if (total + 10 <= 21) {
                total += 10;
                counter++;
            } else {
                break;
            }
        }
        return total;

    }
}

function Deck() {
    var cardNames = [
        ["diamonds", "2"],
        ["diamonds", "3"],
        ["diamonds", "4"],
        ["diamonds", "5"],
        ["diamonds", "6"],
        ["diamonds", "7"],
        ["diamonds", "8"],
        ["diamonds", "9"],
        ["diamonds", "10"],
        ["diamonds", "J"],
        ["diamonds", "Q"],
        ["diamonds", "K"],
        ["diamonds", "A"],
        ["hearts", "2"],
        ["hearts", "3"],
        ["hearts", "4"],
        ["hearts", "5"],
        ["hearts", "6"],
        ["hearts", "7"],
        ["hearts", "8"],
        ["hearts", "9"],
        ["hearts", "10"],
        ["hearts", "J"],
        ["hearts", "Q"],
        ["hearts", "K"],
        ["hearts", "A"],
        ["clubs", "2"],
        ["clubs", "3"],
        ["clubs", "4"],
        ["clubs", "5"],
        ["clubs", "6"],
        ["clubs", "7"],
        ["clubs", "8"],
        ["clubs", "9"],
        ["clubs", "10"],
        ["clubs", "J"],
        ["clubs", "Q"],
        ["clubs", "K"],
        ["clubs", "A"],
        ["spades", "2"],
        ["spades", "3"],
        ["spades", "4"],
        ["spades", "5"],
        ["spades", "6"],
        ["spades", "7"],
        ["spades", "8"],
        ["spades", "9"],
        ["spades", "10"],
        ["spades", "J"],
        ["spades", "Q"],
        ["spades", "K"],
        ["spades", "A"]
    ];
    this.cards = [];

    // Initialize 8 decks; this is a standard casino shoe of cards
    for (var i = 0; i < 8; i++) {
        for (g = 0; g < 52; g++) {
            this.cards.push(new Card(cardNames[g][0], cardNames[g][1]));
        }
    }
}


// Returns a random card from the deck
function dealCard() {
    var randomNum = Math.floor(Math.random() * deck.cards.length);
    var randomCard = deck.cards[randomNum];
    deck.cards.splice(randomNum, 1);
    return randomCard;
}

// Rerenders the card image based on the cards present in the playerHand or dealerHand arrays.
function refreshCards(target) {
    var cards = "";
    if (target == 'player') {
        $.each(playerCards, function(index, value) {
            cards += "<img src = \"" + value.getImageURL() + "\" class = 'card'>" + " ";
        });
        $('#playerCards').html(cards);
    } else if (target == 'dealer') {
        $.each(dealerCards, function(index, value) {
            cards += "<img src = \"" + value.getImageURL() + "\" class = 'card'>" + " ";
        });
        $('#dealerCards').html(cards);
    }
    var cardsChanged = 0;
    $('#playerCards .card').each(function() {
        if (cardsChanged > 0) {
            $(this).css("left", "" + (40 * (cardsChanged)) + "px");
        }
        $('#playerCards').css("width", "" + ($('.card').first().width() + 40 * (cardsChanged)) + "px");
        cardsChanged++;

    });
    cardsChanged = 0;
    $('#dealerCards .card').each(function() {
        if (cardsChanged > 0) {
            $(this).css("left", "" + (40 * (cardsChanged)) + "px");
        }
        $('#dealerCards').css("width", "" + ($('.card').first().width() + 40 * (cardsChanged)) + "px");
        cardsChanged++;
    });
}

// Rerenders image of chips based on the chips present in the playerChips or betChips arrays
function refreshChipImage() {
    var chipsTen = "";
    var chipsTenCount = 0;
    var chipsTwenty = "";
    var chipsTwentyCount = 0;
    var chipsFifty = "";
    var chipsFiftyCount = 0;
    var chipsHundred = "";
    var chipsHundredCount = 0;

    var chipsTenBet = "";
    var chipsTenCountBet = 0;
    var chipsTwentyBet = "";
    var chipsTwentyCountBet = 0;
    var chipsFiftyBet = "";
    var chipsFiftyCountBet = 0;
    var chipsHundredBet = "";
    var chipsHundredCountBet = 0;

    $.each(playerChips[0], function(index, value) {
        chipsTen += "<img src = \"" + value.getChipURL() + "\"" + " class = \"chip draggable\" style = \"z-index: " + zIndex + "\">";
        zIndex++;
        chipsTenCount++;
    });
    $.each(playerChips[1], function(index, value) {
        chipsTwenty += "<img src = \"" + value.getChipURL() + "\"" + " class = \"chip draggable\" style = \"z-index: " + zIndex + "\">";
        zIndex++;
        chipsTwentyCount++;
    });
    $.each(playerChips[2], function(index, value) {
        chipsFifty += "<img src = \"" + value.getChipURL() + "\"" + " class = \"chip draggable\" style = \"z-index: " + zIndex + "\">";
        zIndex++;
        chipsFiftyCount++;
    });
    $.each(playerChips[3], function(index, value) {
        chipsHundred += "<img src = \"" + value.getChipURL() + "\"" + " class = \"chip draggable\" style = \"z-index: " + zIndex + "\">";
        zIndex++;
        chipsHundredCount++;
    });


    $.each(betChips[0], function(index, value) {
        chipsTenBet += "<img src = \"" + value.getChipURL() + "\"" + " class = \"chip bet draggable\" style = \"z-index: " + zIndex + "\">";
        zIndex++;
        chipsTenCountBet++;
    });
    $.each(betChips[1], function(index, value) {
        chipsTwentyBet += "<img src = \"" + value.getChipURL() + "\"" + " class = \"chip bet draggable\" style = \"z-index: " + zIndex + "\">";
        zIndex++;
        chipsTwentyCountBet++;
    });
    $.each(betChips[2], function(index, value) {
        chipsFiftyBet += "<img src = \"" + value.getChipURL() + "\"" + " class = \"chip bet draggable\" style = \"z-index: " + zIndex + "\">";
        zIndex++;
        chipsFiftyCountBet++;
    });
    $.each(betChips[3], function(index, value) {
        chipsHundredBet += "<img src = \"" + value.getChipURL() + "\"" + " class = \"chip bet draggable\" style = \"z-index: " + zIndex + "\">";
        zIndex++;
        chipsHundredCountBet++;
    });


    $('#playerTens').html("<img src = 'images/chips/10.png' class='chipT'>" + chipsTen);
    $('#playerTenCount').html('x ' + chipsTenCount);
    $('#playerTwenties').html("<img src = 'images/chips/20.png' class='chipT'>" + chipsTwenty);
    $('#playerTwentyCount').html('x ' + chipsTwentyCount);
    $('#playerFifties').html("<img src = 'images/chips/50.png' class='chipT'>" + chipsFifty);
    $('#playerFiftyCount').html('x ' + chipsFiftyCount);
    $('#playerHundreds').html("<img src = 'images/chips/100.png' class='chipT'>" + chipsHundred);
    $('#playerHundredCount').html('x ' + chipsHundredCount);

    $('#betTens').html("<img src = 'images/chips/10.png' class='chipT'>" + chipsTenBet);
    $('#betTenCount').html('x ' + chipsTenCountBet);
    $('#betTwenties').html("<img src = 'images/chips/20.png' class='chipT'>" + chipsTwentyBet);
    $('#betTwentyCount').html('x ' + chipsTwentyCountBet);
    $('#betFifties').html("<img src = 'images/chips/50.png' class='chipT'>" + chipsFiftyBet);
    $('#betFiftyCount').html('x ' + chipsFiftyCountBet);
    $('#betHundreds').html("<img src = 'images/chips/100.png' class='chipT'>" + chipsHundredBet);
    $('#betHundredCount').html('x ' + chipsHundredCountBet);
}

// Refreshes the playerChips and betChips arrays based on the chips present on the screen
function refreshChipArray() {
    playerChips[0] = [];
    playerChips[1] = [];
    playerChips[2] = [];
    playerChips[3] = [];

    betChips[0] = [];
    betChips[1] = [];
    betChips[2] = [];
    betChips[3] = [];

    $('#playerTens').children('.chip').each(function() {
        addChip(getChipValue($(this)[0].outerHTML));
    });
    $('#playerTwenties').children('.chip').each(function() {
        addChip(getChipValue($(this)[0].outerHTML));
    });
    $('#playerFifties').children('.chip').each(function() {
        addChip(getChipValue($(this)[0].outerHTML));
    });
    $('#playerHundreds').children('.chip').each(function() {
        addChip(getChipValue($(this)[0].outerHTML));
    });
    $('#playerChips').children('.chip').each(function() {
        addChip(getChipValue($(this)[0].outerHTML));
    });

    $('#betTens').children('.chip').each(function() {
        addChipBet(getChipValue($(this)[0].outerHTML));
    });
    $('#betTwenties').children('.chip').each(function() {
        addChipBet(getChipValue($(this)[0].outerHTML));
    });
    $('#betFifties').children('.chip').each(function() {
        addChipBet(getChipValue($(this)[0].outerHTML));
    });
    $('#betHundreds').children('.chip').each(function() {
        addChipBet(getChipValue($(this)[0].outerHTML));
    });
    $('#chipDrop').children('.chip').each(function() {
        addChipBet(getChipValue($(this)[0].outerHTML));
    });
}

function checkSum(target) {
    if (target == "player") {
        if (getHandValue('player') > 21) {
            playerBust = true;
        }
    } else if (target == "dealer") {
        if (getHandValue('dealer') > 21) {
            dealerBust = true;
        }
    }
}

function dealerMove() {
    if (!playerBust && getHandValue('dealer') < 17) {
        dealerCards.push(dealCard());

        $('#statusBarText').html('The dealer hits.');
        refreshCards('dealer');

        return true;
    } else {
        $('#statusBarText').html('Dealer stands.');
        return false;
    }
}

function initializeChips() {
    var tens = [new Chip(10), new Chip(10), new Chip(10), new Chip(10), new Chip(10)];
    var twenties = [new Chip(20), new Chip(20), new Chip(20), new Chip(20), new Chip(20)];
    var fifties = [new Chip(50), new Chip(50), new Chip(50)];
    var hundreds = [new Chip(100), new Chip(100)];
    playerChips[0] = tens;
    playerChips[1] = twenties;
    playerChips[2] = fifties;
    playerChips[3] = hundreds;

    betChips[0] = [];
    betChips[1] = [];
    betChips[2] = [];
    betChips[3] = [];

}

function getChipValue(chipURL) {
    var value = chipURL.substring(23, 26);
    if (value.substring(value.length - 1, value.length) == ".") {
        value = value.substring(0, value.length - 1);
    }
    return parseInt(value);
}

// The following four methods add or remove chips of various values from the playerChips and betChips arrays.

function removeChip(value) {
    if (value == 10) {
        playerChips[0].splice(0, 1);
    } else if (value == 20) {
        playerChips[1].splice(0, 1);
    } else if (value == 50) {
        playerChips[2].splice(0, 1);
    }
    if (value == 100) {
        playerChips[3].splice(0, 1);
    }
}

function addChip(value) {
    if (value == 10) {
        playerChips[0].push(new Chip(10));
    } else if (value == 20) {
        playerChips[1].push(new Chip(20));
    } else if (value == 50) {
        playerChips[2].push(new Chip(50));
    } else if (value == 100) {
        playerChips[3].push(new Chip(100));
    }
}

function removeChipBet(value) {
    if (value == 10) {
        betChips[0].splice(0, 1);
    } else if (value == 20) {
        betChips[1].splice(0, 1);
    } else if (value == 50) {
        betChips[2].splice(0, 1);
    }
    if (value == 100) {
        betChips[3].splice(0, 1);
    }
}

function addChipBet(value) {
    if (value == 10) {
        betChips[0].push(new Chip(10));
    } else if (value == 20) {
        betChips[1].push(new Chip(20));
    } else if (value == 50) {
        betChips[2].push(new Chip(50));
    } else if (value == 100) {
        betChips[3].push(new Chip(100));
    }
}

// Refreshes the money count based on the chips present on the screen in the wallet and bet area.
function updateMoney() {
    playerCash = 0;
    playerBet = 0;

    $('#playerTens').children('.chip').each(function() {
        playerCash += getChipValue($(this)[0].outerHTML);
    });
    $('#playerTwenties').children('.chip').each(function() {
        playerCash += getChipValue($(this)[0].outerHTML);
    });
    $('#playerFifties').children('.chip').each(function() {
        playerCash += getChipValue($(this)[0].outerHTML);
    });
    $('#playerHundreds').children('.chip').each(function() {
        playerCash += getChipValue($(this)[0].outerHTML);
    });
    $('#playerChips').children('.chip').each(function() {
        playerCash += getChipValue($(this)[0].outerHTML);
    });

    $('#betTens').children('.chip').each(function() {
        playerBet += getChipValue($(this)[0].outerHTML);
    });
    $('#betTwenties').children('.chip').each(function() {
        playerBet += getChipValue($(this)[0].outerHTML);
    });
    $('#betFifties').children('.chip').each(function() {
        playerBet += getChipValue($(this)[0].outerHTML);
    });
    $('#betHundreds').children('.chip').each(function() {
        playerBet += getChipValue($(this)[0].outerHTML);
    });
    $('#chipDrop').children('.chip').each(function() {
        playerBet += getChipValue($(this)[0].outerHTML);
    });


    $('#playerCash').html(playerCash);
    $('#playerBet').html(playerBet);

}


// Determines the outcome of the game (winner, loser) based on the card values of the player and dealer
function endGame() {
    dealerCards[0].visible = true;
    refreshCards('dealer');
    if (playerBust) {
        $('#statusBarText').html('The player busted, so the dealer wins!');
        executeBet(false);
    } else if (dealerBust) {
        $('#statusBarText').html('The dealer busted, so the player wins!');
        executeBet(true);
    } else if (getHandValue('player') > getHandValue('dealer')) {
        $('#statusBarText').html('Player wins with a sum of ' + getHandValue('player') + '! Dealer loses.');
        executeBet(true);
    } else if (getHandValue('player') < getHandValue('dealer')) {
        $('#statusBarText').html('Dealer wins with a sum of ' + getHandValue('dealer') + '! Player loses.');
        executeBet(false);
    } else if ((getHandValue('player') == getHandValue('dealer')) && (playerCards.length < dealerCards.length)) {
        $('#statusBarText').html('The hand values are the same, but player wins because he has less cards!');
        executeBet(true);
    } else if ((getHandValue('player') == getHandValue('dealer')) && (playerCards.length > dealerCards.length)) {
        $('#statusBarText').html('The hand values are the same, but dealer wins because he has less cards!');
        executeBet(false);
    } else if ((getHandValue('player') == getHandValue('dealer'))) {
        $('#statusBarText').html("It's a tie, but dealer wins because of dealer privilege.");
        executeBet(false);
    }

    $('#hit').hide();
    $('#stand').hide();
    $('#double').hide();
    if (playerCash > 0) {
        $('#playAgain').show();
    } else {
        // If player has run out of money, the game provides an option to restart fully.
        $('#gameOverBG').fadeIn(1000);
        $('#playBankrupt').fadeIn(1000);
        $('#statusBarText').append(" You have gone bankrupt. Game over!");
    }

}

// Redistributes the money based on the outcome of the game.
function executeBet(win) {
    if (!win) {
        betChips[0] = [];
        betChips[1] = [];
        betChips[2] = [];
        betChips[3] = [];
        refreshChipImage();
        updateMoney();
    } else {
        $('#betTens').children('.chip').each(function() {
            for (var i = 0; i < 2; i++) {
                addChip(getChipValue($(this)[0].outerHTML));
            }
            removeChipBet(getChipValue($(this)[0].outerHTML));
        });
        $('#betTwenties').children('.chip').each(function() {
            for (var i = 0; i < 2; i++) {
                addChip(getChipValue($(this)[0].outerHTML));
            }
            removeChipBet(getChipValue($(this)[0].outerHTML));
        });
        $('#betFifties').children('.chip').each(function() {
            for (var i = 0; i < 2; i++) {
                addChip(getChipValue($(this)[0].outerHTML));
            }
            removeChipBet(getChipValue($(this)[0].outerHTML));
        });
        $('#betHundreds').children('.chip').each(function() {
            for (var i = 0; i < 2; i++) {
                addChip(getChipValue($(this)[0].outerHTML));
            }
            removeChipBet(getChipValue($(this)[0].outerHTML));
        });

        refreshChipImage();
        updateMoney();
    }
}
