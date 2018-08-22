const app = {};
const chars = 'abcdefghijklmnopqrstuvwxyz';
const score = 0;
app.url = 'https://www.dictionaryapi.com/api/v1/references/collegiate/xml/';
app.key = '8c5c85a3-ffa3-4f09-b901-7db8209015dc';

// randomly generate letters on a 4x4 grid
app.getBoard = function(){
    $('.start').on('click touchstart', function() {
        // write a for loop to iterate over each box on the board
        for (let i = 1; i <= 16; i++) {
            // generate random letters
            const ranLet = chars[Math.floor(Math.random() * 25)];       
            // append them to the board
            $(`.${i}`).append(`<a href="#" class="letter">${ranLet}</a>`)
        };
        // Add timer *******
    })
};

// DISPLAYING THE ANSWER
// make event function on 'click touchstart'
// prevent default
// when the user clicks a letter, add a "selected" class to the box
// make an empty string variable and then append each letter to the end of the string as they are touched/clicked
// display that string on the page
app.userInput = function() {
    $('.letter').on('touch', function() {

    });
};

// CLEAR THE USER SELECTIONS
// clear the p tag that holds the user's letter choices
app.clear = function () {
    $('.clear').on('click touchstart', function() {

    });
};

// COMPARING TO THE API
// comapre word to the list of words they have already created. if it's on there, throw an error( "you've already guessed that word"). If not then compare to the api
// connect to the api
// run our word(query) into the api url
// if there is a response, then score + 1 and append word to displayed accepted words list 
// if null, then score doesn't change and return alert that says "not a word"
app.wordSubmit = function() {
    $('form').on('submit', function(e) {
        e.preventDefualt();
        // get the api information
        app.getWord = function(query) {
            return $.ajax({
                url: `${app.url}${app.userInput}`,
                method: 'GET',
                data: {
                    key: app.key,
                    word: query
                }
            })
        }
    });
};


// initialize function
app.init = function () {
    app.getBoard();
}

// run initialize function through the doc ready function (on page load)
$(function () {
    app.init();
});