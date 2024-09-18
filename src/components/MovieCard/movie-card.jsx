import PropTypes from 'prop-types';
import Card from 'react-bootstrap/Card';
import './movie-card.scss';
import { RippleButton } from '../RippleButton/ripple-button';
import { useContext, useEffect, useState } from 'react';
import { AuthContext } from '../AuthProvider/auth-provider';
import { S3Client, GetObjectCommand } from "@aws-sdk/client-s3";

export const MovieCard = ({ movie, onClick }) => {
    const { user, token, setUser } = useContext(AuthContext);
    const [isFavourite, setIsFavourite] = useState(() => {
        if (user && user.favourites) return user.favourites.includes(movie._id);
        return false;
    });
    const [thumbnail, setThumbnail] = useState(() => {
        return process.env.HEROKU + '/placeholders/movie_set_cropped.webp';
    });

    useEffect(() => {
        if (!movie.thumbnailPath) return;
        (async () => {
            try {
                const s3 = new S3Client({
                    region: process.env.S3_REGION,
                    credentials: {
                        accessKeyId: process.env.AWS_ID,
                        secretAccessKey: process.env.AWS_SECRET
                    }
                });
                const thumbnailResponse = await s3.send(new GetObjectCommand({
                    Bucket: process.env.S3_BUCKET,
                    Key: movie.thumbnailPath
                }));
                const thumbnailReader = thumbnailResponse.Body.getReader();
                const thumbnailChunks = [];
                let done, value;
                while ({ done, value } = await thumbnailReader.read(), !done) {
                    thumbnailChunks.push(value);
                }
                setThumbnail(URL.createObjectURL(new Blob(thumbnailChunks)));
                s3.destroy();
            } catch (error) {
                console.error(error);
            }
        })();
    }, [movie.thumbnailPath]);

    const patchFavourites = () => {
        fetch(process.env.HEROKU + '/users/' + user.username + '/favourites/' + movie._id, {
            method: isFavourite ? 'DELETE' : 'POST',
            headers: {
                'Content-Type': 'application/json; charset=utf-8',
                'Authorization': `Bearer ${token}`
            }
        }).then(response => {
            if (response.ok) {
                response.json().then(favourites => {
                    setUser({ ...user, favourites });
                    setIsFavourite(!isFavourite);
                });
            }
        }).catch(error => console.error(error));
    }
    
    return (
        <Card className="z-0 position-relative" style={{cursor: 'pointer'}} onClick={onClick}>
            <Card.Img className="z-0 position-relative" variant="top" src={thumbnail} />
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
            __v: PropTypes.number
        }),
        director: PropTypes.exact({
            _id: PropTypes.string.isRequired,
            name: PropTypes.string.isRequired,
            birthday: PropTypes.string.isRequired,
            deathday: PropTypes.string,
            biography: PropTypes.string.isRequired,
            __v: PropTypes.number
        }),
        imagePath: PropTypes.string,
        thumbnailPath: PropTypes.string,
        __v: PropTypes.number
    }).isRequired,
    onClick: PropTypes.func.isRequired
};