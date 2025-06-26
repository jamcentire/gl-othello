import './BoardSpace.css'

interface BoardSpaceProps {
    key: string; // In format '{row_idx}-{col_idx}'
}

const BoardSpace = (props: BoardSpaceProps) => {
  return (
    <div className='board-space'></div>
  )
}

export default BoardSpace;