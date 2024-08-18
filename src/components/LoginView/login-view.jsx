import { useContext, useState } from "react";
import { useNavigate } from 'react-router-dom';
import Form from 'react-bootstrap/Form';
import Button from "react-bootstrap/Button";

import './login-view.scss';
import { AuthContext } from "../AuthProvider/auth-provider";

export const LoginView = () => {
    const [username, setUsername] = useState(''),
        [password, setPassword] = useState(''),
        [errorMessage, setErrorMessage] = useState(''),
        { setToken, setUser } = useContext(AuthContext),
        navigate = useNavigate(),
        handleSubmit = (event) => {
            event.preventDefault();
            fetch(`https://oles-myflix-810b16f7a5af.herokuapp.com/login?username=${username}&password=${password}`, {
                method: 'POST'
            }).then(res => {
                if (res.ok) {
                    res.json().then(res_ok => {
                        setToken(res_ok.token);
                        setUser(res_ok.user);
                        navigate('/');
                    })
                        .catch(e => console.error('Couldn\'t convert response to JSON: ' + e));
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