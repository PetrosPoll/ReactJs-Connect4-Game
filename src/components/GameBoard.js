import { useState, useRef, useEffect } from "react";
import GameRow from "./GameRow";

const GameBoard = () => {

  // our main board 6x7
  const initialBoard = {
    rows: Array.from({ length: 6 }, () => ({
      columns: Array.from({ length: 7 }, () => ({
        player: null,
      })),
    })),
  };

  const [board, setBoard] = useState(initialBoard);
  const [currPlayer, setCurrPlayer] = useState(1);
  const [winner, setWinner] = useState('');
  const prevCountRef = useRef(null);
  
useEffect (() => {
  console.log('Refresh after board changed');
},[board]);


// get the data from the local storage to continue the game after refresh the page
useEffect (() => {
    setCurrPlayer( JSON.parse(window.localStorage.getItem('currentPlayer')));
    setBoard( JSON.parse(window.localStorage.getItem('board')));
  },[]);

  // clear the winner value after someone won
  useEffect (() => {
    setTimeout( () => {
        setWinner('');
    },[3000])
  }, [ winner ]);

  const updateBoard = (columnIndex) => {

    let boardCopy = board;
    let rowIndex = 0;
    let columnIsFull = false;

    // when winner get filled user has to wait few seconds
    if(winner === ''){ 

    // check the cell that was clicked and add playe's colour
    for (let r = 5; r >= 0; r--) {
      let columnPlayer = boardCopy.rows[r].columns[columnIndex].player;

      if (columnPlayer === null) {
        boardCopy.rows[r].columns[columnIndex].player = currPlayer;
        columnIsFull = true;
        rowIndex = r;
        break;
      }
    }

    // update the board and player
    if (columnIsFull) {
      prevCountRef.current = JSON.parse(window.localStorage.getItem('board'));
      setBoard(boardCopy);
      window.localStorage.setItem('board', JSON.stringify(boardCopy));
      setCurrPlayer(currPlayer === 1 ? 2 : 1);
      window.localStorage.setItem('currentPlayer', JSON.stringify(currPlayer === 1 ? 2 : 1));
    }

    // check for winner and if it's true, set the game from the beginning
    if (winnerChecking(rowIndex, columnIndex)) {

        setTimeout( () => {
            newGame();
        },[2000])
      setWinner("Player " + currPlayer + " won!");

        }
    else 
        {
            if (drawCheck()) {
                setWinner("DRAW!");
                newGame();
            }
        }
    }
  };
  
  // check if the game is draw and set the game from the beginning
 const drawCheck = () => {

    let isBoardFilled =
      board.rows.filter(
        (row) =>
          row.columns.filter((column) => column.player === null)
            .length > 0
      ).length > 0
        ? false
        : true;

    return isBoardFilled;
  };

  // check for winner HORIZONTAL
  const checkHorizontal = (rowIndex, columnIndex) => {

    let row = board.rows[rowIndex];
    let consecutiveColumns = 0;

    for (let c = 0; c < 7; c++) {
      if (row.columns[c].player === row.columns[columnIndex].player) {
        consecutiveColumns++;
        if (consecutiveColumns >= 4) {
          return true;
        }
      } else {
        consecutiveColumns = 0;
      }
    }
    return false;

  };

  // check for winner VERTICAL
  const checkVertical = (rowIndex, columnIndex) => {

    let row = board.rows[rowIndex];
    let consecutiveRows = 0;

    for (let r = 0; r < 6; r++) {
      if ( board.rows[r].columns[columnIndex].player === row.columns[columnIndex].player) {
            consecutiveRows++;
            if (consecutiveRows >= 4)
                return true;
        } 
      else 
        consecutiveRows = 0;
    }    
    return false;

  };

   // check for winner DIAGONAL
  const checkDiagonal = (rowIndex, columnIndex) => {

    let row = board.rows[rowIndex];
    let consecutiveDiagonalRight = 0;
    let counter = 0;

    // check diagonal right
    if (columnIndex + counter < 6) {
        for (let r = 0; r < 6; r++) {
            if (board.rows[r].columns[columnIndex + counter].player === row.columns[columnIndex].player) {
                consecutiveDiagonalRight++;
                counter++;
                if (consecutiveDiagonalRight >= 4) {
                    return true;
                }
            }
            else
                consecutiveDiagonalRight = 0;
        }
    }

    // check diagonal left
    for (let r = 0; r < 6; r++) {
        if (board.rows[r].columns[columnIndex + counter].player === row.columns[columnIndex].player) {
            consecutiveDiagonalRight++;
            counter--;
            if (consecutiveDiagonalRight >= 4) {
                return true;
              }
          }
          else
            consecutiveDiagonalRight = 0;
    }
  }

  // call all functions to find the winner
  const winnerChecking = (rowIndex, columnIndex) => {
    return ( checkHorizontal(rowIndex, columnIndex) || checkVertical(rowIndex, columnIndex) || checkDiagonal(rowIndex, columnIndex) );
  };

// set the game from the beginning
const newGame = () => {
    setBoard(initialBoard);
    window.localStorage.setItem('board', JSON.stringify(initialBoard));
    setCurrPlayer(1);
    window.localStorage.setItem('currentPlayer', JSON.stringify(1));
}

// go back to the last move
const goBack = () => {
    console.log('STATES === =====');
    console.log(prevCountRef.current);
    setBoard(prevCountRef.current);
    window.localStorage.setItem('board', JSON.stringify(prevCountRef.current));
    setCurrPlayer(currPlayer === 1 ? 2 : 1);
    window.localStorage.setItem('currentPlayer', JSON.stringify(currPlayer === 1 ? 2 : 1));

}


  return (
    <div style={{marginTop: 50}}>
        <div style={{float: 'left', marginRight: 2}}>
            <button className="button" onClick={() => goBack()}> GO BACK </button>
            <button className="button" onClick={() => newGame()} style={{ width: 200, height: 50}}> NEW GAME </button>
            <h1 style={{  width: 250}}> Next player: {currPlayer}</h1>
            <h1 className="players" style={{  backgroundColor: 'rgba(255, 0, 0, 0.700)'}}>Player 1</h1>
            <h1 className="players" style={{  backgroundColor: 'rgba(0, 0, 255, 0.700)'}}>Player 2</h1>
            <h1 style={{marginTop: 100}}>{winner ? winner : ''}</h1>
      </div>
      <table>
        <tbody>
          {board.rows.map((row, i) => (
            <GameRow key={i} row={row} updatedBoard={ updateBoard} />
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default GameBoard;
