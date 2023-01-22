import React from "react";
import Tile from "./Tile";

const GameRow = ({ row, updatedBoard }) => {

  return (
    <tr>
      {row.columns.map(
        (column, i) => (
          <Tile key={i} column={column} columnIndex={i} updateBoard={updatedBoard} />
        )
      )}
    </tr>
  );
};
export default GameRow;
