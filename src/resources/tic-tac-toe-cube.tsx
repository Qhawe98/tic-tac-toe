import '../App.css';

export type CubeModel = {
    cubeSquares: {
        id: string;
        squareText: string;
        isClicked: boolean;
        isTextVisible: boolean;
        squareColor?: "success" | "danger" | "warning" | "info";
        playerMoves?: PlayerMove[]
    }[];
}

export type PlayerMove = {
    squareId: string,
    playerSymbol: string,
    moveNumber: number,
}

type CubeProps = {
    cubeContent: CubeModel;
    cubeOnClick: (index: number) => void;
    width?: number;
}

const TicTacToeCube = ({ cubeContent, cubeOnClick, width }: CubeProps) => {
    const limitedWidth = width !== undefined
        ? Math.min(Math.max(width, 1), 100)
        : undefined;

    return (
        <div
            className={`cube-face ${cubeContent.cubeSquares.length > 0 ? 'visible' : 'hidden'}`}
            style={limitedWidth ? { width: `${limitedWidth}vmin` } : {}}
        >
            {cubeContent.cubeSquares.map((square, i) => (
                <div
                    key={i}
                    onClick={() => cubeOnClick(i)}
                    className={`cube-tile ${square.isClicked ? 'clicked' : ''}`}
                >
                    {square.isTextVisible && (
                        <span className={`symbol ${square.squareText.toLowerCase()}`}>
                            {square.squareText}
                        </span>
                    )}
                </div>
            ))}
        </div>
    );
};

export default TicTacToeCube;