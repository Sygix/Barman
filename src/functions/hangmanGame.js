
module.exports = {

    wordBank: ['hersheys', 'almondjoy', 'reeses', 'snickers', 'milkyway', 'kitkat', 'twix'],
    wordsWon: 0,
    guessesRemaining: 10,
    currentWrd: null,

    startGame: function (wrd) {
        this.resetGuesses();
        this.currentWrd = new Word(this.wordBank[Math.floor(Math.random()* this.wordBank.length)]);
        this.currentWrd.getLet();
        this.promptUser();
    },

    resetGuesses: function(){
        this.guessesRemaining = 10;
    },

    promptUser: function(){
        var self = this;
        prompt.get(['guessLet'], function(err, result){
            console.log("You guessed: " + result.guessLet);
            var manyGuessed = self.currentWrd.checkLetter(result.guessLet);

            if(manyGuessed ==0) {
                console.log("WRONG");
                self.guessesRemaining--;

            } else {
                console.log("CORRECT");
                if(self.currentWrd.findWord()){
                    console.log("You won!");
                    console.log("-------------------");
                    return;
                }
            }

            console.log("Guesses remaining: " + self.guessesRemaining);
            console.log("Now : "+self.currentWrd.wordRender());
            console.log("-------------------");
            if((self.guessesRemaining > 0) && (self.currentWrd.found == false)){
                self.promptUser();
            }
            else if(self.guessesRemaining ==0){
                console.log("Game over. Correct Word ", self.currentWrd.target);
            }
        });

    }

};