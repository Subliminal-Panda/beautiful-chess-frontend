
import React, { useState } from 'react';
import Table from "./table";
import CurrentGameContext from './currentGame';
import Login from './login';
import routes from './routes';
import { useRoutes } from 'hookrouter';

export default function App () {
  const [ newGame, setNewGame ] = useState(true)
  const [ playerOne, setPlayerOne ] = useState("White")
  const [ playerTwo, setPlayerTwo ] = useState("Black")
  const [ activePlayer, setActivePlayer ] = useState("black")
  const [ selection, setSelection ] = useState(false)
  const [ pieces, setPieces ] = useState([])
  const [ locations, setLocations ] = useState([])
  const [ taken, setTaken ] = useState([])
  const [ underAttack, setUnderAttack ] = useState([])
  const [ castled, setCastled ] = useState([])
  const [ inCheck, setInCheck ] = useState([])
  const [ assassinAttempts, setAssassinAttempts ] = useState([])
  const [ moving, setMoving ] = useState(false)
  const [ pinned, setPinned ] = useState([])
  const [ gameEnd, setGameEnd ] = useState(false)
  const [ loginWhite, setLoginWhite ] = useState(false)
  const [ loginBlack, setLoginBlack ] = useState(false)

  const routeResult = useRoutes(routes)


  return (
    <div className='app' >
      <CurrentGameContext.Provider value={{ loginWhite, setLoginWhite, loginBlack, setLoginBlack, newGame, setNewGame, playerOne, setPlayerOne, playerTwo, setPlayerTwo, activePlayer, setActivePlayer, selection, setSelection, pieces, setPieces, locations, setLocations, taken, setTaken, underAttack, setUnderAttack, castled, setCastled, inCheck, setInCheck, assassinAttempts, setAssassinAttempts, moving, setMoving, pinned, setPinned, gameEnd, setGameEnd }}>
        {routeResult}
      </CurrentGameContext.Provider>
    </div>
  );
}
