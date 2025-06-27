import './BoardSpace.css'
import Token from './Token';

interface BoardSpaceProps {
    key: string; // In format '{row_idx}-{col_idx}'
}

const BoardSpace = (props: BoardSpaceProps) => {
  return (
    <div className='board-space'>
      <Token></Token>
    </div>
  )
}

export default BoardSpace;