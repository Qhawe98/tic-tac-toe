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
    width?: number;
}

const ticTacToeCube = ({ cubeContent, cubeOnClick, width }: CubeProps) => {

    const limitedWidth = width !== undefined
        ? Math.min(Math.max(width, 1), 100)
        : undefined;


    return (
        <>
            <div className={`cube-face ${cubeContent.cubeSquares.length > 0 ? 'visible' : 'hidden'}`} style={limitedWidth ? { width: `${limitedWidth}vmin` } : {}}>
                {
                    cubeContent.cubeSquares.map((square, i) => (
                        <div key={i} onClick={() => cubeOnClick(i)} className={`cube-face-content ${square.squareColor ? `bg-${square.squareColor}` : ''} text-black`}>{square.isTextVisible ? square.squareText : ''}</div>
                    ))
                }
            </div>

        </>)
}

export default ticTacToeCube;