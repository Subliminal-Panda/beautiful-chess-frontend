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
        e.preventDefault();
        firstInput.current.focus()
        if(username === '' || password === '' ) {
            setError(true);
            setLoginError('You need a username and password!');

        } else if(username === playerOne) {
            setError(true);
            setLoginError("players must have different names.")
        } else {
            fetch('http://127.0.0.1:5000/user/verify', {
                method: "POST",
                headers: {"content-type" : "application/json"},
                body: JSON.stringify({
                    username,
                    password
                })
            })
            .then(res => res.json())
            .then(data => {
                console.log(data)
                if( (data === 'User not found.') || (data === 'Incorrect password.')) {
                    setError(true);
                    // setErrorMessage(data);
                } else if(data[0] === 'User verified:') {
                    tempUserData.current=(data[1])
                    Cookies.set('username', username);
                    console.log("cookies:", Cookies)
                    console.log(data)
                    setSignupError('')
                    return(data)
                }
            })
            .then(data => {
                handleLogin(data[1]);
            })
            .catch(error => {
                console.log('Problem logging in.', error);
                setError(true);
                setLoginError('Sorry, wrong credentials.');
            })
        }

    }

    const handleSignUp = () => {
            // e.preventDefault();
            firstInput.current.focus()
            if(username === playerOne) {
                setError(true);
                setSignupError("players must have different names.")
            }else if(username === '' || password === '' ) {
                setError(true);
                setSignupError('You need a username and password!');
            } else if(password !== confirmPassword) {
                setError(true);
                setSignupError("Your passwords don't match.");
            } else {
                fetch('http://127.0.0.1:5000/user/add', {
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
                        // setErrorMessage(data);
                    } else {
                        tempUserData.current=(data[1])
                        setError(false);
                        setSignupError('');
                        Cookies.set('username', username);
                        console.log(data)
                        return(data)
                    }
                })
                .then(data => {
                    handleLogin(data[1]);
                })
                .catch(error => {
                    console.log('Error creating your user', error);
                    setError(true);
                    setSignupError('Unable to add user.');
                })
            }


    }


    const handleGuest = () => {
        if(username === playerOne) {
            setError(true);
            setGuestError("players must have different names.")
        } else if( !loginWhite && username ) {
            setLoginWhite("guest")
            setPlayerOne(username)
            setPlayerOneData("guest")
        } else if( !loginBlack && username ) {
            setLoginBlack("guest")
            setPlayerTwo(username)
            setPlayerTwoData("guest")
        }
        setUsername('')
        setPassword('')
        setConfirmPassword('')
        console.log(firstInput.current)
        firstInput.current.focus()
        navigate('/game')
    }

    const handleLogin = (data) => {
        // navigate('/game')
        if( !loginWhite && username ) {
            setLoginWhite("user")
            setPlayerOne(username)
            setPlayerOneData(data)
        } else if( !loginBlack && username ) {
            setLoginBlack("user")
            setPlayerTwo(username)
            setPlayerTwoData(data)
        }
        setUsername('')
        setPassword('')
        setConfirmPassword('')
        console.log(firstInput.current)
        console.log("user data:", data)

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
        nameListener();
    },[username, password])

    useEffect(() => {
        firstInput.current.focus()
    },[])

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
                            maxlength="12"
                            placeholder="Enter a username"
                            value={ username }
                            onChange={ handleChange }
                        />
                    </div>
                    <div className="button-wrapper">
                        <div className="error">{guestError}</div>
                        <button className="btn guest" onClick={() => handleGuest()} type="button">Guest</button>
                        <h2>or:</h2>
                    </div>
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
                        <div className="error">{loginError}</div>
                        <button className="btn login" type="submit">Log In</button>
                        <h2>or:</h2>
                    </div>
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
                        <div className="error">{signupError}</div>
                        <button className="btn signup" onClick={() => handleSignUp()} type="button">Sign up</button>
                    </div>
                </div>
            </form>
        </div>
    )
}
