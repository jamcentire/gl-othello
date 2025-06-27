import { ReactElement } from 'react';
import './BoardSpace.css'
import Token from './Token';

interface BoardSpaceProps {
    handleClick: any,
    token: ReactElement<typeof Token>;
    key: string;
}

const BoardSpace = (props: BoardSpaceProps) => {
  return (
    <div className='board-space' key={props.key} onClick={props.handleClick}>
      {props.token}
    </div>
  )
}

export default BoardSpace;