import React, { useState, useEffect, useContext } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

import CurrentGameContext from './currentGame';

export default function CapturedZone(props) {

    const { taken, setTaken } = useContext(CurrentGameContext)
    const { locations, setLocations } = useContext(CurrentGameContext)
    const { activePlayer, setActivePlayer } = useContext(CurrentGameContext)
    const { inCheck, setInCheck } = useContext(CurrentGameContext)
    const { gameEnd, setGameEnd } = useContext(CurrentGameContext)
    const { playerOne, setPlayerOne } = useContext(CurrentGameContext)
    const { playerTwo, setPlayerTwo } = useContext(CurrentGameContext)
    const { moving, setMoving } = useContext(CurrentGameContext)

    const [ capturesOne, setCapturesOne ] = useState([])
    const [ capturesTwo, setCapturesTwo ] = useState([])

    const [ active, setActive ] = useState(playerOne)
    const [ inactive, setInactive ] = useState(playerTwo)

    useEffect(() => {
        renderTaken();
        findInactive();
    },[activePlayer, moving])



    const findInactive = () => {
        if(activePlayer === "white") {
            setActive(playerOne)
            setInactive(playerTwo)
        } else if(activePlayer === "black") {
            setActive(playerTwo)
            setInactive(playerOne)
        }
    }



    const renderTaken = () => {
        const renderedOne = []
        const renderedTwo = []
        const playerTaken = taken.filter((pc, index, arr) =>
            index === arr.findIndex((oth) => (
            oth[2] === pc[2]
            )
        ))
        playerTaken.forEach((pc) => {
            if(pc[1] === "black") {
                renderedOne.push(
                    <div className="taken-wrapper" style={{color: `${pc[1]}`}} >
                        <FontAwesomeIcon className="taken" icon={pc[0]}></FontAwesomeIcon>
                    </div>
                )
            } else if(pc[1] === "white") {
                renderedTwo.push(
                    <div className="taken-wrapper" style={{color: `${pc[1]}`}} >
                        <FontAwesomeIcon className="taken" icon={pc[0]}></FontAwesomeIcon>
                    </div>
                )
            }
        })
        setCapturesOne(renderedOne)
        setCapturesTwo(renderedTwo)
    }

    return (
        <div className={ active === playerTwo ? "player-two-captured captured-zone" : "player-one-captured captured-zone" }>
            <h1 className={ active === playerOne ? "player-one single-captured captured" : active === playerTwo ? "player-two single-captured captured" : null }>Captured:</h1>

            <div className="details-wrap" >


                <div className={ active === playerOne ? "player-one one-active active-details details" : active === playerTwo ? "player-two two-active active-details details" : null }>

                    <div className="nameplate">
                        { gameEnd ?
                        <div className="game-end">
                            <div>{`${gameEnd[0]}.`.toUpperCase()}</div>
                            <div>{`${gameEnd[1]} wins.`.toUpperCase()}</div>
                        </div>
                        : inCheck[0] === "white" && activePlayer === "white" || inCheck[1] === "black" && activePlayer === "black" ?
                        <div className="in-check">
                            CHECK!
                        </div>
                        : <div className={ active === playerTwo ? "player-two on-turn" : "player-one on-turn" } >{active}'s move.</div>
                        }
                        { gameEnd ? null : <h1 className={ active === playerOne ? "player-one captured" : active === playerTwo ? "player-two captured" : null }>Captured:</h1>}
                    </div>




                    <div className="captures active-captures">


                        { active === playerOne ? capturesOne : capturesTwo }

                    </div>
                </div>

                <div className="divider" />

                <div className={ inactive === playerOne ? "player-one inactive-details details" : inactive === playerTwo ? "player-two inactive-details details" : null }>

                    <div className="nameplate">
                        {inactive}
                        <h1 className={ inactive === playerOne ? "player-one captured" : inactive === playerTwo ? "player-two captured" : null }>Captured:</h1>
                    </div>

                    <div className="captures">


                        { inactive === playerOne ? capturesOne : capturesTwo }

                    </div>
                </div>
            </div>
        </div>
    )
}
