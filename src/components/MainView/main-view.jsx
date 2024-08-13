/*import {
    useState,
    useEffect
} from 'react';*/

import { Outlet } from 'react-router-dom';

import Container from 'react-bootstrap/Container';

export const MainView = () => {
    /*const storedUser = JSON.parse(localStorage.getItem('user'));
    const storedToken = localStorage.getItem('token');
    const [user, setUser] = useState(storedUser ? storedUser : null);
    const [token, setToken] = useState(storedToken ? storedToken : null);

   useEffect(() => {
        I dont need authorization for GET /movies, because I want GET /movies to be a public endpoint, but it's part of the exercise.
        fetch('https://oles-myflix-810b16f7a5af.herokuapp.com/movies', { headers: { Authorization: `Bearer ${token}` }})
            .then(response => response.json())
            .then(data => setMovies(data))
            .catch(error => console.error(error));
    }, [token]);

    if (!user) {
        return (
            <Container>
                <Row>
                    <Col xs={12} md={6}>
                        <LoginView onLoggedIn={(logedinuser, usertoken) => {
                            setUser(logedinuser);
                            setToken(usertoken);
                        }} />
                    </Col>
                    <Col xs={12} md={6}>
                        <SignupView onSignedUp={(signedUpUser, userToken) => {
                            setUser(signedUpUser);
                            setToken(userToken);
                        }} />
                    </Col>
                </Row>
            </Container>
        );
    };*/
    return (
        <Container className="overflow-hidden">
            <Outlet />
        </Container>
    );
};