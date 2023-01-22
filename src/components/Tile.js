import React from "react";

const Tile = ({ columnIndex, updateBoard, column })=> {
  let tileStatus = "open";

  if (column.player === 1) {
    tileStatus = "player1";
  } else if (column.player === 2) {
    tileStatus = "player2";
  }

  return (
    <td>
      <div className="tile" onClick={() => updateBoard(columnIndex)}>
        <div className={[tileStatus, "circle"].join(" ")}></div>
      </div>
    </td>
  );
};
export default Tile;
