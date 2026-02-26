import { useEffect, useState } from 'react';
import './App.css'
import ticTacToeCube from './resources/tic-tac-toe-cube';
import InformationModal from './resources/information-modal';

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
  };

  const [isLegWinnerModalOpen, setIsLegWinnerModalOpen] = useState<boolean>(false);
  const [isLegCubeVisible, setIsLegCubeVisible] = useState<boolean>(false);
  const [mainGameStarted, setMainGameStarted] = useState<boolean>(false);
  const [isGameSquareVisible, setIsGameSquareVisible] = useState<boolean>(false);


  const [cubeData, setCubeData] = useState({
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
      setIsLegWinnerModalOpen(true);
      setIsLegCubeVisible(false);

      if (numberForEachPlayer.player1 > numberForEachPlayer.player2) {
        setPlayerNames(prev => ({ ...prev, player1Symbol: 'X', player2Symbol: 'O' }));
      } else {
        setPlayerNames(prev => ({ ...prev, player1Symbol: 'O', player2Symbol: 'X' }));
      }
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

  return (
    <>
      {(playerNames.player1 === '' || playerNames.player2 === '') ? (
        <div className="form-container">
          <h1>Enter Player Names</h1>
          <input
            type="text"
            id='player1'
            key={`player1`}
            placeholder="Player 1 Name"
            value={formData.player1}
            onChange={(e) => setFormData({ ...formData, player1: e.target.value })}
          />
          <input
            type="text"
            id='player2'
            key={`player2`}
            placeholder="Player 2 Name"
            value={formData.player2}
            onChange={(e) => setFormData({ ...formData, player2: e.target.value })}
          />
          <button onClick={() => setPlayerNamesAndGenerateNumbers()}>Submit Names</button>
        </div>
      ) : (playerNames.player1 !== '' && playerNames.player2 !== '' && isLegCubeVisible) ? (
        <div className="game-container">
          <h2>Players: {playerNames.player1} vs {playerNames.player2}</h2>
          <p>{getStatusMessage()}</p>
          {ticTacToeCube({ cubeContent: cubeData, cubeOnClick: onSquareClick, width: 50 })}
        </div>
      ) : (
        isLegWinnerModalOpen && (
          <InformationModal
            isOpen={isLegWinnerModalOpen}
            onClose={() => {
              setIsLegWinnerModalOpen(false);
              setIsGameSquareVisible(false);
              setMainGameStarted(true);
            }}
            title={labels.legWinner}
            message={labels.playerHasWonTheLeg(getStatusMessage())}
            onConfirmButtonText="Next Leg"
          />
        )
      )}
    </>
  )
}

export default App
