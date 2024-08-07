import {
    useState,
    useEffect
} from 'react';
import { MovieCard } from '../MovieCard/movie-card';
import { MovieView } from '../MovieView/movie-view';
import { LoginView } from '../LoginView/login-view';
import { SignupView } from '../SignupView/signup-view';

export const MainView = () => {
    const storedUser = JSON.parse(localStorage.getItem('user'));
    const storedToken = localStorage.getItem('token');
    const [user, setUser] = useState(storedUser ? storedUser : null);
    const [token, setToken] = useState(storedToken ? storedToken : null);
    const [movies, setMovies] = useState([]);
    const [selectedMovie, setSelectedMovie] = useState(null);

    useEffect(() => {
        //I dont need authorization for GET /movies, because I want GET /movies to be a public endpoint, but it's part of the exercise.
        fetch('https://oles-myflix-810b16f7a5af.herokuapp.com/movies', { headers: { Authorization: `Bearer ${token}` }})
            .then(response => response.json())
            .then(data => setMovies(data))
            .catch(error => console.error(error));
    }, [token]);

    if (!user) {
        return (
            <>
                <LoginView onLoggedIn={(logedinuser, usertoken) => {
                    setUser(logedinuser);
                    setToken(usertoken);
                }} />
                or
                <SignupView onSignedUp={(signedUpUser, userToken) => {
                    setUser(signedUpUser);
                    setToken(userToken);
                }} />
            </>
        );
    };
    if (selectedMovie) return <MovieView movie={selectedMovie} onBackClick={() => setSelectedMovie(null)} />;
    if (movies.length === 0) {
        return <div className="main-view">The list is empty!</div>;
    }
    return (
        <div  className="main-view">
            {movies.map(movie => <MovieCard key={movie._id} movie={movie} onClick={(select) => { setSelectedMovie(select) }} />)}
            <button onClick={() => {
                setUser(null);
                setToken(null);
                localStorage.clear();
            }}>Logout</button>
        </div>
    );
};