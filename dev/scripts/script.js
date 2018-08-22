const app = {};
const chars = 'abcdefghijklmnopqrstuvwxyz';
app.url = 'https://www.dictionaryapi.com/api/v1/references/collegiate/xml/';
app.key = '8c5c85a3-ffa3-4f09-b901-7db8209015dc';

// randomly generate letters on a 4x4 grid
app.getBoard = function(){
    // write a for loop to iterate over each box on the board
    for (let i = 1; i <= 16; i++) {
        // generate random letters
        const ranLet = chars[Math.floor(Math.random() * 25)];       
        // append them to the board
        $(`.${i}`).append(`<p class="letter">${ranLet}</p>`)
    };
};

// each time the user clicks a letter, that letter will appear in answer div at the bottom of the screen
app.userInput = function() {
    $('.letter').on('touch', function() {

    });
};

// then user can submit answer div text to API
// if text ="true", then score + 1
// if text = "false", then score doesn't change
app.wordSubmit = function() {
    $('.submitForm').on('submit', function(e) {
        e.preventDefualt();

    });
};

// get the api information
app.getWord = function(query) {
    return $.ajax({
        url: `${app.url}${app.userInput}`,
        method: 'GET',
        data: {
            key: app.key
        }
    })
}

// initialize function
app.init = function () {
    app.getBoard();
}

// run initialize function through the doc ready function (on page load)
$(function () {
    app.init();
});