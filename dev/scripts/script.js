const app = {};
const chars = 'aaaaabcdeeeeeefghiiiiijklmmnoooooprssstttuuuwxyz';
let score = 0;
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
            const ranLet = chars[Math.floor(Math.random() * 48)];       
            // append them to the board
            $(`.${i}`).append(`<a href="#" class="letter"><p>${ranLet}</p></a>`)
        };
        $('.start').addClass('hide');

        // $('#scoreBoard').countdown('00:01:30', function (event) {
        //     $(this).html(event.strftime('-%M:-%S'));
        // });

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
                
                if (resp.entry_list.suggestion) {
                    $('.submitButton').addClass('wrong');
                    setTimeout(() => {
                        $('.submitButton').removeClass('wrong');
                    }, 1000);
                } 

                else if (resp.entry_list.entry) {   
                    if (resp.entry_list.entry[0]){
                        app.dontPost(resp.entry_list.entry[0].ew);
                        answerList.push(resp.entry_list.entry[0].ew);
                        app.findWhiteSpace(resp.entry_list.entry[0].ew);
                        score += 1;
                        console.log(resp.entry_list.entry[0].ew);
                        
                        
                        
                        if (resp.entry_list.entry[0].fl === 'abbreviation' ) {
                            $('.submitButton').addClass('wrong');
                            setTimeout(() => {
                                $('.submitButton').removeClass('wrong');
                            }, 1000);
                            
                            
                        }
                        
                    } else { // aka if it's an object
                        if (resp.entry_list.entry.fl === 'abbreviation'){
                            $('.submitButton').addClass('wrong');
                            setTimeout(() => {
                                $('.submitButton').removeClass('wrong');
                            }, 1000);
                            
                            
                            } else {
                        // is object
                            app.dontPost(resp.entry_list.entry.ew);
                            answerList.push(resp.entry_list.entry.ew);
                            app.findWhiteSpace(resp.entry_list.entry.ew);
                            score += 1;
                            console.log(resp.entry_list.entry.ew);
                            
                                
                            }
                    }
                } else {
                    $('.submitButton').addClass('wrong');
                    setTimeout(() => {
                        $('.submitButton').removeClass('wrong');
                    }, 1000);
                    
                    
                };
                
                    
                $('.answer').empty();
                answer = "";
                $('.letter').removeClass('selected');
                console.log(answerList);



                
                app.displayAnswers();
                app.changeScore();
                
            }); // end of this

            } // end of getAPI function

        console.log(getAPI(submitAnswer));


        
        
    });  // end of form submit
}; // end of event function

app.displayAnswers = function() {
    answerList.forEach(function(word){
        // $('.displayedAnswers').empty();
        $('.displayedAnswers').append(`<li>${word}</li>`)
    })
};

app.changeScore = function() {
    $('.score').html(`${score}`)
}

app.dontPost = function(guess){
    var i = answerList.length;
    while(i--) {
        if (guess === answerList[i]) {
            score -= 1;
            $('.submitButton').addClass('wrong');
            setTimeout(() => {
                $('.submitButton').removeClass('wrong');
            }, 1000);
            answerList.pop();

        }
    }
}

app.findWhiteSpace = function() {
    answerList.forEach(function(word){
        var n = word.includes(" ");
        if (word = n) {
            score -= 1;
            $('.submitButton').addClass('wrong');
            setTimeout(() => {
                $('.submitButton').removeClass('wrong');
            }, 1000);
            answerList.pop();
        }
    })
}




// initialize function
app.init = function () {
    app.getBoard();
    app.events();
}

// run initialize function through the doc ready function (on page load)
$(function () {
    app.init();
});