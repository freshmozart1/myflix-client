import { useContext, useState } from "react";
import Form from 'react-bootstrap/Form';
import Button from "react-bootstrap/Button";
import { useNavigate } from 'react-router-dom';
import { AuthContext } from "../AuthProvider/auth-provider";

export const SignupView = () => { 
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [email, setEmail] = useState('');
    const [birthday, setBirthday] = useState('');
    const { setToken, setUser } = useContext(AuthContext);
    const navigate = useNavigate();

    const handleSubmit = (event) => {
        event.preventDefault();
        fetch(process.env.HEROKU + '/users', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ username, password, email, birthday })
        }).then(signupResponse => {
            if (signupResponse.ok) {
                fetch(`${process.env.HEROKU}/login?username=${username}&password=${password}`, {
                    method: 'POST'
                }).then(loginResponse => {
                    if (loginResponse.ok) {
                        loginResponse.json().then(res => {
                            setToken(res.token);
                            setUser(res.user);
                            navigate('/');
                        })
                        .catch(e => console.error('Couldn\'t convert response to JSON: ' +e ));
                    } else {
                        alert('Login failed');
                    }
                })
                .catch(e => console.error('Error logging in: ' + e));
            } else {
                alert('Sign up failed.');
            }
        })
        .catch(e => console.error('Error signing up: ' + e));
    };

    return (
        <Form onSubmit={handleSubmit}>
            <Form.Group controlId="signup_username">
                <Form.Label>Username <sup>*</sup></Form.Label>
                <Form.Control type="text" value={username} onChange={e => setUsername(e.target.value)} minLength={process.env.USERNAME_LENGTH} required />
            </Form.Group>
            <Form.Group controlId="signup_password">
                <Form.Label>Password <sup>*</sup></Form.Label>
                <Form.Control type="password" value={password} onChange={e => setPassword(e.target.value)} minLength={process.env.PASSWORD_LENGTH} required />
            </Form.Group>
            <Form.Group controlId="signup_email">
                <Form.Label>Email <sup>*</sup></Form.Label>
                <Form.Control type="email" value={email} onChange={e => setEmail(e.target.value)} required />
            </Form.Group>
            <Form.Group controlId="signup_birthday">
                <Form.Label>Birthday</Form.Label>
                <Form.Control type="date" value={birthday} onChange={e => setBirthday(e.target.value)} />
            </Form.Group>
            <small>Fields marked with a <sup>*</sup> are required.</small><br />
            <Button variant="secondary" type="submit">Submit</Button>
        </Form>
    );
};