import PropTypes from 'prop-types';

import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Button from 'react-bootstrap/Button';

export const MovieView = ({ movie, onBackClick }) => {
    return (
        <Container>
            <Row>
                <Col xs={12} md={6}>
                    <Row className='align-items-center'>
                        <Col xs='auto'>
                            <Button variant='secondary' onClick={onBackClick}>{'\u003c'}</Button>
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
            </Row>
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