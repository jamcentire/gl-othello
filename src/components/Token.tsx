import './Token.css';

// Represents dark and light tokens to be placed on the board.
// This could be rolled into the board space component, but, among other reasons,
// I'm envisioning graphical extensions of this game that show you your pile of tokens
// on the side of the board, and that show the tokens flipping when you make a move
// (rather than just changing color). Each of these wants a separate token component.
interface TokenProps {
  tokenColor: string;
  key: string;
}

const Token = (props: TokenProps) => {
  const tokenType = props.tokenColor.length > 0 ? props.tokenColor : 'none'
  return (
    <div className={`game-token ${tokenType}`} key={props.key}></div>
  )
}

export default Token;