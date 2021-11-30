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
    const [confirmPassword, setConfirmPassword] = useState('');
    const [error, setError] = useState(false);
    const [errorMessage, setErrorMessage] = useState('');

    const handleChange = ( event ) => {
        if(event.target.name === "username") {
            setUsername(event.target.value)
            console.log(event.target.value)
        } else if(event.target.name = "password") {
            setPassword(event.target.value)
            console.log(event.target.value)
            console.log(username);
        }
    }

    const handleSubmit = (e) => {
        e.preventDefault();

        if(username === '' || password === '' ) {
            setError(true);
            setErrorMessage('Error: All fields must be filled in!');
        } else {
            fetch('endpoint here', {
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
                if(data === 'User NOT verified.') {
                    setError(true);
                    setErrorMessage('Invalid username or password.');
                } else if(data === 'User has been verified.') {
                    Cookies.set('username', username);
                    console.log(Cookies)
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
                .then(data => {
                    if(data === 'Error: That username is Taken.') {
                        setError(true);
                        setErrorMessage('Error: That username is Taken.');
                    } else {
                        setError(false);
                        setErrorMessage('');
                        Cookies.set('username', username);
                    }
                })
                .catch(error => {
                    console.log('Error creating your user', error);
                    setError(true);
                    setErrorMessage('Error adding user! Try again please.');
                })
            }


    }

    const guestContinue = () => {
        if( !loginWhite ) {
            if(username) {
                setPlayerOne(username)
                setUsername('')
            }
            setLoginWhite(username)
        } else if( !loginBlack ) {
            if(username) {
                setPlayerTwo(username)
                setUsername('')
            }
            setLoginBlack(username)
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

        <div>
            <h1>{`${ !loginWhite ? "Player one" : !loginBlack ? "Player two" : "error loading login info" }: what can I call you?`}</h1>
            <form
            onSubmit={ handleSubmit }
            className="login-form-wrap"
            >
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
                { username ? <button className="btn guest" onClick={() => guestContinue()} type="button">Continue as guest?</button> : null }

                { username ? <div className="form-group">
                    <FontAwesomeIcon icon={ faLock } />
                    <input
                        type="password"
                        name="password"
                        placeholder="Or... enter your password"
                        value={ password }
                        onChange={ handleChange }
                    />
                </div> : null }

                <div>
                    { password ? <button className="btn login" type="submit">Log In</button> : null }
                    { password ? <button className="btn signup" onClick={() => handleSignUp()} type="button">Sign up</button> : null }
                </div>
            </form>
        </div>
    )
}
