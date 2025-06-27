import { useState } from 'react';
import BoardSpace from './BoardSpace';
import Token, { TokenType } from './Token';
import './Board.css';
import { toNamespacedPath } from 'path';

const GRID_SIZE = 8;
// Represents the 8 traversable directions on the board as [dx, dy]
const DIRECTIONS = [
  [0,1], [1,0], [0, -1], [-1, 0],
  [1, 1], [1, -1], [-1, 1], [-1, -1]
]

const Board = () => {
  ///////////////////////////////////////////
  ///////// HELPER FUNCTIONS /////////////
  ///////////////////////////////////////////

  // Shortcut function so we don't have to write ternaries everywhere
  const oppositeColor = (color: string): string => {
    return color === TokenType.BLACK ? TokenType.WHITE : TokenType.BLACK
  }
  // This is not really necessary but makes the code cleaner
  const coordsAreInBounds = (x: number, y: number): boolean => {
    return (
      x >= 0 && x < GRID_SIZE
      && y >= 0 && y < GRID_SIZE
    )
  }

  // Returns an array of coordinates representing tokens of tokenColor in some direction that will
  // flip for a token placed on startCoords
  const getFlippableTokenCoordsInDirection = (
    // TODO revert this to [number, number] for clarity?
    startCoords: number[],
    direction: number[],
    tokenColor: string // This is the color of tokens to look for, not to flip to
  ): number[][] => {
    var flippableTokenCoords = []
    let [x, y] = startCoords;
    const [dx, dy] = direction;

    // Crawl across board in direction, adding coordinates if that space is valid
    while (
      coordsAreInBounds(x + dx, y + dy)
    ) {
      // Move forward if possible
      x = x + dx
      y = y + dy

      if (boardState[x][y] === tokenColor) {
        // If token is desired color, log it
        flippableTokenCoords.push([x,y])
      } else if (boardState[x][y] === oppositeColor(tokenColor)) {
        // If we encounter original token color, return logged spaces
        return flippableTokenCoords
      }
    }

    // If we reach the end of the board or of the token row without hitting a closing token,
    // we return nothing
    return []

    }


  // Returns an array of coordinates representing all tokens that will flip due to a
  // token of color tokenColor being placed on coordinates coords
  const getFlippableTokenCoordsForMove = (
    coords: number[], // Coordinates of the placed token
    tokenColor: string // Color of the placed token
  ): number[][] => {
    var allFlippableTokenCoords: number[][] = []
    const colorToFlip = tokenColor === TokenType.BLACK ? TokenType.WHITE : TokenType.BLACK

    // Aggregate flippable tokens in each direction to get total
    DIRECTIONS.forEach((direction) => {
      let temp = getFlippableTokenCoordsInDirection(
        coords, direction, colorToFlip
      )
      allFlippableTokenCoords = allFlippableTokenCoords.concat(temp)
      //allFlippableTokenCoords.concat(getFlippableTokenCoordsInDirection(
      //  coords, direction, colorToFlip
      //))
    })

    return allFlippableTokenCoords
  }

  // Sets the given tokens to a color. Note that this is not a toggle function, and so depends
  // on a correct board state and tokenCoords to operate correctly (within the rules of the game)
  const setTokensToColor = (tokenCoords: number[][], color: string) => {
    let boardStateCopy = Array.from(boardState);
    tokenCoords.forEach((coordinate) => {
      boardStateCopy[coordinate[0]][coordinate[1]] = color
    })
    setBoardState(boardStateCopy)
  }

  // Handler for a player clicking a space
  const handleBoardClick = (x: number, y: number) => {
    const tokensToFlip = getFlippableTokenCoordsForMove([x,y], activePlayer)
    if (tokensToFlip.length === 0) {
      return
    }
    setTokensToColor(tokensToFlip.concat([[x,y]]), activePlayer);

  }

  ///////////////////////////////////////////
  ////////// INITIALIZE STATE /////////////
  ///////////////////////////////////////////

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
  // TODO work turns into logic and meld tokenType with player color
  const [activePlayer, setActivePlayer] = useState<string>('black');

  ///////////////////////////////////////////
  ////////// DEFINE GRID COMPONENT /////////////
  ///////////////////////////////////////////

  // I used chatgpt to get the general formula for how to build a grid using basic React components
  // (including styling), and tweaked the syntax to fit my purpose
  const grid: any[] = [ ...new Array(GRID_SIZE)].map( (_, row_idx) => {
    return [ ...new Array(GRID_SIZE)].map( (_, col_idx) => {
        return <BoardSpace
          token={
            Token({tokenType: boardState[row_idx][col_idx], key: `token-${row_idx}-${col_idx}`})
          }
          key={`space-${row_idx}-${col_idx}`}
          handleClick={() => handleBoardClick(row_idx, col_idx)}
        ></BoardSpace>
    })
  })

  ///////////////////////////////////////////
  ////////// RETURN TSX ///////////
  ///////////////////////////////////////////

  return (
    <div className='board-container'>
        <div className="board">
            {grid}
        </div>
    </div>
  );
};

export default Board;
