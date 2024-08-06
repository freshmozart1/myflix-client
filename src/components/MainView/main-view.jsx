import {
    useState,
    useEffect
} from 'react';
import { MovieCard } from '../MovieCard/movie-card';
import { MovieView } from '../MovieView/movie-view';

export const MainView = () => {
    const [movies, setMovies] = useState([]);
    const [selectedMovie, setSelectedMovie] = useState(null);

    useEffect(() => {
        fetch('https://oles-myflix-810b16f7a5af.herokuapp.com/movies')
            .then(response => response.json())
            .then(data => setMovies(data))
            .catch(error => console.log(error));
    }, []);

    if (selectedMovie) return <MovieView movie={selectedMovie} onBackClick={() => setSelectedMovie(null)} />;
    if (movies.length === 0) {
        return <div className="main-view">The list is empty!</div>;
    }
    return (
        <div  className="main-view">
            {movies.map(movie => <MovieCard key={movie._id} movie={movie} onClick={(select) => {setSelectedMovie(select)}} />)}
        </div>
    );
};