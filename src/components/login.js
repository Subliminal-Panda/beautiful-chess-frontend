import { faChessQueen, faChessRook, faLock, faUnlock } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import React, { useState, useEffect, useContext, useRef } from 'react';
import Cookies from 'js-cookie';
import CurrentGameContext from './currentGame';
import { navigate } from 'hookrouter';


export default function Login() {

    const { playerOne, setPlayerOne } = useContext(CurrentGameContext)
    const { playerTwo, setPlayerTwo } = useContext(CurrentGameContext)
    const { playerOneData, setPlayerOneData } = useContext(CurrentGameContext)
    const { playerTwoData, setPlayerTwoData } = useContext(CurrentGameContext)
    const { loginWhite, setLoginWhite } = useContext(CurrentGameContext)
    const { loginBlack, setLoginBlack } = useContext(CurrentGameContext)

    const [ username, setUsername ] = useState('');
    const [ password, setPassword ] = useState('');
    const [ confirmPassword, setConfirmPassword ] = useState('');
    const [ retrieving, setRetrieving ] = useState(false);
    const [error, setError] = useState(false);
    const [guestError, setGuestError] = useState('');
    const [loginError, setLoginError] = useState('');
    const [signupError, setSignupError] = useState('');

    const tempUserData = useRef('')
    let firstInput = useRef(null)

    const handleChange = ( event ) => {
        if(event.target.name === "username") {
            setUsername(event.target.value)
        } else if(event.target.name === "confirm") {
            setConfirmPassword(event.target.value)
        } else if(event.target.name === "password") {
            setPassword(event.target.value)
        }
    }

    const handleSubmit = (e) => {
        setError(false)
        e.preventDefault();
        if(username === '' || password=== '' || username === ' ' || password=== ' ') {
            setError(true);
            setLoginError('You need a username and password.');

        } else if(username === playerOne) {
            setError(true);
            setLoginError("players must have different names.")
        } else {
            setRetrieving(true)
            fetch('https://beautiful-chess-backend.herokuapp.com/user/verify', {
                method: "POST",
                headers: {"content-type" : "application/json"},
                body: JSON.stringify({
                    username,
                    password
                })
            })
            .then(res => res.json())
            .then(data => {
                if( (data === 'User not found.') || (data === 'Incorrect password.')) {
                    setError(true);
                    setRetrieving(false)
                    setLoginError(data)
                    return(data)
                } else if(data[0] === 'User verified:') {
                    tempUserData.current=(data[1])
                    Cookies.set('username', username);
                    setSignupError('')
                    return(data)
                }
            })
            .then(data => {
                if((data[0] === 'User verified:') && (!error)) {
                    handleLogin(data[1]);
                }
            })
            .catch(error => {
                setRetrieving(false)
                console.log('Problem logging in.', error);
                setError(true);
                setLoginError('Problem logging in.');
                navigate("/game")
            })
        }

    }

    const handleSignUp = () => {
            setError(false)
            if(username === playerOne) {
                setError(true);
                setSignupError("players must have different names.")
            }else if(username === '' || password=== '' || username === ' ' || password=== ' ') {
                setError(true);
                setSignupError('You need a username and password.');
            } else if(password !== confirmPassword) {
                setError(true);
                setSignupError("Your passwords don't match.");
            } else {
                setRetrieving(true)
                fetch('https://beautiful-chess-backend.herokuapp.com/user/add', {
                    method: "POST",
                    headers: {"content-type" : "application/json"},
                    body: JSON.stringify({
                        username,
                        password
                    })
                })
                .then(res => res.json())
                .then(data => {
                    if(data[0] === 'That username is taken.') {
                        setError(true);
                        setSignupError('That username is taken.');
                        setRetrieving(false)
                        return(data)
                    } else {
                        tempUserData.current=(data[1])
                        setError(false);
                        Cookies.set('username', username);
                        setSignupError('');
                        return(data)
                    }
                })
                .then(info => {
                    if((info[0] !== undefined) && (info[0] !== 'That username is taken.') && (!error)) {
                        handleLogin(info[1]);
                    }
                    console.log("info:", info)
                    return(info)
                })
                .catch(err => {
                    setRetrieving(false)
                    console.log('Error creating your user', err);
                    setError(true);
                    if((err[0] !== undefined) && (err[0] === 'That username is taken.')) {
                        setError(true);
                        setSignupError('That username is taken.');
                    } else if(!signupError && err) {
                        console.log("New user error:", err)
                        setSignupError('Error creating your user');
                    }
                })
            }


    }


    const handleGuest = () => {
        setError(false)
        if(username === playerOne) {
            setError(true);
            setGuestError("Players must have different names.")
        } else if((!playerOneData && !playerOne) && (username === '' || username === ' ')) {
            setLoginWhite("guest")
            setPlayerOneData({
                chess_agreement_draws: 0,
                chess_checkmate_losses: 0,
                chess_checkmate_wins: 0,
                chess_fifty_move_draws: 0,
                chess_insufficient_material_draws: 0,
                chess_repetition_draws: 0,
                chess_resignation_losses: 0,
                chess_resignation_wins: 0,
                chess_stalemate_draws: 0,
                chess_timeout_losses: 0,
                chess_timeout_wins: 0,
                id: "guest",
                username: "Player One"
            })
            setPlayerOne("Player One")
        } else if( !playerOneData && !playerOne && (username !== '') ) {
            setLoginWhite("guest")
            setPlayerOneData({
                chess_agreement_draws: 0,
                chess_checkmate_losses: 0,
                chess_checkmate_wins: 0,
                chess_fifty_move_draws: 0,
                chess_insufficient_material_draws: 0,
                chess_repetition_draws: 0,
                chess_resignation_losses: 0,
                chess_resignation_wins: 0,
                chess_stalemate_draws: 0,
                chess_timeout_losses: 0,
                chess_timeout_wins: 0,
                id: "guest",
                username: username
            })
            setPlayerOne(username)
        } else if((!playerTwoData && !playerTwo) && (username === '' || username === ' ') && (playerOne !== "Player Two")) {
            setLoginBlack("guest")
            setPlayerTwoData({
                chess_agreement_draws: 0,
                chess_checkmate_losses: 0,
                chess_checkmate_wins: 0,
                chess_fifty_move_draws: 0,
                chess_insufficient_material_draws: 0,
                chess_repetition_draws: 0,
                chess_resignation_losses: 0,
                chess_resignation_wins: 0,
                chess_stalemate_draws: 0,
                chess_timeout_losses: 0,
                chess_timeout_wins: 0,
                id: "guest",
                username: "Player Two"
            })
            setPlayerTwo("Player Two")
            } else if((!playerTwoData && !playerTwo) && (username === '' || username === ' ') && (playerOne === "Player Two")) {
                setLoginBlack("guest")
                setPlayerTwoData({
                    chess_agreement_draws: 0,
                    chess_checkmate_losses: 0,
                    chess_checkmate_wins: 0,
                    chess_fifty_move_draws: 0,
                    chess_insufficient_material_draws: 0,
                    chess_repetition_draws: 0,
                    chess_resignation_losses: 0,
                    chess_resignation_wins: 0,
                    chess_stalemate_draws: 0,
                    chess_timeout_losses: 0,
                    chess_timeout_wins: 0,
                    id: "guest",
                    username: "Player 2"
                })
                setPlayerTwo("Player 2")
                } else if( !playerTwoData && !playerTwo && (username !== '') ) {
            setLoginBlack("guest")
            setPlayerTwoData({
                chess_agreement_draws: 0,
                chess_checkmate_losses: 0,
                chess_checkmate_wins: 0,
                chess_fifty_move_draws: 0,
                chess_insufficient_material_draws: 0,
                chess_repetition_draws: 0,
                chess_resignation_losses: 0,
                chess_resignation_wins: 0,
                chess_stalemate_draws: 0,
                chess_timeout_losses: 0,
                chess_timeout_wins: 0,
                id: "guest",
                username: username
            })
            setPlayerTwo(username)
        }
        if(username && (username !== playerOne) && username !== " " && username !== "") {
            if(!playerOneData || !playerTwoData || !playerOne || !playerTwo) {
                setUsername('')
                setPassword('')
                setConfirmPassword('')
                firstInput.current.focus()
            }
        }
    }

    const handleLogin = (data) => {
        if( !playerOneData && !playerOne && (username !== '') ) {
            setPlayerOneData(data)
            setPlayerOne(username)
            setLoginWhite("user")
        } else if( !playerTwoData && !playerTwo && (username !== '') ) {
            setPlayerTwoData(data)
            setPlayerTwo(username)
            setLoginBlack("user")
        }
        setRetrieving(false)
        setUsername('')
        setPassword('')
        setConfirmPassword('')
    }

    const nameListener = () => {
        if(firstInput.current.value.length >= 13) {
            setGuestError("maximum name reached: 13 characters.")
       } else {
           setGuestError('')
       }
    };

    useEffect(() => {
        setError(false);
        setLoginError('');
        setSignupError('');
        setGuestError('')
        nameListener();
    },[username, password])

    useEffect(() => {
        firstInput.current.focus()
    },[])

    useEffect(() => {
        if(playerOneData && playerOne) {
            navigate('/game')
        }
    },[playerOneData, playerOne])

    return (

        <div className="login-page" style={ playerOneData && playerOne ? {backgroundColor: "rgb(130, 85, 255)"} : null}>
            { retrieving ?
                <div className="content-loader">
                    <div className="loader-wrap">
                        <FontAwesomeIcon  className={ playerOneData && playerOne ? "loading-two" : "loading"} icon={faChessQueen} spin />
                        {/* <FontAwesomeIcon  className={ playerOneData && playerOne ? "loading-two dots" : "loading dots"} icon={faSpinner} spin /> */}
                    </div>
                    <h1 className={ playerOneData && playerOne ? "loading-two" : "loading"}>Logging in...</h1>
                </div>
                :
                <form
                onSubmit={ handleSubmit }
                className="login-form-wrap"
                >
                    <h1 style={ !loginWhite ? {color: "black"} : !loginBlack ? {color: "white"} : null}>Welcome to Beautiful Chess.</h1>
                    <h1 style={ !loginWhite ? {color: "black"} : !loginBlack ? {color: "white"} : null}>{`${ !playerOneData || !playerOne ? "Player 1," : !playerTwoData || !playerTwo ? "Player 2," : '' } what can I call you?`}</h1>
                    <div className="button-form-wrap" >
                        <div className="form-group">
                            <FontAwesomeIcon icon={ faChessRook } />
                            <input
                                ref={firstInput}
                                type="text"
                                name="username"
                                maxLength="13"
                                placeholder="Enter a username"
                                value={ username }
                                onChange={ handleChange }
                            />
                        </div>
                        <div className="button-wrapper">
                            <button className="btn guest" onClick={() => handleGuest()} type="button">Guest</button>
                            <h2>or:</h2>
                        </div>
                            <div className="error">{guestError}</div>
                    </div>
                    <div className="button-form-wrap">
                            <div className="form-group">
                                <FontAwesomeIcon icon={ faLock } />
                                <input
                                    type="password"
                                    name="password"
                                    placeholder="Enter a password"
                                    value={ password }
                                    onChange={ handleChange }
                                />
                            </div>
                        <div className="button-wrapper">
                            <button className="btn login" type="submit">Log In</button>
                            <h2>or:</h2>
                        </div>
                            <div className="error">{loginError}</div>
                    </div>
                    <div className="button-form-wrap">
                            <div className="form-group">
                                <FontAwesomeIcon icon={ faUnlock } />
                                <input
                                    type="password"
                                    name="confirm"
                                    placeholder="Confirm password to sign up."
                                    value={ confirmPassword }
                                    onChange={ handleChange }
                                />
                            </div>
                        <div className="button-wrapper">
                            <button className="btn signup" onClick={() => handleSignUp()} type="button">Sign up</button>
                        </div>
                            <div className="error">{signupError}</div>
                    </div>
                </form>
            }
        </div>
    )
}
