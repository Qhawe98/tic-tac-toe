import '../App.css';

type CubeModel = {
    cubeSquares: {
        id: string;
        squareText: string;
        isClicked: boolean;
        isTextVisible: boolean;
        squareColor?: "success" | "danger" | "warning" | "info";
    }[];
}

type CubeProps = {
    cubeContent: CubeModel;
    cubeOnClick: (index: number) => void;
}

const ticTacToeCube = ({ cubeContent, cubeOnClick }: CubeProps) => {

    return (
        <>
            <div className={`cube-face ${cubeContent.cubeSquares.length > 0 ? 'visible' : 'hidden'}`}>
                {
                    cubeContent.cubeSquares.map((square, i) => (
                        <div key={i} onClick={() => cubeOnClick(i)} className={`cube-face-content ${square.squareColor ? `bg-${square.squareColor}` : ''} text-black`}>{square.isTextVisible? square.squareText : ''}</div>
                    ))
                }
            </div>

        </>)
}

export default ticTacToeCube;