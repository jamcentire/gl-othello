import { useState } from 'react';
import BoardSpace from './BoardSpace';
import Token, { TokenType } from './Token';
import './Board.css';
import { toNamespacedPath } from 'path';

// TODO fix function typing?
interface GameBoardProps {
    activePlayer: string,
    setActivePlayer: any,
    playersHaveAvailableMove: object,
    setPlayersHaveAvailableMove: any
}

const GRID_SIZE = 4;
// Represents the 8 traversable directions on the board as [dx, dy]
const DIRECTIONS = [
  [0,1], [1,0], [0, -1], [-1, 0],
  [1, 1], [1, -1], [-1, 1], [-1, -1]
]

const Board = (props: GameBoardProps) => {
  ///////////////////////////////////////////
  ////////// HELPER FUNCTIONS ///////////////
  ///////////////////////////////////////////

  // Shortcut function so we don't have to write ternaries everywhere
  const oppositeColor = (color: string): string => {
    return color === TokenType.DARK ? TokenType.LIGHT : TokenType.DARK
  }
  // Checks whether a set of coordinates are within the bounds of the board
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
    tokenColor: string // Color of the anchor/closing token
  ): number[][] => {
    var flippableTokenCoords = []
    let [x, y] = startCoords;
    const [dx, dy] = direction;

    // Crawl across board in direction, adding coordinates if spaces are valid
    while (
      coordsAreInBounds(x + dx, y + dy)
    ) {
      // Move forward if possible
      x = x + dx
      y = y + dy

      // If token is opposing color, log it
      if (boardState[x][y] === oppositeColor(tokenColor)) {
        flippableTokenCoords.push([x,y])

      // If we encounter original token color (ending crawl), return logged spaces
      } else if (boardState[x][y] === tokenColor) {
        return flippableTokenCoords

      // If we hit an empty space, return nothing
      } else if (boardState[x][y] === TokenType.NONE) {
        return []
      }
    }

    // If we reach the end of the board without hitting a closing token, we return nothing
    return []

    }


  // Returns an array of coordinates representing all tokens that will flip due to a
  // token of color tokenColor being placed on coordinates coords
  const getFlippableTokenCoordsForMove = (
    coords: number[], // Coordinates of the placed token
    tokenColor: string // Color of the placed token
  ): number[][] => {
    var allFlippableTokenCoords: number[][] = []

    // Aggregate flippable tokens in each direction to get total
    DIRECTIONS.forEach((direction) => {
      let temp = getFlippableTokenCoordsInDirection(
        coords, direction, tokenColor
      )
      allFlippableTokenCoords = allFlippableTokenCoords.concat(temp)
    })

    return allFlippableTokenCoords
  }

  // Takes in a set of coordinates and changes all corresponding tokens to color.
  // Note that this is not a toggle function, and so depends on correct board state
  // and tokenCoords to operate correctly (within the rules of the game)
  const setTokensToColor = (tokenCoords: number[][], color: string) => {
    let boardStateCopy = Array.from(boardState);
    tokenCoords.forEach((coordinate) => {
      boardStateCopy[coordinate[0]][coordinate[1]] = color
    })
    setBoardState(boardStateCopy)
  }

  // Determines if any move is available for the active player
  const moveIsAvailableForPlayer = (player: string): boolean => {
    // Iterate over all spaces on the board
    for (let x = 0; x < GRID_SIZE; x++) {
      for (let y = 0; y < GRID_SIZE; y++) {
        // only check empty spaces
        if (boardState[x][y] !== TokenType.NONE) {
          continue
        }
        // If any space has a viable move, return true
        else if (getFlippableTokenCoordsForMove([x,y], props.activePlayer).length > 0) {
          return true
        }
      }
    }

    // If no viable move found, return false
    return false
  }

  // Logic for advancing turn, including determining availability of players moves, and triggering
  // game end if necessary
  const handleAdvanceTurn = () => {
    // If the next player may make a move, change to their turn
    if (moveIsAvailableForPlayer(oppositeColor(props.activePlayer))) {
      props.setActivePlayer(oppositeColor(props.activePlayer));
      return
    }
    // Otherwise, keep player turn the same, and flash message that player turn has been skipped

    // TODO: add message that player turn has been skipped
    // TODO: add handling for neither players has active turn (game end)
  }

  // Handler for a player clicking a space. Searches for flippable tokens, flips them and
  // advances turn if any exist. Otherwise, does nothing
  const handleBoardClick = (x: number, y: number) => {
    const tokensToFlip = getFlippableTokenCoordsForMove([x,y], props.activePlayer)
    if (tokensToFlip.length === 0) {
      return
    }
    setTokensToColor(tokensToFlip.concat([[x,y]]), props.activePlayer);
    handleAdvanceTurn();
  }

  ///////////////////////////////////////////
  //////////// INITIALIZE STATE /////////////
  ///////////////////////////////////////////

  // TODO set this type back to string[][]
  // Initialize board state as all empty spaces
  let initialBoardState: any[][] = Array.from({ length: GRID_SIZE }, () =>
    new Array(GRID_SIZE).fill(TokenType.NONE)
  );

  // Then set middle 2x2 square of board to starting state (we assume grid size will always be even)
  const halfGridSize = GRID_SIZE / 2;
  initialBoardState[halfGridSize - 1][halfGridSize - 1] = TokenType.DARK
  initialBoardState[halfGridSize][halfGridSize] = TokenType.DARK
  initialBoardState[halfGridSize - 1][halfGridSize] = TokenType.LIGHT
  initialBoardState[halfGridSize][halfGridSize - 1] = TokenType.LIGHT

  // State comprises a 2d array of TokenType strings
  const [boardState, setBoardState] = useState<any[][]>(initialBoardState);

  ///////////////////////////////////////////
  ///////// DEFINE GRID COMPONENT ///////////
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
  //////////////// RETURN TSX ///////////////
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
