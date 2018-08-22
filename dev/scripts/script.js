<<<<<<< HEAD


// randomly generate letters on a 4x4 grid 
// each time the user clicks a letter, that letter will appear in answer div at the bottom of the screen


// then user can submit answer div text to API

// if text ="true", then score + 1
// if text = "false", then score doesn't change

const app = {};

const chars = 'aabcdefghijklmnopqrstuvwxyz';

//randomly generate letters on the board
app.getBoard = function() {
    // generate random letters
    const ranNum1 = Math.floor(Math.random() * 26);
    const ranNum2 = Math.floor(Math.random() * 26);
    const ranNum3 = Math.floor(Math.random() * 26);
    const ranNum4 = Math.floor(Math.random() * 26);
    const ranNum5 = Math.floor(Math.random() * 26);
    const ranNum6 = Math.floor(Math.random() * 26);
    const ranNum7 = Math.floor(Math.random() * 26);
    const ranNum8 = Math.floor(Math.random() * 26);
    const ranNum9 = Math.floor(Math.random() * 26);
    const ranNum10 = Math.floor(Math.random() * 26);
    const ranNum11 = Math.floor(Math.random() * 26);
    const ranNum12 = Math.floor(Math.random() * 26);
    const ranNum13 = Math.floor(Math.random() * 26);
    const ranNum14 = Math.floor(Math.random() * 26);
    const ranNum15 = Math.floor(Math.random() * 26);
    const ranNum16 = Math.floor(Math.random() * 26);
    
    const ranLet1 = chars[ranNum1];
    const ranLet2 = chars[ranNum2];
    const ranLet3 = chars[ranNum3];
    const ranLet4 = chars[ranNum4];
    const ranLet5 = chars[ranNum5];
    const ranLet6 = chars[ranNum6];
    const ranLet7 = chars[ranNum7];
    const ranLet8 = chars[ranNum8];
    const ranLet9 = chars[ranNum9];
    const ranLet10 = chars[ranNum10];
    const ranLet11 = chars[ranNum11];
    const ranLet12 = chars[ranNum12];
    const ranLet13 = chars[ranNum13];
    const ranLet14 = chars[ranNum14];
    const ranLet15 = chars[ranNum15];
    const ranLet16 = chars[ranNum16];

    // append them to the board
    let letTile1 = `<p>${ranLet1}</p>`;
    $('.1').append(letTile1);

    let letTile2 = `<p>${ranLet2}</p>`;
    $('.2').append(letTile2);

    let letTile3 = `<p>${ranLet3}</p>`;
    $('.3').append(letTile3);

    let letTile4 = `<p>${ranLet4}</p>`;
    $('.4').append(letTile4);

    let letTile5 = `<p>${ranLet5}</p>`;
    $('.5').append(letTile5);

    let letTile6 = `<p>${ranLet6}</p>`;
    $('.6').append(letTile6);

    let letTile7 = `<p>${ranLet7}</p>`;
    $('.7').append(letTile7);

    let letTile8 = `<p>${ranLet8}</p>`;
    $('.8').append(letTile8);

    let letTile9 = `<p>${ranLet9}</p>`;
    $('.9').append(letTile9);

    let letTile10 = `<p>${ranLet10}</p>`;
    $('.10').append(letTile10);

    let letTile11 = `<p>${ranLet11}</p>`;
    $('.11').append(letTile11);

    let letTile12 = `<p>${ranLet12}</p>`;
    $('.12').append(letTile12);

    let letTile13 = `<p>${ranLet13}</p>`;
    $('.13').append(letTile13);

    let letTile14 = `<p>${ranLet14}</p>`;
    $('.14').append(letTile14);

    let letTile15 = `<p>${ranLet15}</p>`;
    $('.15').append(letTile15);

    let letTile16 = `<p>${ranLet16}</p>`;
    $('.16').append(letTile16);
    
}







=======
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
>>>>>>> 0eb746788719458be24b98116a8a9d8a2eb308c0

// each time the user clicks a letter, that letter will appear in answer div at the bottom of the screen
app.userInput = function() {
    $('.letter').on('touch', function() {

<<<<<<< HEAD

app.userInput = $('p').text();
=======
    });
};
>>>>>>> 0eb746788719458be24b98116a8a9d8a2eb308c0

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