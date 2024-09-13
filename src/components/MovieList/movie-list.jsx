import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Row, Col, Container, Spinner } from 'react-bootstrap';
import PropTypes from 'prop-types';
import Card from 'react-bootstrap/Card';
import { MovieCard } from '../MovieCard/movie-card';
import { RippleButton } from '../RippleButton/ripple-button';

import './movie-list.scss';

export const MovieList = (props) => {
    const navigate = useNavigate();
    const [movies, setMovies] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetch(process.env.HEROKU + '/movies')
            .then((response) => {
                if (response.ok) return response.json();
                setLoading(false);
                return response.text().then((text) => Promise.reject(text));
            })
            .then((data) => {
                if (props.movies) {
                    data = data.filter((movie) => props.movies.includes(movie._id));
                }
                setLoading(false);
                return setMovies(data);
            })
            .catch((error) => console.error(error));
    }, [props.movies]);

    return (<>
        {loading && <Container className="loading_container">
            <Spinner animation="border" role="status" aria-label='Loading movie' />
        </Container>}
        {!loading && movies.length > 0 ? (<Row>
            {
                props.movies ? '' : <Col xs="12" md="6" lg="4" xl="3" className="g-md-4 d-flex align-items-stretch">
                    <Card style={{ position: 'relative', width: '100%', borderColor: getComputedStyle(document.documentElement).getPropertyValue('--bs-primary').trim() }}>
                        <Card.Body style={{ position: 'relative' }}>
                            <RippleButton className="addNewMovieButton" onClick={() => {
                                setTimeout(() => navigate('/newmovie'), 600);
                            }} rippleColor={(() => getComputedStyle(document.documentElement).getPropertyValue('--bs-primary').trim())()}>
                                <i className="bi bi-plus"></i>
                            </RippleButton>
                        </Card.Body>
                    </Card>
                </Col>
            }
            {
                movies.map((movie) => (
                    <Col xs="12" md="6" lg="4" xl="3" className="g-md-4 d-flex align-items-stretch" key={movie._id}>
                        <MovieCard movie={movie} onClick={() => navigate(`/movies/${movie.title}`)} />
                    </Col>
                ))
            }
        </Row>) : (<Row>
            <Col xs="12" md="6" lg="4" xl="3" className="g-md-4 d-flex align-items-stretch">
                <Card style={{ position: 'relative', width: '100%', borderColor: getComputedStyle(document.documentElement).getPropertyValue('--bs-primary').trim() }}>
                    <Card.Body style={{ position: 'relative' }}>
                        <RippleButton className="addNewMovieButton" onClick={() => {
                            setTimeout(() => navigate('/newmovie'), 600);
                        }} rippleColor={(() => getComputedStyle(document.documentElement).getPropertyValue('--bs-primary').trim())()}>
                            <i className="bi bi-plus"></i>
                        </RippleButton>
                    </Card.Body>
                </Card>
            </Col>
        </Row>)}
    </>); //TODO: #16 Add a message for when there are no movies
};

MovieList.propTypes = {
    movies: PropTypes.array,
};