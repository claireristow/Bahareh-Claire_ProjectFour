const app = {};
const chars = 'abcdefghijklmnopqrstuvwxyz';
const score = 0;
let answer = '';
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
            $(`.${i}`).append(`<a href="#" class="letter"><p>${ranLet}</p></a>`)
        };
        $('.start').addClass('hide');
        // Add timer *******
    })
};

app.events = function() {

    // DISPLAYING THE ANSWER
    // make event function on 'click touchstart'
    // when the user clicks a letter, add a "selected" class to the box
    // make an empty string variable and then append each letter to the end of the string as they are touched/clicked
    // display that string on the page

    $('.box').on('click touchstart', '.letter' ,function(e) {
        e.preventDefault(); // prevent default
        $(this).addClass('selected');
        let activeLetter = $(this).find('p').text();
        answer += activeLetter;
        $('.answer').html(`<p>${answer}</p>`);
    });

    // once a letter is selected, it cannot be clicked again


    // CLEAR THE USER SELECTIONS
    // clear the p tag that holds the user's letter choices
    
    $('.clear').on('click touchstart', function(e) {
        e.preventDefault(); //prevent default
        $('.answer').empty();
        answer = '';
        $('.letter').removeClass('selected');
    });
    
    
    // COMPARING TO THE API
    // comapre word to the list of words they have already created. if it's on there, throw an error( "you've already guessed that word"). If not then compare to the api
    // connect to the api
    // run our word(query) into the api url
    // if there is a response, then score + 1 and append word to displayed accepted words list 
    // if null, then score doesn't change and return alert that says "not a word"
   
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
    app.events();
}

// run initialize function through the doc ready function (on page load)
$(function () {
    app.init();
});