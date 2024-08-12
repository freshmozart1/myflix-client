import { useState } from "react";
import PropTypes from 'prop-types';

import Form from 'react-bootstrap/Form';
import Button from "react-bootstrap/Button";

import './login-view.scss';

export const LoginView = ({ onLoggedIn }) => {
    const [username, setUsername] = useState(''),
        [password, setPassword] = useState(''),
        [errorMessage, setErrorMessage] = useState(''),
        handleSubmit = (event) => {
            event.preventDefault();
            const data = {
                username: username,
                password: password
            };
            fetch(`https://oles-myflix-810b16f7a5af.herokuapp.com/login?username=${username}&password=${password}`, {
                method: 'POST'
            }).then(res => {
                if (res.ok) {
                    res.json().then(res_ok => {
                        localStorage.setItem('user', JSON.stringify(res_ok.user));
                        localStorage.setItem('token', res_ok.token);
                        onLoggedIn(res_ok.user, res_ok.token);
                    })
                    .catch(e => console.error('Couldn\'t convert response to JSON: ' +e ));
                } else {
                    res.json().then(res_error => {
                        setErrorMessage(res_error.message);
                    });
                }
            })
            .catch(e => console.error('Error logging in: ' + e));
        };
    
    return (
        <Form onSubmit={handleSubmit}>
            <Form.Group controlId="login_username">
                <Form.Label>Username</Form.Label>
                <Form.Control 
                    type="text" 
                    value={username} 
                    onChange={(e) => setUsername(e.target.value)} 
                    minLength={process.env.USERNAME_LENGTH} 
                    required 
                />
            </Form.Group>
            <Form.Group controlId="login_password">
                <Form.Label>Password</Form.Label>
                <Form.Control 
                    type="password" 
                    value={password} 
                    onChange={(e) => setPassword(e.target.value)} 
                    minLength={process.env.PASSWORD_LENGTH} 
                    required 
                />
            </Form.Group>
            {errorMessage && <small className="error">{errorMessage}</small>}
            <br />
            <Button variant="primary" type="submit">
                Submit
            </Button>
        </Form>
    );
};

LoginView.propTypes = {
    onLoggedIn: PropTypes.func.isRequired
};