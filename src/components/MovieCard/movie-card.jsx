import PropTypes from 'prop-types';
import Card from 'react-bootstrap/Card';
import './movie-card.scss';
import { RippleButton } from '../RippleButton/ripple-button';

export const MovieCard = ({ movie, onClick }) => {
    return (
        <Card className="z-0 position-relative" style={{cursor: 'pointer'}} onClick={onClick}>
            <Card.Img className="z-0 position-relative" variant="top" src={'.' + movie.imagePath} />
            <Card.Body className="z-0 position-relative">
                <div style={{float: 'right', width: '50px', height: '9px'}}/>
                <Card.Title className='movieTitle'>
                    {movie.title}
                </Card.Title>
                <RippleButton className="favouriteButton" onClick={(e) => {
                    e.stopPropagation();
                }} rippleColor={(() => getComputedStyle(document.documentElement).getPropertyValue('--bs-yellow').trim())()}>
                    <i className="bi bi-star"></i>
                </RippleButton>
                <Card.Text>{movie.description}</Card.Text>
            </Card.Body>
        </Card>
    );
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