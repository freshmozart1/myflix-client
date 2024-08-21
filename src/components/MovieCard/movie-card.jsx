import PropTypes from 'prop-types';
import Card from 'react-bootstrap/Card';
import './movie-card.scss';
import { RippleButton } from '../RippleButton/ripple-button';
import { useContext, useState } from 'react';
import { AuthContext } from '../AuthProvider/auth-provider';

export const MovieCard = ({ movie, onClick }) => {
    const { user, token, setUser } = useContext(AuthContext);
    const [isFavourite, setIsFavourite] = useState(() => {
        if (user.favourites) return user.favourites.includes(movie._id);
        return false;
    });
    const patchFavourites = () => {
        if (isFavourite) {
            user.favourites = user.favourites.filter(favourite => favourite !== movie._id);
            if (user.favourites.length === 0) user.favourites = null;
        } else {
            if (!user.favourites) user.favourites = [];
            user.favourites.push(movie._id);
        }
        fetch(process.env.HEROKU + '/users/' + user.username, {
            method: 'PATCH',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify({ favourites: user.favourites })
        }).then(respone => {
            if (respone.ok) {
                setUser(user);
                setIsFavourite(!isFavourite);
            } else {
                console.error('Failed to patch favourites: ' + respone.status);
            }
        });
    }
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
                    patchFavourites();
                }} rippleColor={(() => getComputedStyle(document.documentElement).getPropertyValue('--bs-yellow').trim())()}>
                    <i className={`bi bi-star${isFavourite ? '-fill' : ''}`}></i>
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