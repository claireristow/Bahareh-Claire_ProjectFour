(function(){function r(e,n,t){function o(i,f){if(!n[i]){if(!e[i]){var c="function"==typeof require&&require;if(!f&&c)return c(i,!0);if(u)return u(i,!0);var a=new Error("Cannot find module '"+i+"'");throw a.code="MODULE_NOT_FOUND",a}var p=n[i]={exports:{}};e[i][0].call(p.exports,function(r){var n=e[i][1][r];return o(n||r)},p,p.exports,r,e,n,t)}return n[i].exports}for(var u="function"==typeof require&&require,i=0;i<t.length;i++)o(t[i]);return o}return r})()({1:[function(require,module,exports){
'use strict';

// list of constants
var app = {};
var chars = 'aaaaabbccdddeeeeeeefgghhiiiiiijklllmmnnoooooprrrrsssttttuuuvwxyz';
var answer = '';
var answerList = new Set();
var countdown = void 0;
var timerDisplay = document.querySelector('.timeLeft');

app.url = 'https://www.dictionaryapi.com/api/v3/references/collegiate/json/';
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
                url: '' + app.url + query,
                method: "GET",
                dataType: 'json',
                data: {
                    key: app.key
                }
            }).then(function (resp) {
                console.log(resp);

                // const word = resp.entry_list.entry;
                var word = resp[0];
                console.log(word);

                if (!word.fl) {
                    app.wrongAlert();
                    // console.log('suggestion');
                } // end of suggestion
                else if (word.fl) {
                        if (word.fl === 'abbreviation' || word.fl === 'combining form') {
                            answerList.delete(word.fl);
                            app.wrongAlert();
                        } else {
                            app.duplicateAnswer(word.hwi.hw);
                            answerList.add(word.hwi.hw);
                            app.findWhiteSpace(word.hwi.hw);
                        }
                    }

                // else if (word) { // start of if (word)
                //     if (word[0]) { //is array
                //         if (word[0].fl === "noun" || word[0].fl === "verb" || word[0].fl === "adjective" || word[0].fl === "adverb" || word[0].fl === "pronoun" || word[0].fl === "preposition" || word[0].fl === "conjunction" || word[0].fl === "determiner" || word[0].fl === "pronoun, plural in construction") { // array word types
                //         app.duplicateAnswer(word[0].ew);
                //         answerList.add(word[0].ew);
                //         app.findWhiteSpace(word[0].ew);

                //             if (word[0].ew === word[0].ew.toUpperCase() || word[0].ew === (word[0].ew).charAt(0).toUpperCase() + (word[0].ew).slice(1)) { // word is uppercase abbrev OR capitalized
                //                 answerList.delete(word[0].ew);
                //                 app.wrongAlert();
                //             } //end of word is uppercase abbrev OR capitalized

                //         } //end of array word types
                //         else if (word[0].cx.ct || word[0].cx[0].ct) { //targeting past tense words for arrays
                //             app.duplicateAnswer(word[0].ew);
                //             answerList.add(word[0].ew);
                //             app.findWhiteSpace(word[0].ew);
                //         } //end of past tense words for arrays
                //         else { // unaccepted word type for arrays
                //             app.wrongAlert();
                //         } //end of unaccepted word type for arrays


                //     } // end of is array
                //     else { //is object
                //         if (word.fl === "noun" || word.fl === "verb" || word.fl === "adjective" || word.fl === "adverb" || word.fl === "pronoun" || word.fl === "preposition" || word.fl === "conjunction" || word.fl === "determiner" || word.fl === "pronoun, plural in construction") { // object word types 
                //         app.duplicateAnswer(word.ew);
                //         answerList.add(word.ew);
                //         app.findWhiteSpace(word.ew);

                //             if (word.ew === word.ew.toUpperCase() || word.ew === (word.ew).charAt(0).toUpperCase() + (word.ew).slice(1)) { // word is uppercase abbrev OR capitalized
                //                 answerList.delete(word.ew);
                //                 app.wrongAlert();
                //             } //end of word is uppercase abbrev OR capitalized
                //             else if (word.et === "by shortening & alteration") { //shortform word
                //                 answerList.delete(word.ew);
                //                 app.wrongAlert();
                //             } // end of shortform word like "helo"

                //         } //end of object word types
                //         else if (word.cx.ct || word.cx[0].ct) { //targeting past tense words for objects 
                //             app.duplicateAnswer(word.ew);
                //             answerList.add(word.ew);
                //             app.findWhiteSpace(word.ew);
                //         } //end of past tense words for objects
                //         else { // unaccepted word type for objects
                //             app.wrongAlert();
                //         } //end of unaccepted word type for objects

                //     } //end of is object

                // } // end of if (word)
                // else { //not a word
                //     app.wrongAlert();

                // }; //end of if statements!!

                $('.userAnswer').empty();
                answer = "";
                $('.letter').removeClass('selected');
                console.log(answerList);

                app.displayAnswers();
                app.changeScore();
                $('.letter').removeClass('unclickable');
            }); // end of then
        }; // end of getAPI function
        // console.log(getAPI(submitAnswer));
        getAPI(submitAnswer);
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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm5vZGVfbW9kdWxlcy9icm93c2VyLXBhY2svX3ByZWx1ZGUuanMiLCJkZXYvc2NyaXB0cy9zY3JpcHQuanMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7OztBQ0FBO0FBQ0EsSUFBTSxNQUFNLEVBQVo7QUFDQSxJQUFNLFFBQVEsa0VBQWQ7QUFDQSxJQUFJLFNBQVMsRUFBYjtBQUNBLElBQU0sYUFBYSxJQUFJLEdBQUosRUFBbkI7QUFDQSxJQUFJLGtCQUFKO0FBQ0EsSUFBTSxlQUFlLFNBQVMsYUFBVCxDQUF1QixXQUF2QixDQUFyQjs7QUFFQSxJQUFJLEdBQUosR0FBVSxrRUFBVjtBQUNBLElBQUksR0FBSixHQUFVLHNDQUFWOztBQUdBOztBQUVBLElBQUksYUFBSixHQUFvQixZQUFXO0FBQzNCLE1BQUUsUUFBRixFQUFZLEVBQVosQ0FBZSxrQkFBZixFQUFtQyxVQUFTLENBQVQsRUFBWTtBQUMzQyxVQUFFLGNBQUY7QUFDQSxlQUFPLFFBQVAsR0FBa0IsWUFBbEI7QUFDSCxLQUhELEVBRDJCLENBSXZCO0FBQ1AsQ0FMRCxDLENBS0c7O0FBRUgsSUFBSSxRQUFKLEdBQWUsWUFBVTtBQUNqQjtBQUNBLFNBQUssSUFBSSxJQUFJLENBQWIsRUFBZ0IsS0FBSyxFQUFyQixFQUF5QixHQUF6QixFQUE4QjtBQUMxQjtBQUNBLFlBQU0sU0FBUyxNQUFNLEtBQUssS0FBTCxDQUFXLEtBQUssTUFBTCxLQUFnQixFQUEzQixDQUFOLENBQWY7QUFDQTtBQUNBLGdCQUFNLENBQU4sRUFBVyxNQUFYLG9DQUFtRCxNQUFuRDtBQUNIO0FBQ0QsUUFBSSxLQUFKLENBQVUsRUFBVixFQVJpQixDQVFGO0FBQ3RCLENBVEQsQyxDQVNHOztBQUVILElBQUksTUFBSixHQUFhLFlBQVc7QUFBRTs7O0FBR3RCOztBQUVBLE1BQUUsTUFBRixFQUFVLEVBQVYsQ0FBYSxrQkFBYixFQUFpQyxTQUFqQyxFQUE0QyxVQUFTLENBQVQsRUFBWTtBQUNwRCxVQUFFLGNBQUYsR0FEb0Qs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aEIsQ0FBbUIsa0JBQW5CLEVBQXVDLFVBQVMsQ0FBVCxFQUFZO0FBQy9DLFVBQUUsY0FBRjtBQUNBLGlCQUFTLE1BQVQ7QUFDQSxVQUFFLFVBQUYsRUFBYyxRQUFkLENBQXVCLE1BQXZCO0FBQ0gsS0FKRCxFQUZzQixDQU1sQjtBQUVQLENBUkQ7O0FBVUE7QUFDQSxJQUFJLElBQUosR0FBVyxZQUFZO0FBQ25CLFFBQUksYUFBSjtBQUNBLFFBQUksUUFBSjtBQUNBLFFBQUksTUFBSjtBQUNILENBSkQ7O0FBTUE7QUFDQSxFQUFFLFlBQVk7QUFDVixRQUFJLElBQUo7QUFDSCxDQUZEIiwiZmlsZSI6ImdlbmVyYXRlZC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzQ29udGVudCI6WyIoZnVuY3Rpb24oKXtmdW5jdGlvbiByKGUsbix0KXtmdW5jdGlvbiBvKGksZil7aWYoIW5baV0pe2lmKCFlW2ldKXt2YXIgYz1cImZ1bmN0aW9uXCI9PXR5cGVvZiByZXF1aXJlJiZyZXF1aXJlO2lmKCFmJiZjKXJldHVybiBjKGksITApO2lmKHUpcmV0dXJuIHUoaSwhMCk7dmFyIGE9bmV3IEVycm9yKFwiQ2Fubm90IGZpbmQgbW9kdWxlICdcIitpK1wiJ1wiKTt0aHJvdyBhLmNvZGU9XCJNT0RVTEVfTk9UX0ZPVU5EXCIsYX12YXIgcD1uW2ldPXtleHBvcnRzOnt9fTtlW2ldWzBdLmNhbGwocC5leHBvcnRzLGZ1bmN0aW9uKHIpe3ZhciBuPWVbaV1bMV1bcl07cmV0dXJuIG8obnx8cil9LHAscC5leHBvcnRzLHIsZSxuLHQpfXJldHVybiBuW2ldLmV4cG9ydHN9Zm9yKHZhciB1PVwiZnVuY3Rpb25cIj09dHlwZW9mIHJlcXVpcmUmJnJlcXVpcmUsaT0wO2k8dC5sZW5ndGg7aSsrKW8odFtpXSk7cmV0dXJuIG99cmV0dXJuIHJ9KSgpIiwiLy8gbGlzdCBvZiBjb25zdGFudHNcclxuY29uc3QgYXBwID0ge307XHJcbmNvbnN0IGNoYXJzID0gJ2FhYWFhYmJjY2RkZGVlZWVlZWVmZ2doaGlpaWlpaWprbGxsbW1ubm9vb29vcHJycnJzc3N0dHR0dXV1dnd4eXonO1xyXG5sZXQgYW5zd2VyID0gJyc7XHJcbmNvbnN0IGFuc3dlckxpc3QgPSBuZXcgU2V0KCk7XHJcbmxldCBjb3VudGRvd247XHJcbmNvbnN0IHRpbWVyRGlzcGxheSA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoJy50aW1lTGVmdCcpO1xyXG5cclxuYXBwLnVybCA9ICdodHRwczovL3d3dy5kaWN0aW9uYXJ5YXBpLmNvbS9hcGkvdjMvcmVmZXJlbmNlcy9jb2xsZWdpYXRlL2pzb24vJztcclxuYXBwLmtleSA9ICc4YzVjODVhMy1mZmEzLTRmMDktYjkwMS03ZGI4MjA5MDE1ZGMnO1xyXG5cclxuXHJcbi8vIFJBTkRPTUxZIEdFTkVSQVRFIExFVFRFUlMgT04gQSA0WDQgR1JJRCBXSEVOIFBSRVNTSU5HICdTVEFSVCBHQU1FJ1xyXG5cclxuYXBwLnN3aXRjaFNjcmVlbnMgPSBmdW5jdGlvbiAoKXtcclxuICAgICQoJy5zdGFydCcpLm9uKCdjbGljayB0b3VjaHN0YXJ0JywgZnVuY3Rpb24oZSkge1xyXG4gICAgICAgIGUucHJldmVudERlZmF1bHQoKTtcclxuICAgICAgICB3aW5kb3cubG9jYXRpb24gPSBcImJvYXJkLmh0bWxcIjtcclxuICAgIH0pOyAvLyBlbmQgb2Ygc3RhcnQgZXZlbnQgZnVuY3Rpb25cclxufTsgLy8gZW5kIG9mIHN3aXRjaFNjcmVlbnMgZnVuY3Rpb25cclxuXHJcbmFwcC5nZXRCb2FyZCA9IGZ1bmN0aW9uKCl7XHJcbiAgICAgICAgLy8gd3JpdGUgYSBmb3IgbG9vcCB0byBpdGVyYXRlIG92ZXIgZWFjaCBib3ggb24gdGhlIGJvYXJkXHJcbiAgICAgICAgZm9yIChsZXQgaSA9IDE7IGkgPD0gMTY7IGkrKykge1xyXG4gICAgICAgICAgICAvLyBnZW5lcmF0ZSByYW5kb20gbGV0dGVyc1xyXG4gICAgICAgICAgICBjb25zdCByYW5MZXQgPSBjaGFyc1tNYXRoLmZsb29yKE1hdGgucmFuZG9tKCkgKiA2MyldOyAgICAgICBcclxuICAgICAgICAgICAgLy8gYXBwZW5kIHRoZW0gdG8gdGhlIGJvYXJkXHJcbiAgICAgICAgICAgICQoYC4ke2l9YCkuYXBwZW5kKGA8YSBocmVmPVwiI1wiIGNsYXNzPVwibGV0dGVyXCI+PHA+JHtyYW5MZXR9PC9wPjwvYT5gKSAgICAgICAgICAgIFxyXG4gICAgICAgIH07XHJcbiAgICAgICAgYXBwLnRpbWVyKDkwKTsgLy8gOTAgc2Vjb25kcyBvbiB0aGUgdGltZXJcclxufTsgLy9lbmQgb2YgZ2V0Qm9hcmRcclxuXHJcbmFwcC5ldmVudHMgPSBmdW5jdGlvbigpIHsgLy9FVkVOVFMgRlVOQ1RJT04gT05DRSBUSEUgQk9BUkQgSVMgTUFERVxyXG5cclxuXHJcbiAgICAvLyBESVNQTEFZIFRIRSBBTlNXRVJcclxuICAgIFxyXG4gICAgJCgnLmJveCcpLm9uKCdjbGljayB0b3VjaHN0YXJ0JywgJy5sZXR0ZXInICxmdW5jdGlvbihlKSB7XHJcbiAgICAgICAgZS5wcmV2ZW50RGVmYXVsdCgpOyAvLyBwcmV2ZW50IGRlZmF1bHRcclxuICAgICAgICAkKHRoaXMpLmFkZENsYXNzKCdzZWxlY3RlZCcpO1xyXG4gICAgICAgIGxldCBhY3RpdmVMZXR0ZXIgPSAkKHRoaXMpLmZpbmQoJ3AnKS50ZXh0KCk7XHJcbiAgICAgICAgYW5zd2VyICs9IGFjdGl2ZUxldHRlcjtcclxuICAgICAgICAkKCcudXNlckFuc3dlcicpLmh0bWwoYDxwPiR7YW5zd2VyfTwvcD5gKTtcclxuICAgICAgICBcclxuICAgICAgICAvLyBTVFJFVENIIEdPQUwgXHJcblxyXG4gICAgICAgIC8vIHVwb24gZmlyc3QgY2xpY2ssIG1ha2UgZXZlcnl0aGluZyAndW5jbGlja2FibGUnXHJcbiAgICAgICAgJCgnLmxldHRlcicpLmFkZENsYXNzKCd1bmNsaWNrYWJsZScpO1xyXG4gICAgICAgIFxyXG4gICAgICAgIC8vIHNlbGVjdGVkQm94TnVtIGlzIGVxdWFsIHRvIHRoZSAqbnVtYmVyKiBjbGFzcyBvZiB0aGUgYm94IGRpdlxyXG4gICAgICAgIGxldCBzZWxlY3RlZEJveE51bSA9IHBhcnNlSW50KCgkKHRoaXMpLnBhcmVudCgpKS5hdHRyKCdjbGFzcycpLnNsaWNlKC0yKSk7XHJcblxyXG4gICAgICAgIC8vIGlmIHN0YXRlbWVudHMgZm9yIHJlbW92aW5nICd1bmNsaWNrYWJsZScgY2xhc3MgZnJvbSBib3hlcyBpbiBmaXJzdCBjb2x1bW4sIG1pZGRsZSBjb2x1bW5zIGFuZCBsYXN0IGNvbHVtblxyXG4gICAgICAgIGZvcihsZXQgaSA9IDE7IGkgPD0gMTY7IGkrKykge1xyXG4gICAgICAgICAgICBpZiAoJChgLiR7c2VsZWN0ZWRCb3hOdW19YCkuaGFzQ2xhc3MoJ2ZpcnN0Q29sdW1uJykpIHsgLy9maXJzdENvbHVtblxyXG4gICAgICAgICAgICAgICAgaWYgKGkgPT09IHNlbGVjdGVkQm94TnVtICsgMSkge1xyXG4gICAgICAgICAgICAgICAgICAgICQoYC4ke2l9IC5sZXR0ZXJgKS5yZW1vdmVDbGFzcygndW5jbGlja2FibGUnKTtcclxuICAgICAgICAgICAgICAgIH0gZWxzZSBpZiAoaSA9PT0gc2VsZWN0ZWRCb3hOdW0gLSAzKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgJChgLiR7aX0gLmxldHRlcmApLnJlbW92ZUNsYXNzKCd1bmNsaWNrYWJsZScpXHJcbiAgICAgICAgICAgICAgICB9IGVsc2UgaWYgKGkgPT09IHNlbGVjdGVkQm94TnVtICsgNCB8fCBpID09PSBzZWxlY3RlZEJveE51bSAtIDQpIHtcclxuICAgICAgICAgICAgICAgICAgICAkKGAuJHtpfSAubGV0dGVyYCkucmVtb3ZlQ2xhc3MoJ3VuY2xpY2thYmxlJylcclxuICAgICAgICAgICAgICAgIH0gZWxzZSBpZiAoaSA9PT0gc2VsZWN0ZWRCb3hOdW0gKyA1KSB7XHJcbiAgICAgICAgICAgICAgICAgICAgJChgLiR7aX0gLmxldHRlcmApLnJlbW92ZUNsYXNzKCd1bmNsaWNrYWJsZScpXHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIH0gLy9lbmQgb2YgZmlyc3RDb2x1bW5cclxuICAgICAgICAgICAgZWxzZSBpZiAoJChgLiR7c2VsZWN0ZWRCb3hOdW19YCkuaGFzQ2xhc3MoJ2xhc3RDb2x1bW4nKSl7IC8vbGFzdENvbHVtblxyXG4gICAgICAgICAgICAgICAgaWYgKGkgPT09IHNlbGVjdGVkQm94TnVtIC0gMSkge1xyXG4gICAgICAgICAgICAgICAgICAgICQoYC4ke2l9IC5sZXR0ZXJgKS5yZW1vdmVDbGFzcygndW5jbGlja2FibGUnKTtcclxuICAgICAgICAgICAgICAgIH0gZWxzZSBpZiAoaSA9PT0gc2VsZWN0ZWRCb3hOdW0gKyAzKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgJChgLiR7aX0gLmxldHRlcmApLnJlbW92ZUNsYXNzKCd1bmNsaWNrYWJsZScpXHJcbiAgICAgICAgICAgICAgICB9IGVsc2UgaWYgKGkgPT09IHNlbGVjdGVkQm94TnVtICsgNCB8fCBpID09PSBzZWxlY3RlZEJveE51bSAtIDQpIHtcclxuICAgICAgICAgICAgICAgICAgICAkKGAuJHtpfSAubGV0dGVyYCkucmVtb3ZlQ2xhc3MoJ3VuY2xpY2thYmxlJylcclxuICAgICAgICAgICAgICAgIH0gZWxzZSBpZiAoaSA9PT0gc2VsZWN0ZWRCb3hOdW0gLSA1KSB7XHJcbiAgICAgICAgICAgICAgICAgICAgJChgLiR7aX0gLmxldHRlcmApLnJlbW92ZUNsYXNzKCd1bmNsaWNrYWJsZScpXHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIH0gLy9lbmQgb2YgbGFzdENvbHVtblxyXG4gICAgICAgICAgICBlbHNlIHsgLy9taWRkbGVDb2x1bW5cclxuICAgICAgICAgICAgICAgIGlmIChpID09PSBzZWxlY3RlZEJveE51bSArIDEgfHwgaSA9PT0gc2VsZWN0ZWRCb3hOdW0gLSAxKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgJChgLiR7aX0gLmxldHRlcmApLnJlbW92ZUNsYXNzKCd1bmNsaWNrYWJsZScpO1xyXG4gICAgICAgICAgICAgICAgfSBlbHNlIGlmIChpID09PSBzZWxlY3RlZEJveE51bSArIDMgfHwgaSA9PT0gc2VsZWN0ZWRCb3hOdW0gLSAzKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgJChgLiR7aX0gLmxldHRlcmApLnJlbW92ZUNsYXNzKCd1bmNsaWNrYWJsZScpXHJcbiAgICAgICAgICAgICAgICB9IGVsc2UgaWYgKGkgPT09IHNlbGVjdGVkQm94TnVtICsgNCB8fCBpID09PSBzZWxlY3RlZEJveE51bSAtIDQpIHtcclxuICAgICAgICAgICAgICAgICAgICAkKGAuJHtpfSAubGV0dGVyYCkucmVtb3ZlQ2xhc3MoJ3VuY2xpY2thYmxlJylcclxuICAgICAgICAgICAgICAgIH0gZWxzZSBpZiAoaSA9PT0gc2VsZWN0ZWRCb3hOdW0gKyA1IHx8IGkgPT09IHNlbGVjdGVkQm94TnVtIC0gNSkge1xyXG4gICAgICAgICAgICAgICAgICAgICQoYC4ke2l9IC5sZXR0ZXJgKS5yZW1vdmVDbGFzcygndW5jbGlja2FibGUnKVxyXG4gICAgICAgICAgICAgICAgfSAgICAgICAgICAgICBcclxuICAgICAgICAgICAgfSAvL2VuZCBvZiBtaWRkbGVDb2x1bW5cclxuICAgICAgICB9IC8vZW5kIG9mIGZvciBsb29wXHJcbiAgICB9KTsgLy9lbmQgb2YgbWFraW5nIHRoZSB3b3JkXHJcblxyXG5cclxuICAgIC8vcHJldmVudGluZyBkZWZhdWx0IGFjdGlvbiBvbiB1bmNsaWNrYWJsZVxyXG4gICAgJCgnLmJveCcpLm9uKCdjbGljayB0b3VjaHN0YXJ0JywgJy51bmNsaWNrYWJsZScsIGZ1bmN0aW9uKGUpIHtcclxuICAgICAgICBlLnByZXZlbnREZWZhdWx0KCk7XHJcbiAgICB9KVxyXG5cclxuICAgIC8vIGtlZXAgdGhlIGVudGVyIGtleSBmcm9tIHJlcGVhdGluZyB0aGUgbGV0dGVyIFxyXG4gICAgJCgnLmJveCcpLm9uKCdrZXlkb3duJywgJy5sZXR0ZXInLCBmdW5jdGlvbiAoZSkge1xyXG4gICAgICAgIGUucHJldmVudERlZmF1bHQoKTsgLy8gcHJldmVudCBkZWZhdWx0XHJcbiAgICB9KTtcclxuXHJcblxyXG4gICAgLy8gQ0xFQVIgVEhFIFVTRVIgU0VMRUNUSU9OU1xyXG4gICAgXHJcbiAgICAkKCcuY2xlYXInKS5vbignY2xpY2sgdG91Y2hzdGFydCcsIGZ1bmN0aW9uKGUpIHtcclxuICAgICAgICBlLnByZXZlbnREZWZhdWx0KCk7IC8vcHJldmVudCBkZWZhdWx0XHJcbiAgICAgICAgJCgnLnVzZXJBbnN3ZXInKS5lbXB0eSgpO1xyXG4gICAgICAgIGFuc3dlciA9ICcnO1xyXG4gICAgICAgICQoJy5sZXR0ZXInKS5yZW1vdmVDbGFzcygnc2VsZWN0ZWQgdW5jbGlja2FibGUnKTtcclxuICAgICAgICAkKCcuY2xlYXInKS5hZGRDbGFzcygnJyk7XHJcbiAgICAgICAgc2V0VGltZW91dCgoKSA9PiB7XHJcbiAgICAgICAgICAgICQoJy5zdWJtaXRCdXR0b24nKS5yZW1vdmVDbGFzcygnJyk7XHJcbiAgICAgICAgfSwgMTAwMCk7XHJcbiAgICB9KTsgLy8gZW5kIG9mIGNsZWFyXHJcbiAgICBcclxuICAgIFxyXG4gICAgLy8gQ09NUEFSSU5HIFRPIFRIRSBBUElcclxuICAgXHJcbiAgICAkKCdmb3JtJykub24oJ3N1Ym1pdCcsIGZ1bmN0aW9uKGUpIHtcclxuICAgICAgICBlLnByZXZlbnREZWZhdWx0KCk7XHJcbiAgICAgICAgJCgnLmRpc3BsYXllZEFuc3dlcnMnKS5lbXB0eSgpO1xyXG4gICAgICAgIFxyXG4gICAgICAgIGNvbnN0IHN1Ym1pdEFuc3dlciA9ICQoJy51c2VyQW5zd2VyJykudGV4dCgpO1xyXG5cclxuICAgICAgICBjb25zdCBnZXRBUEkgPSBmdW5jdGlvbihxdWVyeSkge1xyXG4gICAgICAgICAgICAkLmFqYXgoe1xyXG4gICAgICAgICAgICAgICAgdXJsOiBgJHthcHAudXJsfSR7cXVlcnl9YCxcclxuICAgICAgICAgICAgICAgIG1ldGhvZDogXCJHRVRcIixcclxuICAgICAgICAgICAgICAgIGRhdGFUeXBlOiAnanNvbicsXHJcbiAgICAgICAgICAgICAgICBkYXRhOiB7XHJcbiAgICAgICAgICAgICAgICAgICAga2V5OiBhcHAua2V5XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIH0pLnRoZW4ocmVzcCA9PiB7XHJcbiAgICAgICAgICAgICAgICBjb25zb2xlLmxvZyhyZXNwKTtcclxuXHJcbiAgICAgICAgICAgICAgICAvLyBjb25zdCB3b3JkID0gcmVzcC5lbnRyeV9saXN0LmVudHJ5O1xyXG4gICAgICAgICAgICAgICAgY29uc3Qgd29yZCA9IHJlc3BbMF07XHJcbiAgICAgICAgICAgICAgICBjb25zb2xlLmxvZyh3b3JkKTtcclxuICAgICAgICAgICAgICAgIFxyXG5cclxuICAgICAgICAgICAgICAgIGlmICghd29yZC5mbCkge1xyXG4gICAgICAgICAgICAgICAgICAgIGFwcC53cm9uZ0FsZXJ0KCk7XHJcbiAgICAgICAgICAgICAgICAgICAgLy8gY29uc29sZS5sb2coJ3N1Z2dlc3Rpb24nKTtcclxuXHJcbiAgICAgICAgICAgICAgICB9IC8vIGVuZCBvZiBzdWdnZXN0aW9uXHJcbiAgICAgICAgICAgICAgICBlbHNlIGlmICh3b3JkLmZsKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgaWYgKHdvcmQuZmwgPT09ICdhYmJyZXZpYXRpb24nIHx8IHdvcmQuZmwgPT09ICdjb21iaW5pbmcgZm9ybScpIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgYW5zd2VyTGlzdC5kZWxldGUod29yZC5mbCk7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGFwcC53cm9uZ0FsZXJ0KCk7XHJcbiAgICAgICAgICAgICAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgYXBwLmR1cGxpY2F0ZUFuc3dlcih3b3JkLmh3aS5odyk7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGFuc3dlckxpc3QuYWRkKHdvcmQuaHdpLmh3KTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgYXBwLmZpbmRXaGl0ZVNwYWNlKHdvcmQuaHdpLmh3KTtcclxuICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICAgICAgXHJcbiAgICAgICAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgICAgICAgXHJcbiAgICAgICAgICAgICAgICAvLyBlbHNlIGlmICh3b3JkKSB7IC8vIHN0YXJ0IG9mIGlmICh3b3JkKVxyXG4gICAgICAgICAgICAgICAgLy8gICAgIGlmICh3b3JkWzBdKSB7IC8vaXMgYXJyYXlcclxuICAgICAgICAgICAgICAgIC8vICAgICAgICAgaWYgKHdvcmRbMF0uZmwgPT09IFwibm91blwiIHx8IHdvcmRbMF0uZmwgPT09IFwidmVyYlwiIHx8IHdvcmRbMF0uZmwgPT09IFwiYWRqZWN0aXZlXCIgfHwgd29yZFswXS5mbCA9PT0gXCJhZHZlcmJcIiB8fCB3b3JkWzBdLmZsID09PSBcInByb25vdW5cIiB8fCB3b3JkWzBdLmZsID09PSBcInByZXBvc2l0aW9uXCIgfHwgd29yZFswXS5mbCA9PT0gXCJjb25qdW5jdGlvblwiIHx8IHdvcmRbMF0uZmwgPT09IFwiZGV0ZXJtaW5lclwiIHx8IHdvcmRbMF0uZmwgPT09IFwicHJvbm91biwgcGx1cmFsIGluIGNvbnN0cnVjdGlvblwiKSB7IC8vIGFycmF5IHdvcmQgdHlwZXNcclxuICAgICAgICAgICAgICAgIC8vICAgICAgICAgYXBwLmR1cGxpY2F0ZUFuc3dlcih3b3JkWzBdLmV3KTtcclxuICAgICAgICAgICAgICAgIC8vICAgICAgICAgYW5zd2VyTGlzdC5hZGQod29yZFswXS5ldyk7XHJcbiAgICAgICAgICAgICAgICAvLyAgICAgICAgIGFwcC5maW5kV2hpdGVTcGFjZSh3b3JkWzBdLmV3KTtcclxuXHJcbiAgICAgICAgICAgICAgICAvLyAgICAgICAgICAgICBpZiAod29yZFswXS5ldyA9PT0gd29yZFswXS5ldy50b1VwcGVyQ2FzZSgpIHx8IHdvcmRbMF0uZXcgPT09ICh3b3JkWzBdLmV3KS5jaGFyQXQoMCkudG9VcHBlckNhc2UoKSArICh3b3JkWzBdLmV3KS5zbGljZSgxKSkgeyAvLyB3b3JkIGlzIHVwcGVyY2FzZSBhYmJyZXYgT1IgY2FwaXRhbGl6ZWRcclxuICAgICAgICAgICAgICAgIC8vICAgICAgICAgICAgICAgICBhbnN3ZXJMaXN0LmRlbGV0ZSh3b3JkWzBdLmV3KTtcclxuICAgICAgICAgICAgICAgIC8vICAgICAgICAgICAgICAgICBhcHAud3JvbmdBbGVydCgpO1xyXG4gICAgICAgICAgICAgICAgLy8gICAgICAgICAgICAgfSAvL2VuZCBvZiB3b3JkIGlzIHVwcGVyY2FzZSBhYmJyZXYgT1IgY2FwaXRhbGl6ZWRcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIFxyXG4gICAgICAgICAgICAgICAgLy8gICAgICAgICB9IC8vZW5kIG9mIGFycmF5IHdvcmQgdHlwZXNcclxuICAgICAgICAgICAgICAgIC8vICAgICAgICAgZWxzZSBpZiAod29yZFswXS5jeC5jdCB8fCB3b3JkWzBdLmN4WzBdLmN0KSB7IC8vdGFyZ2V0aW5nIHBhc3QgdGVuc2Ugd29yZHMgZm9yIGFycmF5c1xyXG4gICAgICAgICAgICAgICAgLy8gICAgICAgICAgICAgYXBwLmR1cGxpY2F0ZUFuc3dlcih3b3JkWzBdLmV3KTtcclxuICAgICAgICAgICAgICAgIC8vICAgICAgICAgICAgIGFuc3dlckxpc3QuYWRkKHdvcmRbMF0uZXcpO1xyXG4gICAgICAgICAgICAgICAgLy8gICAgICAgICAgICAgYXBwLmZpbmRXaGl0ZVNwYWNlKHdvcmRbMF0uZXcpO1xyXG4gICAgICAgICAgICAgICAgLy8gICAgICAgICB9IC8vZW5kIG9mIHBhc3QgdGVuc2Ugd29yZHMgZm9yIGFycmF5c1xyXG4gICAgICAgICAgICAgICAgLy8gICAgICAgICBlbHNlIHsgLy8gdW5hY2NlcHRlZCB3b3JkIHR5cGUgZm9yIGFycmF5c1xyXG4gICAgICAgICAgICAgICAgLy8gICAgICAgICAgICAgYXBwLndyb25nQWxlcnQoKTtcclxuICAgICAgICAgICAgICAgIC8vICAgICAgICAgfSAvL2VuZCBvZiB1bmFjY2VwdGVkIHdvcmQgdHlwZSBmb3IgYXJyYXlzXHJcblxyXG5cclxuICAgICAgICAgICAgICAgIC8vICAgICB9IC8vIGVuZCBvZiBpcyBhcnJheVxyXG4gICAgICAgICAgICAgICAgLy8gICAgIGVsc2UgeyAvL2lzIG9iamVjdFxyXG4gICAgICAgICAgICAgICAgLy8gICAgICAgICBpZiAod29yZC5mbCA9PT0gXCJub3VuXCIgfHwgd29yZC5mbCA9PT0gXCJ2ZXJiXCIgfHwgd29yZC5mbCA9PT0gXCJhZGplY3RpdmVcIiB8fCB3b3JkLmZsID09PSBcImFkdmVyYlwiIHx8IHdvcmQuZmwgPT09IFwicHJvbm91blwiIHx8IHdvcmQuZmwgPT09IFwicHJlcG9zaXRpb25cIiB8fCB3b3JkLmZsID09PSBcImNvbmp1bmN0aW9uXCIgfHwgd29yZC5mbCA9PT0gXCJkZXRlcm1pbmVyXCIgfHwgd29yZC5mbCA9PT0gXCJwcm9ub3VuLCBwbHVyYWwgaW4gY29uc3RydWN0aW9uXCIpIHsgLy8gb2JqZWN0IHdvcmQgdHlwZXMgXHJcbiAgICAgICAgICAgICAgICAvLyAgICAgICAgIGFwcC5kdXBsaWNhdGVBbnN3ZXIod29yZC5ldyk7XHJcbiAgICAgICAgICAgICAgICAvLyAgICAgICAgIGFuc3dlckxpc3QuYWRkKHdvcmQuZXcpO1xyXG4gICAgICAgICAgICAgICAgLy8gICAgICAgICBhcHAuZmluZFdoaXRlU3BhY2Uod29yZC5ldyk7XHJcblxyXG4gICAgICAgICAgICAgICAgLy8gICAgICAgICAgICAgaWYgKHdvcmQuZXcgPT09IHdvcmQuZXcudG9VcHBlckNhc2UoKSB8fCB3b3JkLmV3ID09PSAod29yZC5ldykuY2hhckF0KDApLnRvVXBwZXJDYXNlKCkgKyAod29yZC5ldykuc2xpY2UoMSkpIHsgLy8gd29yZCBpcyB1cHBlcmNhc2UgYWJicmV2IE9SIGNhcGl0YWxpemVkXHJcbiAgICAgICAgICAgICAgICAvLyAgICAgICAgICAgICAgICAgYW5zd2VyTGlzdC5kZWxldGUod29yZC5ldyk7XHJcbiAgICAgICAgICAgICAgICAvLyAgICAgICAgICAgICAgICAgYXBwLndyb25nQWxlcnQoKTtcclxuICAgICAgICAgICAgICAgIC8vICAgICAgICAgICAgIH0gLy9lbmQgb2Ygd29yZCBpcyB1cHBlcmNhc2UgYWJicmV2IE9SIGNhcGl0YWxpemVkXHJcbiAgICAgICAgICAgICAgICAvLyAgICAgICAgICAgICBlbHNlIGlmICh3b3JkLmV0ID09PSBcImJ5IHNob3J0ZW5pbmcgJiBhbHRlcmF0aW9uXCIpIHsgLy9zaG9ydGZvcm0gd29yZFxyXG4gICAgICAgICAgICAgICAgLy8gICAgICAgICAgICAgICAgIGFuc3dlckxpc3QuZGVsZXRlKHdvcmQuZXcpO1xyXG4gICAgICAgICAgICAgICAgLy8gICAgICAgICAgICAgICAgIGFwcC53cm9uZ0FsZXJ0KCk7XHJcbiAgICAgICAgICAgICAgICAvLyAgICAgICAgICAgICB9IC8vIGVuZCBvZiBzaG9ydGZvcm0gd29yZCBsaWtlIFwiaGVsb1wiXHJcblxyXG4gICAgICAgICAgICAgICAgLy8gICAgICAgICB9IC8vZW5kIG9mIG9iamVjdCB3b3JkIHR5cGVzXHJcbiAgICAgICAgICAgICAgICAvLyAgICAgICAgIGVsc2UgaWYgKHdvcmQuY3guY3QgfHwgd29yZC5jeFswXS5jdCkgeyAvL3RhcmdldGluZyBwYXN0IHRlbnNlIHdvcmRzIGZvciBvYmplY3RzIFxyXG4gICAgICAgICAgICAgICAgLy8gICAgICAgICAgICAgYXBwLmR1cGxpY2F0ZUFuc3dlcih3b3JkLmV3KTtcclxuICAgICAgICAgICAgICAgIC8vICAgICAgICAgICAgIGFuc3dlckxpc3QuYWRkKHdvcmQuZXcpO1xyXG4gICAgICAgICAgICAgICAgLy8gICAgICAgICAgICAgYXBwLmZpbmRXaGl0ZVNwYWNlKHdvcmQuZXcpO1xyXG4gICAgICAgICAgICAgICAgLy8gICAgICAgICB9IC8vZW5kIG9mIHBhc3QgdGVuc2Ugd29yZHMgZm9yIG9iamVjdHNcclxuICAgICAgICAgICAgICAgIC8vICAgICAgICAgZWxzZSB7IC8vIHVuYWNjZXB0ZWQgd29yZCB0eXBlIGZvciBvYmplY3RzXHJcbiAgICAgICAgICAgICAgICAvLyAgICAgICAgICAgICBhcHAud3JvbmdBbGVydCgpO1xyXG4gICAgICAgICAgICAgICAgLy8gICAgICAgICB9IC8vZW5kIG9mIHVuYWNjZXB0ZWQgd29yZCB0eXBlIGZvciBvYmplY3RzXHJcblxyXG4gICAgICAgICAgICAgICAgLy8gICAgIH0gLy9lbmQgb2YgaXMgb2JqZWN0XHJcblxyXG4gICAgICAgICAgICAgICAgLy8gfSAvLyBlbmQgb2YgaWYgKHdvcmQpXHJcbiAgICAgICAgICAgICAgICAvLyBlbHNlIHsgLy9ub3QgYSB3b3JkXHJcbiAgICAgICAgICAgICAgICAvLyAgICAgYXBwLndyb25nQWxlcnQoKTtcclxuXHJcbiAgICAgICAgICAgICAgICAvLyB9OyAvL2VuZCBvZiBpZiBzdGF0ZW1lbnRzISFcclxuICAgICAgICAgICAgICAgICAgICBcclxuICAgICAgICAgICAgICAgICQoJy51c2VyQW5zd2VyJykuZW1wdHkoKTtcclxuICAgICAgICAgICAgICAgIGFuc3dlciA9IFwiXCI7XHJcbiAgICAgICAgICAgICAgICAkKCcubGV0dGVyJykucmVtb3ZlQ2xhc3MoJ3NlbGVjdGVkJyk7XHJcbiAgICAgICAgICAgICAgICBjb25zb2xlLmxvZyhhbnN3ZXJMaXN0KTtcclxuXHJcbiAgICAgICAgICAgICAgICBhcHAuZGlzcGxheUFuc3dlcnMoKTtcclxuICAgICAgICAgICAgICAgIGFwcC5jaGFuZ2VTY29yZSgpO1xyXG4gICAgICAgICAgICAgICAgJCgnLmxldHRlcicpLnJlbW92ZUNsYXNzKCd1bmNsaWNrYWJsZScpO1xyXG4gICAgICAgICAgICAgICAgXHJcbiAgICAgICAgICAgICAgICBcclxuICAgICAgICAgICAgfSk7IC8vIGVuZCBvZiB0aGVuXHJcblxyXG4gICAgICAgIH07IC8vIGVuZCBvZiBnZXRBUEkgZnVuY3Rpb25cclxuICAgICAgICAvLyBjb25zb2xlLmxvZyhnZXRBUEkoc3VibWl0QW5zd2VyKSk7XHJcbiAgICAgICAgZ2V0QVBJKHN1Ym1pdEFuc3dlcik7XHJcbiAgICAgICAgXHJcbiAgICAgICAgXHJcbiAgICB9KTsgIC8vIGVuZCBvZiBmb3JtIHN1Ym1pdFxyXG4gICAgXHJcbn07IC8vIGVuZCBvZiBldmVudCBmdW5jdGlvblxyXG5cclxuXHJcbi8vIEFQUEVORCBBTlNXRVIgVE8gVEhFIERJU1BMQVlFREFOU1dFUlMgRElWXHJcblxyXG5hcHAuZGlzcGxheUFuc3dlcnMgPSBmdW5jdGlvbigpIHtcclxuICAgIGFuc3dlckxpc3QuZm9yRWFjaChmdW5jdGlvbih3b3JkKXtcclxuICAgICAgICAvLyAkKCcuZGlzcGxheWVkQW5zd2VycycpLmVtcHR5KCk7XHJcbiAgICAgICAgJCgnLmRpc3BsYXllZEFuc3dlcnMnKS5hcHBlbmQoYDxsaT4ke3dvcmR9PC9saT5gKVxyXG4gICAgfSk7XHJcbn07IC8vIGVuZCBvZiBkaXNwbGF5QW5zd2VycyBmdWNudGlvblxyXG5cclxuXHJcbi8vIElGIERVUExJQ0FURSwgTUFLRSBUSEUgU1VCTUlUIEJVVFRPTiBTSE9XIFRIQVQgVEhFWSBBUkUgV1JPTkdcclxuXHJcbmFwcC5kdXBsaWNhdGVBbnN3ZXIgPSBmdW5jdGlvbih3b3JkKSB7IFxyXG4gICAgaWYgKGFuc3dlckxpc3QuaGFzKHdvcmQpKSB7XHJcbiAgICAgICAgYXBwLndyb25nQWxlcnQoKTtcclxuICAgIH07XHJcbn07IC8vIGVuZCBvZiBkdXBsaWNhdGVBbnN3ZXIgZnVuY3Rpb25cclxuXHJcbmFwcC53cm9uZ0FsZXJ0ID0gZnVuY3Rpb24oKSB7XHJcbiAgICAkKCcuc3VibWl0QnV0dG9uJykucmVtb3ZlQ2xhc3MoJ3B1bHNlIGluZmluaXRlJykuYWRkQ2xhc3MoJ3dyb25nIHdvYmJsZScpO1xyXG4gICAgc2V0VGltZW91dCgoKSA9PiB7XHJcbiAgICAgICAgJCgnLnN1Ym1pdEJ1dHRvbicpLnJlbW92ZUNsYXNzKCd3cm9uZyB3b2JibGUnKS5hZGRDbGFzcygnaW5maW5pdGUgcHVsc2UnKTtcclxuICAgIH0sIDEwMDApO1xyXG4gICAgJCgnLmxldHRlci5zZWxlY3RlZCcpLmFkZENsYXNzKCd3cm9uZycpO1xyXG4gICAgc2V0VGltZW91dCgoKSA9PiB7XHJcbiAgICAgICAgJCgnLmxldHRlcicpLnJlbW92ZUNsYXNzKCd3cm9uZycpO1xyXG4gICAgfSwgMTAwMCk7XHJcbn1cclxuXHJcblxyXG4vLyBTQ09SRSBXSUxMIEJFIFRIRSBTQU1FIEFTIFRIRSBOVU1CRVIgT0YgSVRFTVMgT04gVEhFIFNFVFxyXG5cclxuYXBwLmNoYW5nZVNjb3JlID0gZnVuY3Rpb24oKSB7XHJcbiAgICBsZXQgc2NvcmUgPSBhbnN3ZXJMaXN0LnNpemU7XHJcbiAgICAkKCcuc2NvcmUnKS5odG1sKGAke3Njb3JlfWApO1xyXG4gICAgJCgnLnNjb3JlQm9hcmQnKS5hZGRDbGFzcygnZ3JvdycpO1xyXG4gICAgc2V0VGltZW91dCgoKSA9PiB7XHJcbiAgICAgICAgJCgnLnNjb3JlQm9hcmQnKS5yZW1vdmVDbGFzcygnZ3JvdycpO1xyXG4gICAgfSwgNTAwKTtcclxufTtcclxuXHJcblxyXG4vLyBpZiBBUEkgcmVzdWx0IGhhcyBhIHNwYWNlIGluIGl0LCBkb24ndCBzaG93IGl0IGFuZCBjb3VudCBpdCBhcyB3cm9uZ1xyXG5cclxuYXBwLmZpbmRXaGl0ZVNwYWNlID0gZnVuY3Rpb24gKCkge1xyXG4gICAgYW5zd2VyTGlzdC5mb3JFYWNoKGZ1bmN0aW9uICh3b3JkKSB7XHJcbiAgICAgICAgbGV0IG4gPSB3b3JkLmluY2x1ZGVzKFwiIFwiKTtcclxuICAgICAgICBpZiAod29yZCA9IG4pIHtcclxuICAgICAgICAgICAgYXBwLndyb25nQWxlcnQoKTtcclxuICAgICAgICAgICAgYW5zd2VyTGlzdC5kZWxldGUod29yZCk7XHJcbiAgICAgICAgfTtcclxuICAgIH0pOyAvLyBlbmQgb2YgZm9yRWFjaCBsb29wXHJcbn07IC8vIGVuZCBvZiBmaW5kV2hpdGVTcGFjZVxyXG5cclxuXHJcbi8vIFRJTUVSXHJcblxyXG5hcHAudGltZXIgPSBmdW5jdGlvbihzZWNvbmRzKSB7XHJcbiAgICBjb25zdCBub3cgPSBEYXRlLm5vdygpO1xyXG4gICAgY29uc3QgdGhlbiA9IG5vdyArIHNlY29uZHMgKiAxMDAwO1xyXG4gICAgZGlzcGxheVRpbWVMZWZ0KHNlY29uZHMpO1xyXG4gICAgY291bnRkb3duID0gc2V0SW50ZXJ2YWwoKCkgPT4ge1xyXG4gICAgICAgIGxldCBzZWNvbmRzTGVmdCA9ICh0aGVuIC0gRGF0ZS5ub3coKSkgLyAxMDAwO1xyXG4gICAgICAgIGlmKHNlY29uZHNMZWZ0IDw9IDApIHtcclxuICAgICAgICAgICAgY2xlYXJJbnRlcnZhbChjb3VudGRvd24pO1xyXG4gICAgICAgICAgICBhcHAuZ2FtZU92ZXIoKVxyXG4gICAgICAgICAgICByZXR1cm47XHJcbiAgICAgICAgfVxyXG4gICAgICAgIGRpc3BsYXlUaW1lTGVmdChzZWNvbmRzTGVmdCk7XHJcbiAgICB9LCAxMDAwKTtcclxufSAvLyBlbmQgb2YgdGltZXIgZnVuY3Rpb25cclxuXHJcbi8vIERJU1BMQVkgVEhFIFRJTUVcclxuXHJcbmZ1bmN0aW9uIGRpc3BsYXlUaW1lTGVmdChzZWNvbmRzKSB7XHJcbiAgICBjb25zdCBtaW51dGVzID0gTWF0aC5mbG9vcihzZWNvbmRzIC8gNjApO1xyXG4gICAgbGV0IHJlbWFpbmRlclNlY29uZHMgPSBNYXRoLmZsb29yKHNlY29uZHMgJSA2MCk7XHJcbiAgICBsZXQgZGlzcGxheSA9IGAke21pbnV0ZXN9OiR7cmVtYWluZGVyU2Vjb25kc31gO1xyXG4gICAgaWYgKHJlbWFpbmRlclNlY29uZHMgPCAxMCkge1xyXG4gICAgICAgIHJlbWFpbmRlclNlY29uZHMgPSBcIjBcIiArIHJlbWFpbmRlclNlY29uZHM7XHJcbiAgICAgICAgZGlzcGxheSA9IGAke21pbnV0ZXN9OiR7cmVtYWluZGVyU2Vjb25kc31gO1xyXG4gICAgfVxyXG4gICAgdGltZXJEaXNwbGF5LnRleHRDb250ZW50ID0gZGlzcGxheTtcclxufSAvLyBlbmQgb2YgZGlzcGxheWluZyB0aGUgdGltZVxyXG5cclxuLy8gR0FNRSBPVkVSIE9WRVJMQVlcclxuYXBwLmdhbWVPdmVyID0gZnVuY3Rpb24oKSB7XHJcbiAgICAkKCcub3ZlcmxheScpLnJlbW92ZUNsYXNzKCdoaWRlJyk7XHJcbiAgICAkKCcucGxheUFnYWluJykub24oJ2NsaWNrIHRvdWNoc3RhcnQnLCBmdW5jdGlvbihlKSB7XHJcbiAgICAgICAgZS5wcmV2ZW50RGVmYXVsdCgpO1xyXG4gICAgICAgIGxvY2F0aW9uLnJlbG9hZCgpO1xyXG4gICAgICAgICQoJy5vdmVybGF5JykuYWRkQ2xhc3MoJ2hpZGUnKTtcclxuICAgIH0pOyAvLyBlbmQgb2Ygc3RhcnQgZXZlbnQgZnVuY3Rpb25cclxuXHJcbn1cclxuXHJcbi8vIGluaXRpYWxpemUgZnVuY3Rpb25cclxuYXBwLmluaXQgPSBmdW5jdGlvbiAoKSB7XHJcbiAgICBhcHAuc3dpdGNoU2NyZWVucygpO1xyXG4gICAgYXBwLmdldEJvYXJkKCk7XHJcbiAgICBhcHAuZXZlbnRzKCk7XHJcbn07XHJcblxyXG4vLyBydW4gaW5pdGlhbGl6ZSBmdW5jdGlvbiB0aHJvdWdoIHRoZSBkb2MgcmVhZHkgZnVuY3Rpb24gKG9uIHBhZ2UgbG9hZClcclxuJChmdW5jdGlvbiAoKSB7XHJcbiAgICBhcHAuaW5pdCgpO1xyXG59KTsiXX0=
