import { faChessRook, faLock } from '@fortawesome/free-solid-svg-icons';
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
        firstInput.current.focus()
        if(username === '' || password === '' ) {
            setError(true);
            setLoginError('You need a username and password.');

        } else if(username === playerOne) {
            setError(true);
            setLoginError("players must have different names.")
        } else {
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
                } else if(data[0] === 'User verified:') {
                    tempUserData.current=(data[1])
                    Cookies.set('username', username);
                    console.log("cookies:", Cookies)
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
                console.log('Problem logging in.', error);
                setError(true);
                setLoginError('Sorry, wrong credentials.');
            })
        }

    }

    const handleSignUp = () => {
            setError(false)
            firstInput.current.focus()
            if(username === playerOne) {
                setError(true);
                setSignupError("players must have different names.")
            }else if(username === '' || password === '' ) {
                setError(true);
                setSignupError('You need a username and password.');
            } else if(password !== confirmPassword) {
                setError(true);
                setSignupError("Your passwords don't match.");
            } else {
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
                    } else {
                        tempUserData.current=(data[1])
                        setError(false);
                        Cookies.set('username', username);
                        console.log("cookies:", Cookies)
                        setSignupError('');
                        return(data)
                    }
                })
                .then(data => {
                    if((data[0] !== 'That username is taken.') && (!error)) {
                        handleLogin(data[1]);
                    }
                })
                .catch(error => {
                    console.log('Error creating your user', error);
                    setError(true);
                    if(!signupError && error) {
                        setSignupError(error);
                    }
                })
            }


    }


    const handleGuest = () => {
        setError(false)
        if(username === playerOne) {
            setError(true);
            setGuestError("Players must have different names.")
        } else if(!username) {
            setError(true);
            setGuestError("You need a username.")
        } else if( !loginWhite && username ) {
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
        } else if( !loginBlack && username ) {
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
        if(username && (username !== playerOne)) {
            setUsername('')
            setPassword('')
            setConfirmPassword('')
        }
        firstInput.current.focus()
    }

    const handleLogin = (data) => {
        if( !loginWhite && username ) {
            setLoginWhite("user")
            setPlayerOneData(data)
            setPlayerOne(username)
        } else if( !loginBlack && username ) {
            setLoginBlack("user")
            setPlayerTwoData(data)
            setPlayerTwo(username)
        }
        setUsername('')
        setPassword('')
        setConfirmPassword('')

    }

    const nameListener = () => {
        if(firstInput.current.value.length >= 12) {
            setGuestError("maximum name reached: 12 characters.")
       } else {
           setGuestError('')
       }
    };

    useEffect(() => {
        console.log("login error:", loginError, "sign up error:", signupError, "guest error:", guestError)
    },[loginError, signupError, guestError])

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
        if(playerOne && playerTwo && playerOneData && playerTwoData && loginBlack && loginWhite) {
            navigate('/game')
        }
    })

    return (

        <div className="login-page">
            <form
            onSubmit={ handleSubmit }
            className="login-form-wrap"
            >
                <h1>{`${ !loginWhite ? "Player 1" : !loginBlack ? "Player 2" : null }, what can I call you?`}</h1>
                <div className="button-form-wrap" >
                    <div className="form-group">
                        <FontAwesomeIcon icon={ faChessRook } />
                        <input
                            ref={firstInput}
                            type="text"
                            name="username"
                            maxLength="12"
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
                            <FontAwesomeIcon icon={ faLock } />
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
        </div>
    )
}
