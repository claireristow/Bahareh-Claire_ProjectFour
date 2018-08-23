const app = {};
const chars = 'abcdefghijklmnopqrstuvwxyz';
const score = 0;
let answer = '';
let answerList = [];
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
    }) // end of start event function
}; //end of getBoard

app.events = function() {

    // DISPLAYING THE ANSWER
    

    $('.box').on('click touchstart', '.letter' ,function(e) {
        e.preventDefault(); // prevent default
        $(this).addClass('selected');
        let activeLetter = $(this).find('p').text();
        answer += activeLetter;
        $('.answer').html(`<p>${answer}</p>`);
    }); // end of making the word
    // stretch goal: upon first click, make everything 'unclickable'. then, make everything within 'selected' +- 1345+, clickable. 

    // once a letter is selected, it cannot be clicked again


    // CLEAR THE USER SELECTIONS
    
    $('.clear').on('click touchstart', function(e) {
        e.preventDefault(); //prevent default
        $('.answer').empty();
        answer = '';
        $('.letter').removeClass('selected');
    }); // end of clear
    
    
    // COMPARING TO THE API
    // comapre word to the list of words they have already created. if it's on there, throw an error( "you've already guessed that word"). If not then compare to the api
    // connect to the api
    // run our word(query) into the api url
    // if there is a response, then score + 1 and append word to displayed accepted words list 
    // if null, then score doesn't change and return alert that says "not a word"

   
    $('form').on('submit', function(e) {
        e.preventDefault();
        
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
                answerList.push(resp.entry_list.entry[0].ew);
                
                $('.answer').empty();
                answer = "";
                $('.letter').removeClass('selected');
                console.log(answerList);
                
                
                // app.displayAnswers(resp.ajax)
            }); // end of this
            } // end of getAPI function

        console.log(getAPI(submitAnswer));


        
        
    });  // end of form submit
}; // end of event function

// app.displayAnswers = function(answers) {
//     $('.displayAnswers')
// }




// initialize function
app.init = function () {
    app.getBoard();
    app.events();
    // app.displayAnswers();
}

// run initialize function through the doc ready function (on page load)
$(function () {
    app.init();
});