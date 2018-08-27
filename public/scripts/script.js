(function(){function r(e,n,t){function o(i,f){if(!n[i]){if(!e[i]){var c="function"==typeof require&&require;if(!f&&c)return c(i,!0);if(u)return u(i,!0);var a=new Error("Cannot find module '"+i+"'");throw a.code="MODULE_NOT_FOUND",a}var p=n[i]={exports:{}};e[i][0].call(p.exports,function(r){var n=e[i][1][r];return o(n||r)},p,p.exports,r,e,n,t)}return n[i].exports}for(var u="function"==typeof require&&require,i=0;i<t.length;i++)o(t[i]);return o}return r})()({1:[function(require,module,exports){
'use strict';

// list of constants
var app = {};
var chars = 'aaaaabbccdddeeeeeeefgghhiiiiiijklllmmnnoooooprrrrsssttttuuuvwxyz';
var answer = '';
var answerList = new Set();
var countdown = void 0;
var timerDisplay = document.querySelector('.timeLeft');

app.url = 'https://www.dictionaryapi.com/api/v1/references/collegiate/xml/';
app.key = '8c5c85a3-ffa3-4f09-b901-7db8209015dc';

// RANDOMLY GENERATE LETTERS ON A 4X4 GRID WHEN PRESSING 'START GAME'

app.switchScreens = function () {
    $('.start').on('click touchstart', function (e) {
        e.preventDefault();
        window.location = "board.html";
    }); // end of start event function
}; // end of switchScreens function

app.getBoard = function () {
    // write a for loop to iterate over each box on the board
    for (var i = 1; i <= 16; i++) {
        // generate random letters
        var ranLet = chars[Math.floor(Math.random() * 63)];
        // append them to the board
        $('.' + i).append('<a href="#" class="letter"><p>' + ranLet + '</p></a>');
    };
    app.timer(90); // 90 seconds on the timer
}; //end of getBoard

app.events = function () {
    //EVENTS FUNCTION ONCE THE BOARD IS MADE


    // DISPLAY THE ANSWER

    $('.box').on('click touchstart', '.letter', function (e) {
        e.preventDefault(); // prevent default
        $(this).addClass('selected');
        var activeLetter = $(this).find('p').text();
        answer += activeLetter;
        $('.userAnswer').html('<p>' + answer + '</p>');

        // STRETCH GOAL 

        // upon first click, make everything 'unclickable'
        $('.letter').addClass('unclickable');

        // selectedBoxNum is equal to the *number* class of the box div
        var selectedBoxNum = parseInt($(this).parent().attr('class').slice(-2));

        // if statements for removing 'unclickable' class from boxes in first column, middle columns and last column
        for (var i = 1; i <= 16; i++) {
            if ($('.' + selectedBoxNum).hasClass('firstColumn')) {
                //firstColumn
                if (i === selectedBoxNum + 1) {
                    $('.' + i + ' .letter').removeClass('unclickable');
                } else if (i === selectedBoxNum - 3) {
                    $('.' + i + ' .letter').removeClass('unclickable');
                } else if (i === selectedBoxNum + 4 || i === selectedBoxNum - 4) {
                    $('.' + i + ' .letter').removeClass('unclickable');
                } else if (i === selectedBoxNum + 5) {
                    $('.' + i + ' .letter').removeClass('unclickable');
                }
            } //end of firstColumn
            else if ($('.' + selectedBoxNum).hasClass('lastColumn')) {
                    //lastColumn
                    if (i === selectedBoxNum - 1) {
                        $('.' + i + ' .letter').removeClass('unclickable');
                    } else if (i === selectedBoxNum + 3) {
                        $('.' + i + ' .letter').removeClass('unclickable');
                    } else if (i === selectedBoxNum + 4 || i === selectedBoxNum - 4) {
                        $('.' + i + ' .letter').removeClass('unclickable');
                    } else if (i === selectedBoxNum - 5) {
                        $('.' + i + ' .letter').removeClass('unclickable');
                    }
                } //end of lastColumn
                else {
                        //middleColumn
                        if (i === selectedBoxNum + 1 || i === selectedBoxNum - 1) {
                            $('.' + i + ' .letter').removeClass('unclickable');
                        } else if (i === selectedBoxNum + 3 || i === selectedBoxNum - 3) {
                            $('.' + i + ' .letter').removeClass('unclickable');
                        } else if (i === selectedBoxNum + 4 || i === selectedBoxNum - 4) {
                            $('.' + i + ' .letter').removeClass('unclickable');
                        } else if (i === selectedBoxNum + 5 || i === selectedBoxNum - 5) {
                            $('.' + i + ' .letter').removeClass('unclickable');
                        }
                    } //end of middleColumn
        } //end of for loop
    }); //end of making the word


    //preventing default action on unclickable
    $('.box').on('click touchstart', '.unclickable', function (e) {
        e.preventDefault();
    });

    // keep the enter key from repeating the letter 
    $('.box').on('keydown', '.letter', function (e) {
        e.preventDefault(); // prevent default
    });

    // CLEAR THE USER SELECTIONS

    $('.clear').on('click touchstart', function (e) {
        e.preventDefault(); //prevent default
        $('.userAnswer').empty();
        answer = '';
        $('.letter').removeClass('selected unclickable');
        $('.clear').addClass('');
        setTimeout(function () {
            $('.submitButton').removeClass('');
        }, 1000);
    }); // end of clear


    // COMPARING TO THE API

    $('form').on('submit', function (e) {
        e.preventDefault();
        $('.displayedAnswers').empty();

        var submitAnswer = $('.userAnswer').text();

        var getAPI = function getAPI(query) {
            $.ajax({
                url: 'https://proxy.hackeryou.com',
                method: 'GET',
                dataResponse: 'json',
                paramsSerializer: function paramsSerializer(params) {
                    return Qs.stringify(params, { arrayFormat: 'brackets' });
                },
                data: {
                    reqUrl: app.url,
                    params: {
                        'key': app.key,
                        'word': query
                    },
                    xmlToJSON: true,
                    useCache: false // end of ajax
                } }).then(function (resp) {
                console.log(resp);

                var word = resp.entry_list.entry;

                if (resp.entry_list.suggestion) {
                    app.wrongAlert();
                    // console.log('suggestion');
                } // end of suggestion
                else if (word) {
                        // start of if (word)
                        if (word[0]) {
                            //is array
                            if (word[0].fl === "noun" || word[0].fl === "verb" || word[0].fl === "adjective" || word[0].fl === "adverb" || word[0].fl === "pronoun" || word[0].fl === "preposition" || word[0].fl === "conjunction" || word[0].fl === "determiner" || word[0].fl === "pronoun, plural in construction") {
                                // array word types
                                app.duplicateAnswer(word[0].ew);
                                answerList.add(word[0].ew);
                                app.findWhiteSpace(word[0].ew);

                                if (word[0].ew === word[0].ew.toUpperCase() || word[0].ew === word[0].ew.charAt(0).toUpperCase() + word[0].ew.slice(1)) {
                                    // word is uppercase abbrev OR capitalized
                                    answerList.delete(word[0].ew);
                                    app.wrongAlert();
                                } //end of word is uppercase abbrev OR capitalized
                            } //end of array word types
                            else if (word[0].cx.ct || word[0].cx[0].ct) {
                                    //targeting past tense words for arrays
                                    app.duplicateAnswer(word[0].ew);
                                    answerList.add(word[0].ew);
                                    app.findWhiteSpace(word[0].ew);
                                } //end of past tense words for arrays
                                else {
                                        // unaccepted word type for arrays
                                        app.wrongAlert();
                                    } //end of unaccepted word type for arrays

                        } // end of is array
                        else {
                                //is object
                                if (word.fl === "noun" || word.fl === "verb" || word.fl === "adjective" || word.fl === "adverb" || word.fl === "pronoun" || word.fl === "preposition" || word.fl === "conjunction" || word.fl === "determiner" || word.fl === "pronoun, plural in construction") {
                                    // object word types 
                                    app.duplicateAnswer(word.ew);
                                    answerList.add(word.ew);
                                    app.findWhiteSpace(word.ew);

                                    if (word.ew === word.ew.toUpperCase() || word.ew === word.ew.charAt(0).toUpperCase() + word.ew.slice(1)) {
                                        // word is uppercase abbrev OR capitalized
                                        answerList.delete(word.ew);
                                        app.wrongAlert();
                                    } //end of word is uppercase abbrev OR capitalized
                                    else if (word.et === "by shortening & alteration") {
                                            //shortform word
                                            answerList.delete(word.ew);
                                            app.wrongAlert();
                                        } // end of shortform word like "helo"
                                } //end of object word types
                                else if (word.cx.ct || word.cx[0].ct) {
                                        //targeting past tense words for objects 
                                        app.duplicateAnswer(word.ew);
                                        answerList.add(word.ew);
                                        app.findWhiteSpace(word.ew);
                                    } //end of past tense words for objects
                                    else {
                                            // unaccepted word type for objects
                                            app.wrongAlert();
                                        } //end of unaccepted word type for objects
                            } //end of is object
                    } // end of if (word)
                    else {
                            //not a word
                            app.wrongAlert();
                        }; //end of if statements!!

                $('.userAnswer').empty();
                answer = "";
                $('.letter').removeClass('selected');
                console.log(answerList);

                app.displayAnswers();
                app.changeScore();
                $('.letter').removeClass('unclickable');
            }); // end of then
        }; // end of getAPI function
        console.log(getAPI(submitAnswer));
    }); // end of form submit
}; // end of event function


// APPEND ANSWER TO THE DISPLAYEDANSWERS DIV

app.displayAnswers = function () {
    answerList.forEach(function (word) {
        // $('.displayedAnswers').empty();
        $('.displayedAnswers').append('<li>' + word + '</li>');
    });
}; // end of displayAnswers fucntion


// IF DUPLICATE, MAKE THE SUBMIT BUTTON SHOW THAT THEY ARE WRONG

app.duplicateAnswer = function (word) {
    if (answerList.has(word)) {
        app.wrongAlert();
    };
}; // end of duplicateAnswer function

app.wrongAlert = function () {
    $('.submitButton').removeClass('pulse infinite').addClass('wrong wobble');
    setTimeout(function () {
        $('.submitButton').removeClass('wrong wobble').addClass('infinite pulse');
    }, 1000);
    $('.letter.selected').addClass('wrong');
    setTimeout(function () {
        $('.letter').removeClass('wrong');
    }, 1000);
};

// SCORE WILL BE THE SAME AS THE NUMBER OF ITEMS ON THE SET

app.changeScore = function () {
    var score = answerList.size;
    $('.score').html('' + score);
    $('.scoreBoard').addClass('grow');
    setTimeout(function () {
        $('.scoreBoard').removeClass('grow');
    }, 500);
};

// if API result has a space in it, don't show it and count it as wrong

app.findWhiteSpace = function () {
    answerList.forEach(function (word) {
        var n = word.includes(" ");
        if (word = n) {
            app.wrongAlert();
            answerList.delete(word);
        };
    }); // end of forEach loop
}; // end of findWhiteSpace


// TIMER

app.timer = function (seconds) {
    var now = Date.now();
    var then = now + seconds * 1000;
    displayTimeLeft(seconds);
    countdown = setInterval(function () {
        var secondsLeft = (then - Date.now()) / 1000;
        if (secondsLeft <= 0) {
            clearInterval(countdown);
            app.gameOver();
            return;
        }
        displayTimeLeft(secondsLeft);
    }, 1000);
}; // end of timer function

// DISPLAY THE TIME

function displayTimeLeft(seconds) {
    var minutes = Math.floor(seconds / 60);
    var remainderSeconds = Math.floor(seconds % 60);
    var display = minutes + ':' + remainderSeconds;
    if (remainderSeconds < 10) {
        remainderSeconds = "0" + remainderSeconds;
        display = minutes + ':' + remainderSeconds;
    }
    timerDisplay.textContent = display;
} // end of displaying the time

// GAME OVER OVERLAY
app.gameOver = function () {
    $('.overlay').removeClass('hide');
    $('.playAgain').on('click touchstart', function (e) {
        e.preventDefault();
        location.reload();
        $('.overlay').addClass('hide');
    }); // end of start event function
};

// initialize function
app.init = function () {
    app.switchScreens();
    app.getBoard();
    app.events();
};

// run initialize function through the doc ready function (on page load)
$(function () {
    app.init();
});

},{}]},{},[1])
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm5vZGVfbW9kdWxlcy9icm93c2VyLXBhY2svX3ByZWx1ZGUuanMiLCJkZXYvc2NyaXB0cy9zY3JpcHQuanMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7OztBQ0FBO0FBQ0EsSUFBTSxNQUFNLEVBQVo7QUFDQSxJQUFNLFFBQVEsa0VBQWQ7QUFDQSxJQUFJLFNBQVMsRUFBYjtBQUNBLElBQU0sYUFBYSxJQUFJLEdBQUosRUFBbkI7QUFDQSxJQUFJLGtCQUFKO0FBQ0EsSUFBTSxlQUFlLFNBQVMsYUFBVCxDQUF1QixXQUF2QixDQUFyQjs7QUFFQSxJQUFJLEdBQUosR0FBVSxpRUFBVjtBQUNBLElBQUksR0FBSixHQUFVLHNDQUFWOztBQUdBOztBQUVBLElBQUksYUFBSixHQUFvQixZQUFXO0FBQzNCLE1BQUUsUUFBRixFQUFZLEVBQVosQ0FBZSxrQkFBZixFQUFtQyxVQUFTLENBQVQsRUFBWTtBQUMzQyxVQUFFLGNBQUY7QUFDQSxlQUFPLFFBQVAsR0FBa0IsWUFBbEI7QUFDSCxLQUhELEVBRDJCLENBSXZCO0FBQ1AsQ0FMRCxDLENBS0c7O0FBRUgsSUFBSSxRQUFKLEdBQWUsWUFBVTtBQUNqQjtBQUNBLFNBQUssSUFBSSxJQUFJLENBQWIsRUFBZ0IsS0FBSyxFQUFyQixFQUF5QixHQUF6QixFQUE4QjtBQUMxQjtBQUNBLFlBQU0sU0FBUyxNQUFNLEtBQUssS0FBTCxDQUFXLEtBQUssTUFBTCxLQUFnQixFQUEzQixDQUFOLENBQWY7QUFDQTtBQUNBLGdCQUFNLENBQU4sRUFBVyxNQUFYLG9DQUFtRCxNQUFuRDtBQUNIO0FBQ0QsUUFBSSxLQUFKLENBQVUsRUFBVixFQVJpQixDQVFGO0FBQ3RCLENBVEQsQyxDQVNHOztBQUVILElBQUksTUFBSixHQUFhLFlBQVc7QUFBRTs7O0FBR3RCOztBQUVBLE1BQUUsTUFBRixFQUFVLEVBQVYsQ0FBYSxrQkFBYixFQUFpQyxTQUFqQyxFQUE0QyxVQUFTLENBQVQsRUFBWTtBQUNwRCxVQUFFLGNBQUYsR0FEb0QsQ0FDaEM7QUFDcEIsVUFBRSxJQUFGLEVBQVEsUUFBUixDQUFpQixVQUFqQjtBQUNBLFlBQUksZUFBZSxFQUFFLElBQUYsRUFBUSxJQUFSLENBQWEsR0FBYixFQUFrQixJQUFsQixFQUFuQjtBQUNBLGtCQUFVLFlBQVY7QUFDQSxVQUFFLGFBQUYsRUFBaUIsSUFBakIsU0FBNEIsTUFBNUI7O0FBRUE7O0FBRUE7QUFDQSxVQUFFLFNBQUYsRUFBYSxRQUFiLENBQXNCLGFBQXRCOztBQUVBO0FBQ0EsWUFBSSxpQkFBaUIsU0FBVSxFQUFFLElBQUYsRUFBUSxNQUFSLEVBQUQsQ0FBbUIsSUFBbkIsQ0FBd0IsT0FBeEIsRUFBaUMsS0FBakMsQ0FBdUMsQ0FBQyxDQUF4QyxDQUFULENBQXJCOztBQUVBO0FBQ0EsYUFBSSxJQUFJLElBQUksQ0FBWixFQUFlLEtBQUssRUFBcEIsRUFBd0IsR0FBeEIsRUFBNkI7QUFDekIsZ0JBQUksUUFBTSxjQUFOLEVBQXdCLFFBQXhCLENBQWlDLGFBQWpDLENBQUosRUFBcUQ7QUFBRTtBQUNuRCxvQkFBSSxNQUFNLGlCQUFpQixDQUEzQixFQUE4QjtBQUMxQiw0QkFBTSxDQUFOLGVBQW1CLFdBQW5CLENBQStCLGFBQS9CO0FBQ0gsaUJBRkQsTUFFTyxJQUFJLE1BQU0saUJBQWlCLENBQTNCLEVBQThCO0FBQ2pDLDRCQUFNLENBQU4sZUFBbUIsV0FBbkIsQ0FBK0IsYUFBL0I7QUFDSCxpQkFGTSxNQUVBLElBQUksTUFBTSxpQkFBaUIsQ0FBdkIsSUFBNEIsTUFBTSxpQkFBaUIsQ0FBdkQsRUFBMEQ7QUFDN0QsNEJBQU0sQ0FBTixlQUFtQixXQUFuQixDQUErQixhQUEvQjtBQUNILGlCQUZNLE1BRUEsSUFBSSxNQUFNLGlCQUFpQixDQUEzQixFQUE4QjtBQUNqQyw0QkFBTSxDQUFOLGVBQW1CLFdBQW5CLENBQStCLGFBQS9CO0FBQ0g7QUFDSixhQVZELENBVUU7QUFWRixpQkFXSyxJQUFJLFFBQU0sY0FBTixFQUF3QixRQUF4QixDQUFpQyxZQUFqQyxDQUFKLEVBQW1EO0FBQUU7QUFDdEQsd0JBQUksTUFBTSxpQkFBaUIsQ0FBM0IsRUFBOEI7QUFDMUIsZ0NBQU0sQ0FBTixlQUFtQixXQUFuQixDQUErQixhQUEvQjtBQUNILHFCQUZELE1BRU8sSUFBSSxNQUFNLGlCQUFpQixDQUEzQixFQUE4QjtBQUNqQyxnQ0FBTSxDQUFOLGVBQW1CLFdBQW5CLENBQStCLGFBQS9CO0FBQ0gscUJBRk0sTUFFQSxJQUFJLE1BQU0saUJBQWlCLENBQXZCLElBQTRCLE1BQU0saUJBQWlCLENBQXZELEVBQTBEO0FBQzdELGdDQUFNLENBQU4sZUFBbUIsV0FBbkIsQ0FBK0IsYUFBL0I7QUFDSCxxQkFGTSxNQUVBLElBQUksTUFBTSxpQkFBaUIsQ0FBM0IsRUFBOEI7QUFDakMsZ0NBQU0sQ0FBTixlQUFtQixXQUFuQixDQUErQixhQUEvQjtBQUNIO0FBQ0osaUJBVkksQ0FVSDtBQVZHLHFCQVdBO0FBQUU7QUFDSCw0QkFBSSxNQUFNLGlCQUFpQixDQUF2QixJQUE0QixNQUFNLGlCQUFpQixDQUF2RCxFQUEwRDtBQUN0RCxvQ0FBTSxDQUFOLGVBQW1CLFdBQW5CLENBQStCLGFBQS9CO0FBQ0gseUJBRkQsTUFFTyxJQUFJLE1BQU0saUJBQWlCLENBQXZCLElBQTRCLE1BQU0saUJBQWlCLENBQXZELEVBQTBEO0FBQzdELG9DQUFNLENBQU4sZUFBbUIsV0FBbkIsQ0FBK0IsYUFBL0I7QUFDSCx5QkFGTSxNQUVBLElBQUksTUFBTSxpQkFBaUIsQ0FBdkIsSUFBNEIsTUFBTSxpQkFBaUIsQ0FBdkQsRUFBMEQ7QUFDN0Qsb0NBQU0sQ0FBTixlQUFtQixXQUFuQixDQUErQixhQUEvQjtBQUNILHlCQUZNLE1BRUEsSUFBSSxNQUFNLGlCQUFpQixDQUF2QixJQUE0QixNQUFNLGlCQUFpQixDQUF2RCxFQUEwRDtBQUM3RCxvQ0FBTSxDQUFOLGVBQW1CLFdBQW5CLENBQStCLGFBQS9CO0FBQ0g7QUFDSixxQkFqQ3dCLENBaUN2QjtBQUNMLFNBbERtRCxDQWtEbEQ7QUFDTCxLQW5ERCxFQUxvQixDQXdEaEI7OztBQUdKO0FBQ0EsTUFBRSxNQUFGLEVBQVUsRUFBVixDQUFhLGtCQUFiLEVBQWlDLGNBQWpDLEVBQWlELFVBQVMsQ0FBVCxFQUFZO0FBQ3pELFVBQUUsY0FBRjtBQUNILEtBRkQ7O0FBSUE7QUFDQSxNQUFFLE1BQUYsRUFBVSxFQUFWLENBQWEsU0FBYixFQUF3QixTQUF4QixFQUFtQyxVQUFVLENBQVYsRUFBYTtBQUM1QyxVQUFFLGNBQUYsR0FENEMsQ0FDeEI7QUFDdkIsS0FGRDs7QUFLQTs7QUFFQSxNQUFFLFFBQUYsRUFBWSxFQUFaLENBQWUsa0JBQWYsRUFBbUMsVUFBUyxDQUFULEVBQVk7QUFDM0MsVUFBRSxjQUFGLEdBRDJDLENBQ3ZCO0FBQ3BCLFVBQUUsYUFBRixFQUFpQixLQUFqQjtBQUNBLGlCQUFTLEVBQVQ7QUFDQSxVQUFFLFNBQUYsRUFBYSxXQUFiLENBQXlCLHNCQUF6QjtBQUNBLFVBQUUsUUFBRixFQUFZLFFBQVosQ0FBcUIsRUFBckI7QUFDQSxtQkFBVyxZQUFNO0FBQ2IsY0FBRSxlQUFGLEVBQW1CLFdBQW5CLENBQStCLEVBQS9CO0FBQ0gsU0FGRCxFQUVHLElBRkg7QUFHSCxLQVRELEVBeEVvQixDQWlGaEI7OztBQUdKOztBQUVBLE1BQUUsTUFBRixFQUFVLEVBQVYsQ0FBYSxRQUFiLEVBQXVCLFVBQVMsQ0FBVCxFQUFZO0FBQy9CLFVBQUUsY0FBRjtBQUNBLFVBQUUsbUJBQUYsRUFBdUIsS0FBdkI7O0FBRUEsWUFBTSxlQUFlLEVBQUUsYUFBRixFQUFpQixJQUFqQixFQUFyQjs7QUFFQSxZQUFNLFNBQVMsU0FBVCxNQUFTLENBQVMsS0FBVCxFQUFnQjtBQUMzQixjQUFFLElBQUYsQ0FBTztBQUNILHFCQUFLLDZCQURGO0FBRUgsd0JBQVEsS0FGTDtBQUdILDhCQUFjLE1BSFg7QUFJSCxrQ0FBa0IsMEJBQVUsTUFBVixFQUFrQjtBQUNoQywyQkFBTyxHQUFHLFNBQUgsQ0FBYSxNQUFiLEVBQXFCLEVBQUUsYUFBYSxVQUFmLEVBQXJCLENBQVA7QUFDSCxpQkFORTtBQU9ILHNCQUFNO0FBQ0YsNEJBQVEsSUFBSSxHQURWO0FBRUYsNEJBQVE7QUFDSiwrQkFBTyxJQUFJLEdBRFA7QUFFSixnQ0FBUTtBQUZKLHFCQUZOO0FBTUYsK0JBQVcsSUFOVDtBQU9GLDhCQUFVLEtBUFIsQ0FRSjtBQVJJLGlCQVBILEVBQVAsRUFnQkcsSUFoQkgsQ0FnQlEsZ0JBQVE7QUFDWix3QkFBUSxHQUFSLENBQVksSUFBWjs7QUFFQSxvQkFBTSxPQUFPLEtBQUssVUFBTCxDQUFnQixLQUE3Qjs7QUFFQSxvQkFBSSxLQUFLLFVBQUwsQ0FBZ0IsVUFBcEIsRUFBZ0M7QUFDNUIsd0JBQUksVUFBSjtBQUNBO0FBRUgsaUJBSkQsQ0FJRTtBQUpGLHFCQUtLLElBQUksSUFBSixFQUFVO0FBQUU7QUFDYiw0QkFBSSxLQUFLLENBQUwsQ0FBSixFQUFhO0FBQUU7QUFDWCxnQ0FBSSxLQUFLLENBQUwsRUFBUSxFQUFSLEtBQWUsTUFBZixJQUF5QixLQUFLLENBQUwsRUFBUSxFQUFSLEtBQWUsTUFBeEMsSUFBa0QsS0FBSyxDQUFMLEVBQVEsRUFBUixLQUFlLFdBQWpFLElBQWdGLEtBQUssQ0FBTCxFQUFRLEVBQVIsS0FBZSxRQUEvRixJQUEyRyxLQUFLLENBQUwsRUFBUSxFQUFSLEtBQWUsU0FBMUgsSUFBdUksS0FBSyxDQUFMLEVBQVEsRUFBUixLQUFlLGFBQXRKLElBQXVLLEtBQUssQ0FBTCxFQUFRLEVBQVIsS0FBZSxhQUF0TCxJQUF1TSxLQUFLLENBQUwsRUFBUSxFQUFSLEtBQWUsWUFBdE4sSUFBc08sS0FBSyxDQUFMLEVBQVEsRUFBUixLQUFlLGlDQUF6UCxFQUE0UjtBQUFFO0FBQzlSLG9DQUFJLGVBQUosQ0FBb0IsS0FBSyxDQUFMLEVBQVEsRUFBNUI7QUFDQSwyQ0FBVyxHQUFYLENBQWUsS0FBSyxDQUFMLEVBQVEsRUFBdkI7QUFDQSxvQ0FBSSxjQUFKLENBQW1CLEtBQUssQ0FBTCxFQUFRLEVBQTNCOztBQUVJLG9DQUFJLEtBQUssQ0FBTCxFQUFRLEVBQVIsS0FBZSxLQUFLLENBQUwsRUFBUSxFQUFSLENBQVcsV0FBWCxFQUFmLElBQTJDLEtBQUssQ0FBTCxFQUFRLEVBQVIsS0FBZ0IsS0FBSyxDQUFMLEVBQVEsRUFBVCxDQUFhLE1BQWIsQ0FBb0IsQ0FBcEIsRUFBdUIsV0FBdkIsS0FBd0MsS0FBSyxDQUFMLEVBQVEsRUFBVCxDQUFhLEtBQWIsQ0FBbUIsQ0FBbkIsQ0FBckcsRUFBNEg7QUFBRTtBQUMxSCwrQ0FBVyxNQUFYLENBQWtCLEtBQUssQ0FBTCxFQUFRLEVBQTFCO0FBQ0Esd0NBQUksVUFBSjtBQUNILGlDQVJ1UixDQVF0UjtBQUVMLDZCQVZELENBVUU7QUFWRixpQ0FXSyxJQUFJLEtBQUssQ0FBTCxFQUFRLEVBQVIsQ0FBVyxFQUFYLElBQWlCLEtBQUssQ0FBTCxFQUFRLEVBQVIsQ0FBVyxDQUFYLEVBQWMsRUFBbkMsRUFBdUM7QUFBRTtBQUMxQyx3Q0FBSSxlQUFKLENBQW9CLEtBQUssQ0FBTCxFQUFRLEVBQTVCO0FBQ0EsK0NBQVcsR0FBWCxDQUFlLEtBQUssQ0FBTCxFQUFRLEVBQXZCO0FBQ0Esd0NBQUksY0FBSixDQUFtQixLQUFLLENBQUwsRUFBUSxFQUEzQjtBQUNILGlDQUpJLENBSUg7QUFKRyxxQ0FLQTtBQUFFO0FBQ0gsNENBQUksVUFBSjtBQUNILHFDQW5CUSxDQW1CUDs7QUFHTCx5QkF0QkQsQ0FzQkU7QUF0QkYsNkJBdUJLO0FBQUU7QUFDSCxvQ0FBSSxLQUFLLEVBQUwsS0FBWSxNQUFaLElBQXNCLEtBQUssRUFBTCxLQUFZLE1BQWxDLElBQTRDLEtBQUssRUFBTCxLQUFZLFdBQXhELElBQXVFLEtBQUssRUFBTCxLQUFZLFFBQW5GLElBQStGLEtBQUssRUFBTCxLQUFZLFNBQTNHLElBQXdILEtBQUssRUFBTCxLQUFZLGFBQXBJLElBQXFKLEtBQUssRUFBTCxLQUFZLGFBQWpLLElBQWtMLEtBQUssRUFBTCxLQUFZLFlBQTlMLElBQThNLEtBQUssRUFBTCxLQUFZLGlDQUE5TixFQUFpUTtBQUFFO0FBQ25RLHdDQUFJLGVBQUosQ0FBb0IsS0FBSyxFQUF6QjtBQUNBLCtDQUFXLEdBQVgsQ0FBZSxLQUFLLEVBQXBCO0FBQ0Esd0NBQUksY0FBSixDQUFtQixLQUFLLEVBQXhCOztBQUVJLHdDQUFJLEtBQUssRUFBTCxLQUFZLEtBQUssRUFBTCxDQUFRLFdBQVIsRUFBWixJQUFxQyxLQUFLLEVBQUwsS0FBYSxLQUFLLEVBQU4sQ0FBVSxNQUFWLENBQWlCLENBQWpCLEVBQW9CLFdBQXBCLEtBQXFDLEtBQUssRUFBTixDQUFVLEtBQVYsQ0FBZ0IsQ0FBaEIsQ0FBekYsRUFBNkc7QUFBRTtBQUMzRyxtREFBVyxNQUFYLENBQWtCLEtBQUssRUFBdkI7QUFDQSw0Q0FBSSxVQUFKO0FBQ0gscUNBSEQsQ0FHRTtBQUhGLHlDQUlLLElBQUksS0FBSyxFQUFMLEtBQVksNEJBQWhCLEVBQThDO0FBQUU7QUFDakQsdURBQVcsTUFBWCxDQUFrQixLQUFLLEVBQXZCO0FBQ0EsZ0RBQUksVUFBSjtBQUNILHlDQVo0UCxDQVkzUDtBQUVMLGlDQWRELENBY0U7QUFkRixxQ0FlSyxJQUFJLEtBQUssRUFBTCxDQUFRLEVBQVIsSUFBYyxLQUFLLEVBQUwsQ0FBUSxDQUFSLEVBQVcsRUFBN0IsRUFBaUM7QUFBRTtBQUNwQyw0Q0FBSSxlQUFKLENBQW9CLEtBQUssRUFBekI7QUFDQSxtREFBVyxHQUFYLENBQWUsS0FBSyxFQUFwQjtBQUNBLDRDQUFJLGNBQUosQ0FBbUIsS0FBSyxFQUF4QjtBQUNILHFDQUpJLENBSUg7QUFKRyx5Q0FLQTtBQUFFO0FBQ0gsZ0RBQUksVUFBSjtBQUNILHlDQXZCQSxDQXVCQztBQUVMLDZCQWpEVSxDQWlEVDtBQUVMLHFCQW5ESSxDQW1ESDtBQW5ERyx5QkFvREE7QUFBRTtBQUNILGdDQUFJLFVBQUo7QUFFSCwwQkFqRVcsQ0FpRVQ7O0FBRUgsa0JBQUUsYUFBRixFQUFpQixLQUFqQjtBQUNBLHlCQUFTLEVBQVQ7QUFDQSxrQkFBRSxTQUFGLEVBQWEsV0FBYixDQUF5QixVQUF6QjtBQUNBLHdCQUFRLEdBQVIsQ0FBWSxVQUFaOztBQUVBLG9CQUFJLGNBQUo7QUFDQSxvQkFBSSxXQUFKO0FBQ0Esa0JBQUUsU0FBRixFQUFhLFdBQWIsQ0FBeUIsYUFBekI7QUFFSCxhQTVGRCxFQUQyQixDQTZGdkI7QUFFUCxTQS9GRCxDQU4rQixDQXFHNUI7QUFDSCxnQkFBUSxHQUFSLENBQVksT0FBTyxZQUFQLENBQVo7QUFFSCxLQXhHRCxFQXRGb0IsQ0E4TGY7QUFFUixDQWhNRCxDLENBZ01HOzs7QUFHSDs7QUFFQSxJQUFJLGNBQUosR0FBcUIsWUFBVztBQUM1QixlQUFXLE9BQVgsQ0FBbUIsVUFBUyxJQUFULEVBQWM7QUFDN0I7QUFDQSxVQUFFLG1CQUFGLEVBQXVCLE1BQXZCLFVBQXFDLElBQXJDO0FBQ0gsS0FIRDtBQUlILENBTEQsQyxDQUtHOzs7QUFHSDs7QUFFQSxJQUFJLGVBQUosR0FBc0IsVUFBUyxJQUFULEVBQWU7QUFDakMsUUFBSSxXQUFXLEdBQVgsQ0FBZSxJQUFmLENBQUosRUFBMEI7QUFDdEIsWUFBSSxVQUFKO0FBQ0g7QUFDSixDQUpELEMsQ0FJRzs7QUFFSCxJQUFJLFVBQUosR0FBaUIsWUFBVztBQUN4QixNQUFFLGVBQUYsRUFBbUIsV0FBbkIsQ0FBK0IsZ0JBQS9CLEVBQWlELFFBQWpELENBQTBELGNBQTFEO0FBQ0EsZUFBVyxZQUFNO0FBQ2IsVUFBRSxlQUFGLEVBQW1CLFdBQW5CLENBQStCLGNBQS9CLEVBQStDLFFBQS9DLENBQXdELGdCQUF4RDtBQUNILEtBRkQsRUFFRyxJQUZIO0FBR0EsTUFBRSxrQkFBRixFQUFzQixRQUF0QixDQUErQixPQUEvQjtBQUNBLGVBQVcsWUFBTTtBQUNiLFVBQUUsU0FBRixFQUFhLFdBQWIsQ0FBeUIsT0FBekI7QUFDSCxLQUZELEVBRUcsSUFGSDtBQUdILENBVEQ7O0FBWUE7O0FBRUEsSUFBSSxXQUFKLEdBQWtCLFlBQVc7QUFDekIsUUFBSSxRQUFRLFdBQVcsSUFBdkI7QUFDQSxNQUFFLFFBQUYsRUFBWSxJQUFaLE1BQW9CLEtBQXBCO0FBQ0EsTUFBRSxhQUFGLEVBQWlCLFFBQWpCLENBQTBCLE1BQTFCO0FBQ0EsZUFBVyxZQUFNO0FBQ2IsVUFBRSxhQUFGLEVBQWlCLFdBQWpCLENBQTZCLE1BQTdCO0FBQ0gsS0FGRCxFQUVHLEdBRkg7QUFHSCxDQVBEOztBQVVBOztBQUVBLElBQUksY0FBSixHQUFxQixZQUFZO0FBQzdCLGVBQVcsT0FBWCxDQUFtQixVQUFVLElBQVYsRUFBZ0I7QUFDL0IsWUFBSSxJQUFJLEtBQUssUUFBTCxDQUFjLEdBQWQsQ0FBUjtBQUNBLFlBQUksT0FBTyxDQUFYLEVBQWM7QUFDVixnQkFBSSxVQUFKO0FBQ0EsdUJBQVcsTUFBWCxDQUFrQixJQUFsQjtBQUNIO0FBQ0osS0FORCxFQUQ2QixDQU96QjtBQUNQLENBUkQsQyxDQVFHOzs7QUFHSDs7QUFFQSxJQUFJLEtBQUosR0FBWSxVQUFTLE9BQVQsRUFBa0I7QUFDMUIsUUFBTSxNQUFNLEtBQUssR0FBTCxFQUFaO0FBQ0EsUUFBTSxPQUFPLE1BQU0sVUFBVSxJQUE3QjtBQUNBLG9CQUFnQixPQUFoQjtBQUNBLGdCQUFZLFlBQVksWUFBTTtBQUMxQixZQUFJLGNBQWMsQ0FBQyxPQUFPLEtBQUssR0FBTCxFQUFSLElBQXNCLElBQXhDO0FBQ0EsWUFBRyxlQUFlLENBQWxCLEVBQXFCO0FBQ2pCLDBCQUFjLFNBQWQ7QUFDQSxnQkFBSSxRQUFKO0FBQ0E7QUFDSDtBQUNELHdCQUFnQixXQUFoQjtBQUNILEtBUlcsRUFRVCxJQVJTLENBQVo7QUFTSCxDQWJELEMsQ0FhRTs7QUFFRjs7QUFFQSxTQUFTLGVBQVQsQ0FBeUIsT0FBekIsRUFBa0M7QUFDOUIsUUFBTSxVQUFVLEtBQUssS0FBTCxDQUFXLFVBQVUsRUFBckIsQ0FBaEI7QUFDQSxRQUFJLG1CQUFtQixLQUFLLEtBQUwsQ0FBVyxVQUFVLEVBQXJCLENBQXZCO0FBQ0EsUUFBSSxVQUFhLE9BQWIsU0FBd0IsZ0JBQTVCO0FBQ0EsUUFBSSxtQkFBbUIsRUFBdkIsRUFBMkI7QUFDdkIsMkJBQW1CLE1BQU0sZ0JBQXpCO0FBQ0Esa0JBQWEsT0FBYixTQUF3QixnQkFBeEI7QUFDSDtBQUNELGlCQUFhLFdBQWIsR0FBMkIsT0FBM0I7QUFDSCxDLENBQUM7O0FBRUY7QUFDQSxJQUFJLFFBQUosR0FBZSxZQUFXO0FBQ3RCLE1BQUUsVUFBRixFQUFjLFdBQWQsQ0FBMEIsTUFBMUI7QUFDQSxNQUFFLFlBQUYsRUFBZ0IsRUFBaEIsQ0FBbUIsa0JBQW5CLEVBQXVDLFVBQVMsQ0FBVCxFQUFZO0FBQy9DLFVBQUUsY0FBRjtBQUNBLGlCQUFTLE1BQVQ7QUFDQSxVQUFFLFVBQUYsRUFBYyxRQUFkLENBQXVCLE1BQXZCO0FBQ0gsS0FKRCxFQUZzQixDQU1sQjtBQUVQLENBUkQ7O0FBVUE7QUFDQSxJQUFJLElBQUosR0FBVyxZQUFZO0FBQ25CLFFBQUksYUFBSjtBQUNBLFFBQUksUUFBSjtBQUNBLFFBQUksTUFBSjtBQUNILENBSkQ7O0FBTUE7QUFDQSxFQUFFLFlBQVk7QUFDVixRQUFJLElBQUo7QUFDSCxDQUZEIiwiZmlsZSI6ImdlbmVyYXRlZC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzQ29udGVudCI6WyIoZnVuY3Rpb24oKXtmdW5jdGlvbiByKGUsbix0KXtmdW5jdGlvbiBvKGksZil7aWYoIW5baV0pe2lmKCFlW2ldKXt2YXIgYz1cImZ1bmN0aW9uXCI9PXR5cGVvZiByZXF1aXJlJiZyZXF1aXJlO2lmKCFmJiZjKXJldHVybiBjKGksITApO2lmKHUpcmV0dXJuIHUoaSwhMCk7dmFyIGE9bmV3IEVycm9yKFwiQ2Fubm90IGZpbmQgbW9kdWxlICdcIitpK1wiJ1wiKTt0aHJvdyBhLmNvZGU9XCJNT0RVTEVfTk9UX0ZPVU5EXCIsYX12YXIgcD1uW2ldPXtleHBvcnRzOnt9fTtlW2ldWzBdLmNhbGwocC5leHBvcnRzLGZ1bmN0aW9uKHIpe3ZhciBuPWVbaV1bMV1bcl07cmV0dXJuIG8obnx8cil9LHAscC5leHBvcnRzLHIsZSxuLHQpfXJldHVybiBuW2ldLmV4cG9ydHN9Zm9yKHZhciB1PVwiZnVuY3Rpb25cIj09dHlwZW9mIHJlcXVpcmUmJnJlcXVpcmUsaT0wO2k8dC5sZW5ndGg7aSsrKW8odFtpXSk7cmV0dXJuIG99cmV0dXJuIHJ9KSgpIiwiLy8gbGlzdCBvZiBjb25zdGFudHNcclxuY29uc3QgYXBwID0ge307XHJcbmNvbnN0IGNoYXJzID0gJ2FhYWFhYmJjY2RkZGVlZWVlZWVmZ2doaGlpaWlpaWprbGxsbW1ubm9vb29vcHJycnJzc3N0dHR0dXV1dnd4eXonO1xyXG5sZXQgYW5zd2VyID0gJyc7XHJcbmNvbnN0IGFuc3dlckxpc3QgPSBuZXcgU2V0KCk7XHJcbmxldCBjb3VudGRvd247XHJcbmNvbnN0IHRpbWVyRGlzcGxheSA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoJy50aW1lTGVmdCcpO1xyXG5cclxuYXBwLnVybCA9ICdodHRwczovL3d3dy5kaWN0aW9uYXJ5YXBpLmNvbS9hcGkvdjEvcmVmZXJlbmNlcy9jb2xsZWdpYXRlL3htbC8nO1xyXG5hcHAua2V5ID0gJzhjNWM4NWEzLWZmYTMtNGYwOS1iOTAxLTdkYjgyMDkwMTVkYyc7XHJcblxyXG5cclxuLy8gUkFORE9NTFkgR0VORVJBVEUgTEVUVEVSUyBPTiBBIDRYNCBHUklEIFdIRU4gUFJFU1NJTkcgJ1NUQVJUIEdBTUUnXHJcblxyXG5hcHAuc3dpdGNoU2NyZWVucyA9IGZ1bmN0aW9uICgpe1xyXG4gICAgJCgnLnN0YXJ0Jykub24oJ2NsaWNrIHRvdWNoc3RhcnQnLCBmdW5jdGlvbihlKSB7XHJcbiAgICAgICAgZS5wcmV2ZW50RGVmYXVsdCgpO1xyXG4gICAgICAgIHdpbmRvdy5sb2NhdGlvbiA9IFwiYm9hcmQuaHRtbFwiO1xyXG4gICAgfSk7IC8vIGVuZCBvZiBzdGFydCBldmVudCBmdW5jdGlvblxyXG59OyAvLyBlbmQgb2Ygc3dpdGNoU2NyZWVucyBmdW5jdGlvblxyXG5cclxuYXBwLmdldEJvYXJkID0gZnVuY3Rpb24oKXtcclxuICAgICAgICAvLyB3cml0ZSBhIGZvciBsb29wIHRvIGl0ZXJhdGUgb3ZlciBlYWNoIGJveCBvbiB0aGUgYm9hcmRcclxuICAgICAgICBmb3IgKGxldCBpID0gMTsgaSA8PSAxNjsgaSsrKSB7XHJcbiAgICAgICAgICAgIC8vIGdlbmVyYXRlIHJhbmRvbSBsZXR0ZXJzXHJcbiAgICAgICAgICAgIGNvbnN0IHJhbkxldCA9IGNoYXJzW01hdGguZmxvb3IoTWF0aC5yYW5kb20oKSAqIDYzKV07ICAgICAgIFxyXG4gICAgICAgICAgICAvLyBhcHBlbmQgdGhlbSB0byB0aGUgYm9hcmRcclxuICAgICAgICAgICAgJChgLiR7aX1gKS5hcHBlbmQoYDxhIGhyZWY9XCIjXCIgY2xhc3M9XCJsZXR0ZXJcIj48cD4ke3JhbkxldH08L3A+PC9hPmApICAgICAgICAgICAgXHJcbiAgICAgICAgfTtcclxuICAgICAgICBhcHAudGltZXIoOTApOyAvLyA5MCBzZWNvbmRzIG9uIHRoZSB0aW1lclxyXG59OyAvL2VuZCBvZiBnZXRCb2FyZFxyXG5cclxuYXBwLmV2ZW50cyA9IGZ1bmN0aW9uKCkgeyAvL0VWRU5UUyBGVU5DVElPTiBPTkNFIFRIRSBCT0FSRCBJUyBNQURFXHJcblxyXG5cclxuICAgIC8vIERJU1BMQVkgVEhFIEFOU1dFUlxyXG4gICAgXHJcbiAgICAkKCcuYm94Jykub24oJ2NsaWNrIHRvdWNoc3RhcnQnLCAnLmxldHRlcicgLGZ1bmN0aW9uKGUpIHtcclxuICAgICAgICBlLnByZXZlbnREZWZhdWx0KCk7IC8vIHByZXZlbnQgZGVmYXVsdFxyXG4gICAgICAgICQodGhpcykuYWRkQ2xhc3MoJ3NlbGVjdGVkJyk7XHJcbiAgICAgICAgbGV0IGFjdGl2ZUxldHRlciA9ICQodGhpcykuZmluZCgncCcpLnRleHQoKTtcclxuICAgICAgICBhbnN3ZXIgKz0gYWN0aXZlTGV0dGVyO1xyXG4gICAgICAgICQoJy51c2VyQW5zd2VyJykuaHRtbChgPHA+JHthbnN3ZXJ9PC9wPmApO1xyXG4gICAgICAgIFxyXG4gICAgICAgIC8vIFNUUkVUQ0ggR09BTCBcclxuXHJcbiAgICAgICAgLy8gdXBvbiBmaXJzdCBjbGljaywgbWFrZSBldmVyeXRoaW5nICd1bmNsaWNrYWJsZSdcclxuICAgICAgICAkKCcubGV0dGVyJykuYWRkQ2xhc3MoJ3VuY2xpY2thYmxlJyk7XHJcbiAgICAgICAgXHJcbiAgICAgICAgLy8gc2VsZWN0ZWRCb3hOdW0gaXMgZXF1YWwgdG8gdGhlICpudW1iZXIqIGNsYXNzIG9mIHRoZSBib3ggZGl2XHJcbiAgICAgICAgbGV0IHNlbGVjdGVkQm94TnVtID0gcGFyc2VJbnQoKCQodGhpcykucGFyZW50KCkpLmF0dHIoJ2NsYXNzJykuc2xpY2UoLTIpKTtcclxuXHJcbiAgICAgICAgLy8gaWYgc3RhdGVtZW50cyBmb3IgcmVtb3ZpbmcgJ3VuY2xpY2thYmxlJyBjbGFzcyBmcm9tIGJveGVzIGluIGZpcnN0IGNvbHVtbiwgbWlkZGxlIGNvbHVtbnMgYW5kIGxhc3QgY29sdW1uXHJcbiAgICAgICAgZm9yKGxldCBpID0gMTsgaSA8PSAxNjsgaSsrKSB7XHJcbiAgICAgICAgICAgIGlmICgkKGAuJHtzZWxlY3RlZEJveE51bX1gKS5oYXNDbGFzcygnZmlyc3RDb2x1bW4nKSkgeyAvL2ZpcnN0Q29sdW1uXHJcbiAgICAgICAgICAgICAgICBpZiAoaSA9PT0gc2VsZWN0ZWRCb3hOdW0gKyAxKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgJChgLiR7aX0gLmxldHRlcmApLnJlbW92ZUNsYXNzKCd1bmNsaWNrYWJsZScpO1xyXG4gICAgICAgICAgICAgICAgfSBlbHNlIGlmIChpID09PSBzZWxlY3RlZEJveE51bSAtIDMpIHtcclxuICAgICAgICAgICAgICAgICAgICAkKGAuJHtpfSAubGV0dGVyYCkucmVtb3ZlQ2xhc3MoJ3VuY2xpY2thYmxlJylcclxuICAgICAgICAgICAgICAgIH0gZWxzZSBpZiAoaSA9PT0gc2VsZWN0ZWRCb3hOdW0gKyA0IHx8IGkgPT09IHNlbGVjdGVkQm94TnVtIC0gNCkge1xyXG4gICAgICAgICAgICAgICAgICAgICQoYC4ke2l9IC5sZXR0ZXJgKS5yZW1vdmVDbGFzcygndW5jbGlja2FibGUnKVxyXG4gICAgICAgICAgICAgICAgfSBlbHNlIGlmIChpID09PSBzZWxlY3RlZEJveE51bSArIDUpIHtcclxuICAgICAgICAgICAgICAgICAgICAkKGAuJHtpfSAubGV0dGVyYCkucmVtb3ZlQ2xhc3MoJ3VuY2xpY2thYmxlJylcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgfSAvL2VuZCBvZiBmaXJzdENvbHVtblxyXG4gICAgICAgICAgICBlbHNlIGlmICgkKGAuJHtzZWxlY3RlZEJveE51bX1gKS5oYXNDbGFzcygnbGFzdENvbHVtbicpKXsgLy9sYXN0Q29sdW1uXHJcbiAgICAgICAgICAgICAgICBpZiAoaSA9PT0gc2VsZWN0ZWRCb3hOdW0gLSAxKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgJChgLiR7aX0gLmxldHRlcmApLnJlbW92ZUNsYXNzKCd1bmNsaWNrYWJsZScpO1xyXG4gICAgICAgICAgICAgICAgfSBlbHNlIGlmIChpID09PSBzZWxlY3RlZEJveE51bSArIDMpIHtcclxuICAgICAgICAgICAgICAgICAgICAkKGAuJHtpfSAubGV0dGVyYCkucmVtb3ZlQ2xhc3MoJ3VuY2xpY2thYmxlJylcclxuICAgICAgICAgICAgICAgIH0gZWxzZSBpZiAoaSA9PT0gc2VsZWN0ZWRCb3hOdW0gKyA0IHx8IGkgPT09IHNlbGVjdGVkQm94TnVtIC0gNCkge1xyXG4gICAgICAgICAgICAgICAgICAgICQoYC4ke2l9IC5sZXR0ZXJgKS5yZW1vdmVDbGFzcygndW5jbGlja2FibGUnKVxyXG4gICAgICAgICAgICAgICAgfSBlbHNlIGlmIChpID09PSBzZWxlY3RlZEJveE51bSAtIDUpIHtcclxuICAgICAgICAgICAgICAgICAgICAkKGAuJHtpfSAubGV0dGVyYCkucmVtb3ZlQ2xhc3MoJ3VuY2xpY2thYmxlJylcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgfSAvL2VuZCBvZiBsYXN0Q29sdW1uXHJcbiAgICAgICAgICAgIGVsc2UgeyAvL21pZGRsZUNvbHVtblxyXG4gICAgICAgICAgICAgICAgaWYgKGkgPT09IHNlbGVjdGVkQm94TnVtICsgMSB8fCBpID09PSBzZWxlY3RlZEJveE51bSAtIDEpIHtcclxuICAgICAgICAgICAgICAgICAgICAkKGAuJHtpfSAubGV0dGVyYCkucmVtb3ZlQ2xhc3MoJ3VuY2xpY2thYmxlJyk7XHJcbiAgICAgICAgICAgICAgICB9IGVsc2UgaWYgKGkgPT09IHNlbGVjdGVkQm94TnVtICsgMyB8fCBpID09PSBzZWxlY3RlZEJveE51bSAtIDMpIHtcclxuICAgICAgICAgICAgICAgICAgICAkKGAuJHtpfSAubGV0dGVyYCkucmVtb3ZlQ2xhc3MoJ3VuY2xpY2thYmxlJylcclxuICAgICAgICAgICAgICAgIH0gZWxzZSBpZiAoaSA9PT0gc2VsZWN0ZWRCb3hOdW0gKyA0IHx8IGkgPT09IHNlbGVjdGVkQm94TnVtIC0gNCkge1xyXG4gICAgICAgICAgICAgICAgICAgICQoYC4ke2l9IC5sZXR0ZXJgKS5yZW1vdmVDbGFzcygndW5jbGlja2FibGUnKVxyXG4gICAgICAgICAgICAgICAgfSBlbHNlIGlmIChpID09PSBzZWxlY3RlZEJveE51bSArIDUgfHwgaSA9PT0gc2VsZWN0ZWRCb3hOdW0gLSA1KSB7XHJcbiAgICAgICAgICAgICAgICAgICAgJChgLiR7aX0gLmxldHRlcmApLnJlbW92ZUNsYXNzKCd1bmNsaWNrYWJsZScpXHJcbiAgICAgICAgICAgICAgICB9ICAgICAgICAgICAgIFxyXG4gICAgICAgICAgICB9IC8vZW5kIG9mIG1pZGRsZUNvbHVtblxyXG4gICAgICAgIH0gLy9lbmQgb2YgZm9yIGxvb3BcclxuICAgIH0pOyAvL2VuZCBvZiBtYWtpbmcgdGhlIHdvcmRcclxuXHJcblxyXG4gICAgLy9wcmV2ZW50aW5nIGRlZmF1bHQgYWN0aW9uIG9uIHVuY2xpY2thYmxlXHJcbiAgICAkKCcuYm94Jykub24oJ2NsaWNrIHRvdWNoc3RhcnQnLCAnLnVuY2xpY2thYmxlJywgZnVuY3Rpb24oZSkge1xyXG4gICAgICAgIGUucHJldmVudERlZmF1bHQoKTtcclxuICAgIH0pXHJcblxyXG4gICAgLy8ga2VlcCB0aGUgZW50ZXIga2V5IGZyb20gcmVwZWF0aW5nIHRoZSBsZXR0ZXIgXHJcbiAgICAkKCcuYm94Jykub24oJ2tleWRvd24nLCAnLmxldHRlcicsIGZ1bmN0aW9uIChlKSB7XHJcbiAgICAgICAgZS5wcmV2ZW50RGVmYXVsdCgpOyAvLyBwcmV2ZW50IGRlZmF1bHRcclxuICAgIH0pO1xyXG5cclxuXHJcbiAgICAvLyBDTEVBUiBUSEUgVVNFUiBTRUxFQ1RJT05TXHJcbiAgICBcclxuICAgICQoJy5jbGVhcicpLm9uKCdjbGljayB0b3VjaHN0YXJ0JywgZnVuY3Rpb24oZSkge1xyXG4gICAgICAgIGUucHJldmVudERlZmF1bHQoKTsgLy9wcmV2ZW50IGRlZmF1bHRcclxuICAgICAgICAkKCcudXNlckFuc3dlcicpLmVtcHR5KCk7XHJcbiAgICAgICAgYW5zd2VyID0gJyc7XHJcbiAgICAgICAgJCgnLmxldHRlcicpLnJlbW92ZUNsYXNzKCdzZWxlY3RlZCB1bmNsaWNrYWJsZScpO1xyXG4gICAgICAgICQoJy5jbGVhcicpLmFkZENsYXNzKCcnKTtcclxuICAgICAgICBzZXRUaW1lb3V0KCgpID0+IHtcclxuICAgICAgICAgICAgJCgnLnN1Ym1pdEJ1dHRvbicpLnJlbW92ZUNsYXNzKCcnKTtcclxuICAgICAgICB9LCAxMDAwKTtcclxuICAgIH0pOyAvLyBlbmQgb2YgY2xlYXJcclxuICAgIFxyXG4gICAgXHJcbiAgICAvLyBDT01QQVJJTkcgVE8gVEhFIEFQSVxyXG4gICBcclxuICAgICQoJ2Zvcm0nKS5vbignc3VibWl0JywgZnVuY3Rpb24oZSkge1xyXG4gICAgICAgIGUucHJldmVudERlZmF1bHQoKTtcclxuICAgICAgICAkKCcuZGlzcGxheWVkQW5zd2VycycpLmVtcHR5KCk7XHJcbiAgICAgICAgXHJcbiAgICAgICAgY29uc3Qgc3VibWl0QW5zd2VyID0gJCgnLnVzZXJBbnN3ZXInKS50ZXh0KCk7XHJcblxyXG4gICAgICAgIGNvbnN0IGdldEFQSSA9IGZ1bmN0aW9uKHF1ZXJ5KSB7XHJcbiAgICAgICAgICAgICQuYWpheCh7XHJcbiAgICAgICAgICAgICAgICB1cmw6ICdodHRwczovL3Byb3h5LmhhY2tlcnlvdS5jb20nLFxyXG4gICAgICAgICAgICAgICAgbWV0aG9kOiAnR0VUJyxcclxuICAgICAgICAgICAgICAgIGRhdGFSZXNwb25zZTogJ2pzb24nLFxyXG4gICAgICAgICAgICAgICAgcGFyYW1zU2VyaWFsaXplcjogZnVuY3Rpb24gKHBhcmFtcykge1xyXG4gICAgICAgICAgICAgICAgICAgIHJldHVybiBRcy5zdHJpbmdpZnkocGFyYW1zLCB7IGFycmF5Rm9ybWF0OiAnYnJhY2tldHMnIH0pXHJcbiAgICAgICAgICAgICAgICB9LFxyXG4gICAgICAgICAgICAgICAgZGF0YToge1xyXG4gICAgICAgICAgICAgICAgICAgIHJlcVVybDogYXBwLnVybCxcclxuICAgICAgICAgICAgICAgICAgICBwYXJhbXM6IHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgJ2tleSc6IGFwcC5rZXksXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICd3b3JkJzogcXVlcnlcclxuICAgICAgICAgICAgICAgICAgICB9LFxyXG4gICAgICAgICAgICAgICAgICAgIHhtbFRvSlNPTjogdHJ1ZSxcclxuICAgICAgICAgICAgICAgICAgICB1c2VDYWNoZTogZmFsc2VcclxuICAgICAgICAgICAgICAgIH0gLy8gZW5kIG9mIGFqYXhcclxuICAgICAgICAgICAgfSkudGhlbihyZXNwID0+IHtcclxuICAgICAgICAgICAgICAgIGNvbnNvbGUubG9nKHJlc3ApO1xyXG5cclxuICAgICAgICAgICAgICAgIGNvbnN0IHdvcmQgPSByZXNwLmVudHJ5X2xpc3QuZW50cnk7XHJcblxyXG4gICAgICAgICAgICAgICAgaWYgKHJlc3AuZW50cnlfbGlzdC5zdWdnZXN0aW9uKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgYXBwLndyb25nQWxlcnQoKTtcclxuICAgICAgICAgICAgICAgICAgICAvLyBjb25zb2xlLmxvZygnc3VnZ2VzdGlvbicpO1xyXG5cclxuICAgICAgICAgICAgICAgIH0gLy8gZW5kIG9mIHN1Z2dlc3Rpb25cclxuICAgICAgICAgICAgICAgIGVsc2UgaWYgKHdvcmQpIHsgLy8gc3RhcnQgb2YgaWYgKHdvcmQpXHJcbiAgICAgICAgICAgICAgICAgICAgaWYgKHdvcmRbMF0pIHsgLy9pcyBhcnJheVxyXG4gICAgICAgICAgICAgICAgICAgICAgICBpZiAod29yZFswXS5mbCA9PT0gXCJub3VuXCIgfHwgd29yZFswXS5mbCA9PT0gXCJ2ZXJiXCIgfHwgd29yZFswXS5mbCA9PT0gXCJhZGplY3RpdmVcIiB8fCB3b3JkWzBdLmZsID09PSBcImFkdmVyYlwiIHx8IHdvcmRbMF0uZmwgPT09IFwicHJvbm91blwiIHx8IHdvcmRbMF0uZmwgPT09IFwicHJlcG9zaXRpb25cIiB8fCB3b3JkWzBdLmZsID09PSBcImNvbmp1bmN0aW9uXCIgfHwgd29yZFswXS5mbCA9PT0gXCJkZXRlcm1pbmVyXCIgfHwgd29yZFswXS5mbCA9PT0gXCJwcm9ub3VuLCBwbHVyYWwgaW4gY29uc3RydWN0aW9uXCIpIHsgLy8gYXJyYXkgd29yZCB0eXBlc1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBhcHAuZHVwbGljYXRlQW5zd2VyKHdvcmRbMF0uZXcpO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBhbnN3ZXJMaXN0LmFkZCh3b3JkWzBdLmV3KTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgYXBwLmZpbmRXaGl0ZVNwYWNlKHdvcmRbMF0uZXcpO1xyXG5cclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGlmICh3b3JkWzBdLmV3ID09PSB3b3JkWzBdLmV3LnRvVXBwZXJDYXNlKCkgfHwgd29yZFswXS5ldyA9PT0gKHdvcmRbMF0uZXcpLmNoYXJBdCgwKS50b1VwcGVyQ2FzZSgpICsgKHdvcmRbMF0uZXcpLnNsaWNlKDEpKSB7IC8vIHdvcmQgaXMgdXBwZXJjYXNlIGFiYnJldiBPUiBjYXBpdGFsaXplZFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGFuc3dlckxpc3QuZGVsZXRlKHdvcmRbMF0uZXcpO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGFwcC53cm9uZ0FsZXJ0KCk7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB9IC8vZW5kIG9mIHdvcmQgaXMgdXBwZXJjYXNlIGFiYnJldiBPUiBjYXBpdGFsaXplZFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIH0gLy9lbmQgb2YgYXJyYXkgd29yZCB0eXBlc1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBlbHNlIGlmICh3b3JkWzBdLmN4LmN0IHx8IHdvcmRbMF0uY3hbMF0uY3QpIHsgLy90YXJnZXRpbmcgcGFzdCB0ZW5zZSB3b3JkcyBmb3IgYXJyYXlzXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBhcHAuZHVwbGljYXRlQW5zd2VyKHdvcmRbMF0uZXcpO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgYW5zd2VyTGlzdC5hZGQod29yZFswXS5ldyk7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBhcHAuZmluZFdoaXRlU3BhY2Uod29yZFswXS5ldyk7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIH0gLy9lbmQgb2YgcGFzdCB0ZW5zZSB3b3JkcyBmb3IgYXJyYXlzXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGVsc2UgeyAvLyB1bmFjY2VwdGVkIHdvcmQgdHlwZSBmb3IgYXJyYXlzXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBhcHAud3JvbmdBbGVydCgpO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICB9IC8vZW5kIG9mIHVuYWNjZXB0ZWQgd29yZCB0eXBlIGZvciBhcnJheXNcclxuXHJcblxyXG4gICAgICAgICAgICAgICAgICAgIH0gLy8gZW5kIG9mIGlzIGFycmF5XHJcbiAgICAgICAgICAgICAgICAgICAgZWxzZSB7IC8vaXMgb2JqZWN0XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGlmICh3b3JkLmZsID09PSBcIm5vdW5cIiB8fCB3b3JkLmZsID09PSBcInZlcmJcIiB8fCB3b3JkLmZsID09PSBcImFkamVjdGl2ZVwiIHx8IHdvcmQuZmwgPT09IFwiYWR2ZXJiXCIgfHwgd29yZC5mbCA9PT0gXCJwcm9ub3VuXCIgfHwgd29yZC5mbCA9PT0gXCJwcmVwb3NpdGlvblwiIHx8IHdvcmQuZmwgPT09IFwiY29uanVuY3Rpb25cIiB8fCB3b3JkLmZsID09PSBcImRldGVybWluZXJcIiB8fCB3b3JkLmZsID09PSBcInByb25vdW4sIHBsdXJhbCBpbiBjb25zdHJ1Y3Rpb25cIikgeyAvLyBvYmplY3Qgd29yZCB0eXBlcyBcclxuICAgICAgICAgICAgICAgICAgICAgICAgYXBwLmR1cGxpY2F0ZUFuc3dlcih3b3JkLmV3KTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgYW5zd2VyTGlzdC5hZGQod29yZC5ldyk7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGFwcC5maW5kV2hpdGVTcGFjZSh3b3JkLmV3KTtcclxuXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBpZiAod29yZC5ldyA9PT0gd29yZC5ldy50b1VwcGVyQ2FzZSgpIHx8IHdvcmQuZXcgPT09ICh3b3JkLmV3KS5jaGFyQXQoMCkudG9VcHBlckNhc2UoKSArICh3b3JkLmV3KS5zbGljZSgxKSkgeyAvLyB3b3JkIGlzIHVwcGVyY2FzZSBhYmJyZXYgT1IgY2FwaXRhbGl6ZWRcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBhbnN3ZXJMaXN0LmRlbGV0ZSh3b3JkLmV3KTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBhcHAud3JvbmdBbGVydCgpO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgfSAvL2VuZCBvZiB3b3JkIGlzIHVwcGVyY2FzZSBhYmJyZXYgT1IgY2FwaXRhbGl6ZWRcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGVsc2UgaWYgKHdvcmQuZXQgPT09IFwiYnkgc2hvcnRlbmluZyAmIGFsdGVyYXRpb25cIikgeyAvL3Nob3J0Zm9ybSB3b3JkXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgYW5zd2VyTGlzdC5kZWxldGUod29yZC5ldyk7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgYXBwLndyb25nQWxlcnQoKTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIH0gLy8gZW5kIG9mIHNob3J0Zm9ybSB3b3JkIGxpa2UgXCJoZWxvXCJcclxuXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIH0gLy9lbmQgb2Ygb2JqZWN0IHdvcmQgdHlwZXNcclxuICAgICAgICAgICAgICAgICAgICAgICAgZWxzZSBpZiAod29yZC5jeC5jdCB8fCB3b3JkLmN4WzBdLmN0KSB7IC8vdGFyZ2V0aW5nIHBhc3QgdGVuc2Ugd29yZHMgZm9yIG9iamVjdHMgXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBhcHAuZHVwbGljYXRlQW5zd2VyKHdvcmQuZXcpO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgYW5zd2VyTGlzdC5hZGQod29yZC5ldyk7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBhcHAuZmluZFdoaXRlU3BhY2Uod29yZC5ldyk7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIH0gLy9lbmQgb2YgcGFzdCB0ZW5zZSB3b3JkcyBmb3Igb2JqZWN0c1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBlbHNlIHsgLy8gdW5hY2NlcHRlZCB3b3JkIHR5cGUgZm9yIG9iamVjdHNcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGFwcC53cm9uZ0FsZXJ0KCk7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIH0gLy9lbmQgb2YgdW5hY2NlcHRlZCB3b3JkIHR5cGUgZm9yIG9iamVjdHNcclxuXHJcbiAgICAgICAgICAgICAgICAgICAgfSAvL2VuZCBvZiBpcyBvYmplY3RcclxuXHJcbiAgICAgICAgICAgICAgICB9IC8vIGVuZCBvZiBpZiAod29yZClcclxuICAgICAgICAgICAgICAgIGVsc2UgeyAvL25vdCBhIHdvcmRcclxuICAgICAgICAgICAgICAgICAgICBhcHAud3JvbmdBbGVydCgpO1xyXG5cclxuICAgICAgICAgICAgICAgIH07IC8vZW5kIG9mIGlmIHN0YXRlbWVudHMhIVxyXG4gICAgICAgICAgICAgICAgICAgIFxyXG4gICAgICAgICAgICAgICAgJCgnLnVzZXJBbnN3ZXInKS5lbXB0eSgpO1xyXG4gICAgICAgICAgICAgICAgYW5zd2VyID0gXCJcIjtcclxuICAgICAgICAgICAgICAgICQoJy5sZXR0ZXInKS5yZW1vdmVDbGFzcygnc2VsZWN0ZWQnKTtcclxuICAgICAgICAgICAgICAgIGNvbnNvbGUubG9nKGFuc3dlckxpc3QpO1xyXG5cclxuICAgICAgICAgICAgICAgIGFwcC5kaXNwbGF5QW5zd2VycygpO1xyXG4gICAgICAgICAgICAgICAgYXBwLmNoYW5nZVNjb3JlKCk7XHJcbiAgICAgICAgICAgICAgICAkKCcubGV0dGVyJykucmVtb3ZlQ2xhc3MoJ3VuY2xpY2thYmxlJyk7XHJcbiAgICAgICAgICAgICAgICBcclxuICAgICAgICAgICAgfSk7IC8vIGVuZCBvZiB0aGVuXHJcblxyXG4gICAgICAgIH07IC8vIGVuZCBvZiBnZXRBUEkgZnVuY3Rpb25cclxuICAgICAgICBjb25zb2xlLmxvZyhnZXRBUEkoc3VibWl0QW5zd2VyKSk7XHJcbiAgICAgICAgXHJcbiAgICB9KTsgIC8vIGVuZCBvZiBmb3JtIHN1Ym1pdFxyXG4gICAgXHJcbn07IC8vIGVuZCBvZiBldmVudCBmdW5jdGlvblxyXG5cclxuXHJcbi8vIEFQUEVORCBBTlNXRVIgVE8gVEhFIERJU1BMQVlFREFOU1dFUlMgRElWXHJcblxyXG5hcHAuZGlzcGxheUFuc3dlcnMgPSBmdW5jdGlvbigpIHtcclxuICAgIGFuc3dlckxpc3QuZm9yRWFjaChmdW5jdGlvbih3b3JkKXtcclxuICAgICAgICAvLyAkKCcuZGlzcGxheWVkQW5zd2VycycpLmVtcHR5KCk7XHJcbiAgICAgICAgJCgnLmRpc3BsYXllZEFuc3dlcnMnKS5hcHBlbmQoYDxsaT4ke3dvcmR9PC9saT5gKVxyXG4gICAgfSk7XHJcbn07IC8vIGVuZCBvZiBkaXNwbGF5QW5zd2VycyBmdWNudGlvblxyXG5cclxuXHJcbi8vIElGIERVUExJQ0FURSwgTUFLRSBUSEUgU1VCTUlUIEJVVFRPTiBTSE9XIFRIQVQgVEhFWSBBUkUgV1JPTkdcclxuXHJcbmFwcC5kdXBsaWNhdGVBbnN3ZXIgPSBmdW5jdGlvbih3b3JkKSB7IFxyXG4gICAgaWYgKGFuc3dlckxpc3QuaGFzKHdvcmQpKSB7XHJcbiAgICAgICAgYXBwLndyb25nQWxlcnQoKTtcclxuICAgIH07XHJcbn07IC8vIGVuZCBvZiBkdXBsaWNhdGVBbnN3ZXIgZnVuY3Rpb25cclxuXHJcbmFwcC53cm9uZ0FsZXJ0ID0gZnVuY3Rpb24oKSB7XHJcbiAgICAkKCcuc3VibWl0QnV0dG9uJykucmVtb3ZlQ2xhc3MoJ3B1bHNlIGluZmluaXRlJykuYWRkQ2xhc3MoJ3dyb25nIHdvYmJsZScpO1xyXG4gICAgc2V0VGltZW91dCgoKSA9PiB7XHJcbiAgICAgICAgJCgnLnN1Ym1pdEJ1dHRvbicpLnJlbW92ZUNsYXNzKCd3cm9uZyB3b2JibGUnKS5hZGRDbGFzcygnaW5maW5pdGUgcHVsc2UnKTtcclxuICAgIH0sIDEwMDApO1xyXG4gICAgJCgnLmxldHRlci5zZWxlY3RlZCcpLmFkZENsYXNzKCd3cm9uZycpO1xyXG4gICAgc2V0VGltZW91dCgoKSA9PiB7XHJcbiAgICAgICAgJCgnLmxldHRlcicpLnJlbW92ZUNsYXNzKCd3cm9uZycpO1xyXG4gICAgfSwgMTAwMCk7XHJcbn1cclxuXHJcblxyXG4vLyBTQ09SRSBXSUxMIEJFIFRIRSBTQU1FIEFTIFRIRSBOVU1CRVIgT0YgSVRFTVMgT04gVEhFIFNFVFxyXG5cclxuYXBwLmNoYW5nZVNjb3JlID0gZnVuY3Rpb24oKSB7XHJcbiAgICBsZXQgc2NvcmUgPSBhbnN3ZXJMaXN0LnNpemU7XHJcbiAgICAkKCcuc2NvcmUnKS5odG1sKGAke3Njb3JlfWApO1xyXG4gICAgJCgnLnNjb3JlQm9hcmQnKS5hZGRDbGFzcygnZ3JvdycpO1xyXG4gICAgc2V0VGltZW91dCgoKSA9PiB7XHJcbiAgICAgICAgJCgnLnNjb3JlQm9hcmQnKS5yZW1vdmVDbGFzcygnZ3JvdycpO1xyXG4gICAgfSwgNTAwKTtcclxufTtcclxuXHJcblxyXG4vLyBpZiBBUEkgcmVzdWx0IGhhcyBhIHNwYWNlIGluIGl0LCBkb24ndCBzaG93IGl0IGFuZCBjb3VudCBpdCBhcyB3cm9uZ1xyXG5cclxuYXBwLmZpbmRXaGl0ZVNwYWNlID0gZnVuY3Rpb24gKCkge1xyXG4gICAgYW5zd2VyTGlzdC5mb3JFYWNoKGZ1bmN0aW9uICh3b3JkKSB7XHJcbiAgICAgICAgbGV0IG4gPSB3b3JkLmluY2x1ZGVzKFwiIFwiKTtcclxuICAgICAgICBpZiAod29yZCA9IG4pIHtcclxuICAgICAgICAgICAgYXBwLndyb25nQWxlcnQoKTtcclxuICAgICAgICAgICAgYW5zd2VyTGlzdC5kZWxldGUod29yZCk7XHJcbiAgICAgICAgfTtcclxuICAgIH0pOyAvLyBlbmQgb2YgZm9yRWFjaCBsb29wXHJcbn07IC8vIGVuZCBvZiBmaW5kV2hpdGVTcGFjZVxyXG5cclxuXHJcbi8vIFRJTUVSXHJcblxyXG5hcHAudGltZXIgPSBmdW5jdGlvbihzZWNvbmRzKSB7XHJcbiAgICBjb25zdCBub3cgPSBEYXRlLm5vdygpO1xyXG4gICAgY29uc3QgdGhlbiA9IG5vdyArIHNlY29uZHMgKiAxMDAwO1xyXG4gICAgZGlzcGxheVRpbWVMZWZ0KHNlY29uZHMpO1xyXG4gICAgY291bnRkb3duID0gc2V0SW50ZXJ2YWwoKCkgPT4ge1xyXG4gICAgICAgIGxldCBzZWNvbmRzTGVmdCA9ICh0aGVuIC0gRGF0ZS5ub3coKSkgLyAxMDAwO1xyXG4gICAgICAgIGlmKHNlY29uZHNMZWZ0IDw9IDApIHtcclxuICAgICAgICAgICAgY2xlYXJJbnRlcnZhbChjb3VudGRvd24pO1xyXG4gICAgICAgICAgICBhcHAuZ2FtZU92ZXIoKVxyXG4gICAgICAgICAgICByZXR1cm47XHJcbiAgICAgICAgfVxyXG4gICAgICAgIGRpc3BsYXlUaW1lTGVmdChzZWNvbmRzTGVmdCk7XHJcbiAgICB9LCAxMDAwKTtcclxufSAvLyBlbmQgb2YgdGltZXIgZnVuY3Rpb25cclxuXHJcbi8vIERJU1BMQVkgVEhFIFRJTUVcclxuXHJcbmZ1bmN0aW9uIGRpc3BsYXlUaW1lTGVmdChzZWNvbmRzKSB7XHJcbiAgICBjb25zdCBtaW51dGVzID0gTWF0aC5mbG9vcihzZWNvbmRzIC8gNjApO1xyXG4gICAgbGV0IHJlbWFpbmRlclNlY29uZHMgPSBNYXRoLmZsb29yKHNlY29uZHMgJSA2MCk7XHJcbiAgICBsZXQgZGlzcGxheSA9IGAke21pbnV0ZXN9OiR7cmVtYWluZGVyU2Vjb25kc31gO1xyXG4gICAgaWYgKHJlbWFpbmRlclNlY29uZHMgPCAxMCkge1xyXG4gICAgICAgIHJlbWFpbmRlclNlY29uZHMgPSBcIjBcIiArIHJlbWFpbmRlclNlY29uZHM7XHJcbiAgICAgICAgZGlzcGxheSA9IGAke21pbnV0ZXN9OiR7cmVtYWluZGVyU2Vjb25kc31gO1xyXG4gICAgfVxyXG4gICAgdGltZXJEaXNwbGF5LnRleHRDb250ZW50ID0gZGlzcGxheTtcclxufSAvLyBlbmQgb2YgZGlzcGxheWluZyB0aGUgdGltZVxyXG5cclxuLy8gR0FNRSBPVkVSIE9WRVJMQVlcclxuYXBwLmdhbWVPdmVyID0gZnVuY3Rpb24oKSB7XHJcbiAgICAkKCcub3ZlcmxheScpLnJlbW92ZUNsYXNzKCdoaWRlJyk7XHJcbiAgICAkKCcucGxheUFnYWluJykub24oJ2NsaWNrIHRvdWNoc3RhcnQnLCBmdW5jdGlvbihlKSB7XHJcbiAgICAgICAgZS5wcmV2ZW50RGVmYXVsdCgpO1xyXG4gICAgICAgIGxvY2F0aW9uLnJlbG9hZCgpO1xyXG4gICAgICAgICQoJy5vdmVybGF5JykuYWRkQ2xhc3MoJ2hpZGUnKTtcclxuICAgIH0pOyAvLyBlbmQgb2Ygc3RhcnQgZXZlbnQgZnVuY3Rpb25cclxuXHJcbn1cclxuXHJcbi8vIGluaXRpYWxpemUgZnVuY3Rpb25cclxuYXBwLmluaXQgPSBmdW5jdGlvbiAoKSB7XHJcbiAgICBhcHAuc3dpdGNoU2NyZWVucygpO1xyXG4gICAgYXBwLmdldEJvYXJkKCk7XHJcbiAgICBhcHAuZXZlbnRzKCk7XHJcbn07XHJcblxyXG4vLyBydW4gaW5pdGlhbGl6ZSBmdW5jdGlvbiB0aHJvdWdoIHRoZSBkb2MgcmVhZHkgZnVuY3Rpb24gKG9uIHBhZ2UgbG9hZClcclxuJChmdW5jdGlvbiAoKSB7XHJcbiAgICBhcHAuaW5pdCgpO1xyXG59KTsiXX0=
