import React, { useState, useEffect, useContext } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

import CurrentGameContext from './currentGame';

export default function CapturedZone() {

    const { taken, setTaken } = useContext(CurrentGameContext)
    const { activePlayer, setActivePlayer } = useContext(CurrentGameContext)
    const { inCheck, setInCheck } = useContext(CurrentGameContext)
    const { gameEnd, setGameEnd } = useContext(CurrentGameContext)
    const { playerOne, setPlayerOne } = useContext(CurrentGameContext)
    const { playerTwo, setPlayerTwo } = useContext(CurrentGameContext)
    const { playerOneData, setPlayerOneData } = useContext(CurrentGameContext)
    const { playerTwoData, setPlayerTwoData } = useContext(CurrentGameContext)
    const { moving, setMoving } = useContext(CurrentGameContext)

    const [ capturesOne, setCapturesOne ] = useState([])
    const [ capturesTwo, setCapturesTwo ] = useState([])
    const [ winsOne, setWinsOne ] = useState(0)
    const [ lossesOne, setLossesOne ] = useState(0)
    const [ drawsOne, setDrawsOne ] = useState(0)
    const [ winsTwo, setWinsTwo ] = useState(0)
    const [ lossesTwo, setLossesTwo ] = useState(0)
    const [ drawsTwo, setDrawsTwo ] = useState(0)

    const [ active, setActive ] = useState(playerOne)
    const [ inactive, setInactive ] = useState(playerTwo)



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
        const renderedOne = {pawns: [], knights: [], bishops: [], rooks: [], queens: []}
        const renderedTwo = {pawns: [], knights: [], bishops: [], rooks: [], queens: []}
        const playerTaken = taken.filter((pc, index, arr) =>
            index === arr.findIndex((oth) => (
            oth[2] === pc[2]
            )
        ))
        playerTaken.forEach((pc) => {
            if(pc[1] === "black") {
                if(pc[0].iconName === "chess-pawn") {
                    renderedOne.pawns.push(
                    <div key={`taken${pc}`} className={`taken-wrapper taken-${activePlayer}`} style={{color: `${pc[1]}`}} >
                    <FontAwesomeIcon className="taken" icon={pc[0]} />
                    </div>)
                }
                if(pc[0].iconName === "chess-knight") {
                    renderedOne.knights.push(
                    <div key={`taken${pc}`} className={`taken-wrapper taken-${activePlayer}`} style={{color: `${pc[1]}`}} >
                    <FontAwesomeIcon className="taken" icon={pc[0]} />
                    </div>)
                }
                if(pc[0].iconName === "chess-bishop") {
                    renderedOne.bishops.push(
                    <div key={`taken${pc}`} className={`taken-wrapper taken-${activePlayer}`} style={{color: `${pc[1]}`}} >
                    <FontAwesomeIcon className="taken" icon={pc[0]} />
                    </div>)
                }
                if(pc[0].iconName === "chess-rook") {
                    renderedOne.rooks.push(
                    <div key={`taken${pc}`} className={`taken-wrapper taken-${activePlayer}`} style={{color: `${pc[1]}`}} >
                    <FontAwesomeIcon className="taken" icon={pc[0]} />
                    </div>)
                }
                if(pc[0].iconName === "chess-queen") {
                    renderedOne.queens.push(
                    <div key={`taken${pc}`} className={`taken-wrapper taken-${activePlayer}`} style={{color: `${pc[1]}`}} >
                    <FontAwesomeIcon className="taken" icon={pc[0]} />
                    </div>)
                }
            } else if(pc[1] === "white") {
                if(pc[0].iconName === "chess-pawn") {
                    renderedTwo.pawns.push(
                    <div key={`taken${pc}`} className={`taken-wrapper taken-${activePlayer}`} style={{color: `${pc[1]}`}} >
                    <FontAwesomeIcon className="taken" icon={pc[0]} />
                    </div>)
                }
                if(pc[0].iconName === "chess-knight") {
                    renderedTwo.knights.push(
                    <div key={`taken${pc}`} className={`taken-wrapper taken-${activePlayer}`} style={{color: `${pc[1]}`}} >
                    <FontAwesomeIcon className="taken" icon={pc[0]} />
                    </div>)
                }
                if(pc[0].iconName === "chess-bishop") {
                    renderedTwo.bishops.push(
                    <div key={`taken${pc}`} className={`taken-wrapper taken-${activePlayer}`} style={{color: `${pc[1]}`}} >
                    <FontAwesomeIcon className="taken" icon={pc[0]} />
                    </div>)
                }
                if(pc[0].iconName === "chess-rook") {
                    renderedTwo.rooks.push(
                    <div key={`taken${pc}`} className={`taken-wrapper taken-${activePlayer}`} style={{color: `${pc[1]}`}} >
                    <FontAwesomeIcon className="taken" icon={pc[0]} />
                    </div>)
                }
                if(pc[0].iconName === "chess-queen") {
                    renderedTwo.queens.push(
                    <div key={`taken${pc}`} className={`taken-wrapper taken-${activePlayer}`} style={{color: `${pc[1]}`}} >
                    <FontAwesomeIcon className="taken" icon={pc[0]} />
                    </div>)
                }
            }
        })
        setCapturesOne([
                        <div className="captures-pieces captures-pawns">
                            {renderedOne.pawns}
                        </div>,
                        <div className="captures-pieces captures-knights">
                            {renderedOne.knights}
                        </div>,
                        <div className="captures-pieces captures-bishops">
                            {renderedOne.bishops}
                        </div>,
                        <div className="captures-pieces captures-rooks">
                            {renderedOne.rooks}
                        </div>,
                        <div className="captures-pieces captures-queens">
                            {renderedOne.queens}
                        </div>
                        ])
        setCapturesTwo([
                        <div className="captures-pieces captures-pawns">
                            {renderedTwo.pawns}
                        </div>,
                        <div className="captures-pieces captures-knights">
                            {renderedTwo.knights}
                        </div>,
                        <div className="captures-pieces captures-bishops">
                            {renderedTwo.bishops}
                        </div>,
                        <div className="captures-pieces captures-rooks">
                            {renderedTwo.rooks}
                        </div>,
                        <div className="captures-pieces captures-queens">
                            {renderedTwo.queens}
                        </div>
                        ])
    }

    useEffect(() => {
        renderTaken();
        findInactive();
    },[activePlayer, moving, taken, findInactive, renderTaken])

    useEffect(() => {
        if(playerOneData && (winsOne !== playerOneData.chess_checkmate_wins || lossesOne !== playerOneData.chess_checkmate_losses || drawsOne !== playerOneData.chess_stalemate_draws)) {
            setWinsOne(playerOneData.chess_checkmate_wins)
            setLossesOne(playerOneData.chess_checkmate_losses)
            setDrawsOne(playerOneData.chess_stalemate_draws)
        }
        if(playerTwoData && (winsTwo !== playerTwoData.chess_checkmate_wins || lossesTwo !== playerTwoData.chess_checkmate_losses || drawsTwo !== playerTwoData.chess_stalemate_draws)) {
            setWinsTwo(playerTwoData.chess_checkmate_wins)
            setLossesTwo(playerTwoData.chess_checkmate_losses)
            setDrawsTwo(playerTwoData.chess_stalemate_draws)
        }
    },[playerOneData, winsOne, lossesOne, drawsOne, playerTwoData, winsTwo, lossesTwo, drawsTwo])

    return (
        <div className={ active === playerTwo ? "player-two-captured captured-zone" : "player-one-captured captured-zone" }>
            <div className={ active === playerOne ? "player-one single-captured captured" : active === playerTwo ? "player-two single-captured captured" : null }>
                <div>Won: </div>
                <div>{ active === playerOne ? winsOne : winsTwo }</div>
                <div>Lost: </div>
                <div>{active === playerOne ? lossesOne : lossesTwo }</div>
                <div>Draw: </div>
                <div>{active === playerOne ? drawsOne : drawsTwo }</div>
            </div>

            <div className="details-wrap" >


                <div className={ active === playerOne ? "player-one one-active active-details details" : active === playerTwo ? "player-two two-active active-details details" : null }>

                    <div className="nameplate">
                        { gameEnd ?
                        <div className="game-end">
                            <div className="name">{active}:</div>
                            <div>{`${gameEnd[0]}.`.toUpperCase()}</div>
                        </div>
                        : inCheck[0] === "white" && activePlayer === "white" || inCheck[1] === "black" && activePlayer === "black" ?
                        <div className="in-check">
                            <div className="name">{active}:</div>
                            <div>CHECK!</div>
                        </div>
                        :
                        <div className={ active === playerTwo ? "player-two on-turn" : "player-one on-turn" } >
                            <div className="name">{active}:</div>
                            <div className="your-move">your move.</div>
                        </div>
                        }
                        <div className={ active === playerOne ? "player-one captured" : active === playerTwo ? "player-two captured" : null }>
                            <div>Won: </div>
                            <div>{ active === playerOne ? winsOne : winsTwo }</div>
                            <div>Lost: </div>
                            <div>{active === playerOne ? lossesOne : lossesTwo }</div>
                            <div>Draw: </div>
                            <div>{active === playerOne ? drawsOne : drawsTwo }</div>
                        </div>
                    </div>




                    <div className="captures active-captures">


                        { active === playerOne ? capturesOne[0] : capturesTwo[0] }
                        { active === playerOne ? capturesOne[1] : capturesTwo[1] }
                        { active === playerOne ? capturesOne[2] : capturesTwo[2] }
                        { active === playerOne ? capturesOne[3] : capturesTwo[3] }
                        { active === playerOne ? capturesOne[4] : capturesTwo[4] }

                    </div>
                </div>

                <div className="divider" />

                <div className={ inactive === playerOne ? "player-one inactive-details details" : inactive === playerTwo ? "player-two inactive-details details" : null }>

                    <div className="nameplate">
                        <div className="name">
                            {inactive}:
                        </div>
                        <div className={ inactive === playerOne ? "player-one captured" : inactive === playerTwo ? "player-two captured" : null }>
                            <div>Won: </div>
                            <div>{ inactive === playerOne ? winsOne : winsTwo }</div>
                            <div>Lost: </div>
                            <div>{ inactive === playerOne ? lossesOne : lossesTwo }</div>
                            <div>Draw: </div>
                            <div>{ inactive === playerOne ? drawsOne : drawsTwo }</div>
                        </div>
                    </div>

                    <div className="captures">


                        { inactive === playerOne ? capturesOne : capturesTwo }

                    </div>
                </div>
            </div>
        </div>
    )
}
