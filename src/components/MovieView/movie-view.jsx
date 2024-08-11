import PropTypes from 'prop-types';

export const MovieView = ({ movie, onBackClick }) => {
    return (
        <div className='container'>
            <div className='row'>
                <div className='col-xs-12 col-md-6'>
                    <div className='row align-items-center'>
                        <div className='col-auto'>
                            <button className='btn btn-secondary' onClick={onBackClick}>{'\u003c'}</button>
                        </div>
                        <div className='col'>
                            <h1>{movie.title}</h1>
                        </div>
                    </div>
                    <div className='row'>
                        <div className='col'>
                            <div className='value'>{movie.genre.name}</div>
                        </div>
                    </div>
                    <div className='row'>
                        <div className='col-auto'>Director:</div>
                        <div className='col'>{movie.director.name}</div>
                    </div>
                    <div className='row'>
                        <div className='col'>{movie.description}</div>
                    </div>
                </div>
                <div className='col-xs-12 col-md-6'>
                    <img src={movie.imagePath} alt="Movie poster" />
                </div>
            </div>
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