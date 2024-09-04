import React, {useEffect, useState} from 'react';
import {usePlayerContext} from "../context/PlayerContext.jsx";
import {gameSettings, stats, useGameContext} from "../context/GameContext.jsx";

export const UI = () => {
    const {getHitCount, getStrength, resetHitCount, getScoreBoard} = usePlayerContext();
    const {gameState, nextHole, currentHole} = useGameContext();
    const [showScoreBoard, setShowScoreBoard] = useState(false);

    const scoringTable = [{type: "condor", score: -4}, {type: "albatross", score: -3}, {
        type: "eagle", score: -2
    }, {type: "birdie", score: -1}, {type: "par", score: 0}, {type: "bogey", score: 1}, {
        type: "double bogey", score: 2
    }, {type: "triple bogey", score: 3}];

    useEffect(() => {
        const handleKeyDown = (event) => {
            if (event.key === 'Tab') {
                event.preventDefault();
                setShowScoreBoard(true);
            }
        };

        const handleKeyUp = (event) => {
            if (event.key === 'Tab') {
                event.preventDefault();
                setShowScoreBoard(false);
            }
        }

        window.addEventListener('keydown', handleKeyDown);
        window.addEventListener('keyup', handleKeyUp);
        return () => {
            window.removeEventListener('keydown', handleKeyDown);
            window.removeEventListener('keyup', handleKeyUp);
        };
    }, []);

    return (<>
        <div className={"header"}>
            <h1>Mini Golf R3F</h1>
            <h1>Hole: {currentHole + 1}</h1>
        </div>

        <ul className="score">
            <li>Hits : {getHitCount()}</li>
            <li>Par: {gameSettings[currentHole].par}</li>
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
            <h1>Win!</h1>
            <p>
                {scoringTable.map((score) => {
                    if (getHitCount() === gameSettings[currentHole].par + score.score) {
                        return <span key={score.type}>{score.type}</span>;
                    }
                    return null;
                })}
            </p>
            {currentHole < 2 && (<button onClick={() => {
                resetHitCount();
                nextHole();
            }}>Next hole
            </button>)}
        </div>)}

        {showScoreBoard && (<div className="score-board">
            <h2>Score Board</h2>
            <table>
                <thead>
                <tr>
                    <th>Hole</th>
                    <th>Par</th>
                    <th>Score</th>
                </tr>
                </thead>
                <tbody>
                {getScoreBoard().map((score) => (<tr key={score.hole}>
                    <td>{score.hole}</td>
                    <td>{gameSettings[score.hole - 1].par}</td>
                    <td>{score.score}</td>
                </tr>))}
                </tbody>
            </table>
        </div>)}

    </>);
};