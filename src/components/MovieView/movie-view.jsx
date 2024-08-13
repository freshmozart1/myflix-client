import PropTypes from 'prop-types';

import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Button from 'react-bootstrap/Button';
import { useParams, useNavigate } from 'react-router-dom';
import { useEffect, useState } from 'react';

import './movie-view.scss';
import { Spinner, Container } from 'react-bootstrap';

export const MovieView = () => {
    const title = Object.values(useParams())[0];
    const navigate = useNavigate();
    const [movie, setMovie] = useState(null);

    useEffect(() => {
        fetch(`https://oles-myflix-810b16f7a5af.herokuapp.com/movies/${title}`)
            .then((response) => response.json())
            .then((data) => setMovie(data))
            .catch((error) => console.error(error));
    });

    return movie ? (
        <Container>
            <Row>
                <Col xs={12} md={6}>
                    <Row className='align-items-center'>
                        <Col xs='auto'>
                            <Button onClick={() => navigate(-1)} variant='secondary'>&lt;</Button>
                        </Col>
                        <Col>
                            <h1>{movie.title}</h1>
                        </Col>
                    </Row>
                    <Row>
                        <Col>
                            {movie.genre.name}
                        </Col>
                    </Row>
                    <Row>
                        <Col xs='auto'>Director:</Col>
                        <Col>{movie.director.name}</Col>
                    </Row>
                    <Row>
                        <Col>{movie.description}</Col>
                    </Row>
                </Col>
                <Col xs={12} md={6}>
                    <img src={movie.imagePath} alt="Movie poster" />
                </Col>
            </Row >
        </Container >
    ) : (
        <Container className="loading_container">
            <Spinner animation="border" role="status" aria-label='Loading movie' />
        </Container>
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