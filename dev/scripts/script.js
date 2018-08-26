
// list of constants
const app = {};
const chars = 'aaaaabbccdddeeeeeeefgghhiiiiiijklllmmnnoooooprrrrsssttttuuuvwxyz';
let answer = '';
const answerList = new Set();
let countdown;
const timerDisplay = document.querySelector('.timeLeft');

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
        $('.userAnswer').html(`<p>${answer}</p>`);
        
        // // STRETCH GOAL 

        // // upon first click, make everything 'unclickable'
        // $('.letter').addClass('unclickable');
        
        // // selectedBoxNum is equal to the *number* class of the box div
        // let selectedBoxNum = parseInt(($(this).parent()).attr('class').slice(-1));
        // const boxClass = [1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16];

        // // make everything within 'selected' +- 1345+, clickable
        // boxClass.forEach(function(box) {
        //     if (box === selectedBoxNum + 1 || box === selectedBoxNum - 1) {
        //         $(`.${box} .letter`).removeClass('unclickable');
        //     } else if (box === selectedBoxNum + 3 || box === selectedBoxNum - 3) {
        //         $(`.${box} .letter`).removeClass('unclickable')
        //     } else if (box === selectedBoxNum + 4 || box === selectedBoxNum - 4) {
        //         $(`.${box} .letter`).removeClass('unclickable')
        //     } else if (box === selectedBoxNum + 5 || box === selectedBoxNum - 5) {
        //         $(`.${box} .letter`).removeClass('unclickable')
        //     }
        // });
    }); // end of making the word

    $('.box').on('click touchstart', '.unclickable', function(e) {
        e.preventDefault();
    })

    // keep the enter key from repeating the letter 
    $('.box').on('keydown', '.letter', function (e) {
        e.preventDefault(); // prevent default
    });


    // CLEAR THE USER SELECTIONS
    
    $('.clear').on('click touchstart', function(e) {
        e.preventDefault(); //prevent default
        $('.userAnswer').empty();
        answer = '';
        $('.letter').removeClass('selected');
        $('.clear').addClass('');
        setTimeout(() => {
            $('.submitButton').removeClass('');
        }, 1000);
    }); // end of clear
    
    
    // COMPARING TO THE API
   
    $('form').on('submit', function(e) {
        e.preventDefault();
        $('.displayedAnswers').empty();
        
        const submitAnswer = $('.userAnswer').text();

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
                    app.wrongAlert();
                    // console.log('suggestion');

                } // end of suggestion
                else if (word) { // start of if (word)
                    if (word[0]) { //is array
                        if (word[0].fl === "noun" || word[0].fl === "verb" || word[0].fl === "adjective" || word[0].fl === "adverb" || word[0].fl === "pronoun" || word[0].fl === "preposition" || word[0].fl === "conjunction" || word[0].fl === "determiner" || word[0].fl === "pronoun, plural in construction") { // array word types
                        app.duplicateAnswer(word[0].ew);
                        answerList.add(word[0].ew);
                        app.findWhiteSpace(word[0].ew);

                            if (word[0].ew === word[0].ew.toUpperCase() || word[0].ew === (word[0].ew).charAt(0).toUpperCase() + (word[0].ew).slice(1)) { // word is uppercase abbrev OR capitalized
                                answerList.delete(word[0].ew);
                                app.wrongAlert();
                            } //end of word is uppercase abbrev OR capitalized
                            
                        } //end of array word types
                        else if (word[0].cx.ct || word[0].cx[0].ct) { //targeting past tense words for arrays
                            app.duplicateAnswer(word[0].ew);
                            answerList.add(word[0].ew);
                            app.findWhiteSpace(word[0].ew);
                        } //end of past tense words for arrays
                        else { // unaccepted word type for arrays
                            app.wrongAlert();
                        } //end of unaccepted word type for arrays


                    } // end of is array
                    else { //is object
                        if (word.fl === "noun" || word.fl === "verb" || word.fl === "adjective" || word.fl === "adverb" || word.fl === "pronoun" || word.fl === "preposition" || word.fl === "conjunction" || word.fl === "determiner" || word.fl === "pronoun, plural in construction") { // object word types 
                        app.duplicateAnswer(word.ew);
                        answerList.add(word.ew);
                        app.findWhiteSpace(word.ew);

                            if (word.ew === word.ew.toUpperCase() || word.ew === (word.ew).charAt(0).toUpperCase() + (word.ew).slice(1)) { // word is uppercase abbrev OR capitalized
                                answerList.delete(word.ew);
                                app.wrongAlert();
                            } //end of word is uppercase abbrev OR capitalized
                            else if (word.et === "by shortening & alteration") { //shortform word
                                answerList.delete(word.ew);
                                app.wrongAlert();
                            } // end of shortform word like "helo"

                        } //end of object word types
                        else if (word.cx.ct || word.cx[0].ct) { //targeting past tense words for objects 
                            app.duplicateAnswer(word.ew);
                            answerList.add(word.ew);
                            app.findWhiteSpace(word.ew);
                        } //end of past tense words for objects
                        else { // unaccepted word type for objects
                            app.wrongAlert();
                        } //end of unaccepted word type for objects

                    } //end of is object

                } // end of if (word)
                else { //not a word
                    app.wrongAlert();

                }; //end of if statements!!
                    
                $('.userAnswer').empty();
                answer = "";
                $('.letter').removeClass('selected');
                console.log(answerList);

                app.displayAnswers();
                app.changeScore();
                // $('.letter').removeClass('unclickable');
                
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

app.duplicateAnswer = function(word) { 
    if (answerList.has(word)) {
        app.wrongAlert();
    };
}; // end of duplicateAnswer function

app.wrongAlert = function() {
    $('.submitButton').removeClass('pulse infinite').addClass('wrong wobble');
    setTimeout(() => {
        $('.submitButton').removeClass('wrong wobble').addClass('infinite pulse');
    }, 1000);
    $('.letter.selected').addClass('wrong');
    setTimeout(() => {
        $('.letter').removeClass('wrong');
    }, 1000);
}


// SCORE WILL BE THE SAME AS THE NUMBER OF ITEMS ON THE SET

app.changeScore = function() {
    let score = answerList.size;
    $('.score').html(`${score}`);
    $('.scoreBoard').addClass('grow');
    setTimeout(() => {
        $('.scoreBoard').removeClass('grow');
    }, 500);
};


// if API result has a space in it, don't show it and count it as wrong

app.findWhiteSpace = function () {
    answerList.forEach(function (word) {
        let n = word.includes(" ");
        if (word = n) {
            app.wrongAlert();
            answerList.delete(word);
        };
    }); // end of forEach loop
}; // end of findWhiteSpace


// TIMER

app.timer = function(seconds) {
    const now = Date.now();
    const then = now + seconds * 1000;
    displayTimeLeft(seconds);
    countdown = setInterval(() => {
        let secondsLeft = (then - Date.now()) / 1000;
        if(secondsLeft <= 0) {
            clearInterval(countdown);
            app.gameOver()
            return;
        }
        displayTimeLeft(secondsLeft);
    }, 1000);
} // end of timer function

// DISPLAY THE TIME

function displayTimeLeft(seconds) {
    const minutes = Math.floor(seconds / 60);
    let remainderSeconds = Math.floor(seconds % 60);
    let display = `${minutes}:${remainderSeconds}`;
    if (remainderSeconds < 10) {
        remainderSeconds = "0" + remainderSeconds;
        display = `${minutes}:${remainderSeconds}`;
    }
    timerDisplay.textContent = display;
} // end of displaying the time

// GAME OVER OVERLAY
app.gameOver = function() {
    $('.overlay').removeClass('hide');
    $('.playAgain').on('click touchstart', function(e) {
        e.preventDefault();
        window.location.replace("/board.html");
        $('.overlay').addClass('hide');
    }); // end of start event function

}


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