import { act, useState } from 'react';
import Board, { PlayerColor, GameEvent, oppositeColor } from './Board';
import './GameScreen.css';

const GameScreen = () => {

  const [activePlayer, setActivePlayer] = useState<string>(PlayerColor.DARK)
  const [eventText, setEventText] = useState<string>('');

  const triggerEvent = (event: string, playerColor: string) => {
    if (event === GameEvent.NO_MOVES_AVAILABLE) {
      setEventText(`No moves available for ${playerColor}! Turn reverts to ${oppositeColor(playerColor)}`)
    } else if (event === GameEvent.VICTORY) {
      if (playerColor === '') {
        setEventText('A draw! Well played to you both')
      } else {
        setEventText(`Game over. ${playerColor} has won!`)
      }
    } else if (event === GameEvent.MOVE_MADE) {
      setEventText('');
    }
  }

  return (
    <div className="App">
      <div className='title-text turn-indicator'>Player Turn: {activePlayer}</div>
      <div className='title-text event-indicator'>{eventText}</div>
      <Board
        activePlayer={activePlayer}
        setActivePlayer={setActivePlayer}
        triggerEvent={triggerEvent}
      />
    </div>
  );
}

export default GameScreen