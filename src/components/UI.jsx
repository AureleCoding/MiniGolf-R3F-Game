import {usePlayerContext} from "../context/PlayerContext.jsx";
import {gameSettings, stats, useGameContext} from "../context/GameContext.jsx";

export const UI = () => {
    const {getHitCount, getStrength} = usePlayerContext();
    const {gameState, nextHole, currentHole} = useGameContext();

    return (<>

        <ul className="score">
            <li>
                Hits : {getHitCount()}
            </li>
            <li>
                Par: {gameSettings[currentHole].par}
            </li>
            <li>
                Hole: {currentHole + 1}
            </li>
            <li>
                Game state: {gameState}
            </li>
        </ul>

        <div className="force-gauge">
            <div
                className="force-bar"
                style={{
                    clipPath: `polygon(0 ${100 - ((getStrength() - 0.0005) / (0.002 - 0.0005)) * 100}%, 100% ${100 - ((getStrength() - 0.0005) / (0.002 - 0.0005)) * 100}%, 100% 100%, 0 100%)`,
                }}
            />
        </div>

        {gameState === stats.win && (<div className="win">
            WIN

            {/*Next */}
            <button onClick={() => nextHole()}>Next</button>
        </div>)}
    </>);
};
