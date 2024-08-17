import { createContext, useEffect, useState } from "react";
import PropTypes from 'prop-types';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [token, setToken] = useState(() => {
        const _token = localStorage.getItem('token');
        return _token ? _token : null;
    });

    const [user, setUser] = useState(() => {
        const _user = localStorage.getItem('user');
        return _user ? _user : null;
    });

    const _setUser = (newUser) => {
        if (newUser) {
            setUser(JSON.stringify(newUser));
        } else {
            setUser(null);
        }
    };
    useEffect(() => {
        if (token) {
            localStorage.setItem('token', token);
        } else {
            localStorage.removeItem('token');
        }
        if (user) {
            localStorage.setItem('user', user);
        } else {
            localStorage.removeItem('user');
        }
    }, [token, user]);

    return (
        <AuthContext.Provider value={{ token, setToken, user: JSON.parse(user), setUser: _setUser }}>
            {children}
        </AuthContext.Provider>
    );
};

AuthProvider.propTypes = {
    children: PropTypes.node
};