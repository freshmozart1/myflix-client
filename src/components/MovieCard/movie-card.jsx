import PropTypes from 'prop-types';

export const MovieCard = ({ movie, onClick }) => {
    return <div onClick={() => {onClick(movie)}}>{movie.title}</div>;
};

MovieCard.propTypes = {
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
    onClick: PropTypes.func.isRequired
};