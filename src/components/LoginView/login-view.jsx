import { useState } from "react";
import PropTypes from 'prop-types';

export const LoginView = ({ onLoggedIn }) => {
    const [username, setUsername] = useState(''),
        [password, setPassword] = useState(''),
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
                    res.json().then(res => {
                        localStorage.setItem('user', JSON.stringify(res.user));
                        localStorage.setItem('token', res.token);
                        onLoggedIn(res.user, res.token);
                    })
                    .catch(e => console.error('Couldn\'t convert response to JSON: ' +e ));
                } else {
                    alert('Login failed');
                }
            })
            .catch(e => console.error('Error logging in: ' + e));
        };

    return (
        <form onSubmit={handleSubmit}>
            <label htmlFor="login_username">Username</label>
            <input type="text" id="login_username" value={username} onChange={(e) => {setUsername(e.target.value)}} required />
            <label htmlFor="login_password">Password</label>
            <input type="password" id="login_password" value={password} onChange={(e) => {setPassword(e.target.value)}} required />
            <button type="submit">Submit</button>
        </form>
    );
};

LoginView.propTypes = {
    onLoggedIn: PropTypes.func.isRequired
};