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
        window.replace("board.html");
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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm5vZGVfbW9kdWxlcy9icm93c2VyLXBhY2svX3ByZWx1ZGUuanMiLCJkZXYvc2NyaXB0cy9zY3JpcHQuanMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7OztBQ0FBO0FBQ0EsSUFBTSxNQUFNLEVBQVo7QUFDQSxJQUFNLFFBQVEsa0VBQWQ7QUFDQSxJQUFJLFNBQVMsRUFBYjtBQUNBLElBQU0sYUFBYSxJQUFJLEdBQUosRUFBbkI7QUFDQSxJQUFJLGtCQUFKO0FBQ0EsSUFBTSxlQUFlLFNBQVMsYUFBVCxDQUF1QixXQUF2QixDQUFyQjs7QUFFQSxJQUFJLEdBQUosR0FBVSxpRUFBVjtBQUNBLElBQUksR0FBSixHQUFVLHNDQUFWOztBQUdBOztBQUVBLElBQUksYUFBSixHQUFvQixZQUFXO0FBQzNCLE1BQUUsUUFBRixFQUFZLEVBQVosQ0FBZSxrQkFBZixFQUFtQyxVQUFTLENBQVQsRUFBWTtBQUMzQyxVQUFFLGNBQUY7QUFDQSxlQUFPLE9BQVAsQ0FBZSxZQUFmO0FBQ0gsS0FIRCxFQUQyQixDQUl2QjtBQUNQLENBTEQsQyxDQUtHOztBQUVILElBQUksUUFBSixHQUFlLFlBQVU7QUFDakI7QUFDQSxTQUFLLElBQUksSUFBSSxDQUFiLEVBQWdCLEtBQUssRUFBckIsRUFBeUIsR0FBekIsRUFBOEI7QUFDMUI7QUFDQSxZQUFNLFNBQVMsTUFBTSxLQUFLLEtBQUwsQ0FBVyxLQUFLLE1BQUwsS0FBZ0IsRUFBM0IsQ0FBTixDQUFmO0FBQ0E7QUFDQSxnQkFBTSxDQUFOLEVBQVcsTUFBWCxvQ0FBbUQsTUFBbkQ7QUFDSDtBQUNELFFBQUksS0FBSixDQUFVLEVBQVYsRUFSaUIsQ0FRRjtBQUN0QixDQVRELEMsQ0FTRzs7QUFFSCxJQUFJLE1BQUosR0FBYSxZQUFXO0FBQUU7OztBQUd0Qjs7QUFFQSxNQUFFLE1BQUYsRUFBVSxFQUFWLENBQWEsa0JBQWIsRUFBaUMsU0FBakMsRUFBNEMsVUFBUyxDQUFULEVBQVk7QUFDcEQsVUFBRSxjQUFGLEdBRG9ELENB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O0FBQ0gsQyxDQUFDOztBQUVGO0FBQ0EsSUFBSSxRQUFKLEdBQWUsWUFBVztBQUN0QixNQUFFLFVBQUYsRUFBYyxXQUFkLENBQTBCLE1BQTFCO0FBQ0EsTUFBRSxZQUFGLEVBQWdCLEVBQWhCLENBQW1CLGtCQUFuQixFQUF1QyxVQUFTLENBQVQsRUFBWTtBQUMvQyxVQUFFLGNBQUY7QUFDQSxpQkFBUyxNQUFUO0FBQ0EsVUFBRSxVQUFGLEVBQWMsUUFBZCxDQUF1QixNQUF2QjtBQUNILEtBSkQsRUFGc0IsQ0FNbEI7QUFFUCxDQVJEOztBQVVBO0FBQ0EsSUFBSSxJQUFKLEdBQVcsWUFBWTtBQUNuQixRQUFJLGFBQUo7QUFDQSxRQUFJLFFBQUo7QUFDQSxRQUFJLE1BQUo7QUFDSCxDQUpEOztBQU1BO0FBQ0EsRUFBRSxZQUFZO0FBQ1YsUUFBSSxJQUFKO0FBQ0gsQ0FGRCIsImZpbGUiOiJnZW5lcmF0ZWQuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlc0NvbnRlbnQiOlsiKGZ1bmN0aW9uKCl7ZnVuY3Rpb24gcihlLG4sdCl7ZnVuY3Rpb24gbyhpLGYpe2lmKCFuW2ldKXtpZighZVtpXSl7dmFyIGM9XCJmdW5jdGlvblwiPT10eXBlb2YgcmVxdWlyZSYmcmVxdWlyZTtpZighZiYmYylyZXR1cm4gYyhpLCEwKTtpZih1KXJldHVybiB1KGksITApO3ZhciBhPW5ldyBFcnJvcihcIkNhbm5vdCBmaW5kIG1vZHVsZSAnXCIraStcIidcIik7dGhyb3cgYS5jb2RlPVwiTU9EVUxFX05PVF9GT1VORFwiLGF9dmFyIHA9bltpXT17ZXhwb3J0czp7fX07ZVtpXVswXS5jYWxsKHAuZXhwb3J0cyxmdW5jdGlvbihyKXt2YXIgbj1lW2ldWzFdW3JdO3JldHVybiBvKG58fHIpfSxwLHAuZXhwb3J0cyxyLGUsbix0KX1yZXR1cm4gbltpXS5leHBvcnRzfWZvcih2YXIgdT1cImZ1bmN0aW9uXCI9PXR5cGVvZiByZXF1aXJlJiZyZXF1aXJlLGk9MDtpPHQubGVuZ3RoO2krKylvKHRbaV0pO3JldHVybiBvfXJldHVybiByfSkoKSIsIi8vIGxpc3Qgb2YgY29uc3RhbnRzXHJcbmNvbnN0IGFwcCA9IHt9O1xyXG5jb25zdCBjaGFycyA9ICdhYWFhYWJiY2NkZGRlZWVlZWVlZmdnaGhpaWlpaWlqa2xsbG1tbm5vb29vb3BycnJyc3NzdHR0dHV1dXZ3eHl6JztcclxubGV0IGFuc3dlciA9ICcnO1xyXG5jb25zdCBhbnN3ZXJMaXN0ID0gbmV3IFNldCgpO1xyXG5sZXQgY291bnRkb3duO1xyXG5jb25zdCB0aW1lckRpc3BsYXkgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKCcudGltZUxlZnQnKTtcclxuXHJcbmFwcC51cmwgPSAnaHR0cHM6Ly93d3cuZGljdGlvbmFyeWFwaS5jb20vYXBpL3YxL3JlZmVyZW5jZXMvY29sbGVnaWF0ZS94bWwvJztcclxuYXBwLmtleSA9ICc4YzVjODVhMy1mZmEzLTRmMDktYjkwMS03ZGI4MjA5MDE1ZGMnO1xyXG5cclxuXHJcbi8vIFJBTkRPTUxZIEdFTkVSQVRFIExFVFRFUlMgT04gQSA0WDQgR1JJRCBXSEVOIFBSRVNTSU5HICdTVEFSVCBHQU1FJ1xyXG5cclxuYXBwLnN3aXRjaFNjcmVlbnMgPSBmdW5jdGlvbiAoKXtcclxuICAgICQoJy5zdGFydCcpLm9uKCdjbGljayB0b3VjaHN0YXJ0JywgZnVuY3Rpb24oZSkge1xyXG4gICAgICAgIGUucHJldmVudERlZmF1bHQoKTtcclxuICAgICAgICB3aW5kb3cucmVwbGFjZShcImJvYXJkLmh0bWxcIik7XHJcbiAgICB9KTsgLy8gZW5kIG9mIHN0YXJ0IGV2ZW50IGZ1bmN0aW9uXHJcbn07IC8vIGVuZCBvZiBzd2l0Y2hTY3JlZW5zIGZ1bmN0aW9uXHJcblxyXG5hcHAuZ2V0Qm9hcmQgPSBmdW5jdGlvbigpe1xyXG4gICAgICAgIC8vIHdyaXRlIGEgZm9yIGxvb3AgdG8gaXRlcmF0ZSBvdmVyIGVhY2ggYm94IG9uIHRoZSBib2FyZFxyXG4gICAgICAgIGZvciAobGV0IGkgPSAxOyBpIDw9IDE2OyBpKyspIHtcclxuICAgICAgICAgICAgLy8gZ2VuZXJhdGUgcmFuZG9tIGxldHRlcnNcclxuICAgICAgICAgICAgY29uc3QgcmFuTGV0ID0gY2hhcnNbTWF0aC5mbG9vcihNYXRoLnJhbmRvbSgpICogNjMpXTsgICAgICAgXHJcbiAgICAgICAgICAgIC8vIGFwcGVuZCB0aGVtIHRvIHRoZSBib2FyZFxyXG4gICAgICAgICAgICAkKGAuJHtpfWApLmFwcGVuZChgPGEgaHJlZj1cIiNcIiBjbGFzcz1cImxldHRlclwiPjxwPiR7cmFuTGV0fTwvcD48L2E+YCkgICAgICAgICAgICBcclxuICAgICAgICB9O1xyXG4gICAgICAgIGFwcC50aW1lcig5MCk7IC8vIDkwIHNlY29uZHMgb24gdGhlIHRpbWVyXHJcbn07IC8vZW5kIG9mIGdldEJvYXJkXHJcblxyXG5hcHAuZXZlbnRzID0gZnVuY3Rpb24oKSB7IC8vRVZFTlRTIEZVTkNUSU9OIE9OQ0UgVEhFIEJPQVJEIElTIE1BREVcclxuXHJcblxyXG4gICAgLy8gRElTUExBWSBUSEUgQU5TV0VSXHJcbiAgICBcclxuICAgICQoJy5ib3gnKS5vbignY2xpY2sgdG91Y2hzdGFydCcsICcubGV0dGVyJyAsZnVuY3Rpb24oZSkge1xyXG4gICAgICAgIGUucHJldmVudERlZmF1bHQoKTsgLy8gcHJldmVudCBkZWZhdWx0XHJcbiAgICAgICAgJCh0aGlzKS5hZGRDbGFzcygnc2VsZWN0ZWQnKTtcclxuICAgICAgICBsZXQgYWN0aXZlTGV0dGVyID0gJCh0aGlzKS5maW5kKCdwJykudGV4dCgpO1xyXG4gICAgICAgIGFuc3dlciArPSBhY3RpdmVMZXR0ZXI7XHJcbiAgICAgICAgJCgnLnVzZXJBbnN3ZXInKS5odG1sKGA8cD4ke2Fuc3dlcn08L3A+YCk7XHJcbiAgICAgICAgXHJcbiAgICAgICAgLy8gU1RSRVRDSCBHT0FMIFxyXG5cclxuICAgICAgICAvLyB1cG9uIGZpcnN0IGNsaWNrLCBtYWtlIGV2ZXJ5dGhpbmcgJ3VuY2xpY2thYmxlJ1xyXG4gICAgICAgICQoJy5sZXR0ZXInKS5hZGRDbGFzcygndW5jbGlja2FibGUnKTtcclxuICAgICAgICBcclxuICAgICAgICAvLyBzZWxlY3RlZEJveE51bSBpcyBlcXVhbCB0byB0aGUgKm51bWJlciogY2xhc3Mgb2YgdGhlIGJveCBkaXZcclxuICAgICAgICBsZXQgc2VsZWN0ZWRCb3hOdW0gPSBwYXJzZUludCgoJCh0aGlzKS5wYXJlbnQoKSkuYXR0cignY2xhc3MnKS5zbGljZSgtMikpO1xyXG5cclxuICAgICAgICAvLyBpZiBzdGF0ZW1lbnRzIGZvciByZW1vdmluZyAndW5jbGlja2FibGUnIGNsYXNzIGZyb20gYm94ZXMgaW4gZmlyc3QgY29sdW1uLCBtaWRkbGUgY29sdW1ucyBhbmQgbGFzdCBjb2x1bW5cclxuICAgICAgICBmb3IobGV0IGkgPSAxOyBpIDw9IDE2OyBpKyspIHtcclxuICAgICAgICAgICAgaWYgKCQoYC4ke3NlbGVjdGVkQm94TnVtfWApLmhhc0NsYXNzKCdmaXJzdENvbHVtbicpKSB7IC8vZmlyc3RDb2x1bW5cclxuICAgICAgICAgICAgICAgIGlmIChpID09PSBzZWxlY3RlZEJveE51bSArIDEpIHtcclxuICAgICAgICAgICAgICAgICAgICAkKGAuJHtpfSAubGV0dGVyYCkucmVtb3ZlQ2xhc3MoJ3VuY2xpY2thYmxlJyk7XHJcbiAgICAgICAgICAgICAgICB9IGVsc2UgaWYgKGkgPT09IHNlbGVjdGVkQm94TnVtIC0gMykge1xyXG4gICAgICAgICAgICAgICAgICAgICQoYC4ke2l9IC5sZXR0ZXJgKS5yZW1vdmVDbGFzcygndW5jbGlja2FibGUnKVxyXG4gICAgICAgICAgICAgICAgfSBlbHNlIGlmIChpID09PSBzZWxlY3RlZEJveE51bSArIDQgfHwgaSA9PT0gc2VsZWN0ZWRCb3hOdW0gLSA0KSB7XHJcbiAgICAgICAgICAgICAgICAgICAgJChgLiR7aX0gLmxldHRlcmApLnJlbW92ZUNsYXNzKCd1bmNsaWNrYWJsZScpXHJcbiAgICAgICAgICAgICAgICB9IGVsc2UgaWYgKGkgPT09IHNlbGVjdGVkQm94TnVtICsgNSkge1xyXG4gICAgICAgICAgICAgICAgICAgICQoYC4ke2l9IC5sZXR0ZXJgKS5yZW1vdmVDbGFzcygndW5jbGlja2FibGUnKVxyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB9IC8vZW5kIG9mIGZpcnN0Q29sdW1uXHJcbiAgICAgICAgICAgIGVsc2UgaWYgKCQoYC4ke3NlbGVjdGVkQm94TnVtfWApLmhhc0NsYXNzKCdsYXN0Q29sdW1uJykpeyAvL2xhc3RDb2x1bW5cclxuICAgICAgICAgICAgICAgIGlmIChpID09PSBzZWxlY3RlZEJveE51bSAtIDEpIHtcclxuICAgICAgICAgICAgICAgICAgICAkKGAuJHtpfSAubGV0dGVyYCkucmVtb3ZlQ2xhc3MoJ3VuY2xpY2thYmxlJyk7XHJcbiAgICAgICAgICAgICAgICB9IGVsc2UgaWYgKGkgPT09IHNlbGVjdGVkQm94TnVtICsgMykge1xyXG4gICAgICAgICAgICAgICAgICAgICQoYC4ke2l9IC5sZXR0ZXJgKS5yZW1vdmVDbGFzcygndW5jbGlja2FibGUnKVxyXG4gICAgICAgICAgICAgICAgfSBlbHNlIGlmIChpID09PSBzZWxlY3RlZEJveE51bSArIDQgfHwgaSA9PT0gc2VsZWN0ZWRCb3hOdW0gLSA0KSB7XHJcbiAgICAgICAgICAgICAgICAgICAgJChgLiR7aX0gLmxldHRlcmApLnJlbW92ZUNsYXNzKCd1bmNsaWNrYWJsZScpXHJcbiAgICAgICAgICAgICAgICB9IGVsc2UgaWYgKGkgPT09IHNlbGVjdGVkQm94TnVtIC0gNSkge1xyXG4gICAgICAgICAgICAgICAgICAgICQoYC4ke2l9IC5sZXR0ZXJgKS5yZW1vdmVDbGFzcygndW5jbGlja2FibGUnKVxyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB9IC8vZW5kIG9mIGxhc3RDb2x1bW5cclxuICAgICAgICAgICAgZWxzZSB7IC8vbWlkZGxlQ29sdW1uXHJcbiAgICAgICAgICAgICAgICBpZiAoaSA9PT0gc2VsZWN0ZWRCb3hOdW0gKyAxIHx8IGkgPT09IHNlbGVjdGVkQm94TnVtIC0gMSkge1xyXG4gICAgICAgICAgICAgICAgICAgICQoYC4ke2l9IC5sZXR0ZXJgKS5yZW1vdmVDbGFzcygndW5jbGlja2FibGUnKTtcclxuICAgICAgICAgICAgICAgIH0gZWxzZSBpZiAoaSA9PT0gc2VsZWN0ZWRCb3hOdW0gKyAzIHx8IGkgPT09IHNlbGVjdGVkQm94TnVtIC0gMykge1xyXG4gICAgICAgICAgICAgICAgICAgICQoYC4ke2l9IC5sZXR0ZXJgKS5yZW1vdmVDbGFzcygndW5jbGlja2FibGUnKVxyXG4gICAgICAgICAgICAgICAgfSBlbHNlIGlmIChpID09PSBzZWxlY3RlZEJveE51bSArIDQgfHwgaSA9PT0gc2VsZWN0ZWRCb3hOdW0gLSA0KSB7XHJcbiAgICAgICAgICAgICAgICAgICAgJChgLiR7aX0gLmxldHRlcmApLnJlbW92ZUNsYXNzKCd1bmNsaWNrYWJsZScpXHJcbiAgICAgICAgICAgICAgICB9IGVsc2UgaWYgKGkgPT09IHNlbGVjdGVkQm94TnVtICsgNSB8fCBpID09PSBzZWxlY3RlZEJveE51bSAtIDUpIHtcclxuICAgICAgICAgICAgICAgICAgICAkKGAuJHtpfSAubGV0dGVyYCkucmVtb3ZlQ2xhc3MoJ3VuY2xpY2thYmxlJylcclxuICAgICAgICAgICAgICAgIH0gICAgICAgICAgICAgXHJcbiAgICAgICAgICAgIH0gLy9lbmQgb2YgbWlkZGxlQ29sdW1uXHJcbiAgICAgICAgfSAvL2VuZCBvZiBmb3IgbG9vcFxyXG4gICAgfSk7IC8vZW5kIG9mIG1ha2luZyB0aGUgd29yZFxyXG5cclxuXHJcbiAgICAvL3ByZXZlbnRpbmcgZGVmYXVsdCBhY3Rpb24gb24gdW5jbGlja2FibGVcclxuICAgICQoJy5ib3gnKS5vbignY2xpY2sgdG91Y2hzdGFydCcsICcudW5jbGlja2FibGUnLCBmdW5jdGlvbihlKSB7XHJcbiAgICAgICAgZS5wcmV2ZW50RGVmYXVsdCgpO1xyXG4gICAgfSlcclxuXHJcbiAgICAvLyBrZWVwIHRoZSBlbnRlciBrZXkgZnJvbSByZXBlYXRpbmcgdGhlIGxldHRlciBcclxuICAgICQoJy5ib3gnKS5vbigna2V5ZG93bicsICcubGV0dGVyJywgZnVuY3Rpb24gKGUpIHtcclxuICAgICAgICBlLnByZXZlbnREZWZhdWx0KCk7IC8vIHByZXZlbnQgZGVmYXVsdFxyXG4gICAgfSk7XHJcblxyXG5cclxuICAgIC8vIENMRUFSIFRIRSBVU0VSIFNFTEVDVElPTlNcclxuICAgIFxyXG4gICAgJCgnLmNsZWFyJykub24oJ2NsaWNrIHRvdWNoc3RhcnQnLCBmdW5jdGlvbihlKSB7XHJcbiAgICAgICAgZS5wcmV2ZW50RGVmYXVsdCgpOyAvL3ByZXZlbnQgZGVmYXVsdFxyXG4gICAgICAgICQoJy51c2VyQW5zd2VyJykuZW1wdHkoKTtcclxuICAgICAgICBhbnN3ZXIgPSAnJztcclxuICAgICAgICAkKCcubGV0dGVyJykucmVtb3ZlQ2xhc3MoJ3NlbGVjdGVkIHVuY2xpY2thYmxlJyk7XHJcbiAgICAgICAgJCgnLmNsZWFyJykuYWRkQ2xhc3MoJycpO1xyXG4gICAgICAgIHNldFRpbWVvdXQoKCkgPT4ge1xyXG4gICAgICAgICAgICAkKCcuc3VibWl0QnV0dG9uJykucmVtb3ZlQ2xhc3MoJycpO1xyXG4gICAgICAgIH0sIDEwMDApO1xyXG4gICAgfSk7IC8vIGVuZCBvZiBjbGVhclxyXG4gICAgXHJcbiAgICBcclxuICAgIC8vIENPTVBBUklORyBUTyBUSEUgQVBJXHJcbiAgIFxyXG4gICAgJCgnZm9ybScpLm9uKCdzdWJtaXQnLCBmdW5jdGlvbihlKSB7XHJcbiAgICAgICAgZS5wcmV2ZW50RGVmYXVsdCgpO1xyXG4gICAgICAgICQoJy5kaXNwbGF5ZWRBbnN3ZXJzJykuZW1wdHkoKTtcclxuICAgICAgICBcclxuICAgICAgICBjb25zdCBzdWJtaXRBbnN3ZXIgPSAkKCcudXNlckFuc3dlcicpLnRleHQoKTtcclxuXHJcbiAgICAgICAgY29uc3QgZ2V0QVBJID0gZnVuY3Rpb24ocXVlcnkpIHtcclxuICAgICAgICAgICAgJC5hamF4KHtcclxuICAgICAgICAgICAgICAgIHVybDogJ2h0dHBzOi8vcHJveHkuaGFja2VyeW91LmNvbScsXHJcbiAgICAgICAgICAgICAgICBtZXRob2Q6ICdHRVQnLFxyXG4gICAgICAgICAgICAgICAgZGF0YVJlc3BvbnNlOiAnanNvbicsXHJcbiAgICAgICAgICAgICAgICBwYXJhbXNTZXJpYWxpemVyOiBmdW5jdGlvbiAocGFyYW1zKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIFFzLnN0cmluZ2lmeShwYXJhbXMsIHsgYXJyYXlGb3JtYXQ6ICdicmFja2V0cycgfSlcclxuICAgICAgICAgICAgICAgIH0sXHJcbiAgICAgICAgICAgICAgICBkYXRhOiB7XHJcbiAgICAgICAgICAgICAgICAgICAgcmVxVXJsOiBhcHAudXJsLFxyXG4gICAgICAgICAgICAgICAgICAgIHBhcmFtczoge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAna2V5JzogYXBwLmtleSxcclxuICAgICAgICAgICAgICAgICAgICAgICAgJ3dvcmQnOiBxdWVyeVxyXG4gICAgICAgICAgICAgICAgICAgIH0sXHJcbiAgICAgICAgICAgICAgICAgICAgeG1sVG9KU09OOiB0cnVlLFxyXG4gICAgICAgICAgICAgICAgICAgIHVzZUNhY2hlOiBmYWxzZVxyXG4gICAgICAgICAgICAgICAgfSAvLyBlbmQgb2YgYWpheFxyXG4gICAgICAgICAgICB9KS50aGVuKHJlc3AgPT4ge1xyXG4gICAgICAgICAgICAgICAgY29uc29sZS5sb2cocmVzcCk7XHJcblxyXG4gICAgICAgICAgICAgICAgY29uc3Qgd29yZCA9IHJlc3AuZW50cnlfbGlzdC5lbnRyeTtcclxuXHJcbiAgICAgICAgICAgICAgICBpZiAocmVzcC5lbnRyeV9saXN0LnN1Z2dlc3Rpb24pIHtcclxuICAgICAgICAgICAgICAgICAgICBhcHAud3JvbmdBbGVydCgpO1xyXG4gICAgICAgICAgICAgICAgICAgIC8vIGNvbnNvbGUubG9nKCdzdWdnZXN0aW9uJyk7XHJcblxyXG4gICAgICAgICAgICAgICAgfSAvLyBlbmQgb2Ygc3VnZ2VzdGlvblxyXG4gICAgICAgICAgICAgICAgZWxzZSBpZiAod29yZCkgeyAvLyBzdGFydCBvZiBpZiAod29yZClcclxuICAgICAgICAgICAgICAgICAgICBpZiAod29yZFswXSkgeyAvL2lzIGFycmF5XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGlmICh3b3JkWzBdLmZsID09PSBcIm5vdW5cIiB8fCB3b3JkWzBdLmZsID09PSBcInZlcmJcIiB8fCB3b3JkWzBdLmZsID09PSBcImFkamVjdGl2ZVwiIHx8IHdvcmRbMF0uZmwgPT09IFwiYWR2ZXJiXCIgfHwgd29yZFswXS5mbCA9PT0gXCJwcm9ub3VuXCIgfHwgd29yZFswXS5mbCA9PT0gXCJwcmVwb3NpdGlvblwiIHx8IHdvcmRbMF0uZmwgPT09IFwiY29uanVuY3Rpb25cIiB8fCB3b3JkWzBdLmZsID09PSBcImRldGVybWluZXJcIiB8fCB3b3JkWzBdLmZsID09PSBcInByb25vdW4sIHBsdXJhbCBpbiBjb25zdHJ1Y3Rpb25cIikgeyAvLyBhcnJheSB3b3JkIHR5cGVzXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGFwcC5kdXBsaWNhdGVBbnN3ZXIod29yZFswXS5ldyk7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGFuc3dlckxpc3QuYWRkKHdvcmRbMF0uZXcpO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBhcHAuZmluZFdoaXRlU3BhY2Uod29yZFswXS5ldyk7XHJcblxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgaWYgKHdvcmRbMF0uZXcgPT09IHdvcmRbMF0uZXcudG9VcHBlckNhc2UoKSB8fCB3b3JkWzBdLmV3ID09PSAod29yZFswXS5ldykuY2hhckF0KDApLnRvVXBwZXJDYXNlKCkgKyAod29yZFswXS5ldykuc2xpY2UoMSkpIHsgLy8gd29yZCBpcyB1cHBlcmNhc2UgYWJicmV2IE9SIGNhcGl0YWxpemVkXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgYW5zd2VyTGlzdC5kZWxldGUod29yZFswXS5ldyk7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgYXBwLndyb25nQWxlcnQoKTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIH0gLy9lbmQgb2Ygd29yZCBpcyB1cHBlcmNhc2UgYWJicmV2IE9SIGNhcGl0YWxpemVkXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBcclxuICAgICAgICAgICAgICAgICAgICAgICAgfSAvL2VuZCBvZiBhcnJheSB3b3JkIHR5cGVzXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGVsc2UgaWYgKHdvcmRbMF0uY3guY3QgfHwgd29yZFswXS5jeFswXS5jdCkgeyAvL3RhcmdldGluZyBwYXN0IHRlbnNlIHdvcmRzIGZvciBhcnJheXNcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGFwcC5kdXBsaWNhdGVBbnN3ZXIod29yZFswXS5ldyk7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBhbnN3ZXJMaXN0LmFkZCh3b3JkWzBdLmV3KTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGFwcC5maW5kV2hpdGVTcGFjZSh3b3JkWzBdLmV3KTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgfSAvL2VuZCBvZiBwYXN0IHRlbnNlIHdvcmRzIGZvciBhcnJheXNcclxuICAgICAgICAgICAgICAgICAgICAgICAgZWxzZSB7IC8vIHVuYWNjZXB0ZWQgd29yZCB0eXBlIGZvciBhcnJheXNcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGFwcC53cm9uZ0FsZXJ0KCk7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIH0gLy9lbmQgb2YgdW5hY2NlcHRlZCB3b3JkIHR5cGUgZm9yIGFycmF5c1xyXG5cclxuXHJcbiAgICAgICAgICAgICAgICAgICAgfSAvLyBlbmQgb2YgaXMgYXJyYXlcclxuICAgICAgICAgICAgICAgICAgICBlbHNlIHsgLy9pcyBvYmplY3RcclxuICAgICAgICAgICAgICAgICAgICAgICAgaWYgKHdvcmQuZmwgPT09IFwibm91blwiIHx8IHdvcmQuZmwgPT09IFwidmVyYlwiIHx8IHdvcmQuZmwgPT09IFwiYWRqZWN0aXZlXCIgfHwgd29yZC5mbCA9PT0gXCJhZHZlcmJcIiB8fCB3b3JkLmZsID09PSBcInByb25vdW5cIiB8fCB3b3JkLmZsID09PSBcInByZXBvc2l0aW9uXCIgfHwgd29yZC5mbCA9PT0gXCJjb25qdW5jdGlvblwiIHx8IHdvcmQuZmwgPT09IFwiZGV0ZXJtaW5lclwiIHx8IHdvcmQuZmwgPT09IFwicHJvbm91biwgcGx1cmFsIGluIGNvbnN0cnVjdGlvblwiKSB7IC8vIG9iamVjdCB3b3JkIHR5cGVzIFxyXG4gICAgICAgICAgICAgICAgICAgICAgICBhcHAuZHVwbGljYXRlQW5zd2VyKHdvcmQuZXcpO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBhbnN3ZXJMaXN0LmFkZCh3b3JkLmV3KTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgYXBwLmZpbmRXaGl0ZVNwYWNlKHdvcmQuZXcpO1xyXG5cclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGlmICh3b3JkLmV3ID09PSB3b3JkLmV3LnRvVXBwZXJDYXNlKCkgfHwgd29yZC5ldyA9PT0gKHdvcmQuZXcpLmNoYXJBdCgwKS50b1VwcGVyQ2FzZSgpICsgKHdvcmQuZXcpLnNsaWNlKDEpKSB7IC8vIHdvcmQgaXMgdXBwZXJjYXNlIGFiYnJldiBPUiBjYXBpdGFsaXplZFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGFuc3dlckxpc3QuZGVsZXRlKHdvcmQuZXcpO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGFwcC53cm9uZ0FsZXJ0KCk7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB9IC8vZW5kIG9mIHdvcmQgaXMgdXBwZXJjYXNlIGFiYnJldiBPUiBjYXBpdGFsaXplZFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgZWxzZSBpZiAod29yZC5ldCA9PT0gXCJieSBzaG9ydGVuaW5nICYgYWx0ZXJhdGlvblwiKSB7IC8vc2hvcnRmb3JtIHdvcmRcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBhbnN3ZXJMaXN0LmRlbGV0ZSh3b3JkLmV3KTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBhcHAud3JvbmdBbGVydCgpO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgfSAvLyBlbmQgb2Ygc2hvcnRmb3JtIHdvcmQgbGlrZSBcImhlbG9cIlxyXG5cclxuICAgICAgICAgICAgICAgICAgICAgICAgfSAvL2VuZCBvZiBvYmplY3Qgd29yZCB0eXBlc1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBlbHNlIGlmICh3b3JkLmN4LmN0IHx8IHdvcmQuY3hbMF0uY3QpIHsgLy90YXJnZXRpbmcgcGFzdCB0ZW5zZSB3b3JkcyBmb3Igb2JqZWN0cyBcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGFwcC5kdXBsaWNhdGVBbnN3ZXIod29yZC5ldyk7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBhbnN3ZXJMaXN0LmFkZCh3b3JkLmV3KTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGFwcC5maW5kV2hpdGVTcGFjZSh3b3JkLmV3KTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgfSAvL2VuZCBvZiBwYXN0IHRlbnNlIHdvcmRzIGZvciBvYmplY3RzXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGVsc2UgeyAvLyB1bmFjY2VwdGVkIHdvcmQgdHlwZSBmb3Igb2JqZWN0c1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgYXBwLndyb25nQWxlcnQoKTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgfSAvL2VuZCBvZiB1bmFjY2VwdGVkIHdvcmQgdHlwZSBmb3Igb2JqZWN0c1xyXG5cclxuICAgICAgICAgICAgICAgICAgICB9IC8vZW5kIG9mIGlzIG9iamVjdFxyXG5cclxuICAgICAgICAgICAgICAgIH0gLy8gZW5kIG9mIGlmICh3b3JkKVxyXG4gICAgICAgICAgICAgICAgZWxzZSB7IC8vbm90IGEgd29yZFxyXG4gICAgICAgICAgICAgICAgICAgIGFwcC53cm9uZ0FsZXJ0KCk7XHJcblxyXG4gICAgICAgICAgICAgICAgfTsgLy9lbmQgb2YgaWYgc3RhdGVtZW50cyEhXHJcbiAgICAgICAgICAgICAgICAgICAgXHJcbiAgICAgICAgICAgICAgICAkKCcudXNlckFuc3dlcicpLmVtcHR5KCk7XHJcbiAgICAgICAgICAgICAgICBhbnN3ZXIgPSBcIlwiO1xyXG4gICAgICAgICAgICAgICAgJCgnLmxldHRlcicpLnJlbW92ZUNsYXNzKCdzZWxlY3RlZCcpO1xyXG4gICAgICAgICAgICAgICAgY29uc29sZS5sb2coYW5zd2VyTGlzdCk7XHJcblxyXG4gICAgICAgICAgICAgICAgYXBwLmRpc3BsYXlBbnN3ZXJzKCk7XHJcbiAgICAgICAgICAgICAgICBhcHAuY2hhbmdlU2NvcmUoKTtcclxuICAgICAgICAgICAgICAgICQoJy5sZXR0ZXInKS5yZW1vdmVDbGFzcygndW5jbGlja2FibGUnKTtcclxuICAgICAgICAgICAgICAgIFxyXG4gICAgICAgICAgICB9KTsgLy8gZW5kIG9mIHRoZW5cclxuXHJcbiAgICAgICAgfTsgLy8gZW5kIG9mIGdldEFQSSBmdW5jdGlvblxyXG4gICAgICAgIGNvbnNvbGUubG9nKGdldEFQSShzdWJtaXRBbnN3ZXIpKTtcclxuICAgICAgICBcclxuICAgIH0pOyAgLy8gZW5kIG9mIGZvcm0gc3VibWl0XHJcbiAgICBcclxufTsgLy8gZW5kIG9mIGV2ZW50IGZ1bmN0aW9uXHJcblxyXG5cclxuLy8gQVBQRU5EIEFOU1dFUiBUTyBUSEUgRElTUExBWUVEQU5TV0VSUyBESVZcclxuXHJcbmFwcC5kaXNwbGF5QW5zd2VycyA9IGZ1bmN0aW9uKCkge1xyXG4gICAgYW5zd2VyTGlzdC5mb3JFYWNoKGZ1bmN0aW9uKHdvcmQpe1xyXG4gICAgICAgIC8vICQoJy5kaXNwbGF5ZWRBbnN3ZXJzJykuZW1wdHkoKTtcclxuICAgICAgICAkKCcuZGlzcGxheWVkQW5zd2VycycpLmFwcGVuZChgPGxpPiR7d29yZH08L2xpPmApXHJcbiAgICB9KTtcclxufTsgLy8gZW5kIG9mIGRpc3BsYXlBbnN3ZXJzIGZ1Y250aW9uXHJcblxyXG5cclxuLy8gSUYgRFVQTElDQVRFLCBNQUtFIFRIRSBTVUJNSVQgQlVUVE9OIFNIT1cgVEhBVCBUSEVZIEFSRSBXUk9OR1xyXG5cclxuYXBwLmR1cGxpY2F0ZUFuc3dlciA9IGZ1bmN0aW9uKHdvcmQpIHsgXHJcbiAgICBpZiAoYW5zd2VyTGlzdC5oYXMod29yZCkpIHtcclxuICAgICAgICBhcHAud3JvbmdBbGVydCgpO1xyXG4gICAgfTtcclxufTsgLy8gZW5kIG9mIGR1cGxpY2F0ZUFuc3dlciBmdW5jdGlvblxyXG5cclxuYXBwLndyb25nQWxlcnQgPSBmdW5jdGlvbigpIHtcclxuICAgICQoJy5zdWJtaXRCdXR0b24nKS5yZW1vdmVDbGFzcygncHVsc2UgaW5maW5pdGUnKS5hZGRDbGFzcygnd3Jvbmcgd29iYmxlJyk7XHJcbiAgICBzZXRUaW1lb3V0KCgpID0+IHtcclxuICAgICAgICAkKCcuc3VibWl0QnV0dG9uJykucmVtb3ZlQ2xhc3MoJ3dyb25nIHdvYmJsZScpLmFkZENsYXNzKCdpbmZpbml0ZSBwdWxzZScpO1xyXG4gICAgfSwgMTAwMCk7XHJcbiAgICAkKCcubGV0dGVyLnNlbGVjdGVkJykuYWRkQ2xhc3MoJ3dyb25nJyk7XHJcbiAgICBzZXRUaW1lb3V0KCgpID0+IHtcclxuICAgICAgICAkKCcubGV0dGVyJykucmVtb3ZlQ2xhc3MoJ3dyb25nJyk7XHJcbiAgICB9LCAxMDAwKTtcclxufVxyXG5cclxuXHJcbi8vIFNDT1JFIFdJTEwgQkUgVEhFIFNBTUUgQVMgVEhFIE5VTUJFUiBPRiBJVEVNUyBPTiBUSEUgU0VUXHJcblxyXG5hcHAuY2hhbmdlU2NvcmUgPSBmdW5jdGlvbigpIHtcclxuICAgIGxldCBzY29yZSA9IGFuc3dlckxpc3Quc2l6ZTtcclxuICAgICQoJy5zY29yZScpLmh0bWwoYCR7c2NvcmV9YCk7XHJcbiAgICAkKCcuc2NvcmVCb2FyZCcpLmFkZENsYXNzKCdncm93Jyk7XHJcbiAgICBzZXRUaW1lb3V0KCgpID0+IHtcclxuICAgICAgICAkKCcuc2NvcmVCb2FyZCcpLnJlbW92ZUNsYXNzKCdncm93Jyk7XHJcbiAgICB9LCA1MDApO1xyXG59O1xyXG5cclxuXHJcbi8vIGlmIEFQSSByZXN1bHQgaGFzIGEgc3BhY2UgaW4gaXQsIGRvbid0IHNob3cgaXQgYW5kIGNvdW50IGl0IGFzIHdyb25nXHJcblxyXG5hcHAuZmluZFdoaXRlU3BhY2UgPSBmdW5jdGlvbiAoKSB7XHJcbiAgICBhbnN3ZXJMaXN0LmZvckVhY2goZnVuY3Rpb24gKHdvcmQpIHtcclxuICAgICAgICBsZXQgbiA9IHdvcmQuaW5jbHVkZXMoXCIgXCIpO1xyXG4gICAgICAgIGlmICh3b3JkID0gbikge1xyXG4gICAgICAgICAgICBhcHAud3JvbmdBbGVydCgpO1xyXG4gICAgICAgICAgICBhbnN3ZXJMaXN0LmRlbGV0ZSh3b3JkKTtcclxuICAgICAgICB9O1xyXG4gICAgfSk7IC8vIGVuZCBvZiBmb3JFYWNoIGxvb3BcclxufTsgLy8gZW5kIG9mIGZpbmRXaGl0ZVNwYWNlXHJcblxyXG5cclxuLy8gVElNRVJcclxuXHJcbmFwcC50aW1lciA9IGZ1bmN0aW9uKHNlY29uZHMpIHtcclxuICAgIGNvbnN0IG5vdyA9IERhdGUubm93KCk7XHJcbiAgICBjb25zdCB0aGVuID0gbm93ICsgc2Vjb25kcyAqIDEwMDA7XHJcbiAgICBkaXNwbGF5VGltZUxlZnQoc2Vjb25kcyk7XHJcbiAgICBjb3VudGRvd24gPSBzZXRJbnRlcnZhbCgoKSA9PiB7XHJcbiAgICAgICAgbGV0IHNlY29uZHNMZWZ0ID0gKHRoZW4gLSBEYXRlLm5vdygpKSAvIDEwMDA7XHJcbiAgICAgICAgaWYoc2Vjb25kc0xlZnQgPD0gMCkge1xyXG4gICAgICAgICAgICBjbGVhckludGVydmFsKGNvdW50ZG93bik7XHJcbiAgICAgICAgICAgIGFwcC5nYW1lT3ZlcigpXHJcbiAgICAgICAgICAgIHJldHVybjtcclxuICAgICAgICB9XHJcbiAgICAgICAgZGlzcGxheVRpbWVMZWZ0KHNlY29uZHNMZWZ0KTtcclxuICAgIH0sIDEwMDApO1xyXG59IC8vIGVuZCBvZiB0aW1lciBmdW5jdGlvblxyXG5cclxuLy8gRElTUExBWSBUSEUgVElNRVxyXG5cclxuZnVuY3Rpb24gZGlzcGxheVRpbWVMZWZ0KHNlY29uZHMpIHtcclxuICAgIGNvbnN0IG1pbnV0ZXMgPSBNYXRoLmZsb29yKHNlY29uZHMgLyA2MCk7XHJcbiAgICBsZXQgcmVtYWluZGVyU2Vjb25kcyA9IE1hdGguZmxvb3Ioc2Vjb25kcyAlIDYwKTtcclxuICAgIGxldCBkaXNwbGF5ID0gYCR7bWludXRlc306JHtyZW1haW5kZXJTZWNvbmRzfWA7XHJcbiAgICBpZiAocmVtYWluZGVyU2Vjb25kcyA8IDEwKSB7XHJcbiAgICAgICAgcmVtYWluZGVyU2Vjb25kcyA9IFwiMFwiICsgcmVtYWluZGVyU2Vjb25kcztcclxuICAgICAgICBkaXNwbGF5ID0gYCR7bWludXRlc306JHtyZW1haW5kZXJTZWNvbmRzfWA7XHJcbiAgICB9XHJcbiAgICB0aW1lckRpc3BsYXkudGV4dENvbnRlbnQgPSBkaXNwbGF5O1xyXG59IC8vIGVuZCBvZiBkaXNwbGF5aW5nIHRoZSB0aW1lXHJcblxyXG4vLyBHQU1FIE9WRVIgT1ZFUkxBWVxyXG5hcHAuZ2FtZU92ZXIgPSBmdW5jdGlvbigpIHtcclxuICAgICQoJy5vdmVybGF5JykucmVtb3ZlQ2xhc3MoJ2hpZGUnKTtcclxuICAgICQoJy5wbGF5QWdhaW4nKS5vbignY2xpY2sgdG91Y2hzdGFydCcsIGZ1bmN0aW9uKGUpIHtcclxuICAgICAgICBlLnByZXZlbnREZWZhdWx0KCk7XHJcbiAgICAgICAgbG9jYXRpb24ucmVsb2FkKCk7XHJcbiAgICAgICAgJCgnLm92ZXJsYXknKS5hZGRDbGFzcygnaGlkZScpO1xyXG4gICAgfSk7IC8vIGVuZCBvZiBzdGFydCBldmVudCBmdW5jdGlvblxyXG5cclxufVxyXG5cclxuLy8gaW5pdGlhbGl6ZSBmdW5jdGlvblxyXG5hcHAuaW5pdCA9IGZ1bmN0aW9uICgpIHtcclxuICAgIGFwcC5zd2l0Y2hTY3JlZW5zKCk7XHJcbiAgICBhcHAuZ2V0Qm9hcmQoKTtcclxuICAgIGFwcC5ldmVudHMoKTtcclxufTtcclxuXHJcbi8vIHJ1biBpbml0aWFsaXplIGZ1bmN0aW9uIHRocm91Z2ggdGhlIGRvYyByZWFkeSBmdW5jdGlvbiAob24gcGFnZSBsb2FkKVxyXG4kKGZ1bmN0aW9uICgpIHtcclxuICAgIGFwcC5pbml0KCk7XHJcbn0pOyJdfQ==
