import { useState } from "react";

export const SignupView = ({ onSignedUp }) => { 
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [email, setEmail] = useState('');
    const [birthday, setBirthday] = useState('');

    const handleSubmit = (event) => {
        event.preventDefault();
        fetch('https://oles-myflix-810b16f7a5af.herokuapp.com/users', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ username, password, email, birthday })
        }).then(signupResponse => {
            if (signupResponse.ok) {
                fetch(`https://oles-myflix-810b16f7a5af.herokuapp.com/login?username=${username}&password=${password}`, { //This is redundant code. I will refactor it later.
                    method: 'POST'
                }).then(loginResponse => {
                    if (loginResponse.ok) {
                        loginResponse.json().then(res => {
                            localStorage.setItem('user', JSON.stringify(res.user));
                            localStorage.setItem('token', res.token);
                            onSignedUp(res.user, res.token);
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

    return(
        <form onSubmit={handleSubmit}>
            <label htmlFor="signup_username">Username: <sup>*</sup></label>
            <input type="text" id="signup_username" value={username} onChange={e => setUsername(e.target.value)} minLength="5" required />
            <label htmlFor="signup_password">Password: <sup>*</sup></label>
            <input type="password" id="signup_password" value={password} onChange={e => setPassword(e.target.value)} minLength="8" required />
            <label htmlFor="signup_email">Email: <sup>*</sup></label>
            <input type="email" id="signup_email" value={email} onChange={e => setEmail(e.target.value)} required />
            <label htmlFor="signup_birthday">Birthday:</label>
            <input type="date" id="signup_birthday" value={birthday} onChange={e => setBirthday(e.target.value)} />
            <button type="submit">Submit</button>
            <p>Fields marked with a <sup>*</sup> are required.</p>
        </form>
    );
};