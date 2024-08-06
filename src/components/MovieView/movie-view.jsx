import PropTypes from 'prop-types';

export const MovieView = ({ movie, onBackClick }) => {
    return (
        <div>
            <div className="movie-image">
                <img src={movie.imagePath} alt="Movie poster" width="200px" />
            </div>
            <div className="movie-title">
                <span className="label">Title: </span>
                <span className="value">{movie.title}</span>
            </div>
            <div className="movie-genre">
                <span className="label">Genre: </span>
                <span className="value">{movie.genre.name}</span>
            </div>
            <div className="movie-director">
                <span className="label">Director: </span>
                <span className="value">{movie.director.name}</span>
            </div>
            <div className="movie-description">
                <span className="label">Description: </span>
                <span className="value">{movie.description}</span>
            </div>
            <button onClick={onBackClick}>Back</button>
        </div>
    );
};

MovieView.propTypes = {
    movie: PropTypes.exact({
        _id: PropTypes.string.isRequired,
        title: PropTypes.string.isRequired,
        description: PropTypes.string.isRequired,
        genre: PropTypes.exact({
            _id: PropTypes.string.isRequired,
            name: PropTypes.string.isRequired,
            description: PropTypes.string.isRequired,
            __v: PropTypes.number.isRequired
        }),
        director: PropTypes.exact({
            _id: PropTypes.string.isRequired,
            name: PropTypes.string.isRequired,
            birthday: PropTypes.string.isRequired,
            deathday: PropTypes.string,
            biography: PropTypes.string.isRequired,
            __v: PropTypes.number.isRequired
        }),
        imagePath: PropTypes.string,
        __v: PropTypes.number.isRequired
    }).isRequired,
    onBackClick: PropTypes.func.isRequired
};