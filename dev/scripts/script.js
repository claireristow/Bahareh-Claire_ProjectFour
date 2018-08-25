
// list of constants
const app = {};
const chars = 'aaaaabbccdddeeeeeeefgghhiiiiiijklllmmnnoooooprrrrsssttttuuuvwxyz';
let answer = '';
const answerList = new Set();

app.url = 'https://www.dictionaryapi.com/api/v1/references/collegiate/xml/';
app.key = '8c5c85a3-ffa3-4f09-b901-7db8209015dc';


// RANDOMLY GENERATE LETTERS ON A 4X4 GRID WHEN PRESSING 'START GAME'


app.switchScreens = function (){
    $('.start').on('click touchstart', function(e) {
        e.preventDefault();
        window.location.replace("/board.html");
    }); // end of start event function
}; // end of switchScreens function

app.getBoard = function(){
        // write a for loop to iterate over each box on the board
        for (let i = 1; i <= 16; i++) {
            // generate random letters
            const ranLet = chars[Math.floor(Math.random() * 63)];       
            // append them to the board
            $(`.${i}`).append(`<a href="#" class="letter"><p>${ranLet}</p></a>`)
        };
        app.timer(90); // 90 seconds on the timer
}; //end of getBoard

app.events = function() { //EVENTS FUNCTION ONCE THE BOARD IS MADE


    // DISPLAYING THE ANSWER
    
    $('.box').on('click touchstart', '.letter' ,function(e) {
        e.preventDefault(); // prevent default
        $(this).addClass('selected');
        let activeLetter = $(this).find('p').text();
        answer += activeLetter;
        $('.answer').html(`<p>${answer}</p>`);
    }); // end of making the word

    // keep the enter key from repeating the letter 
    $('.box').on('keydown', '.letter', function (e) {
        e.preventDefault(); // prevent default
    });


    // stretch goal: upon first click, make everything 'unclickable'. then, make everything within 'selected' +- 1345+, clickable. 


    // CLEAR THE USER SELECTIONS
    
    $('.clear').on('click touchstart', function(e) {
        e.preventDefault(); //prevent default
        $('.answer').empty();
        answer = '';
        $('.letter').removeClass('selected');
    }); // end of clear
    
    
    // COMPARING TO THE API

   
    $('form').on('submit', function(e) {
        e.preventDefault();
        $('.displayedAnswers').empty();
        
        const submitAnswer = $('.answer').text();

        const getAPI = function(query) {
            $.ajax({
                url: 'https://proxy.hackeryou.com',
                method: 'GET',
                dataResponse: 'json',
                paramsSerializer: function (params) {
                    return Qs.stringify(params, { arrayFormat: 'brackets' })
                },
                data: {
                    reqUrl: app.url,
                    params: {
                        'key': app.key,
                        'word': query
                    },
                    xmlToJSON: true,
                    useCache: false
                } // end of ajax
            }).then(resp => {
                console.log(resp);

                const word = resp.entry_list.entry;

                if (resp.entry_list.suggestion) {
                    $('.submitButton').addClass('wrong');
                    setTimeout(() => {
                        $('.submitButton').removeClass('wrong');
                    }, 1000);
                    // console.log('suggestion');

                } // end of suggestion
                else if (word) { // start of if (word)
                    if (word[0]) { //is array
                        if (word[0].fl === "noun" || word[0].fl === "verb" || word[0].fl === "adjective" || word[0].fl === "adverb" || word[0].fl === "pronoun" || word[0].fl === "preposition" || word[0].fl === "conjunction" || word[0].fl === "determiner") { // array word types
                        app.wrongAnswer(word[0].ew);
                        answerList.add(word[0].ew);
                        app.findWhiteSpace(word[0].ew);

                            if (word[0].ew === word[0].ew.toUpperCase() || word[0].ew === (word[0].ew).charAt(0).toUpperCase() + (word[0].ew).slice(1)) { // word is uppercase abbrev OR capitalized
                                answerList.delete(word[0].ew);
                                $('.submitButton').addClass('wrong');
                                setTimeout(() => {
                                    $('.submitButton').removeClass('wrong');
                                }, 1000);
                            } //end of word is uppercase abbrev OR capitalized

                        } //end of array word types
                        else { // unaccepted word type for arrays
                            $('.submitButton').addClass('wrong');
                            setTimeout(() => {
                                $('.submitButton').removeClass('wrong');
                            }, 1000);
                        } //end of unaccepted word type for arrays

                    } // end of is array
                    else { //is object
                        if (word.fl === "noun" || word.fl === "verb" || word.fl === "adjective" || word.fl === "adverb" || word.fl === "pronoun" || word.fl === "preposition" || word.fl === "conjunction" || word.fl === "determiner") { // object word types 
                        app.wrongAnswer(word.ew);
                        answerList.add(word.ew);
                        app.findWhiteSpace(word.ew);

                            if (word.ew === word.ew.toUpperCase() || word.ew === (word.ew).charAt(0).toUpperCase() + (word.ew).slice(1)) { // word is uppercase abbrev OR capitalized
                                answerList.delete(word.ew);
                                $('.submitButton').addClass('wrong');
                                setTimeout(() => {
                                    $('.submitButton').removeClass('wrong');
                                }, 1000);
                            } //end of word is uppercase abbrev OR capitalized
                            else if (word.et === "by shortening & alteration") { //shortform word
                                answerList.delete(word.ew);
                                $('.submitButton').addClass('wrong');
                                setTimeout(() => {
                                    $('.submitButton').removeClass('wrong');
                                }, 1000);
                            } // end of shortform word like "helo"

                        } //end of object word types
                        else { // unaccepted word type for objects
                            $('.submitButton').addClass('wrong');
                            setTimeout(() => {
                                $('.submitButton').removeClass('wrong');
                            }, 1000);
                        } //end of unaccepted word type for objects

                    } //end of is object

                } // end of if (word)
                else { //not a word
                    $('.submitButton').addClass('wrong');
                    setTimeout(() => {
                        $('.submitButton').removeClass('wrong');
                    }, 1000);

                }; // end of 'not a word'
                
                // if (resp.entry_list.suggestion) { // if suggestion
                //     $('.submitButton').addClass('wrong');
                //     setTimeout(() => {
                //         $('.submitButton').removeClass('wrong');
                //     }, 1000);
                //     // console.log('suggestion');
                    
                // } // end of suggestion

                // else if (word) {   
                //     if (word[0]) { //array
                //         app.wrongAnswer(word[0].ew);
                //         answerList.add(word[0].ew);
                //         app.findWhiteSpace(word[0].ew);
                    
                //         if (word[0].fl === 'abbreviation') { // abbreviation array
                //             answerList.delete(word[0].ew);
                //             $('.submitButton').addClass('wrong');
                //             setTimeout(() => {
                //                 $('.submitButton').removeClass('wrong');
                //             }, 1000);
                        
                //         } // end of array abbreviation
                //         else if (word[0].ew === word[0].ew.toUpperCase()){
                //             answerList.delete(word[0].ew);
                //             $('.submitButton').addClass('wrong');
                //             setTimeout(() => {
                //                 $('.submitButton').removeClass('wrong');
                //             }, 1000);
                //         }
                        
                //     }  // end of array
                //     else { // aka if it's an object
                //         if (word.fl === 'abbreviation'){ //object abbreviation
                //             $('.submitButton').addClass('wrong');
                //             setTimeout(() => {
                //                 $('.submitButton').removeClass('wrong');
                //             }, 1000);
  
                //         }  // end of object abbreviation
                //         else if (word.ew === word.ew.toUpperCase()) { //object uppercase noun
                //             $('.submitButton').addClass('wrong');
                //             setTimeout(() => {
                //                 $('.submitButton').removeClass('wrong');
                //             }, 1000);
                //         } //end of object uppercase noun
                //         else { //object no array
                //             app.wrongAnswer(word.ew);
                //             answerList.add(word.ew);
                //             app.findWhiteSpace(word.ew);
                //             console.log(word.ew);

                //         }// end of object no array

                //     } // end of object
                // } else {
                //     $('.submitButton').addClass('wrong');
                //     setTimeout(() => {
                //         $('.submitButton').removeClass('wrong');
                //     }, 1000);
                    
                // }; // end of 'not a word'
                    
                $('.answer').empty();
                answer = "";
                $('.letter').removeClass('selected');
                console.log(answerList);

                app.displayAnswers();
                app.changeScore();
                
            }); // end of then

        }; // end of getAPI function
        console.log(getAPI(submitAnswer));
        
    });  // end of form submit
    
}; // end of event function


