import {
    useState
} from 'react';
import { MovieCard } from '../MovieCard/movie-card';
import { MovieView } from '../MovieView/movie-view';

export const MainView = () => {
    const [movies, setMovies] = useState([
        {
            id: 1,
            title: 'Inception',
            genre: 'Science Fiction',
            director: 'Christopher Nolan',
            description: 'A thief who steals corporate secrets through the use of dream-sharing technology is given the inverse task of planting an idea into the mind of a C.E.O.',
            imagePath: 'https://assets.cdn.moviepilot.de/files/3f60270d14db43f3bb991f45f0f645e136913a3d775d577cd4e6cc052cb2/limit/1600/900/1-1.jpg'
        },
        {
            id: 2,
            title: 'Silence of the Lambs',
            genre: 'Thriller',
            director: 'Jonathan Demme',
            description: 'A young FBI cadet must receive the help of an incarcerated and manipulative cannibal killer to help catch another serial killer.',
            imagePath: 'https://upload.wikimedia.org/wikipedia/en/8/86/The_Silence_of_the_Lambs_poster.jpg'
        },
        {
            id: 3,
            title: 'The Dark Knight',
            genre: 'Action',
            director: 'Christopher Nolan',
            description: 'When the menace known as the Joker emerges from his mysterious past, he wreaks havoc and chaos on the people of Gotham.',
            imagePath: 'https://m.media-amazon.com/images/M/MV5BM2VmMGQ1OTUtMjUyNS00NWFhLTliMzktZTljNDQ0OTQxOTQ4XkEyXkFqcGdeQXVyMTM4NTI3OTI@._V1_FMjpg_UX1000_.jpg'
        }
    ]);
    const [selectedMovie, setSelectedMovie] = useState(null);
    if (selectedMovie) return <MovieView movie={selectedMovie} onBackClick={() => setSelectedMovie(null)} />;
    if (movies.length === 0) {
        return <div className="main-view">The list is empty!</div>;
    }
    return (
        <div  className="main-view">
            {movies.map(movie => <MovieCard key={movie.id} movie={movie} onClick={(select) => {setSelectedMovie(select)}} />)}
        </div>
    );
};