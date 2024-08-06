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
                <span className="value">{movie.genre}</span>
            </div>
            <div className="movie-director">
                <span className="label">Director: </span>
                <span className="value">{movie.director}</span>
            </div>
            <div className="movie-description">
                <span className="label">Description: </span>
                <span className="value">{movie.description}</span>
            </div>
            <button onClick={onBackClick}>Back</button>
        </div>
    );
};