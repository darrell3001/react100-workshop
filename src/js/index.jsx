import React from "react";
import ReactDOM from "react-dom";

function Square(props) {
  console.log("Square()");
  return (
    <button className="square" onClick={props.onClick}>
      {props.value}
    </button>
  );
}

class Board extends React.Component {
  renderSquare(i) {
    console.log("square(" + i + ") render()");
    return (
      <Square
        value={this.props.squares[i]}
        onClick={() => this.props.onClick(i)}
      />
    );
  }

  render() {
    console.log("board - render()");
    return (
      <div>
        <div className="board-row">
          {this.renderSquare(0)}
          {this.renderSquare(1)}
          {this.renderSquare(2)}
        </div>
        <div className="board-row">
          {this.renderSquare(3)}
          {this.renderSquare(4)}
          {this.renderSquare(5)}
        </div>
        <div className="board-row">
          {this.renderSquare(6)}
          {this.renderSquare(7)}
          {this.renderSquare(8)}
        </div>
      </div>
    );
  }
}

class Game extends React.Component {
  constructor() {
    console.log("game constructor");
    super();
    this.state = {
      history: [
        {
          squares: Array(9).fill(null),
          xOrO: null,
          position: null
        }
      ],
      stepNumber: 0,
      xIsNext: true,
      currentlySelectedStepNumber: null
    };
  }

  handleClick(i) {
    console.log("enter handleClick(" + i + ")");

    // make a copy of current history
    const history = this.state.history.slice(0, this.state.stepNumber + 1);
    const current = history[history.length - 1];
    const squares = current.squares.slice();

    // If there is already a winner, then block further
    // updates to the square
    if (calculateWinner(squares) || squares[i]) {
      return;
    }

    var row = parseInt(i / 3) + 1;
    var col = (i % 3) + 1;
    var position = String(row + "," + col);

    squares[i] = this.state.xIsNext ? "X" : "O";
    var xOrO = this.state.xIsNext ? "X" : "O";

    this.setState({
      history: history.concat([
        {
          squares: squares,
          position: position,
          xOrO: xOrO
        }
      ]),
      stepNumber: history.length,
      xIsNext: !this.state.xIsNext
    });

    console.log("exit handleClick(" + i + ")");
  }

  jumpTo(step) {
    console.log("jumpTo()");
    this.setState({
      stepNumber: step,
      xIsNext: step % 2 === 0,
      currentlySelectedStepNumber: step
    });
  }

  render() {
    console.log("game render()");
    console.log("x = " + this.state.currentlySelectedStepNumber);

    const history = this.state.history;
    const current = history[this.state.stepNumber];
    const winner = calculateWinner(current.squares);

    // history.map will iterate each instance
    // it passes in instance and index number
    const moves = history.map((step, move) => {
      const desc = move ? step.xOrO + " to " + step.position : "Game start";
      console.log("y = " + move);
      return (
        <li key={move}>
          <a
            href="#"
            onClick={() => this.jumpTo(move)}
            style={
              this.state.currentlySelectedStepNumber == move
                ? { fontWeight: "bold" }
                : { fontWeight: "normal" }
            }
          >
            {desc}
          </a>
        </li>
      );
    });

    let status;
    if (winner) {
      status = "Winner: " + winner;
    } else {
      status = "Next player: " + (this.state.xIsNext ? "X" : "O");
    }

    return (
      <div className="game">
        <div className="game-board">
          <Board squares={current.squares} onClick={i => this.handleClick(i)} />
        </div>
        <div className="game-info">
          <div>{status}</div>
          <ol>{moves}</ol>
        </div>
      </div>
    );
  }
}

// ========================================

ReactDOM.render(<Game />, document.getElementById("root"));

function calculateWinner(squares) {
  // these are the combinations for a win
  const lines = [
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8],
    [0, 4, 8],
    [2, 4, 6]
  ];
  for (let i = 0; i < lines.length; i++) {
    // this will load up a,b,c with each incremental "win"
    const [a, b, c] = lines[i];

    // if X|O is in all three of the winning coordinates, then declare winner
    if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c]) {
      // console.log("calculateWinner() - we have a winner");
      return squares[a];
    }
  }
  // console.log("calculateWinner() - no winner yet");
  return null;
}