// APPEND ANSWER TO THE DISPLAYEDANSWERS DIV

app.displayAnswers = function() {
    answerList.forEach(function(word){
        // $('.displayedAnswers').empty();
        $('.displayedAnswers').append(`<li>${word}</li>`)
    });
}; // end of displayAnswers fucntion


// IF DUPLICATE, MAKE THE SUBMIT BUTTON SHOW THAT THEY ARE WRONG

app.wrongAnswer = function(word) { 
    if (answerList.has(word)) {
        $('.submitButton').addClass('wrong');
        setTimeout(() => {
            $('.submitButton').removeClass('wrong');
        }, 1000);
    };
}; // end of wrongAnswer function


// SCORE WILL BE THE SAME AS THE NUMBER OF ITEMS ON THE SET

app.changeScore = function() {
    let score = answerList.size;
    $('.score').html(`${score}`);
};


// if API result has a space in it, don't show it and count it as wrong

app.findWhiteSpace = function () {
    answerList.forEach(function (word) {
        let n = word.includes(" ");
        if (word = n) {
            score -= 1;
            $('.submitButton').addClass('wrong');
            setTimeout(() => {
                $('.submitButton').removeClass('wrong');
            }, 1000);
            answerList.pop();
        };
    }); // end of forEach loop
}; // end of findWhiteSpace


// TIMER

let countdown;
const timerDisplay = document.querySelector('.timeLeft');
app.timer = function(seconds) {
    const now = Date.now();
    const then = now + seconds * 1000;
    displayTimeLeft(seconds);

    countdown = setInterval(() => {
        const secondsLeft = (then - Date.now()) / 1000;
        if(secondsLeft <= 0) {
            clearInterval(countdown);
            return;
        }
        displayTimeLeft(secondsLeft);
    }, 1000);
} // end of timer function

// DISPLAY THE TIME

function displayTimeLeft(seconds) {
    const minutes = Math.floor(seconds / 60);
    const remainderSeconds = Math.floor(seconds % 60);
    const display = `${minutes}:${remainderSeconds}`;
    timerDisplay.textContent = display;
} // end of displaying the time



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