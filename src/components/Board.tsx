import { useState } from 'react';
import BoardSpace from './BoardSpace';
import Token from './Token';
import './Board.css';

export const GameEvent = {
  NO_MOVES_AVAILABLE: 'no_moves',
  MOVE_MADE: 'move_made',
  VICTORY: 'victory'
}

export const PlayerColor = {
  DARK: 'dark',
  LIGHT: 'light'
}

interface GameBoardProps {
  activePlayer: string,
  setActivePlayer: (player: string) => void,
  triggerEvent: (event: string, player: string) => void
}

const GRID_SIZE = 8;

// Represents the 8 traversable directions on the board as [dx, dy]
const DIRECTIONS = [
  [0,1], [1,0], [0, -1], [-1, 0],
  [1, 1], [1, -1], [-1, 1], [-1, -1]
]
// Takes in PlayerColor and returns opposite PlayerColor
export const oppositeColor = (color: string): string => {
  return color === PlayerColor.DARK ? PlayerColor.LIGHT : PlayerColor.DARK
}


const Board = (props: GameBoardProps) => {
  ///////////////////////////////////////////
  ////////// HELPER FUNCTIONS ///////////////
  ///////////////////////////////////////////

  // Checks whether a set of coordinates are within the bounds of the board
  const coordsAreInBounds = (x: number, y: number): boolean => {
    return (
      x >= 0 && x < GRID_SIZE
      && y >= 0 && y < GRID_SIZE
    )
  }

  // Returns an array of coordinates pinpointing tokens of opposite(tokenColor) in some direction that will
  // flip if a token of tokenColor is placed at startCoords
  const getFlippableTokenCoordsInDirectionForColor = (
    startCoords: number[],
    direction: number[],
    tokenColor: string // PlayerColor of the anchor and closing tokens (NOT of the tokens to target)
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
      } else if (boardState[x][y].length === 0) {
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
    tokenColor: string // PlayerColor of the placed token
  ): number[][] => {
    var allFlippableTokenCoords: number[][] = []

    // Aggregate flippable tokens in each direction to get total
    DIRECTIONS.forEach((direction) => {
      let temp = getFlippableTokenCoordsInDirectionForColor(
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

  // Determines if any move is available for a given player
  const moveIsAvailableForPlayer = (playerColor: string): boolean => {
    // Iterate over all spaces on the board
    for (let x = 0; x < GRID_SIZE; x++) {
      for (let y = 0; y < GRID_SIZE; y++) {
        // only check empty spaces
        if (boardState[x][y].length > 0) {
          continue
        }
        // If any space has a viable move, return true
        else if (getFlippableTokenCoordsForMove([x,y], playerColor).length > 0) {
          return true
        }
      }
    }

    // If no viable move found, return false
    return false
  }

  // Calculate score, and trigger a victory event
  const handleGameEnd = () => {
    var light_ct = 0;
    var dark_ct = 0;

    for (let x = 0; x < GRID_SIZE; x++) {
      for (let y = 0; y < GRID_SIZE; y++) {
        if (boardState[x][y] === PlayerColor.LIGHT) {
          light_ct++;
        }
        else if (boardState[x][y] === PlayerColor.DARK) {
          dark_ct++
        }
      }
    }

    if (light_ct > dark_ct) {
      props.triggerEvent(GameEvent.VICTORY, PlayerColor.LIGHT)
    } else if (dark_ct > light_ct) {
      props.triggerEvent(GameEvent.VICTORY, PlayerColor.DARK)
    } else {
      // This game can end in a draw
      props.triggerEvent(GameEvent.VICTORY, '')
    }
  }

  // Logic for advancing turn, including determining availability of player moves, and triggering
  // game end if necessary
  const handleAdvanceTurn = () => {
    // If the next player may make a move, change to their turn
    if (moveIsAvailableForPlayer(oppositeColor(props.activePlayer))) {
      props.setActivePlayer(oppositeColor(props.activePlayer));
      props.triggerEvent(GameEvent.MOVE_MADE, props.activePlayer);
    }
    // If neither the next nor the current player can make another move, trigger the game's end
    else if (!moveIsAvailableForPlayer(props.activePlayer)) {
      handleGameEnd();
    } else {
      // Otherwise, keep player turn the same, and fire turn skip event for other player
      props.triggerEvent(GameEvent.NO_MOVES_AVAILABLE, oppositeColor(props.activePlayer))
    }
  }

  // Handler for a player clicking a space. Searches for flippable tokens, flips them and
  // advances turn if any exist. Otherwise, does nothing
  const handleBoardClick = (x: number, y: number) => {
    // If the space is occupied by a token already, ignore
    if (boardState[x][y].length > 0) {
      return
    }

    // Otherwise, search for flippable tokens
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

  // Initialize board state as all empty spaces (empty strings)
  let initialBoardState: string[][] = Array.from({ length: GRID_SIZE }, () =>
    new Array(GRID_SIZE).fill('')
  );

  // Then set middle 2x2 square of board to starting state (we assume grid size will always be an even integer)
  const halfGridSize = GRID_SIZE / 2;
  initialBoardState[halfGridSize - 1][halfGridSize - 1] = PlayerColor.DARK
  initialBoardState[halfGridSize][halfGridSize] = PlayerColor.DARK
  initialBoardState[halfGridSize - 1][halfGridSize] = PlayerColor.LIGHT
  initialBoardState[halfGridSize][halfGridSize - 1] = PlayerColor.LIGHT

  // State comprises a 2d array of PlayerColor strings
  const [boardState, setBoardState] = useState<string[][]>(initialBoardState);

  ///////////////////////////////////////////
  ///////// DEFINE GRID COMPONENT ///////////
  ///////////////////////////////////////////

  // I used chatgpt to get the general formula for how to build a grid using basic React components
  // (including styling), and tweaked the syntax to fit my purpose
  const grid: any[] = [ ...new Array(GRID_SIZE)].map( (_, row_idx) => {
    return [ ...new Array(GRID_SIZE)].map( (_, col_idx) => {
        return <BoardSpace
          token={
            Token({tokenColor: boardState[row_idx][col_idx], key: `token-${row_idx}-${col_idx}`})
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
