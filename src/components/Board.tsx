import { useState } from 'react';
import BoardSpace from './BoardSpace';
import Token, { TokenType } from './Token';
import './Board.css';

const GRID_SIZE = 8;

const Board = () => {
  // TODO set this type back to string[][]
  let initialBoardState: any[][] = Array.from({ length: GRID_SIZE }, () =>
    new Array(GRID_SIZE).fill(TokenType.NONE)
  );

  // Setting initial board state as defined in Othello rules
  initialBoardState[3][3] = TokenType.WHITE
  initialBoardState[4][4] = TokenType.WHITE
  initialBoardState[3][4] = TokenType.BLACK
  initialBoardState[4][3] = TokenType.BLACK

  // State comprises a 2d array of TokenType strings
  const [boardState, setBoardState] = useState<any[][]>(initialBoardState);

  // I used chatgpt to get the general formula for how to build a grid using basic React components
  // (including styling), and tweaked the syntax to fit my purpose
  const grid: any[] = [ ...new Array(GRID_SIZE)].map( (_, row_idx) => {
    return [ ...new Array(GRID_SIZE)].map( (_, col_idx) => {
        return <BoardSpace
          token={
            Token({tokenType: boardState[row_idx][col_idx], key: `token-${row_idx}-${col_idx}`})
          }
          key={`space-${row_idx}-${col_idx}`}
        ></BoardSpace>
    })
  })

  return (
    <div className='board-container'>
        <div className="board">
            {grid}
        </div>
    </div>
  );
};

export default Board;
