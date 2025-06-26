// Grid.tsx
import React from 'react';
import BoardSpace from './BoardSpace';
//import './Grid.css'; // or use styled-components, etc.
import './Board.css';

const GRID_SIZE = 8;

const Board = () => {
  const grid: any[] = [ ...new Array(GRID_SIZE)].map( (_, row_idx) => {
    return [ ...new Array(GRID_SIZE)].map( (_, col_idx) => {
        return <BoardSpace key={`${row_idx}-${col_idx}`}></BoardSpace>
    })
  })

  console.log('-------------')
  console.log(grid)
  return (
    <div className='board-container'>
        <div className="board">
            {grid}
        </div>
    </div>
  );
};

export default Board;
