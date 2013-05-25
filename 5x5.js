/* Do Something for each cell in the game. */
function forEachCell( f )
{
   for ( var row = 0; row < 5; row++ )
   {
      for ( var col = 0; col < 5; col++ )
      {
         f( row, col );
      }
   }
}

/* Get the number of moves. */
function getMoves()
{
   var moves = localStorage.moves;

   if ( moves )
   {
      return parseInt( localStorage.moves );
   }
   else
   {
      return 0;
   }
}

/* Save the state of the game to local storage. */
function saveGame( game, moves )
{
   forEachCell( function( row, col ) { localStorage[ "cell" + row + col ] = game[ row ][ col ]; } );
   localStorage.moves = moves;
   stateUpdated();
}

/* React to a cell click. */
function cellClick( row, col )
{
   // Get the current state of play.
   var game = gameState();

   // Make the move.
                 game[ row     ][ col     ] = !game[ row     ][ col     ];
   if( row > 0 ) game[ row - 1 ][ col     ] = !game[ row - 1 ][ col     ];
   if( row < 4 ) game[ row + 1 ][ col     ] = !game[ row + 1 ][ col     ];
   if( col > 0 ) game[ row     ][ col - 1 ] = !game[ row     ][ col - 1 ];
   if( col < 4 ) game[ row     ][ col + 1 ] = !game[ row     ][ col + 1 ];

   // Write the state of play back to the Wave.
   saveGame( game, getMoves() + 1 );
}

/* The initial state of a game. */          
function defaultGame()
{
   return new Array(
      new Array( false, false, false, false, false ),
      new Array( false, false,  true, false, false ),
      new Array( false,  true,  true,  true, false ),
      new Array( false, false,  true, false, false ),
      new Array( false, false, false, false, false ) );
}

/* Get the state for the current game. */
function gameState()
{
   var game = defaultGame();

   if ( getMoves() > 0 )
   {
      forEachCell( function( row, col ) { game[ row ][ col ] = localStorage[ "cell" + row + col ] == "true"; } );
   }

   return game;
}

/* Set the state of a cell in the display. */
function setCell( row, col, on )
{
   document.getElementById( "cell" + row + col ).className = on ? "cellOn" : "cellOff";
}

/* Refresh the grid based on the current game state. */
function refreshGrid( gameState )
{
   forEachCell( function( row, col ) { setCell( row, col, gameState[ row ][ col ] ); } );
}

/* Get the count of cells switched on. */
function onCount( gameState )
{
   var count = 0;

   forEachCell( function( row, col ) { if ( gameState[ row ][ col ] ) count++; } );
   
   return count;
}
          
/* Update the display of number of moves. */
function refreshMoves( gameState )
{
   var moves   = getMoves();
   var moves_t = moves == 1 ? "move" : "moves";
   
   document.getElementById( "moves" ).innerHTML =
      "After " + moves + " " + moves_t + " you've switched on " +
      onCount( gameState ) + " cells out of 25.";
}

/* After the state has changed, refresh the display. */
function stateUpdated()
{
   var game = gameState();
   
   refreshGrid( game );
   refreshMoves( game );
}

/* Reset the state of the game. */
function resetGame()
{
   localStorage.clear();
   saveGame( defaultGame(), 0 );
}

/* Show some help. */
function showHelp()
{
   alert( "The object of the game is to totally fill the grid with black squares. " +
          "Clicking on a square results in that square (and those around it as " +
          "seen in the initial pattern when you reset the game) toggling its colour.\n\n" +
          "There is a solution in 14 moves. Can you find it without cheating?" );
}

/* Help keep all tabs of the same game in sync. */
function onStoreUpdate( e )
{
   if ( e.key == "moves" )
   {
      stateUpdated();
   }
}

/* Init 5x5. */
function init5x5()
{
   window.addEventListener( "storage", onStoreUpdate, false );
   stateUpdated();
}
