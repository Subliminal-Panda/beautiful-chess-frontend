﻿import React, { useState, useEffect, useContext, useRef } from 'react';

import CapturedZone from './capturedZone';
import Board from './board';
import CurrentGameContext from './currentGame';
import { navigate } from 'hookrouter';
import Login from './login';

export default function Table (props) {

    const { playerOne, setPlayerOne } = useContext(CurrentGameContext)
    const { playerTwo, setPlayerTwo } = useContext(CurrentGameContext)
    const { playerOneData, setPlayerOneData } = useContext(CurrentGameContext)
    const { playerTwoData, setPlayerTwoData } = useContext(CurrentGameContext)
    const { gameEnd, setGameEnd } = useContext(CurrentGameContext)
    const { activePlayer, setActivePlayer } = useContext(CurrentGameContext)
    const { selection, setSelection } = useContext(CurrentGameContext)
    const { pieces, setPieces } = useContext(CurrentGameContext)
    const { locations, setLocations } = useContext(CurrentGameContext)
    const { taken, setTaken } = useContext(CurrentGameContext)
    const { underAttack, setUnderAttack } = useContext(CurrentGameContext)
    const { castled, setCastled } = useContext(CurrentGameContext)
    const { inCheck, setInCheck } = useContext(CurrentGameContext)
    const { assassinAttempts, setAssassinAttempts } = useContext(CurrentGameContext)
    const { moving, setMoving } = useContext(CurrentGameContext)
    const { pinned, setPinned } = useContext(CurrentGameContext)
    const { newGame, setNewGame } = useContext(CurrentGameContext)

    const [ active, setActive ] = useState(playerOne)
    const [ inactive, setInactive ] = useState(playerTwo)

    const resetGame = () => {
        setGameEnd(false)
        setPieces([])
        setActivePlayer("white")
        setSelection(false)
        setLocations([])
        setTaken([])
        setUnderAttack([])
        setCastled([])
        setAssassinAttempts([])
        setMoving(false)
        setPinned([])
        setNewGame(true)
        setInCheck([])
    }

    const findInactive = () => {
        if(activePlayer === "white") {
            setActive(playerOne)
            setInactive(playerTwo)
        } else if(activePlayer === "black") {
            setActive(playerTwo)
            setInactive(playerOne)
        }
    }

    useEffect(() => {
        findInactive();
    },[activePlayer, moving])

    useEffect(() => {
        console.log("player one data:", playerOneData, "player two data:", playerTwoData)

    }, [playerOneData, playerTwoData])


    return (
        <div className="page-wrap">
        { ((playerOneData && playerTwoData && playerOne && playerTwo)) ?
            <div className="table-wrap">
                <CapturedZone />
                <div className="game-wrap">
                    <div className="turn-info">
                    { gameEnd ?
                        <div className="game-end">
                            <div>{`${gameEnd[0]}.`.toUpperCase()}</div>
                        </div>
                        : inCheck[0] === "white" && activePlayer === "white" || inCheck[1] === "black" && activePlayer === "black" ?
                        <div className="in-check">
                        <div>{active}:</div><div>CHECK!</div>
                        </div>
                        :
                        <div className={ active === playerTwo ? "player-two on-turn" : "player-one on-turn" } >
                            {active}:
                            <div>your move.</div>
                        </div>
                    }
                    </div>
                    <Board />
                    { gameEnd ? <div onClick={() => resetGame()} className="new-game">Rematch?</div> : null }
                </div>
            </div>
            : <Login />
        }
        </div>
    )
}
