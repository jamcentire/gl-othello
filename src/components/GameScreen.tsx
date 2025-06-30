import { useState } from 'react';
import Board from './Board';
import { TokenType } from './Token';

const GameScreen = () => {
  /////////////// ACTIVE PLAYER STATE
  // TODO work turns into logic and meld tokenType with player color
  // TODO separate player id from token type
  // Indicates whose turn it is
  const [activePlayer, setActivePlayer] = useState<string>(TokenType.DARK);
  // Indicates which players have an available move. Used to skip turns where play is impossible
  // and trigger game end
  const [playersHaveAvailableMove, setPlayersHaveAvailableMove] = useState({
    [TokenType.LIGHT]: true,
    [TokenType.DARK]: true,
  })
  // NOTE: I used chatgpt to figure out that the TokenType constants must be bounded within []
  // to use computed property name as the key, rather than the bare object expression

  return (
    <div className="App">
      <Board
        activePlayer={activePlayer}
        setActivePlayer={setActivePlayer}
        playersHaveAvailableMove={playersHaveAvailableMove}
        setPlayersHaveAvailableMove={setPlayersHaveAvailableMove}
      />
    </div>
  );
}

export default GameScreen