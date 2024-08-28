import PropTypes from 'prop-types';
import Card from 'react-bootstrap/Card';
import './movie-card.scss';
import { RippleButton } from '../RippleButton/ripple-button';
import { useContext, useState } from 'react';
import { AuthContext } from '../AuthProvider/auth-provider';

export const MovieCard = ({ movie, onClick }) => {
    const { user, token, setUser } = useContext(AuthContext);
    const [isFavourite, setIsFavourite] = useState(() => {
        if (user && user.favourites) return user.favourites.includes(movie._id);
        return false;
    });
    const patchFavourites = () => {
        if (isFavourite) {
            fetch(process.env.HEROKU + '/users/' + user.username + '/favourites/' + movie._id, {
                method: 'DELETE',
                headers: {
                    'Content-Type': 'application/json; charset=utf-8',
                    'Authorization': `Bearer ${token}`
                }
            }).then(response => {
                if (response.ok) {
                    response.json().then(favourites => {
                        setUser({ ...user, favourites });
                        setIsFavourite(false);
                    });
                }
            }).catch(error => console.error(error));
        } else {
            fetch(process.env.HEROKU + '/users/' + user.username + '/favourites/' + movie._id, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json; charset=utf-8',
                    'Authorization': `Bearer ${token}`
                }
            }).then(response => {
                if (response.ok) {
                    response.json().then(favourites => {
                        setUser({ ...user, favourites });
                        setIsFavourite(true);
                    });
                }
            }).catch(error => console.error(error));
        }
    }
    return (
        <Card className="z-0 position-relative" style={{cursor: 'pointer'}} onClick={onClick}>
            <Card.Img className="z-0 position-relative" variant="top" src={movie.imagePath} />
            <Card.Body className="z-0 position-relative">
                <div style={{float: 'right', width: '50px', height: '9px'}}/>
                <Card.Title className='movieTitle'>
                    {movie.title}
                </Card.Title>
                {user && <RippleButton className="favouriteButton" onClick={(e) => {
                    e.stopPropagation();
                    patchFavourites();
                }} rippleColor={(() => getComputedStyle(document.documentElement).getPropertyValue('--bs-yellow').trim())()}>
                    <i className={`bi bi-star${isFavourite ? '-fill' : ''}`}></i>
                </RippleButton>}
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