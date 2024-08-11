import { useState } from "react";
import PropTypes from 'prop-types';
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
        <form onSubmit={handleSubmit}>
            <div className="form-group">
                <label htmlFor="login_username">Username</label>
                <input type="text" className="form-control" id="login_username" value={username} onChange={(e) => { setUsername(e.target.value) }} minLength={process.env.USERNAME_LENGTH} required />
            </div>
            <div className="form-group">
                <label htmlFor="login_password">Password</label>
                <input type="password" className="form-control" id="login_password" value={password} onChange={(e) => { setPassword(e.target.value) }} minLength={process.env.PASSWORD_LENGTH} required />
            </div>
            <small className="error">{errorMessage}</small><br />
            <button type="submit" className="btn btn-primary">Submit</button>
        </form>
    );
};

LoginView.propTypes = {
    onLoggedIn: PropTypes.func.isRequired
};