// randomly generate letters on a 4x4 grid 
// each time the user clicks a letter, that letter will appear in answer div at the bottom of the screen


// then user can submit answer div text to API

// if text ="true", then score + 1
// if text = "false", then score doesn't change

const app = {};

const chars = 'abcdefghijklmnopqrstuvwxyz';

//randomly generate letters on the board
app.getBoard = function(){
    // generate random letters
    const ranNum = Math.floor(Math.random() * 26);
    console.log(ranNum);
    const ranLet = chars[ranNum];
    console.log(ranLet);
    
    
    // append them to the board
}









app.userInput = $('p').text();

app.url = 'https://www.dictionaryapi.com/api/v1/references/collegiate/xml/';

app.key = '8c5c85a3-ffa3-4f09-b901-7db8209015dc';

function getWord() {
    return $.ajax({
        url: `${app.url}${app.userInput}`,
        method: 'GET',
        data: {
            key: app.key
        }
    })
}


app.init = function () {
    // app.getWord();
    app.getBoard();
}

$(function () {
    app.init();

});


