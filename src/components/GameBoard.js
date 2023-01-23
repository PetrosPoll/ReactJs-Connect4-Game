import { useState, useEffect } from "react";
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

  const [board, setBoard] = useState( initialBoard );
  const [currPlayer, setCurrPlayer] = useState( 1 );
  const [winner, setWinner] = useState("");
  const [previousBoard, setPreviousBoard] = useState( null );
  const [backCounter, setBackCounter] = useState( false );
  const [error, setError] = useState("");
  const [disableBack, setDisableBack] = useState( false );

  // get the data from the local storage to continue the game after refresh the page
  useEffect(() => {
    if ( JSON.parse(window.localStorage.getItem("board")) && JSON.parse(window.localStorage.getItem("currentPlayer")) ) 
    {
      setCurrPlayer( JSON.parse(window.localStorage.getItem("currentPlayer")) );
      setBoard( JSON.parse(window.localStorage.getItem("board")) );
      setPreviousBoard( JSON.parse(window.localStorage.getItem("previousBoard")) );
      setBackCounter( JSON.parse(window.localStorage.getItem("backCounter")) );
      setDisableBack( JSON.parse(window.localStorage.getItem("disableBack")) );
    }
  }, []);

  // clear the winner value after someone won
  useEffect( () => {
    setTimeout( () => {
      setWinner("");
    }, [3000]);
  }, [winner]);

  // update the board, create the previous board and check for possible winners
  const updateBoard = ( columnIndex ) => {

    let rowIndex = 0;
    setBackCounter( false );
    window.localStorage.setItem( "backCounter", JSON.stringify(false) );
    setError("");
    setDisableBack( false );
    window.localStorage.setItem( "disableBack", JSON.stringify(disableBack) );

    // when winner get filled user has to wait few seconds until play again
    if (winner === "") {

      // check the cell that was clicked and add playe's colour
      for (let r = 5; r >= 0; r--) 
      {
        let columnPlayer = board.rows[r].columns[columnIndex].player;

        if (columnPlayer === null) {

          setPreviousBoard( JSON.parse( JSON.stringify(board) ) );
          window.localStorage.setItem( "previousBoard", JSON.stringify(board) );
          board.rows[r].columns[columnIndex].player = currPlayer;
          rowIndex = r;
          setCurrPlayer( currPlayer === 1 ? 2 : 1 );
          window.localStorage.setItem( "board", JSON.stringify(board) );
          window.localStorage.setItem( "currentPlayer", JSON.stringify(currPlayer === 1 ? 2 : 1) );
          break;

        }
      }

      // check for winner and if it's true, set the game from the beginning
      if ( winnerChecking( rowIndex, columnIndex ) ) 
      {  
        setDisableBack( true );
        window.localStorage.setItem( "disableBack", JSON.stringify(disableBack) );
        setTimeout( () => {
          newGame();
        }, [2000]);

        setWinner( "Player " + currPlayer + " won!" );
      } 
      else 
      {
        if (drawCheck()) {
          setWinner( "DRAW!" );
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
          row.columns.filter( ( column ) => column.player === null).length > 0
      ).length > 0
        ? false
        : true;

    return isBoardFilled;
  };

  // check for winner HORIZONTAL
  const checkHorizontal = ( rowIndex, columnIndex ) => {
    let row = board.rows[rowIndex];
    let consecutiveColumns = 0;

    for (let c = 0; c < 7; c++) {
      if (row.columns[c].player === row.columns[columnIndex].player) 
      {
        consecutiveColumns++;
        if (consecutiveColumns >= 4) {
          return true;
        }
      } 
      else 
      {
        consecutiveColumns = 0;
      }
    }
    return false;
  };

  // check for winner VERTICAL
  const checkVertical = (rowIndex, columnIndex) => {
    let row = board.rows[rowIndex];
    let consecutiveRows = 0;

    for (let r = 0; r < 6; r++) 
    {
      if ( board.rows[r].columns[columnIndex].player === row.columns[columnIndex].player )
        {
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
    return (
      checkHorizontal( rowIndex, columnIndex ) ||
      checkVertical( rowIndex, columnIndex )
      || checkDiagonal(rowIndex, columnIndex)
    );
  };

  // set the game from the beginning
  const newGame = () => {
    setBoard( initialBoard );
    window.localStorage.setItem( "board", JSON.stringify(initialBoard) );
    setCurrPlayer( 1 );
    window.localStorage.setItem( "currentPlayer", JSON.stringify(1) );
  };

  // go back to the last move
  const goBack = () => {
    if (!disableBack) 
    {
      if (!backCounter) 
      {
        setBackCounter( true );
        window.localStorage.setItem( "backCounter", JSON.stringify(true) );
        setBoard( previousBoard );
        window.localStorage.setItem( "board", JSON.stringify(previousBoard) );
        setCurrPlayer( currPlayer === 1 ? 2 : 1 );
        window.localStorage.setItem( "currentPlayer", JSON.stringify(currPlayer === 1 ? 2 : 1) );
      } 
      else
        setError( "Only the current player can go back and change his decision" );
    } 
    else
        setError( "You cannot go back to the previous game" );
  };

  return (
    <div style={{ marginTop: 50 }}>
      <div style={{ float: "left", marginRight: 2 }}>
        <button className="button" onClick={() => goBack()}>
          {" "}
          GO BACK{" "}
        </button>
        <button
          className="button"
          onClick={() => newGame()}
          style={{ width: 200, height: 50 }}
        >
          {" "}
          NEW GAME{" "}
        </button>
        <h1 style={{ width: 250 }}> Player {currPlayer} is your turn</h1>
        <h1
          className="players"
          style={{ backgroundColor: "rgba(255, 0, 0, 0.700)" }}
        >
          Player 1
        </h1>
        <h1
          className="players"
          style={{ backgroundColor: "rgba(0, 0, 255, 0.700)" }}
        >
          Player 2
        </h1>
        <h1 style={{ marginTop: 100 }}>{winner ? winner : ""}</h1>
        <p className="error">{error}</p>
      </div>
      <table >
        <tbody>
          {board.rows.map((row, i) => (
            <GameRow key={i} row={row} updatedBoard={updateBoard} />
          ))}
        </tbody>
      </table>
    </div>
  );
};


export default GameBoard;
