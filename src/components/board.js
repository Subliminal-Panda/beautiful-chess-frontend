import React, { useEffect, useState, useContext, useRef } from 'react';
import Square from './Square';
import Piece from './pieces/piece';
import { faChessKing, faChessQueen, faChessRook, faChessBishop, faChessKnight, faChessPawn } from '@fortawesome/free-solid-svg-icons';
import CurrentGameContext from './currentGame';

export default function Board () {

    const ranks = ["1","2","3","4","5","6","7","8"]
    const files = ["a","b","c","d","e","f","g","h"]

    let setup = []

    const [ squares, setSquares ] = useState([])
    const [ checked, setChecked ] = useState(false)

    const { activePlayer, setActivePlayer } = useContext(CurrentGameContext)
    const { playerOneData, setPlayerOneData } = useContext(CurrentGameContext)
    const { playerTwoData, setPlayerTwoData } = useContext(CurrentGameContext)
    const { pieces, setPieces } = useContext(CurrentGameContext)
    const { underAttack, setUnderAttack } = useContext(CurrentGameContext)
    const { locations, setLocations } = useContext(CurrentGameContext)
    const { inCheck, setInCheck } = useContext(CurrentGameContext)
    const { taken, setTaken } = useContext(CurrentGameContext)
    const { moving, setMoving } = useContext(CurrentGameContext)
    const { gameEnd, setGameEnd } = useContext(CurrentGameContext)
    const { newGame, setNewGame } = useContext(CurrentGameContext)

    const updated = useRef(false)

    const makeSquares = () => {
        let squareSet = []
        for(let i=0; i<8; i++) {
            for(let j=0; j<8; j++) {
                let dark = "rgb(90, 90, 90)";
                let light = "rgb(175, 175, 175)";
                let rank = ranks[i];
                let file = files[j];
                let position = `${file}${rank}`;
                let squareColor;
                if((i + j + 2)%2 === 0) {
                    squareColor = dark;
                } else {
                    squareColor = light;
                }
                squareSet.push(
                    <Square
                    key={position}
                    squareColor={squareColor}
                    rank={rank}
                    file={file}
                    position={position}
                    />
                )
            }
        }
        setSquares([squareSet])
    }

    const setBoard = () => {
        for(let i=0; i<8; i++) {
            setup.push(
                <Piece type={faChessPawn} key={`${files[i]}2`} team="white" initFile={i} initRank={1} />
            );
            setup.push(
                <Piece type={faChessPawn} key={`${files[i]}7`} team="black" initFile={i} initRank={6} />
            );
        };
        setup.push(
            <Piece type={faChessKnight} key="b8" team="black" initFile={1} initRank={7} />,
            <Piece type={faChessKnight} key="g8" team="black" initFile={6} initRank={7} />,
            <Piece type={faChessKnight} key="b1" team="white" initFile={1} initRank={0} />,
            <Piece type={faChessKnight} key="g1" team="white" initFile={6} initRank={0} />,
            <Piece type={faChessRook} key="a8" team="black" initFile={0} initRank={7} />,
            <Piece type={faChessRook} key="h8" team="black" initFile={7} initRank={7} />,
            <Piece type={faChessRook} key="a1" team="white" initFile={0} initRank={0} />,
            <Piece type={faChessRook} key="h1" team="white" initFile={7} initRank={0} />,
            <Piece type={faChessBishop} key="c8" team="black" initFile={2} initRank={7} />,
            <Piece type={faChessBishop} key="f8" team="black" initFile={5} initRank={7} />,
            <Piece type={faChessBishop} key="c1" team="white" initFile={2} initRank={0} />,
            <Piece type={faChessBishop} key="f1" team="white" initFile={5} initRank={0} />,
            <Piece type={faChessKing} key="e8" team="black" initFile={4} initRank={7} />,
            <Piece type={faChessQueen} key="d8" team="black" initFile={3} initRank={7} />,
            <Piece type={faChessKing} key="e1" team="white" initFile={4} initRank={0} />,
            <Piece type={faChessQueen} key="d1" team="white" initFile={3} initRank={0} />,
            )
            setPieces([setup])
    }

    const findCheck = () => {
        let checks = [[],[]]

        const checkSafety = (file, rank, team) => {
            const status = []
            if(underAttack[0] !== undefined) {
                const filtered = underAttack[0].filter(atk => atk[0] === file && atk[1] === rank && atk[3] !== team )
                if(filtered[0] !== undefined) {
                    filtered.forEach((atk) => {
                        status.push(file, rank, "unsafe", atk)
                    })
                } else {
                    status.push(file, rank, "safe", filtered)
                }
            } else {
                status.push(file, rank, "safe", [])
            }
            return(status)
        }
        const whiteK = locations.filter(item => item[2] === "e1");
        const blackK = locations.filter(item => item[2] === "e8");
        const whiteKing = whiteK.filter((pc, index, arr) =>
        index === arr.findIndex((oth) => (
        oth[2] === pc[2]
        )))
        const blackKing = blackK.filter((pc, index, arr) =>
        index === arr.findIndex((oth) => (
        oth[2] === pc[2]
        )))
        if(whiteKing[0] !== undefined) {
            const wkf = whiteKing[0][3]
            const wkr = whiteKing[0][4]
            const wkstatus = checkSafety(wkf, wkr, "white")
            if(wkstatus[2] === "unsafe") {
                if(activePlayer === "white") {
                    checks[1] = []
                    checks[0] = "white"
                }
            } else {
                checks[0] = []
            }
        }
        if(blackKing[0] !== undefined) {
            const bkf = blackKing[0][3]
            const bkr = blackKing[0][4]
            const bkstatus = checkSafety(bkf, bkr, "black")
            if(bkstatus[2] === "unsafe") {
                if(activePlayer === "black")
                checks[0] = []
                checks[1] = "black"
            } else {
                checks[1] = []
            }
        }
        setInCheck(checks)
        findCheckMate();
    }

    const findCheckMate = () => {
        const movablePieces = []
        locations.forEach((loc) => {
            if(loc[7][0] !== undefined) {
                if(loc[1] === inCheck[0] || loc[1] === inCheck[1])
                movablePieces.push(loc)
            }
        })
        if(movablePieces[0] === undefined) {
            if(activePlayer === "black" && inCheck[1] === "black") {
                setGameEnd(["checkmate", "white"])
                updateScores(playerOneData, playerTwoData, "white")
            }
            if(activePlayer === "white" && inCheck[0] === "white") {
                setGameEnd(["checkmate", "black"])
                updateScores(playerTwoData, playerOneData, "black")
            }
        }
    }

    const findStaleMate = () => {
        const movablePieces = [];
        console.log("locations:", locations);
        console.log("active player:", activePlayer);
        if(locations.length < 3) {
            console.log ("locations less than 3?", locations)
            setGameEnd(["draw", activePlayer])
            updateScores(playerOneData, playerTwoData, "draw")
        }
        if(locations.length < 4) {
            locations.forEach((loc) => {
                if(loc[0].iconName === "chess-bishop" || loc[0].iconName === "chess-knight") {
                    console.log("remaining pieces:", locations)
                    console.log ("insufficient material?", loc)
                    setGameEnd(["draw", activePlayer])
                    updateScores(playerOneData, playerTwoData, "draw")
                }
            })
        }
        if(locations.length < 5) {
            const bishops = []
            locations.forEach((loc) => {
                if(loc[0].iconName === "chess-bishop") {
                    bishops.push(loc)
                }
            })
            if((bishops.length > 1) && ((bishops[0][2] === "f8" && bishops[1][2] === "c1") || (bishops[1][2] === "f8" && bishops[0][2] === "c1") || (bishops[0][2] === "c8" && bishops[1][2] === "f1") || (bishops[1][2] === "c8" && bishops[0][2] === "f1"))) {
                console.log ("insufficient material?", bishops)
                setGameEnd(["draw", activePlayer])
                updateScores(playerOneData, playerTwoData, "draw")
            }
        }
        if(activePlayer !== inCheck[1] && activePlayer !== inCheck[0]) {
        locations.forEach((loc) => {
                if(loc[7][0] !== undefined) {
                        if(loc[1] === activePlayer) {
                            movablePieces.push(loc)
                        }
                }
            })
            if(movablePieces[0] === undefined) {
                console.log("no movable pieces?", movablePieces, "not in check?", activePlayer, inCheck)
                setGameEnd(["stalemate", activePlayer])
                updateScores(playerOneData, playerTwoData, "draw")
            }
        }
    }

    const updateScores = (winner, loser, color) => {
        console.log("winner id:", winner.id, "loser id:", loser.id)
        if(!updated.current) {
            if(winner.id === "guest" && color === "draw") {
                setPlayerOneData({...playerOneData, chess_stalemate_draws: playerOneData.chess_stalemate_draws + 1 })
            } else if(color === "draw" && winner.id !== "guest") {
                fetch(`https://beautiful-chess-backend.herokuapp.com/user/update/${winner.id}`, {
                    method: "PUT",
                    headers: {"content-type" : "application/json"},
                    body: JSON.stringify({
                        "chess_stalemate_draws": 1
                    })
                })
                .then(res => res.json())
                .then(data => {
                    if(data[0] === "user updated:") {
                        setPlayerOneData(data[1])
                        return(data)
                    }
                })
                .catch(error => {
                    console.log('Problem updating score.', error);
                })
            }
            if(loser.id === "guest" && color === "draw") {
                setPlayerTwoData({...playerTwoData, chess_stalemate_draws: playerTwoData.chess_stalemate_draws + 1 })
            } else if(color === "draw" && loser.id !== "guest") {
                fetch(`https://beautiful-chess-backend.herokuapp.com/user/update/${loser.id}`, {
                    method: "PUT",
                    headers: {"content-type" : "application/json"},
                    body: JSON.stringify({
                        "chess_stalemate_draws": 1
                    })
                })
                .then(res => res.json())
                .then(data => {
                    if(data[0] === "user updated:") {
                        setPlayerTwoData(data[1])
                        return(data)
                    }
                })
                .catch(error => {
                    console.log('Problem updating score.', error);
                })
            }
            if(winner.id === "guest" && color === "white") {
                setPlayerOneData({...playerOneData, chess_checkmate_wins: playerOneData.chess_checkmate_wins + 1 })
            } else if(winner.id === "guest" && color === "black") {
                setPlayerTwoData({...playerTwoData, chess_checkmate_wins: playerTwoData.chess_checkmate_wins + 1 })
            } else if(color !== "draw") {
                fetch(`https://beautiful-chess-backend.herokuapp.com/user/update/${winner.id}`, {
                    method: "PUT",
                    headers: {"content-type" : "application/json"},
                    body: JSON.stringify({
                        "chess_checkmate_wins": 1
                    })
                })
                .then(res => res.json())
                .then(data => {
                    if(data[0] === "user updated:") {
                        if(color === "white") {
                            setPlayerOneData(data[1])
                        } else if(color === "black") {
                            setPlayerTwoData(data[1])
                        }
                        return(data)
                    }
                })
                .catch(error => {
                    console.log('Problem updating score.', error);
                })
            }
            if(loser.id === "guest" && color === "black") {
                setPlayerOneData({...playerOneData, chess_checkmate_losses: playerOneData.chess_checkmate_losses + 1 })
            } else if(loser.id === "guest" && color === "white") {
                setPlayerTwoData({...playerTwoData, chess_checkmate_losses: playerTwoData.chess_checkmate_losses + 1 })
            } else if(color !== "draw") {
                fetch(`https://beautiful-chess-backend.herokuapp.com/user/update/${loser.id}`, {
                    method: "PUT",
                    headers: {"content-type" : "application/json"},
                    body: JSON.stringify({
                        "chess_checkmate_losses": 1
                    })
                })
                .then(res => res.json())
                .then(data => {
                    if(data[0] === "user updated:") {
                        if(color === "white") {
                            setPlayerTwoData(data[1])
                        } else if(color === "black") {
                            setPlayerOneData(data[1])
                        }
                        return(data)
                    }
                })
                .catch(error => {
                    console.log('Problem updating score.', error);
                })
            }
            updated.current= true
        }
    }

    useEffect(() => {
        if(locations.length + taken.length > 31 && checked === false) {
            if(!moving) {
                findCheck();
                findCheckMate();
                findStaleMate();
                setChecked(true);
            }
        }
    })

    useEffect(() => {
        setChecked(false)
    },[activePlayer, locations])


    useEffect(() => {
        if(newGame === true) {
            setActivePlayer("white");
            makeSquares();
            setBoard();
            setNewGame(false);
            updated.current = false;
        }
    }, [newGame])

    return (
        <div className="game-board-wrap">
            <div className={ activePlayer === "white" ? "normal-game-board game-board" : "reversed-game-board game-board"}>
                {pieces}
                {squares}
            </div>
        </div>
    )
}
