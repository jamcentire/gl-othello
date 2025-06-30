import { useState } from 'react';
import Board, { PlayerColor } from './Board';

const GameScreen = () => {

  const [activePlayer, setActivePlayer] = useState<string>(PlayerColor.DARK)

  const triggerEvent = (event: string, playerColor: string) => {
    // TODO build this with handling for victory, turn skip
    console.log(event)
    console.log(playerColor)
  }

  return (
    <div className="App">
      <div>Player Turn: {activePlayer}</div>
      <Board
        activePlayer={activePlayer}
        setActivePlayer={setActivePlayer}
        triggerEvent={triggerEvent}
      />
    </div>
  );
}

export default GameScreen