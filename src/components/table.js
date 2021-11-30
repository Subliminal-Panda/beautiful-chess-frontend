import React, { useState, useEffect, useContext, useRef } from 'react';

import CapturedZone from './capturedZone';
import Board from './board';
import CurrentGameContext from './currentGame';
import { navigate } from 'hookrouter';
import Login from './login';

export default function Table (props) {

    const { playerOne, setPlayerOne } = useContext(CurrentGameContext)
    const { playerTwo, setPlayerTwo } = useContext(CurrentGameContext)
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
    const { loginWhite, setLoginWhite } = useContext(CurrentGameContext)
    const { loginBlack, setLoginBlack } = useContext(CurrentGameContext)

    const [ active, setActive ] = useState(playerOne)
    const [ inactive, setInactive ] = useState(playerTwo)


    const [ vh, setVh ] = useState(window.innerHeight * .01)
    const [ vw, setVw ] = useState(window.innerWidth * .01)
    const [ aspect, setAspect ] = useState((vh/vw).toFixed(2))

    window.addEventListener('resize', () => {
        setVh(window.innerHeight * .01)
        setVw(window.innerWidth * .01)
        setAspect((vh/vw).toFixed(2))
    })

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


    return (
        <div>
        { (loginWhite && loginBlack) ?
            <div className="table-wrap" style={ aspect > 1 ? { height: `${vw * 100}px`} : { height: `${vh * 100}px`} }>
                <CapturedZone />
                <div className="game-wrap">
                    <div className="turn-info">
                    { gameEnd ?
                        <div className="game-end">
                            <div>{`${gameEnd[0]}. ${gameEnd[1]} wins.`.toUpperCase()}</div>
                        </div>
                        : inCheck[0] === "white" && activePlayer === "white" || inCheck[1] === "black" && activePlayer === "black" ?
                        <div className="in-check">
                        <div>{active},</div><div>CHECK!</div>
                        </div>
                        :
                        <div className={ active === playerTwo ? "player-two on-turn" : "player-one on-turn" } >
                            {active},
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
