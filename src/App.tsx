import { useEffect, useState } from 'react';
import './App.css'
import InformationModal from './resources/information-modal';
import TicTacToeCube, { type CubeModel, type PlayerMove } from './resources/tic-tac-toe-cube';

const App = () => {
  const [playerNames, setPlayerNames] = useState<{ player1: string, player2: string }>({ player1: '', player2: '' });
  const [formData, setFormData] = useState({ player1: '', player1Symbol: '', player2: '', player2Symbol: '' });
  const [randomNumbers, setRandomNumbers] = useState<number[]>([]);
  const [numberForEachPlayer, setNumberForEachPlayer] = useState<{ player1: number, player2: number }>({ player1: 0, player2: 0 });
  const labels = {
    playerHasWonTheLeg: (playerName: string) => `${playerName} has won the leg and has been assigned X to start playing first`,
    playerPick: (playerName: string) => `${playerName} please select any cube face to get your number`,
    legWinner: 'Leg Winner',
    nextLeg: 'Next Leg',
    confirmToInitializeGame: 'Confirm to proceed and start the game',
    hasWon: (playerSymbol: string) => `${playerSymbol} has won the match click the restart button to restart or exist to exist the game`
  };

  const [isLegWinnerModalOpen, setIsLegWinnerModalOpen] = useState<boolean>(false);
  const [isLegCubeVisible, setIsLegCubeVisible] = useState<boolean>(false);
  const [mainGameStarted, setMainGameStarted] = useState<boolean>(false);
  const [isGameSquareVisible, setIsGameSquareVisible] = useState<boolean>(false);
  const [isCalculating, setIsCalculating] = useState<boolean>(false);



  const [cubeData, setCubeData] = useState<CubeModel>({
    cubeSquares: randomNumbers.map((num, index) => ({
      id: `square-${index}`,
      squareText: num.toString(),
      onSquareClick: () => {
        if (index % 2 === 0) {
          setNumberForEachPlayer(prev => ({ ...prev, player1: num }));
        } else {
          setNumberForEachPlayer(prev => ({ ...prev, player2: num }));
        }
      },
      isClicked: false,
      isTextVisible: false
    }))
  });

  useEffect(() => {
    const numbers = [32, 1, 12, 25, 4, 19, 8, 15, 27];
    const shuffled = [...numbers].sort(() => Math.random() - 0.5);
    setRandomNumbers(shuffled);
  }, []);

  const handleGenerateNumbers = () => {
    setCubeData({
      cubeSquares: randomNumbers.map((num, index) => ({
        id: `square-${index}`,
        squareText: num.toString(),
        onSquareClick: () => {
          if (index % 2 === 0) {
            setNumberForEachPlayer(prev => ({ ...prev, player1: num }));
          } else {
            setNumberForEachPlayer(prev => ({ ...prev, player2: num }));
          }
        },
        isClicked: false,
        isTextVisible: false
      }))
    });

    setIsLegCubeVisible(true)
  }

  const setPlayerNamesAndGenerateNumbers = () => {
    setPlayerNames((prev) => ({ ...prev, player1: formData.player1, player2: formData.player2 }));
    handleGenerateNumbers();
  }

  const onSquareClick = (index: number) => {
    if (cubeData.cubeSquares[index].isClicked) {
      return;
    }

    if (numberForEachPlayer.player1 === 0 && numberForEachPlayer.player2 === 0) {
      setNumberForEachPlayer(prev => ({ ...prev, player1: randomNumbers[index] }));
      setClickedSquare(index);
    } else if (numberForEachPlayer.player1 > 0 && numberForEachPlayer.player2 === 0) {
      setNumberForEachPlayer(prev => ({ ...prev, player2: randomNumbers[index] }));
      setClickedSquare(index);
    }
    else {
      return;
    }
  }

  const [playerMoves, setPlayerMoves] = useState<PlayerMove[]>([]);
  const [moveNumber, setMoveNumber] = useState<number>(0)

  console.log()

  const onPlayerSquareClick = (squareIndex: number) => {
    const nextMoveNumber = moveNumber + 1;
    const currentPlayer = nextMoveNumber % 2 === 0 ? 'O' : 'X';

    setPlayerMoves((prev) => [
      ...prev,
      {
        squareId: squareIndex.toString(),
        playerSymbol: currentPlayer,
        moveNumber: nextMoveNumber
      }
    ]);

    setCubeData((prevCube) => ({
      ...prevCube,
      cubeSquares: prevCube.cubeSquares.map((square) =>
        square.id === squareIndex.toString()
          ? {
            ...square,
            isClicked: true,
            isTextVisible: true,
            squareText: currentPlayer,
            playerMoves: [
              ...(square.playerMoves ?? []),
              {
                playerSymbol: currentPlayer,
                squareId: squareIndex.toString(),
                moveNumber: nextMoveNumber
              }
            ],
          }
          : square
      ),
    }));

    setMoveNumber(nextMoveNumber);
  };

  const setClickedSquare = (index: number) => {
    setCubeData(prev => ({
      ...prev,
      cubeSquares: prev.cubeSquares.map((square, i) => {
        if (i === index) {
          return {
            ...square,
            isClicked: true,
            isTextVisible: true
          }
        }
        return square;
      })
    }));
  }

  useEffect(() => {
    if (numberForEachPlayer.player1 > 0 && numberForEachPlayer.player2 > 0) {

      setIsCalculating(true);

      const timer = setTimeout(() => {
        if (numberForEachPlayer.player1 > numberForEachPlayer.player2) {
          setPlayerNames(prev => ({ ...prev, player1Symbol: 'X', player2Symbol: 'O' }));
        } else {
          setPlayerNames(prev => ({ ...prev, player1Symbol: 'O', player2Symbol: 'X' }));
        }

        setIsCalculating(false);
        setIsLegCubeVisible(false);
        setIsLegWinnerModalOpen(true);
      }, 5000);

      return () => clearTimeout(timer);
    }
  }, [numberForEachPlayer]);


  const getStatusMessage = () => {
    if (numberForEachPlayer.player1 === 0 && numberForEachPlayer.player2 === 0) {
      return labels.playerPick(playerNames.player1);
    }

    if (numberForEachPlayer.player2 === 0 && numberForEachPlayer.player1 > 0) {
      return labels.playerPick(playerNames.player2);
    }

    if (numberForEachPlayer.player1 > 0 && numberForEachPlayer.player2 > 0) {
      return numberForEachPlayer.player1 > numberForEachPlayer.player2
        ? labels.playerHasWonTheLeg(playerNames.player1)
        : labels.playerHasWonTheLeg(playerNames.player2);
    }

    return '';
  };

  const [gameWinner, setGameWinner] = useState('No Winner');
  const [isFinalizing, setIsFinalizing] = useState(false);
  const [_, setCountdown] = useState(5);

  useEffect(() => {
    const result = gameWinner;

    if (result !== 'No Winner' && !isFinalizing) {
      setIsFinalizing(true);
      setGameWinner(result);

      const timerInterval = setInterval(() => {
        setCountdown((prev) => (prev > 0 ? prev - 1 : 0));
      }, 1000);

      const finalizeTimeout = setTimeout(() => {
        clearInterval(timerInterval);

        setIsLegWinnerModalOpen(true);

      }, 5000);

      return () => {
        clearInterval(timerInterval);
        clearTimeout(finalizeTimeout);
      };
    }
  }, [playerMoves]);

  return (
    <>
      {(playerNames.player1 === '' || playerNames.player2 === '') ? (
        <div className="form-container">
          <div className="form-header">
            <h1>Tic-Tac-Toe</h1>
            <p className="intro-text">
              Welcome! Enter your names below to begin. After submitting, you'll enter the
              <strong> High-Stakes Round</strong>: choose a square from the grid. The player
              with the highest hidden number goes first.
            </p>
          </div>

          <div className="form-body">
            <h3>Enter Player Names</h3>
            <div className='form-container-inputs'>
              <div className="input-group">
                <input
                  type="text"
                  className='form-input'
                  placeholder="Player 1 Name"
                  value={formData.player1}
                  onChange={(e) => setFormData({ ...formData, player1: e.target.value })}
                />
              </div>

              <div className="input-group">
                <input
                  type="text"
                  className='form-input'
                  placeholder="Player 2 Name"
                  value={formData.player2}
                  onChange={(e) => setFormData({ ...formData, player2: e.target.value })}
                />
              </div>

              <button
                className='form-button'
                disabled={!formData.player1 || !formData.player2}
                onClick={() => setPlayerNamesAndGenerateNumbers()}
              >
                Start Game
              </button>
            </div>
          </div>
          <div className="form-footer">
            <p><small>First to get three in a row (vertical, horizontal, or diagonal) wins!</small></p>
          </div>
        </div>

      ) : (playerNames.player1 !== '' && playerNames.player2 !== '' && isLegCubeVisible) ? (
        <div className="game-container">
          <h2 className='text-black'>Players: {playerNames.player1} vs {playerNames.player2}</h2>

          {isCalculating ? (
            <div className="loader-container">
              <div className="spinner"></div>
              <p className="pulse-text">Calculating the Highest Number...</p>
              <p>Who gets the "X"?</p>
            </div>
          ) : (
            <>
              <p className='text-black'>{getStatusMessage()}</p>
              {isLegCubeVisible && (
                <TicTacToeCube
                  cubeContent={cubeData}
                  cubeOnClick={onSquareClick}
                  width={50}
                />
              )}
            </>
          )}
        </div>

      ) : (
        isLegWinnerModalOpen ? (
          <InformationModal
            isOpen={isLegWinnerModalOpen}
            onClose={() => {
              setIsLegWinnerModalOpen(false);
              setIsGameSquareVisible(true);
              setMainGameStarted(true);
              setCubeData({
                cubeSquares: randomNumbers.map((num, index) => ({
                  id: index.toString(),
                  squareText: '',
                  onSquareClick: () => { },
                  isClicked: false,
                  isTextVisible: false,
                }))
              })
            }}
            title={labels.legWinner}
            message={getStatusMessage()}
            onConfirmButtonText="Next Leg"
          />
        ) : isGameSquareVisible && (
          <>
            <div className="status-header">
              {gameWinner === 'No Winner' && (
                <div className="turn-display">
                  <p>Current Turn</p>
                  <span className={`symbol ${(moveNumber + 1) % 2 === 0 ? 'o' : 'x'} pulse`}>
                    {(moveNumber + 1) % 2 === 0 ? 'o' : 'x'}
                  </span>
                </div>
              )}
            </div>

            {
              isLegWinnerModalOpen && gameWinner !== 'No Winner' && <InformationModal
                isOpen={isLegWinnerModalOpen}
                onClose={() => {
                  setCubeData({
                    cubeSquares: randomNumbers.map((_, index) => ({
                      id: index.toString(),
                      squareText: '',
                      onSquareClick: () => { },
                      isClicked: false,
                      isTextVisible: false,
                    }))
                  }),
                    setIsLegWinnerModalOpen(false)
                }}
                title={'Game Finished'}
                message={labels.hasWon(gameWinner)}
              />
            }
            <TicTacToeCube
              cubeContent={cubeData}
              cubeOnClick={(i) => onPlayerSquareClick(i)}
              width={75}
            />
          </>
        )
      )}
    </>
  )
}

export default App
