import { faChessRook, faLock } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import React, { useState, useEffect, useContext } from 'react';
import Cookies from 'js-cookie';
import CurrentGameContext from './currentGame';
import { navigate } from 'hookrouter';


export default function Login() {

    const { playerOne, setPlayerOne } = useContext(CurrentGameContext)
    const { playerTwo, setPlayerTwo } = useContext(CurrentGameContext)
    const { loginWhite, setLoginWhite } = useContext(CurrentGameContext)
    const { loginBlack, setLoginBlack } = useContext(CurrentGameContext)

    const [ username, setUsername ] = useState('');
    const [ password, setPassword ] = useState('');
    const [ confirmPassword, setConfirmPassword ] = useState('');
    const [error, setError] = useState(false);
    const [errorMessage, setErrorMessage] = useState('');

    const handleChange = ( event ) => {
        if(event.target.name === "username") {
            setUsername(event.target.value)
            console.log(event.target.value)
        } else if(event.target.name === "confirm") {
            setConfirmPassword(event.target.value)
            console.log(event.target.value)
        } else if(event.target.name === "password") {
            setPassword(event.target.value)
            console.log(event.target.value, event.target.name)
        }
    }

    const handleSubmit = (e) => {
        e.preventDefault();

        if(username === '' || password === '' ) {
            setError(true);
            setErrorMessage('Error: All fields must be filled in!');
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
                    setErrorMessage(data);
                } else if(data[0] === 'User verified:') {
                    Cookies.set('username', username);
                    console.log("cookies:", Cookies)
                    console.log(data)
                    handleContinue();
                }
            })
            .catch(error => {
                console.log('Error with logging in.', error);
                setError(true);
                setErrorMessage('Error logging in, please try again.');
            })
        }

    }

    const handleSignUp = () => {
            // e.preventDefault();

            if(username === '' || password === '' ) {
                setError(true);
                setErrorMessage('Error: All fields must be filled in!');
            } else if(password !== confirmPassword) {
                setError(true);
                setErrorMessage('Error: The passwords are not the same. ');
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
                    if(data[0] === 'Error: That username is already taken.') {
                        setError(true);
                        setErrorMessage(data);
                    } else {
                        setError(false);
                        setErrorMessage('');
                        Cookies.set('username', username);
                        console.log(data)
                        handleContinue();
                    }
                })
                .catch(error => {
                    console.log('Error creating your user', error);
                    setError(true);
                    setErrorMessage('Error adding user! Try again please.');
                })
            }


    }

    const handleContinue = () => {
        if( !loginWhite ) {
            setLoginWhite(username)
            if(username) {
                setPlayerOne(username)
                setUsername('')
                setPassword('')
                setConfirmPassword('')
            }
        } else if( !loginBlack ) {
            setLoginBlack(username)
            if(username) {
                setPlayerTwo(username)
                setUsername('')
                setPassword('')
                setConfirmPassword('')
            }
            navigate('/game')
        }
        console.log("user:", username, "white logged in?", loginWhite, "black logged in?", loginBlack, "player one", playerOne, "player two", playerTwo)
    }

    useEffect(() => {
        console.log(errorMessage)
    },[errorMessage])

    useEffect(() => {
        setError(false);
        setErrorMessage('');
    },[username, password])

    return (

        <div className="login-page">
            <form
            onSubmit={ handleSubmit }
            className="login-form-wrap"
            >
                <h1>{`${ !loginWhite ? "Player 1" : !loginBlack ? "Player 2" : null }, what can I call you?`}</h1>
                <div className="button-form-wrap">
                    <div className="form-group">
                        <FontAwesomeIcon icon={ faChessRook } />
                        <input
                            type="text"
                            name="username"
                            placeholder="Enter a username"
                            value={ username }
                            onChange={ handleChange }
                        />
                    </div>
                    { username ?
                    <div className="button-wrapper">
                        <button className="btn guest" onClick={() => handleContinue()} type="button">Guest</button>
                        <h2>or:</h2>
                    </div>
                    : null }
                </div>
                <div className="button-form-wrap">
                    { username ?
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
                    : null }
                    { username ?
                    <div className="button-wrapper">
                        <button className="btn login" type="submit">Log In</button>
                        <h2>or:</h2>
                    </div>
                    : null }
                </div>
                <div className="button-form-wrap">
                    { username ?
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
                    : null }
                        { username ?
                    <div className="button-wrapper">
                        <button className="btn signup" onClick={() => handleSignUp()} type="button">Sign up</button>
                    </div>
                    : null }
                </div>
            </form>
        </div>
    )
}
