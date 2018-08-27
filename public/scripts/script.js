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
        window.location.replace("WordScramble/board.html");
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
    app.timer(10); // 90 seconds on the timer
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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm5vZGVfbW9kdWxlcy9icm93c2VyLXBhY2svX3ByZWx1ZGUuanMiLCJkZXYvc2NyaXB0cy9zY3JpcHQuanMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7OztBQ0FBO0FBQ0EsSUFBTSxNQUFNLEVBQVo7QUFDQSxJQUFNLFFBQVEsa0VBQWQ7QUFDQSxJQUFJLFNBQVMsRUFBYjtBQUNBLElBQU0sYUFBYSxJQUFJLEdBQUosRUFBbkI7QUFDQSxJQUFJLGtCQUFKO0FBQ0EsSUFBTSxlQUFlLFNBQVMsYUFBVCxDQUF1QixXQUF2QixDQUFyQjs7QUFFQSxJQUFJLEdBQUosR0FBVSxpRUFBVjtBQUNBLElBQUksR0FBSixHQUFVLHNDQUFWOztBQUdBOztBQUVBLElBQUksYUFBSixHQUFvQixZQUFXO0FBQzNCLE1BQUUsUUFBRixFQUFZLEVBQVosQ0FBZSxrQkFBZixFQUFtQyxVQUFTLENBQVQsRUFBWTtBQUMzQyxVQUFFLGNBQUY7QUFDQSxlQUFPLFFBQVAsQ0FBZ0IsT0FBaEIsQ0FBd0IseUJBQXhCO0FBQ0gsS0FIRCxFQUQyQixDQUl2QjtBQUNQLENBTEQsQyxDQUtHOztBQUVILElBQUksUUFBSixHQUFlLFlBQVU7QUFDakI7QUFDQSxTQUFLLElBQUksSUFBSSxDQUFiLEVBQWdCLEtBQUssRUFBckIsRUFBeUIsR0FBekIsRUFBOEI7QUFDMUI7QUFDQSxZQUFNLFNBQVMsTUFBTSxLQUFLLEtBQUwsQ0FBVyxLQUFLLE1BQUwsS0FBZ0IsRUFBM0IsQ0FBTixDQUFmO0FBQ0E7QUFDQSxnQkFBTSxDQUFOLEVBQVcsTUFBWCxvQ0FBbUQsTUFBbkQ7QUFDSDtBQUNELFFBQUksS0FBSixDQUFVLEVBQVYsRUFSaUIsQ0FRRjtBQUN0QixDQVRELEMsQ0FTRzs7QUFFSCxJQUFJLE1BQUosR0FBYSxZQUFXO0FBQUU7OztBQUd0Qjs7QUFFQSxNQUFFLE1BQUYsRUFBVSxFQUFWLENBQWEsa0JBQWIsRUFBaUMsU0FBakMsRUFBNEMsVUFBUyxDQUFULEVBQVk7QUFDcEQsVUFB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QUFiLEdBQTJCLE9BQTNCO0FBQ0gsQyxDQUFDOztBQUVGO0FBQ0EsSUFBSSxRQUFKLEdBQWUsWUFBVztBQUN0QixNQUFFLFVBQUYsRUFBYyxXQUFkLENBQTBCLE1BQTFCO0FBQ0EsTUFBRSxZQUFGLEVBQWdCLEVBQWhCLENBQW1CLGtCQUFuQixFQUF1QyxVQUFTLENBQVQsRUFBWTtBQUMvQyxVQUFFLGNBQUY7QUFDQSxpQkFBUyxNQUFUO0FBQ0EsVUFBRSxVQUFGLEVBQWMsUUFBZCxDQUF1QixNQUF2QjtBQUNILEtBSkQsRUFGc0IsQ0FNbEI7QUFFUCxDQVJEOztBQVVBO0FBQ0EsSUFBSSxJQUFKLEdBQVcsWUFBWTtBQUNuQixRQUFJLGFBQUo7QUFDQSxRQUFJLFFBQUo7QUFDQSxRQUFJLE1BQUo7QUFDSCxDQUpEOztBQU1BO0FBQ0EsRUFBRSxZQUFZO0FBQ1YsUUFBSSxJQUFKO0FBQ0gsQ0FGRCIsImZpbGUiOiJnZW5lcmF0ZWQuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlc0NvbnRlbnQiOlsiKGZ1bmN0aW9uKCl7ZnVuY3Rpb24gcihlLG4sdCl7ZnVuY3Rpb24gbyhpLGYpe2lmKCFuW2ldKXtpZighZVtpXSl7dmFyIGM9XCJmdW5jdGlvblwiPT10eXBlb2YgcmVxdWlyZSYmcmVxdWlyZTtpZighZiYmYylyZXR1cm4gYyhpLCEwKTtpZih1KXJldHVybiB1KGksITApO3ZhciBhPW5ldyBFcnJvcihcIkNhbm5vdCBmaW5kIG1vZHVsZSAnXCIraStcIidcIik7dGhyb3cgYS5jb2RlPVwiTU9EVUxFX05PVF9GT1VORFwiLGF9dmFyIHA9bltpXT17ZXhwb3J0czp7fX07ZVtpXVswXS5jYWxsKHAuZXhwb3J0cyxmdW5jdGlvbihyKXt2YXIgbj1lW2ldWzFdW3JdO3JldHVybiBvKG58fHIpfSxwLHAuZXhwb3J0cyxyLGUsbix0KX1yZXR1cm4gbltpXS5leHBvcnRzfWZvcih2YXIgdT1cImZ1bmN0aW9uXCI9PXR5cGVvZiByZXF1aXJlJiZyZXF1aXJlLGk9MDtpPHQubGVuZ3RoO2krKylvKHRbaV0pO3JldHVybiBvfXJldHVybiByfSkoKSIsIi8vIGxpc3Qgb2YgY29uc3RhbnRzXHJcbmNvbnN0IGFwcCA9IHt9O1xyXG5jb25zdCBjaGFycyA9ICdhYWFhYWJiY2NkZGRlZWVlZWVlZmdnaGhpaWlpaWlqa2xsbG1tbm5vb29vb3BycnJyc3NzdHR0dHV1dXZ3eHl6JztcclxubGV0IGFuc3dlciA9ICcnO1xyXG5jb25zdCBhbnN3ZXJMaXN0ID0gbmV3IFNldCgpO1xyXG5sZXQgY291bnRkb3duO1xyXG5jb25zdCB0aW1lckRpc3BsYXkgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKCcudGltZUxlZnQnKTtcclxuXHJcbmFwcC51cmwgPSAnaHR0cHM6Ly93d3cuZGljdGlvbmFyeWFwaS5jb20vYXBpL3YxL3JlZmVyZW5jZXMvY29sbGVnaWF0ZS94bWwvJztcclxuYXBwLmtleSA9ICc4YzVjODVhMy1mZmEzLTRmMDktYjkwMS03ZGI4MjA5MDE1ZGMnO1xyXG5cclxuXHJcbi8vIFJBTkRPTUxZIEdFTkVSQVRFIExFVFRFUlMgT04gQSA0WDQgR1JJRCBXSEVOIFBSRVNTSU5HICdTVEFSVCBHQU1FJ1xyXG5cclxuYXBwLnN3aXRjaFNjcmVlbnMgPSBmdW5jdGlvbiAoKXtcclxuICAgICQoJy5zdGFydCcpLm9uKCdjbGljayB0b3VjaHN0YXJ0JywgZnVuY3Rpb24oZSkge1xyXG4gICAgICAgIGUucHJldmVudERlZmF1bHQoKTtcclxuICAgICAgICB3aW5kb3cubG9jYXRpb24ucmVwbGFjZShcIldvcmRTY3JhbWJsZS9ib2FyZC5odG1sXCIpO1xyXG4gICAgfSk7IC8vIGVuZCBvZiBzdGFydCBldmVudCBmdW5jdGlvblxyXG59OyAvLyBlbmQgb2Ygc3dpdGNoU2NyZWVucyBmdW5jdGlvblxyXG5cclxuYXBwLmdldEJvYXJkID0gZnVuY3Rpb24oKXtcclxuICAgICAgICAvLyB3cml0ZSBhIGZvciBsb29wIHRvIGl0ZXJhdGUgb3ZlciBlYWNoIGJveCBvbiB0aGUgYm9hcmRcclxuICAgICAgICBmb3IgKGxldCBpID0gMTsgaSA8PSAxNjsgaSsrKSB7XHJcbiAgICAgICAgICAgIC8vIGdlbmVyYXRlIHJhbmRvbSBsZXR0ZXJzXHJcbiAgICAgICAgICAgIGNvbnN0IHJhbkxldCA9IGNoYXJzW01hdGguZmxvb3IoTWF0aC5yYW5kb20oKSAqIDYzKV07ICAgICAgIFxyXG4gICAgICAgICAgICAvLyBhcHBlbmQgdGhlbSB0byB0aGUgYm9hcmRcclxuICAgICAgICAgICAgJChgLiR7aX1gKS5hcHBlbmQoYDxhIGhyZWY9XCIjXCIgY2xhc3M9XCJsZXR0ZXJcIj48cD4ke3JhbkxldH08L3A+PC9hPmApICAgICAgICAgICAgXHJcbiAgICAgICAgfTtcclxuICAgICAgICBhcHAudGltZXIoMTApOyAvLyA5MCBzZWNvbmRzIG9uIHRoZSB0aW1lclxyXG59OyAvL2VuZCBvZiBnZXRCb2FyZFxyXG5cclxuYXBwLmV2ZW50cyA9IGZ1bmN0aW9uKCkgeyAvL0VWRU5UUyBGVU5DVElPTiBPTkNFIFRIRSBCT0FSRCBJUyBNQURFXHJcblxyXG5cclxuICAgIC8vIERJU1BMQVkgVEhFIEFOU1dFUlxyXG4gICAgXHJcbiAgICAkKCcuYm94Jykub24oJ2NsaWNrIHRvdWNoc3RhcnQnLCAnLmxldHRlcicgLGZ1bmN0aW9uKGUpIHtcclxuICAgICAgICBlLnByZXZlbnREZWZhdWx0KCk7IC8vIHByZXZlbnQgZGVmYXVsdFxyXG4gICAgICAgICQodGhpcykuYWRkQ2xhc3MoJ3NlbGVjdGVkJyk7XHJcbiAgICAgICAgbGV0IGFjdGl2ZUxldHRlciA9ICQodGhpcykuZmluZCgncCcpLnRleHQoKTtcclxuICAgICAgICBhbnN3ZXIgKz0gYWN0aXZlTGV0dGVyO1xyXG4gICAgICAgICQoJy51c2VyQW5zd2VyJykuaHRtbChgPHA+JHthbnN3ZXJ9PC9wPmApO1xyXG4gICAgICAgIFxyXG4gICAgICAgIC8vIFNUUkVUQ0ggR09BTCBcclxuXHJcbiAgICAgICAgLy8gdXBvbiBmaXJzdCBjbGljaywgbWFrZSBldmVyeXRoaW5nICd1bmNsaWNrYWJsZSdcclxuICAgICAgICAkKCcubGV0dGVyJykuYWRkQ2xhc3MoJ3VuY2xpY2thYmxlJyk7XHJcbiAgICAgICAgXHJcbiAgICAgICAgLy8gc2VsZWN0ZWRCb3hOdW0gaXMgZXF1YWwgdG8gdGhlICpudW1iZXIqIGNsYXNzIG9mIHRoZSBib3ggZGl2XHJcbiAgICAgICAgbGV0IHNlbGVjdGVkQm94TnVtID0gcGFyc2VJbnQoKCQodGhpcykucGFyZW50KCkpLmF0dHIoJ2NsYXNzJykuc2xpY2UoLTIpKTtcclxuXHJcbiAgICAgICAgLy8gaWYgc3RhdGVtZW50cyBmb3IgcmVtb3ZpbmcgJ3VuY2xpY2thYmxlJyBjbGFzcyBmcm9tIGJveGVzIGluIGZpcnN0IGNvbHVtbiwgbWlkZGxlIGNvbHVtbnMgYW5kIGxhc3QgY29sdW1uXHJcbiAgICAgICAgZm9yKGxldCBpID0gMTsgaSA8PSAxNjsgaSsrKSB7XHJcbiAgICAgICAgICAgIGlmICgkKGAuJHtzZWxlY3RlZEJveE51bX1gKS5oYXNDbGFzcygnZmlyc3RDb2x1bW4nKSkgeyAvL2ZpcnN0Q29sdW1uXHJcbiAgICAgICAgICAgICAgICBpZiAoaSA9PT0gc2VsZWN0ZWRCb3hOdW0gKyAxKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgJChgLiR7aX0gLmxldHRlcmApLnJlbW92ZUNsYXNzKCd1bmNsaWNrYWJsZScpO1xyXG4gICAgICAgICAgICAgICAgfSBlbHNlIGlmIChpID09PSBzZWxlY3RlZEJveE51bSAtIDMpIHtcclxuICAgICAgICAgICAgICAgICAgICAkKGAuJHtpfSAubGV0dGVyYCkucmVtb3ZlQ2xhc3MoJ3VuY2xpY2thYmxlJylcclxuICAgICAgICAgICAgICAgIH0gZWxzZSBpZiAoaSA9PT0gc2VsZWN0ZWRCb3hOdW0gKyA0IHx8IGkgPT09IHNlbGVjdGVkQm94TnVtIC0gNCkge1xyXG4gICAgICAgICAgICAgICAgICAgICQoYC4ke2l9IC5sZXR0ZXJgKS5yZW1vdmVDbGFzcygndW5jbGlja2FibGUnKVxyXG4gICAgICAgICAgICAgICAgfSBlbHNlIGlmIChpID09PSBzZWxlY3RlZEJveE51bSArIDUpIHtcclxuICAgICAgICAgICAgICAgICAgICAkKGAuJHtpfSAubGV0dGVyYCkucmVtb3ZlQ2xhc3MoJ3VuY2xpY2thYmxlJylcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgfSAvL2VuZCBvZiBmaXJzdENvbHVtblxyXG4gICAgICAgICAgICBlbHNlIGlmICgkKGAuJHtzZWxlY3RlZEJveE51bX1gKS5oYXNDbGFzcygnbGFzdENvbHVtbicpKXsgLy9sYXN0Q29sdW1uXHJcbiAgICAgICAgICAgICAgICBpZiAoaSA9PT0gc2VsZWN0ZWRCb3hOdW0gLSAxKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgJChgLiR7aX0gLmxldHRlcmApLnJlbW92ZUNsYXNzKCd1bmNsaWNrYWJsZScpO1xyXG4gICAgICAgICAgICAgICAgfSBlbHNlIGlmIChpID09PSBzZWxlY3RlZEJveE51bSArIDMpIHtcclxuICAgICAgICAgICAgICAgICAgICAkKGAuJHtpfSAubGV0dGVyYCkucmVtb3ZlQ2xhc3MoJ3VuY2xpY2thYmxlJylcclxuICAgICAgICAgICAgICAgIH0gZWxzZSBpZiAoaSA9PT0gc2VsZWN0ZWRCb3hOdW0gKyA0IHx8IGkgPT09IHNlbGVjdGVkQm94TnVtIC0gNCkge1xyXG4gICAgICAgICAgICAgICAgICAgICQoYC4ke2l9IC5sZXR0ZXJgKS5yZW1vdmVDbGFzcygndW5jbGlja2FibGUnKVxyXG4gICAgICAgICAgICAgICAgfSBlbHNlIGlmIChpID09PSBzZWxlY3RlZEJveE51bSAtIDUpIHtcclxuICAgICAgICAgICAgICAgICAgICAkKGAuJHtpfSAubGV0dGVyYCkucmVtb3ZlQ2xhc3MoJ3VuY2xpY2thYmxlJylcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgfSAvL2VuZCBvZiBsYXN0Q29sdW1uXHJcbiAgICAgICAgICAgIGVsc2UgeyAvL21pZGRsZUNvbHVtblxyXG4gICAgICAgICAgICAgICAgaWYgKGkgPT09IHNlbGVjdGVkQm94TnVtICsgMSB8fCBpID09PSBzZWxlY3RlZEJveE51bSAtIDEpIHtcclxuICAgICAgICAgICAgICAgICAgICAkKGAuJHtpfSAubGV0dGVyYCkucmVtb3ZlQ2xhc3MoJ3VuY2xpY2thYmxlJyk7XHJcbiAgICAgICAgICAgICAgICB9IGVsc2UgaWYgKGkgPT09IHNlbGVjdGVkQm94TnVtICsgMyB8fCBpID09PSBzZWxlY3RlZEJveE51bSAtIDMpIHtcclxuICAgICAgICAgICAgICAgICAgICAkKGAuJHtpfSAubGV0dGVyYCkucmVtb3ZlQ2xhc3MoJ3VuY2xpY2thYmxlJylcclxuICAgICAgICAgICAgICAgIH0gZWxzZSBpZiAoaSA9PT0gc2VsZWN0ZWRCb3hOdW0gKyA0IHx8IGkgPT09IHNlbGVjdGVkQm94TnVtIC0gNCkge1xyXG4gICAgICAgICAgICAgICAgICAgICQoYC4ke2l9IC5sZXR0ZXJgKS5yZW1vdmVDbGFzcygndW5jbGlja2FibGUnKVxyXG4gICAgICAgICAgICAgICAgfSBlbHNlIGlmIChpID09PSBzZWxlY3RlZEJveE51bSArIDUgfHwgaSA9PT0gc2VsZWN0ZWRCb3hOdW0gLSA1KSB7XHJcbiAgICAgICAgICAgICAgICAgICAgJChgLiR7aX0gLmxldHRlcmApLnJlbW92ZUNsYXNzKCd1bmNsaWNrYWJsZScpXHJcbiAgICAgICAgICAgICAgICB9ICAgICAgICAgICAgIFxyXG4gICAgICAgICAgICB9IC8vZW5kIG9mIG1pZGRsZUNvbHVtblxyXG4gICAgICAgIH0gLy9lbmQgb2YgZm9yIGxvb3BcclxuICAgIH0pOyAvL2VuZCBvZiBtYWtpbmcgdGhlIHdvcmRcclxuXHJcblxyXG4gICAgLy9wcmV2ZW50aW5nIGRlZmF1bHQgYWN0aW9uIG9uIHVuY2xpY2thYmxlXHJcbiAgICAkKCcuYm94Jykub24oJ2NsaWNrIHRvdWNoc3RhcnQnLCAnLnVuY2xpY2thYmxlJywgZnVuY3Rpb24oZSkge1xyXG4gICAgICAgIGUucHJldmVudERlZmF1bHQoKTtcclxuICAgIH0pXHJcblxyXG4gICAgLy8ga2VlcCB0aGUgZW50ZXIga2V5IGZyb20gcmVwZWF0aW5nIHRoZSBsZXR0ZXIgXHJcbiAgICAkKCcuYm94Jykub24oJ2tleWRvd24nLCAnLmxldHRlcicsIGZ1bmN0aW9uIChlKSB7XHJcbiAgICAgICAgZS5wcmV2ZW50RGVmYXVsdCgpOyAvLyBwcmV2ZW50IGRlZmF1bHRcclxuICAgIH0pO1xyXG5cclxuXHJcbiAgICAvLyBDTEVBUiBUSEUgVVNFUiBTRUxFQ1RJT05TXHJcbiAgICBcclxuICAgICQoJy5jbGVhcicpLm9uKCdjbGljayB0b3VjaHN0YXJ0JywgZnVuY3Rpb24oZSkge1xyXG4gICAgICAgIGUucHJldmVudERlZmF1bHQoKTsgLy9wcmV2ZW50IGRlZmF1bHRcclxuICAgICAgICAkKCcudXNlckFuc3dlcicpLmVtcHR5KCk7XHJcbiAgICAgICAgYW5zd2VyID0gJyc7XHJcbiAgICAgICAgJCgnLmxldHRlcicpLnJlbW92ZUNsYXNzKCdzZWxlY3RlZCB1bmNsaWNrYWJsZScpO1xyXG4gICAgICAgICQoJy5jbGVhcicpLmFkZENsYXNzKCcnKTtcclxuICAgICAgICBzZXRUaW1lb3V0KCgpID0+IHtcclxuICAgICAgICAgICAgJCgnLnN1Ym1pdEJ1dHRvbicpLnJlbW92ZUNsYXNzKCcnKTtcclxuICAgICAgICB9LCAxMDAwKTtcclxuICAgIH0pOyAvLyBlbmQgb2YgY2xlYXJcclxuICAgIFxyXG4gICAgXHJcbiAgICAvLyBDT01QQVJJTkcgVE8gVEhFIEFQSVxyXG4gICBcclxuICAgICQoJ2Zvcm0nKS5vbignc3VibWl0JywgZnVuY3Rpb24oZSkge1xyXG4gICAgICAgIGUucHJldmVudERlZmF1bHQoKTtcclxuICAgICAgICAkKCcuZGlzcGxheWVkQW5zd2VycycpLmVtcHR5KCk7XHJcbiAgICAgICAgXHJcbiAgICAgICAgY29uc3Qgc3VibWl0QW5zd2VyID0gJCgnLnVzZXJBbnN3ZXInKS50ZXh0KCk7XHJcblxyXG4gICAgICAgIGNvbnN0IGdldEFQSSA9IGZ1bmN0aW9uKHF1ZXJ5KSB7XHJcbiAgICAgICAgICAgICQuYWpheCh7XHJcbiAgICAgICAgICAgICAgICB1cmw6ICdodHRwczovL3Byb3h5LmhhY2tlcnlvdS5jb20nLFxyXG4gICAgICAgICAgICAgICAgbWV0aG9kOiAnR0VUJyxcclxuICAgICAgICAgICAgICAgIGRhdGFSZXNwb25zZTogJ2pzb24nLFxyXG4gICAgICAgICAgICAgICAgcGFyYW1zU2VyaWFsaXplcjogZnVuY3Rpb24gKHBhcmFtcykge1xyXG4gICAgICAgICAgICAgICAgICAgIHJldHVybiBRcy5zdHJpbmdpZnkocGFyYW1zLCB7IGFycmF5Rm9ybWF0OiAnYnJhY2tldHMnIH0pXHJcbiAgICAgICAgICAgICAgICB9LFxyXG4gICAgICAgICAgICAgICAgZGF0YToge1xyXG4gICAgICAgICAgICAgICAgICAgIHJlcVVybDogYXBwLnVybCxcclxuICAgICAgICAgICAgICAgICAgICBwYXJhbXM6IHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgJ2tleSc6IGFwcC5rZXksXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICd3b3JkJzogcXVlcnlcclxuICAgICAgICAgICAgICAgICAgICB9LFxyXG4gICAgICAgICAgICAgICAgICAgIHhtbFRvSlNPTjogdHJ1ZSxcclxuICAgICAgICAgICAgICAgICAgICB1c2VDYWNoZTogZmFsc2VcclxuICAgICAgICAgICAgICAgIH0gLy8gZW5kIG9mIGFqYXhcclxuICAgICAgICAgICAgfSkudGhlbihyZXNwID0+IHtcclxuICAgICAgICAgICAgICAgIGNvbnNvbGUubG9nKHJlc3ApO1xyXG5cclxuICAgICAgICAgICAgICAgIGNvbnN0IHdvcmQgPSByZXNwLmVudHJ5X2xpc3QuZW50cnk7XHJcblxyXG4gICAgICAgICAgICAgICAgaWYgKHJlc3AuZW50cnlfbGlzdC5zdWdnZXN0aW9uKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgYXBwLndyb25nQWxlcnQoKTtcclxuICAgICAgICAgICAgICAgICAgICAvLyBjb25zb2xlLmxvZygnc3VnZ2VzdGlvbicpO1xyXG5cclxuICAgICAgICAgICAgICAgIH0gLy8gZW5kIG9mIHN1Z2dlc3Rpb25cclxuICAgICAgICAgICAgICAgIGVsc2UgaWYgKHdvcmQpIHsgLy8gc3RhcnQgb2YgaWYgKHdvcmQpXHJcbiAgICAgICAgICAgICAgICAgICAgaWYgKHdvcmRbMF0pIHsgLy9pcyBhcnJheVxyXG4gICAgICAgICAgICAgICAgICAgICAgICBpZiAod29yZFswXS5mbCA9PT0gXCJub3VuXCIgfHwgd29yZFswXS5mbCA9PT0gXCJ2ZXJiXCIgfHwgd29yZFswXS5mbCA9PT0gXCJhZGplY3RpdmVcIiB8fCB3b3JkWzBdLmZsID09PSBcImFkdmVyYlwiIHx8IHdvcmRbMF0uZmwgPT09IFwicHJvbm91blwiIHx8IHdvcmRbMF0uZmwgPT09IFwicHJlcG9zaXRpb25cIiB8fCB3b3JkWzBdLmZsID09PSBcImNvbmp1bmN0aW9uXCIgfHwgd29yZFswXS5mbCA9PT0gXCJkZXRlcm1pbmVyXCIgfHwgd29yZFswXS5mbCA9PT0gXCJwcm9ub3VuLCBwbHVyYWwgaW4gY29uc3RydWN0aW9uXCIpIHsgLy8gYXJyYXkgd29yZCB0eXBlc1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBhcHAuZHVwbGljYXRlQW5zd2VyKHdvcmRbMF0uZXcpO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBhbnN3ZXJMaXN0LmFkZCh3b3JkWzBdLmV3KTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgYXBwLmZpbmRXaGl0ZVNwYWNlKHdvcmRbMF0uZXcpO1xyXG5cclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGlmICh3b3JkWzBdLmV3ID09PSB3b3JkWzBdLmV3LnRvVXBwZXJDYXNlKCkgfHwgd29yZFswXS5ldyA9PT0gKHdvcmRbMF0uZXcpLmNoYXJBdCgwKS50b1VwcGVyQ2FzZSgpICsgKHdvcmRbMF0uZXcpLnNsaWNlKDEpKSB7IC8vIHdvcmQgaXMgdXBwZXJjYXNlIGFiYnJldiBPUiBjYXBpdGFsaXplZFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGFuc3dlckxpc3QuZGVsZXRlKHdvcmRbMF0uZXcpO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGFwcC53cm9uZ0FsZXJ0KCk7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB9IC8vZW5kIG9mIHdvcmQgaXMgdXBwZXJjYXNlIGFiYnJldiBPUiBjYXBpdGFsaXplZFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIH0gLy9lbmQgb2YgYXJyYXkgd29yZCB0eXBlc1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBlbHNlIGlmICh3b3JkWzBdLmN4LmN0IHx8IHdvcmRbMF0uY3hbMF0uY3QpIHsgLy90YXJnZXRpbmcgcGFzdCB0ZW5zZSB3b3JkcyBmb3IgYXJyYXlzXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBhcHAuZHVwbGljYXRlQW5zd2VyKHdvcmRbMF0uZXcpO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgYW5zd2VyTGlzdC5hZGQod29yZFswXS5ldyk7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBhcHAuZmluZFdoaXRlU3BhY2Uod29yZFswXS5ldyk7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIH0gLy9lbmQgb2YgcGFzdCB0ZW5zZSB3b3JkcyBmb3IgYXJyYXlzXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGVsc2UgeyAvLyB1bmFjY2VwdGVkIHdvcmQgdHlwZSBmb3IgYXJyYXlzXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBhcHAud3JvbmdBbGVydCgpO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICB9IC8vZW5kIG9mIHVuYWNjZXB0ZWQgd29yZCB0eXBlIGZvciBhcnJheXNcclxuXHJcblxyXG4gICAgICAgICAgICAgICAgICAgIH0gLy8gZW5kIG9mIGlzIGFycmF5XHJcbiAgICAgICAgICAgICAgICAgICAgZWxzZSB7IC8vaXMgb2JqZWN0XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGlmICh3b3JkLmZsID09PSBcIm5vdW5cIiB8fCB3b3JkLmZsID09PSBcInZlcmJcIiB8fCB3b3JkLmZsID09PSBcImFkamVjdGl2ZVwiIHx8IHdvcmQuZmwgPT09IFwiYWR2ZXJiXCIgfHwgd29yZC5mbCA9PT0gXCJwcm9ub3VuXCIgfHwgd29yZC5mbCA9PT0gXCJwcmVwb3NpdGlvblwiIHx8IHdvcmQuZmwgPT09IFwiY29uanVuY3Rpb25cIiB8fCB3b3JkLmZsID09PSBcImRldGVybWluZXJcIiB8fCB3b3JkLmZsID09PSBcInByb25vdW4sIHBsdXJhbCBpbiBjb25zdHJ1Y3Rpb25cIikgeyAvLyBvYmplY3Qgd29yZCB0eXBlcyBcclxuICAgICAgICAgICAgICAgICAgICAgICAgYXBwLmR1cGxpY2F0ZUFuc3dlcih3b3JkLmV3KTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgYW5zd2VyTGlzdC5hZGQod29yZC5ldyk7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGFwcC5maW5kV2hpdGVTcGFjZSh3b3JkLmV3KTtcclxuXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBpZiAod29yZC5ldyA9PT0gd29yZC5ldy50b1VwcGVyQ2FzZSgpIHx8IHdvcmQuZXcgPT09ICh3b3JkLmV3KS5jaGFyQXQoMCkudG9VcHBlckNhc2UoKSArICh3b3JkLmV3KS5zbGljZSgxKSkgeyAvLyB3b3JkIGlzIHVwcGVyY2FzZSBhYmJyZXYgT1IgY2FwaXRhbGl6ZWRcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBhbnN3ZXJMaXN0LmRlbGV0ZSh3b3JkLmV3KTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBhcHAud3JvbmdBbGVydCgpO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgfSAvL2VuZCBvZiB3b3JkIGlzIHVwcGVyY2FzZSBhYmJyZXYgT1IgY2FwaXRhbGl6ZWRcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGVsc2UgaWYgKHdvcmQuZXQgPT09IFwiYnkgc2hvcnRlbmluZyAmIGFsdGVyYXRpb25cIikgeyAvL3Nob3J0Zm9ybSB3b3JkXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgYW5zd2VyTGlzdC5kZWxldGUod29yZC5ldyk7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgYXBwLndyb25nQWxlcnQoKTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIH0gLy8gZW5kIG9mIHNob3J0Zm9ybSB3b3JkIGxpa2UgXCJoZWxvXCJcclxuXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIH0gLy9lbmQgb2Ygb2JqZWN0IHdvcmQgdHlwZXNcclxuICAgICAgICAgICAgICAgICAgICAgICAgZWxzZSBpZiAod29yZC5jeC5jdCB8fCB3b3JkLmN4WzBdLmN0KSB7IC8vdGFyZ2V0aW5nIHBhc3QgdGVuc2Ugd29yZHMgZm9yIG9iamVjdHMgXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBhcHAuZHVwbGljYXRlQW5zd2VyKHdvcmQuZXcpO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgYW5zd2VyTGlzdC5hZGQod29yZC5ldyk7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBhcHAuZmluZFdoaXRlU3BhY2Uod29yZC5ldyk7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIH0gLy9lbmQgb2YgcGFzdCB0ZW5zZSB3b3JkcyBmb3Igb2JqZWN0c1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBlbHNlIHsgLy8gdW5hY2NlcHRlZCB3b3JkIHR5cGUgZm9yIG9iamVjdHNcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGFwcC53cm9uZ0FsZXJ0KCk7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIH0gLy9lbmQgb2YgdW5hY2NlcHRlZCB3b3JkIHR5cGUgZm9yIG9iamVjdHNcclxuXHJcbiAgICAgICAgICAgICAgICAgICAgfSAvL2VuZCBvZiBpcyBvYmplY3RcclxuXHJcbiAgICAgICAgICAgICAgICB9IC8vIGVuZCBvZiBpZiAod29yZClcclxuICAgICAgICAgICAgICAgIGVsc2UgeyAvL25vdCBhIHdvcmRcclxuICAgICAgICAgICAgICAgICAgICBhcHAud3JvbmdBbGVydCgpO1xyXG5cclxuICAgICAgICAgICAgICAgIH07IC8vZW5kIG9mIGlmIHN0YXRlbWVudHMhIVxyXG4gICAgICAgICAgICAgICAgICAgIFxyXG4gICAgICAgICAgICAgICAgJCgnLnVzZXJBbnN3ZXInKS5lbXB0eSgpO1xyXG4gICAgICAgICAgICAgICAgYW5zd2VyID0gXCJcIjtcclxuICAgICAgICAgICAgICAgICQoJy5sZXR0ZXInKS5yZW1vdmVDbGFzcygnc2VsZWN0ZWQnKTtcclxuICAgICAgICAgICAgICAgIGNvbnNvbGUubG9nKGFuc3dlckxpc3QpO1xyXG5cclxuICAgICAgICAgICAgICAgIGFwcC5kaXNwbGF5QW5zd2VycygpO1xyXG4gICAgICAgICAgICAgICAgYXBwLmNoYW5nZVNjb3JlKCk7XHJcbiAgICAgICAgICAgICAgICAkKCcubGV0dGVyJykucmVtb3ZlQ2xhc3MoJ3VuY2xpY2thYmxlJyk7XHJcbiAgICAgICAgICAgICAgICBcclxuICAgICAgICAgICAgfSk7IC8vIGVuZCBvZiB0aGVuXHJcblxyXG4gICAgICAgIH07IC8vIGVuZCBvZiBnZXRBUEkgZnVuY3Rpb25cclxuICAgICAgICBjb25zb2xlLmxvZyhnZXRBUEkoc3VibWl0QW5zd2VyKSk7XHJcbiAgICAgICAgXHJcbiAgICB9KTsgIC8vIGVuZCBvZiBmb3JtIHN1Ym1pdFxyXG4gICAgXHJcbn07IC8vIGVuZCBvZiBldmVudCBmdW5jdGlvblxyXG5cclxuXHJcbi8vIEFQUEVORCBBTlNXRVIgVE8gVEhFIERJU1BMQVlFREFOU1dFUlMgRElWXHJcblxyXG5hcHAuZGlzcGxheUFuc3dlcnMgPSBmdW5jdGlvbigpIHtcclxuICAgIGFuc3dlckxpc3QuZm9yRWFjaChmdW5jdGlvbih3b3JkKXtcclxuICAgICAgICAvLyAkKCcuZGlzcGxheWVkQW5zd2VycycpLmVtcHR5KCk7XHJcbiAgICAgICAgJCgnLmRpc3BsYXllZEFuc3dlcnMnKS5hcHBlbmQoYDxsaT4ke3dvcmR9PC9saT5gKVxyXG4gICAgfSk7XHJcbn07IC8vIGVuZCBvZiBkaXNwbGF5QW5zd2VycyBmdWNudGlvblxyXG5cclxuXHJcbi8vIElGIERVUExJQ0FURSwgTUFLRSBUSEUgU1VCTUlUIEJVVFRPTiBTSE9XIFRIQVQgVEhFWSBBUkUgV1JPTkdcclxuXHJcbmFwcC5kdXBsaWNhdGVBbnN3ZXIgPSBmdW5jdGlvbih3b3JkKSB7IFxyXG4gICAgaWYgKGFuc3dlckxpc3QuaGFzKHdvcmQpKSB7XHJcbiAgICAgICAgYXBwLndyb25nQWxlcnQoKTtcclxuICAgIH07XHJcbn07IC8vIGVuZCBvZiBkdXBsaWNhdGVBbnN3ZXIgZnVuY3Rpb25cclxuXHJcbmFwcC53cm9uZ0FsZXJ0ID0gZnVuY3Rpb24oKSB7XHJcbiAgICAkKCcuc3VibWl0QnV0dG9uJykucmVtb3ZlQ2xhc3MoJ3B1bHNlIGluZmluaXRlJykuYWRkQ2xhc3MoJ3dyb25nIHdvYmJsZScpO1xyXG4gICAgc2V0VGltZW91dCgoKSA9PiB7XHJcbiAgICAgICAgJCgnLnN1Ym1pdEJ1dHRvbicpLnJlbW92ZUNsYXNzKCd3cm9uZyB3b2JibGUnKS5hZGRDbGFzcygnaW5maW5pdGUgcHVsc2UnKTtcclxuICAgIH0sIDEwMDApO1xyXG4gICAgJCgnLmxldHRlci5zZWxlY3RlZCcpLmFkZENsYXNzKCd3cm9uZycpO1xyXG4gICAgc2V0VGltZW91dCgoKSA9PiB7XHJcbiAgICAgICAgJCgnLmxldHRlcicpLnJlbW92ZUNsYXNzKCd3cm9uZycpO1xyXG4gICAgfSwgMTAwMCk7XHJcbn1cclxuXHJcblxyXG4vLyBTQ09SRSBXSUxMIEJFIFRIRSBTQU1FIEFTIFRIRSBOVU1CRVIgT0YgSVRFTVMgT04gVEhFIFNFVFxyXG5cclxuYXBwLmNoYW5nZVNjb3JlID0gZnVuY3Rpb24oKSB7XHJcbiAgICBsZXQgc2NvcmUgPSBhbnN3ZXJMaXN0LnNpemU7XHJcbiAgICAkKCcuc2NvcmUnKS5odG1sKGAke3Njb3JlfWApO1xyXG4gICAgJCgnLnNjb3JlQm9hcmQnKS5hZGRDbGFzcygnZ3JvdycpO1xyXG4gICAgc2V0VGltZW91dCgoKSA9PiB7XHJcbiAgICAgICAgJCgnLnNjb3JlQm9hcmQnKS5yZW1vdmVDbGFzcygnZ3JvdycpO1xyXG4gICAgfSwgNTAwKTtcclxufTtcclxuXHJcblxyXG4vLyBpZiBBUEkgcmVzdWx0IGhhcyBhIHNwYWNlIGluIGl0LCBkb24ndCBzaG93IGl0IGFuZCBjb3VudCBpdCBhcyB3cm9uZ1xyXG5cclxuYXBwLmZpbmRXaGl0ZVNwYWNlID0gZnVuY3Rpb24gKCkge1xyXG4gICAgYW5zd2VyTGlzdC5mb3JFYWNoKGZ1bmN0aW9uICh3b3JkKSB7XHJcbiAgICAgICAgbGV0IG4gPSB3b3JkLmluY2x1ZGVzKFwiIFwiKTtcclxuICAgICAgICBpZiAod29yZCA9IG4pIHtcclxuICAgICAgICAgICAgYXBwLndyb25nQWxlcnQoKTtcclxuICAgICAgICAgICAgYW5zd2VyTGlzdC5kZWxldGUod29yZCk7XHJcbiAgICAgICAgfTtcclxuICAgIH0pOyAvLyBlbmQgb2YgZm9yRWFjaCBsb29wXHJcbn07IC8vIGVuZCBvZiBmaW5kV2hpdGVTcGFjZVxyXG5cclxuXHJcbi8vIFRJTUVSXHJcblxyXG5hcHAudGltZXIgPSBmdW5jdGlvbihzZWNvbmRzKSB7XHJcbiAgICBjb25zdCBub3cgPSBEYXRlLm5vdygpO1xyXG4gICAgY29uc3QgdGhlbiA9IG5vdyArIHNlY29uZHMgKiAxMDAwO1xyXG4gICAgZGlzcGxheVRpbWVMZWZ0KHNlY29uZHMpO1xyXG4gICAgY291bnRkb3duID0gc2V0SW50ZXJ2YWwoKCkgPT4ge1xyXG4gICAgICAgIGxldCBzZWNvbmRzTGVmdCA9ICh0aGVuIC0gRGF0ZS5ub3coKSkgLyAxMDAwO1xyXG4gICAgICAgIGlmKHNlY29uZHNMZWZ0IDw9IDApIHtcclxuICAgICAgICAgICAgY2xlYXJJbnRlcnZhbChjb3VudGRvd24pO1xyXG4gICAgICAgICAgICBhcHAuZ2FtZU92ZXIoKVxyXG4gICAgICAgICAgICByZXR1cm47XHJcbiAgICAgICAgfVxyXG4gICAgICAgIGRpc3BsYXlUaW1lTGVmdChzZWNvbmRzTGVmdCk7XHJcbiAgICB9LCAxMDAwKTtcclxufSAvLyBlbmQgb2YgdGltZXIgZnVuY3Rpb25cclxuXHJcbi8vIERJU1BMQVkgVEhFIFRJTUVcclxuXHJcbmZ1bmN0aW9uIGRpc3BsYXlUaW1lTGVmdChzZWNvbmRzKSB7XHJcbiAgICBjb25zdCBtaW51dGVzID0gTWF0aC5mbG9vcihzZWNvbmRzIC8gNjApO1xyXG4gICAgbGV0IHJlbWFpbmRlclNlY29uZHMgPSBNYXRoLmZsb29yKHNlY29uZHMgJSA2MCk7XHJcbiAgICBsZXQgZGlzcGxheSA9IGAke21pbnV0ZXN9OiR7cmVtYWluZGVyU2Vjb25kc31gO1xyXG4gICAgaWYgKHJlbWFpbmRlclNlY29uZHMgPCAxMCkge1xyXG4gICAgICAgIHJlbWFpbmRlclNlY29uZHMgPSBcIjBcIiArIHJlbWFpbmRlclNlY29uZHM7XHJcbiAgICAgICAgZGlzcGxheSA9IGAke21pbnV0ZXN9OiR7cmVtYWluZGVyU2Vjb25kc31gO1xyXG4gICAgfVxyXG4gICAgdGltZXJEaXNwbGF5LnRleHRDb250ZW50ID0gZGlzcGxheTtcclxufSAvLyBlbmQgb2YgZGlzcGxheWluZyB0aGUgdGltZVxyXG5cclxuLy8gR0FNRSBPVkVSIE9WRVJMQVlcclxuYXBwLmdhbWVPdmVyID0gZnVuY3Rpb24oKSB7XHJcbiAgICAkKCcub3ZlcmxheScpLnJlbW92ZUNsYXNzKCdoaWRlJyk7XHJcbiAgICAkKCcucGxheUFnYWluJykub24oJ2NsaWNrIHRvdWNoc3RhcnQnLCBmdW5jdGlvbihlKSB7XHJcbiAgICAgICAgZS5wcmV2ZW50RGVmYXVsdCgpO1xyXG4gICAgICAgIGxvY2F0aW9uLnJlbG9hZCgpO1xyXG4gICAgICAgICQoJy5vdmVybGF5JykuYWRkQ2xhc3MoJ2hpZGUnKTtcclxuICAgIH0pOyAvLyBlbmQgb2Ygc3RhcnQgZXZlbnQgZnVuY3Rpb25cclxuXHJcbn1cclxuXHJcbi8vIGluaXRpYWxpemUgZnVuY3Rpb25cclxuYXBwLmluaXQgPSBmdW5jdGlvbiAoKSB7XHJcbiAgICBhcHAuc3dpdGNoU2NyZWVucygpO1xyXG4gICAgYXBwLmdldEJvYXJkKCk7XHJcbiAgICBhcHAuZXZlbnRzKCk7XHJcbn07XHJcblxyXG4vLyBydW4gaW5pdGlhbGl6ZSBmdW5jdGlvbiB0aHJvdWdoIHRoZSBkb2MgcmVhZHkgZnVuY3Rpb24gKG9uIHBhZ2UgbG9hZClcclxuJChmdW5jdGlvbiAoKSB7XHJcbiAgICBhcHAuaW5pdCgpO1xyXG59KTsiXX0=
