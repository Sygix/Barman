module.exports = function morpionGame(msg, playerUser, player2User = undefined){

    const channel = msg.channel;
    var messageEDIT;
    var messageTurn;
    var _boardSize = 3
        , _boardData = {}
        , _playerMarks = [':x:', ':o:']
        , _playerMember = [playerUser, player2User]
        , _players = [];

    /**
     * Builds the board data object with a 3x3 array and an array of
     * empty cells
     * @private
     */
    function _buildBoard() {
        var data = {
            board: [],
            empty: []
        };

        for (var i = 0; i < _boardSize; i += 1) {
            var row = [];

            for (var k = 0; k < _boardSize; k += 1) {
                row.push(null);
                data.empty.push(i + ' ' + k);
            }

            data.board.push(row);
        }

        _boardData = data;
    }

    /**
     * Sets the players array with the types supplied, and markers (x and o)
     * chosen at random
     * @private
     */
    function _setupPlayers(playerTypes) {
        var initialIndex = 0;

        if (playerTypes.length == 2) {
            initialIndex = Math.round(Math.random());
            _players = [
                {
                    marker: _playerMarks[initialIndex],
                    type: playerTypes[0],
                    member: _playerMember[initialIndex]
                },
                {
                    marker: _playerMarks[(!initialIndex | 0)],
                    type: playerTypes[1],
                    member: _playerMember[(!initialIndex | 0)]
                }
            ]
        }
    }

    /**
     * Rotates the players. Switches which player is currently active
     * @private
     */
    function _rotatePlayers() {
        _players.push( _players.shift() );
    }

    /**
     * Delegate getting the player's position determined by their type
     * @private
     */
    function _getPlayerMove() {
        var pos = [];

        if (_players[0].type == 'ai') {
            pos = _aiMove(_addPlayerToBoard);
        } else {
            pos = _getInput(_addPlayerToBoard);
        }
    }

    /**
     * Get the AI's position by choosing a random empty cell
     * @private
     */
    function _aiMove(callback) {
        var index = -1
            , pos = [];

        // Choose a random index from the available positions
        index = Math.floor(Math.random() * _boardData.empty.length - 0);
        pos = _posFromString(_boardData.empty[index]);

        setTimeout(function() {
            callback(pos);
        }, 1000);
    }

    /**
     * Get the human's position from the user input
     * @private
     */
    function _getInput(callback) {
        var memberM;
        if(typeof player2User === 'undefined'){
            memberM = msg.member;
        }else{
            memberM = _players[0].member;
        }

        if (typeof messageTurn === 'undefined') {
            msg.channel.send('C\'est le tour de ' + memberM.user + ' ' +  _players[0].marker + ' (entre le numéro de ligne puis de colonne, de 0 à 2).')
                .then(message => messageTurn = message);
        }

        const collector = new Discord.MessageCollector(msg.channel, m => m.author.id === memberM.id, { time: 60000, errors: ['time'] });
        collector.on('collect', message => {
            if (_boardData.empty.indexOf(message.content) != -1) {
                message.delete(2000);
                messageTurn.delete();
                messageTurn = undefined;
                collector.stop('success');
                callback(_posFromString(message.content));
            } else {
                message.delete(2000);
                collector.stop('success/callback');
                _getInput(callback);
            }
        });
        collector.on('end', reason => {
            if(reason.array().length <= 0){
                msg.channel.send("La requète à expiré ! (60 secondes)");
            }
        });
    }

    /**
     * Parse a space separate string of '[row] [column]' as a board position
     * @private
     */
    function _posFromString(str) {
        var pos = str.split(' ');

        pos.forEach(function(el, i, arr) {
            arr[i] = parseInt(el);
        });

        return pos;
    }

    /**
     * Add the active player to the board, print the board, and check
     * for a winner. If no winner is found, start again.
     * @private
     * @param {Array} The player's position
     */
    function _addPlayerToBoard(pos) {
        _addToBoard(_players[0], pos);
        _printBoard();

        if (_boardData.empty.length == 0) {
            msg.channel.send('Draw!');
            return;
        }

        if (_checkBoard(_players[0])) {
            return;
        } else {
            _rotatePlayers();
            _getPlayerMove(_players[0]);
        }
    }

    /**
     * Mark the board with the player's position, and remove that cell
     * from the array of empty cells.
     * @private
     * @param {Object} The player to add
     * @param {Array} The player's position
     */
    function _addToBoard(player, pos) {
        var emptyIndex = -1;

        // Add the player's position to the board
        _boardData.board[pos[0]][pos[1]] = player.marker;

        // Remove this position from the array of empty cells
        emptyIndex = _boardData.empty.indexOf(pos[0] + ' ' + pos[1]);
        _boardData.empty.splice(emptyIndex, 1);
    }

    /**
     * Print the board
     * @private
     */
    function _printBoard() {
        var text = "";
        for (var i = 0; i < 3; i += 1) {
            var row = "";

            for (var k = 0; k < 3; k += 1) {
                if (_boardData.board[i][k]) row += _boardData.board[i][k];
                else row += ":white_large_square:";
            }

           text += row+"\n";
        }
        if (typeof messageEDIT === 'undefined') {
            msg.channel.send(text)
                .then(message => messageEDIT = message);
        }else{
            messageEDIT.edit(text);
        }
    }

    /**
     * Check the board to see if the player had a winning move
     * @private
     * @param {Object} The player
     */
    function _checkBoard(player) {
        var board = _boardData.board
            , playerStr = player.marker + player.marker + player.marker
            , winner = null
            , colStrs = ['', '', '']
            , diagStrs = ['', ''];

        for (var i = 0; i < 3; i += 1) {

            // Check each row for a winner
            var rowStr = board[i].join('');

            if (rowStr == playerStr) {
                winner = player;
                break;
            }

            // Build a string of column values
            for (var k = 0; k < 3; k += 1) {
                colStrs[k] += board[i][k];
            }

            // Build a string of diagonal values
            if (i == 0) {
                diagStrs[0] += board[i][0];
                diagStrs[1] += board[i][2];
            } else if (i == 1) {
                diagStrs[0] += board[i][1];
                diagStrs[1] += board[i][1];
            } else if (i == 2) {
                diagStrs[0] += board[i][2];
                diagStrs[1] += board[i][0];
            }
        }

        // Check the column strings for a winner
        if (colStrs.indexOf(playerStr) > -1) {
            winner = player;
        }

        // Check the diagonals for a winner
        if (diagStrs.indexOf(playerStr) > -1) {
            winner = player;
        }

        if (winner) {
            msg.channel.send(winner.marker + ' a gagné !');
            return true;
        }

        return false;

    }

    return {

        /**
         * Start the game
         * @param {Array} A two element array of player types. Possible values
         * are 'human' or 'ai'.
         */
        start: function(playerTypes) {
            _buildBoard();
            _setupPlayers(playerTypes);

            if (_players[0].marker != ':x:' && typeof player2User === 'undefined') {
                // Rotate the players so that ':x:' goes first - Only with AI
                _rotatePlayers();
            }

            _getPlayerMove();
        },

        /**
         * Return the array of players
         */
        getPlayers: function() {
            return _players;
        }

    }

};