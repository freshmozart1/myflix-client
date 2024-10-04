import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Button from 'react-bootstrap/Button';
import { useParams, useNavigate } from 'react-router-dom';
import { useEffect, useState } from 'react';

import './movie-view.scss';
import { Spinner, Container } from 'react-bootstrap';
import { GetObjectCommand, S3Client } from '@aws-sdk/client-s3';

export const MovieView = () => {
    const title = Object.values(useParams())[0];
    const navigate = useNavigate();
    const [movie, setMovie] = useState(null);
    const [poster, setPoster] = useState(null);

    useEffect(() => {
        if (title) {
            fetch(`${process.env.HEROKU}/movies/${title}`)
                .then((response) => response.json())
                .then((data) => setMovie(data))
                .catch((error) => console.error(error));
        }
    }, [title]);

    useEffect(() => {
        if (!movie) return;
        (async () => {
            try {
                const s3 = new S3Client({
                    region: process.env.S3_REGION,
                    credentials: {
                        accessKeyId: process.env.AWS_ID,
                        secretAccessKey: process.env.AWS_SECRET
                    }
                });
                const posterResponse = await s3.send(new GetObjectCommand({
                    Bucket: process.env.S3_BUCKET,
                    Key: movie.imagePath ? movie.imagePath : 'placeholders/movie_set.webp'
                }));
                const posterReader = posterResponse.Body.getReader();
                const posterChunks = [];
                let done, value;
                while ({ done, value } = await posterReader.read(), !done) {
                    posterChunks.push(value);
                }
                setPoster(URL.createObjectURL(new Blob(posterChunks)));
                s3.destroy();
            } catch (error) {
                console.error(error);
            }
        })();
    }, [movie]);

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
                    <img className='poster' src={poster} alt="Movie poster" />
                </Col>
            </Row >
        </Container >
    ) : (
        <Container className="loading_container">
            <Spinner animation="border" role="status" aria-label='Loading movie' />
        </Container>
    );
};