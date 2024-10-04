import { useContext, useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Col, Form, Row, ListGroup } from "react-bootstrap";
import { isDate } from "date-fns";
import { AuthContext } from "../AuthProvider/auth-provider";
import ReactCrop from "react-image-crop";
import 'react-image-crop/dist/ReactCrop.css';
import './create-new-movie-view.scss';


export default function NewMovieView() {
    const { user, token } = useContext(AuthContext);
    const navigate = useNavigate();

    const [movies, setMovies] = useState([]);

    const [title, setTitle] = useState('');
    const [titleValid, setTitleValid] = useState(false);
    const [titleExists, setTitleExists] = useState(false);
    const [titleError, setTitleError] = useState('');
    const [touchedTitle, setTouchedTitle] = useState(false);

    const [description, setDescription] = useState('');
    const [descriptionValid, setDescriptionValid] = useState(false);
    const [descriptionError, setDescriptionError] = useState('');
    const [touchedDescription, setTouchedDescription] = useState(false);

    const [genres, setGenres] = useState([]);
    const [filteredGenres, setFilteredGenres] = useState([]);
    const [genreName, setGenreName] = useState('');
    const [genreId, setGenreId] = useState('');
    const [genreNameValid, setGenreNameValid] = useState(false);
    const [touchedGenreName, setTouchedGenreName] = useState(false);
    const [touchedGenreList, setTouchedGenreList] = useState(false);
    const [genreNameExists, setGenreNameExists] = useState(false);
    const [genreNameError, setGenreNameError] = useState('');
    const [genreDescription, setGenreDescription] = useState('');
    const [genreDescriptionValid, setGenreDescriptionValid] = useState(false);
    const [genreDescriptionError, setGenreDescriptionError] = useState('');
    const [touchedGenreDescription, setTouchedGenreDescription] = useState(false);

    const [directors, setDirectors] = useState([]);
    const [filteredDirectors, setFilteredDirectors] = useState([]);
    const [directorName, setDirectorName] = useState('');
    const [directorId, setDirectorId] = useState('');
    const [directorNameValid, setDirectorNameValid] = useState(false);
    const [touchedDirectorName, setTouchedDirectorName] = useState(false);
    const [touchedDirectorList, setTouchedDirectorList] = useState(false);
    const [directorNameExists, setDirectorNameExists] = useState(false);
    const [directorNameError, setDirectorNameError] = useState('');
    const [birthday, setBirthday] = useState('');
    const [birthdayValid, setBirthdayValid] = useState(false);
    const [touchedBirthday, setTouchedBirthday] = useState(false);
    const [birthdayError, setBirthdayError] = useState('');
    const [deathday, setDeathday] = useState('');
    const [deathdayValid, setDeathdayValid] = useState(true);
    const [touchedDeathday, setTouchedDeathday] = useState(false);
    const [deathdayError, setDeathdayError] = useState('');
    const [biography, setBiography] = useState('');
    const [biographyValid, setBiographyValid] = useState(false);
    const [biographyTouched, setBiographyTouched] = useState(false);
    const [biographyError, setBiographyError] = useState('');

    const imageRef = useRef();
    const [image, setImage] = useState();
    const [imageUploadValid, setImageUploadValid] = useState(false);
    const [imageUploadTouched, setImageUploadTouched] = useState(false);
    const [imageUploadError, setImageUploadError] = useState('');
    const [cropParams, setCropParams] = useState({ unit: 'px', x: 0, y: 0, width: 286, height: 180, aspect: 286 / 180 });
    const [thumbnail, setThumbnail] = useState();

    const [formValid, setFormValid] = useState(false);
    const [submit, setSubmit] = useState(false);

    useEffect(() => {
        if (!user || !token) {
            navigate('/login')
        }
    })

    useEffect(() => {
        fetchData(`${process.env.HEROKU}/movies`, setMovies);
        fetchData(`${process.env.HEROKU}/genres`, setGenres);
        fetchData(`${process.env.HEROKU}/directors`, setDirectors);
    }, []);

    useEffect(() => {
        setFormValid(
            titleValid &&
            descriptionValid &&
            genreNameValid &&
            (genreNameExists || genreDescriptionValid) &&
            directorNameValid &&
            (directorNameExists || (birthdayValid && deathdayValid && biographyValid))
        );
    }, [titleValid, descriptionValid, genreNameValid, genreDescriptionValid, directorNameValid, birthdayValid, deathdayValid, biographyValid, genreNameExists, directorNameExists]);

    useEffect(() => {
        setTitleExists(movies.some(movie => movie.title.toLowerCase() === title.toLowerCase()));
        setGenreNameExists(genres.some(g => g.name.toLowerCase() === genreName.toLowerCase()));
        setFilteredGenres(genres.filter(g => g.name.toLowerCase().includes(genreName.toLowerCase())));
        setDirectorNameExists(directors.some(d => d.name.toLowerCase() === directorName.toLowerCase()));
        setFilteredDirectors(directors.filter(d => d.name.toLowerCase().includes(directorName.toLowerCase())));
    }, [movies, title, genres, genreName, directors, directorName]);

    useEffect(() => {
        for (const [field, setValid, setError, errorMessage] of [
            [title, setTitleValid, setTitleError, 'Title is required'],
            [description, setDescriptionValid, setDescriptionError, 'Description is required'],
            [genreName, setGenreNameValid, setGenreNameError, 'Genre is required'],
            [genreDescription, setGenreDescriptionValid, setGenreDescriptionError, 'Genre description is required'],
            [directorName, setDirectorNameValid, setDirectorNameError, 'Director name is required'],
            [birthday, setBirthdayValid, setBirthdayError, 'Director birthday is required'],
            [biography, setBiographyValid, setBiographyError, 'Director biography is required']
        ]) {
            if (field.length === 0) {
                setValid(false);
                setError(errorMessage);
            } else {
                setValid(true);
                setError('');
            }
        }

        if (titleExists) {
            setTitleValid(false);
            setTitleError('Movie already exists in the database');
        }
        
        if (deathday.length > 0 && !isDate(new Date(deathday))) {
            setDeathdayValid(false);
            setDeathdayError('Invalid date');
        } else {
            setDeathdayValid(true);
            setDeathdayError('');
        }
        if (!isDate(new Date(birthday))) {
            setBirthdayValid(false);
            setBirthdayError('Invalid date');
        }
    }, [title, titleExists, description, genreName, genreDescription, directorName, birthday, deathday, biography]);

    useEffect(() => {
        if (submit && (genreId.length > 0) && (directorId.length > 0)) {
            fetch(`${process.env.HEROKU}/movies`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify({ title: title, description: description, genre: genreId, director: directorId, ...(image && { image }), ...(thumbnail && { thumbnail }) })
            }).then(response => {
                if (response.ok) return response.json();
                throw new Error('Network response was not ok');
            }).then(newMovie => {
                console.log(newMovie);
                navigate('/');
            }).catch(e => console.error(e));
        }
    }, [submit, directorId, genreId]);

    useEffect(() => {
        if (image) {
            cropPoster();
        }
    }, [cropParams]);

    function fetchData(url, setState) {
        fetch(url)
            .then(response => {
                if (response.ok) return response.json();
                throw new Error("Network response was not ok")
            })
            .then(data => setState(data))
            .catch(e => console.error(e));
    };

    function cropPoster() {
        const canvas = document.createElement('canvas');
        canvas.width = cropParams.width;
        canvas.height = cropParams.height;
        const _img = imageRef.current;
        canvas.getContext('2d').drawImage(
            _img,
            cropParams.x * (_img.naturalWidth / _img.width),
            cropParams.y * (_img.naturalHeight / _img.height),
            cropParams.width * (_img.naturalWidth / _img.width),
            cropParams.height * (_img.naturalHeight / _img.height),
            0,
            0,
            cropParams.width,
            cropParams.height
        );
        setThumbnail(canvas.toDataURL('image/jpeg'));
    };

    function submitMovie() {
        if (genreNameExists) {
            setGenreId(genres.find(g => g.name.toLowerCase() === genreName.toLowerCase())._id);
        } else {
            fetch(`${process.env.HEROKO}/genres`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify({ name: genreName, description: genreDescription })
            }).then(response => {
                if (response.ok) return response.json();
                throw new Error('Network response was not ok');
            }).then(newGenre => {
                setGenreId(newGenre._id);
                setGenres([...genres, newGenre]);
            }).catch(e => {
                console.error(e);
            });
        }
        if (directorNameExists) {
            setDirectorId(directors.find(d => d.name.toLowerCase() === directorName.toLowerCase())._id);
        } else {
            fetch(`${process.env.HEROKO}/directors`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify({ name: directorName, birthday: birthday, deathday: deathday.length > 0 ? deathday : null, biography: biography })
            }).then(response => {
                if (response.ok) return response.json();
                throw new Error('Network response was not ok');
            }).then(newDirector => {
                setDirectorId(newDirector._id);
                setDirectors([...directors, newDirector]);
            }).catch(e => {
                console.error(e);
            });
        }
        setSubmit(true);
    };

    return (<Form onSubmit={(e) => {
        e.preventDefault();
        submitMovie();
    }}>
        <Row>
            <Col xs={12} md={6}>
                <Row className="gy-1">
                    <Col xs={12}>
                        <Form.Group controlId='title'>
                            <Form.Label>Title</Form.Label>
                            <Form.Control type='text' value={title} onChange={(e) => {
                                e.preventDefault();
                                setTitle(e.target.value);
                                setTouchedTitle(true);
                            }} isValid={touchedTitle && titleValid} isInvalid={touchedTitle && !titleValid} />
                            <Form.Control.Feedback type='invalid'>{titleError}</Form.Control.Feedback>
                        </Form.Group>
                    </Col>
                </Row>
                <Row className="gy-1">
                    <Col xs={12}>
                        <Form.Group controlId='description'>
                            <Form.Label>Description</Form.Label>
                            <Form.Control as='textarea' value={description} onChange={(e) => {
                                e.preventDefault();
                                setDescription(e.target.value);
                                setTouchedDescription(true);
                            }} isValid={touchedDescription && descriptionValid} isInvalid={touchedDescription && !descriptionValid} />
                            <Form.Control.Feedback type='invalid'>{descriptionError}</Form.Control.Feedback>
                        </Form.Group>
                    </Col>
                </Row>
                <Row className="gy-1">
                    <Col xs={12}>
                        <Form.Group controlId='genreName'>
                            <Form.Label>Genre</Form.Label>
                            <Form.Control type='text' value={genreName} onChange={(e) => {
                                e.preventDefault();
                                setGenreName(e.target.value);
                                setTouchedGenreName(true);
                                setTouchedGenreList(false);
                            }} isValid={touchedGenreName && genreNameValid} isInvalid={touchedGenreName && !genreNameValid} />
                            <Form.Control.Feedback type='invalid'>{genreNameError}</Form.Control.Feedback>
                        </Form.Group>
                    </Col>
                </Row>
                {!genreNameExists && !touchedGenreList && filteredGenres.length > 0 && <Row className="gy-1">
                    <Col xs={12}>
                        <ListGroup className='scroll-list' variant='flush'>
                            {genreName.length > 0 && <ListGroup.Item action onClick={(e) => {
                                e.preventDefault();
                                setTouchedGenreName(true);
                                setTouchedGenreList(true);
                                setFilteredGenres([]);
                            }}>Add genre &apos;{genreName}&apos;</ListGroup.Item>}
                            {
                                filteredGenres.map(g => {
                                    return (<ListGroup.Item key={g._id} action onClick={(e) => {
                                        e.preventDefault();
                                        setGenreName(g.name);
                                        setTouchedGenreName(true);
                                        setTouchedGenreList(true);
                                    }}>{g.name}</ListGroup.Item>);
                                })
                            }
                        </ListGroup>
                    </Col>
                </Row>}
                {touchedGenreName && filteredGenres.length === 0 && <Row className="gy-1">
                    <Col xs={12}>
                        <Form.Group controlId='genreDescription'>
                            <Form.Label>Genre description</Form.Label>
                            <Form.Control as='textarea' value={genreDescription} onChange={(e) => {
                                e.preventDefault();
                                setGenreDescription(e.target.value);
                                setTouchedGenreDescription(true);
                            }} isValid={touchedGenreDescription && genreDescriptionValid} isInvalid={touchedGenreDescription && !genreDescriptionValid} />
                            <Form.Control.Feedback type='invalid'>{genreDescriptionError}</Form.Control.Feedback>
                        </Form.Group>
                    </Col>
                </Row>}
                <Row className="gy-1">
                    <Col xs={12}>
                        <Form.Group controlId='directorName'>
                            <Form.Label>Director</Form.Label>
                            <Form.Control type='text' value={directorName} onChange={(e) => {
                                e.preventDefault();
                                setDirectorName(e.target.value);
                                setTouchedDirectorName(true);
                                setTouchedDirectorList(false);
                            }} isValid={touchedDirectorName && directorNameValid} isInvalid={touchedDirectorName && !directorNameValid} />
                            <Form.Control.Feedback type='invalid'>{directorNameError}</Form.Control.Feedback>
                        </Form.Group>
                    </Col>
                </Row>
                {!directorNameExists && !touchedDirectorList && filteredDirectors.length > 0 && <Row className="gy-1">
                    <Col xs={12}>
                        <ListGroup className='scroll-list' variant='flush'>
                            {directorName.length > 0 && <ListGroup.Item action onClick={(e) => {
                                e.preventDefault();
                                setTouchedDirectorName(true);
                                setTouchedDirectorList(true);
                                setFilteredDirectors([]);
                            }}>Add director &apos;{directorName}&apos;</ListGroup.Item>}
                            {
                                filteredDirectors.map(d => {
                                    return (<ListGroup.Item key={d._id} action onClick={(e) => {
                                        e.preventDefault();
                                        setDirectorName(d.name);
                                        setTouchedDirectorName(true);
                                        setTouchedDirectorList(true);
                                    }}>{d.name}</ListGroup.Item>);
                                })
                            }
                        </ListGroup>
                    </Col>
                </Row>}
                {touchedDirectorName && filteredDirectors.length == 0 && <Row className="gy-1">
                    <Col xs={12}>
                        <Form.Group controlId='birthday'>
                            <Form.Label>Director birthday</Form.Label>
                            <Form.Control type="date" value={birthday} onChange={(e) => {
                                e.preventDefault();
                                setBirthday(e.target.value);
                                setTouchedBirthday(true);
                            }} isValid={touchedBirthday && birthdayValid} isInvalid={touchedBirthday && !birthdayValid} />
                            <Form.Control.Feedback type='invalid'>{birthdayError}</Form.Control.Feedback>
                        </Form.Group>
                    </Col>
                </Row>}
                {touchedDirectorName && filteredDirectors.length == 0 && <Row className="gy-1">
                    <Col xs={12}>
                        <Form.Group controlId='deathday'>
                            <Form.Label>Director deathday</Form.Label>
                            <Form.Control type="date" value={deathday} onChange={(e) => {
                                e.preventDefault();
                                setDeathday(e.target.value);
                                setTouchedDeathday(true);
                            }} isValid={touchedDeathday && deathdayValid} isInvalid={touchedDeathday && !deathdayValid} />
                            <Form.Control.Feedback type='invalid'>{deathdayError}</Form.Control.Feedback>
                        </Form.Group>
                    </Col>
                </Row>}
                {touchedDirectorName && filteredDirectors.length == 0 && <Row className="gy-1">
                    <Col xs={12}>
                        <Form.Group controlId='biography'>
                            <Form.Label>Director biography</Form.Label>
                            <Form.Control as='textarea' value={biography} onChange={(e) => {
                                e.preventDefault();
                                setBiography(e.target.value);
                                setBiographyTouched(true);
                            }} isValid={biographyTouched && biographyValid} isInvalid={biographyTouched && !biographyValid} />
                            <Form.Control.Feedback type='invalid'>{biographyError}</Form.Control.Feedback>
                        </Form.Group>
                    </Col>
                </Row>}
            </Col>
            <Col xs={12} md={6}>
                <Row className="gy-1">
                    <Col xs={12}>
                        <Form.Group controlId="poster">
                            <Form.Label>Poster</Form.Label>
                            <Form.Control type="file" accept="image/*" onChange={(e) => { //TODO: #15 image must be at least 286x180
                                setImageUploadTouched(true);
                                const reader = new FileReader();
                                reader.onloadend = () => {
                                    const img = new Image();
                                    img.onload = () => {
                                        if (img.width < 286 || img.height < 180) {
                                            setImage(null);
                                            setImageUploadValid(false);
                                            setImageUploadError('Image must be at least 286x180 pixels.');
                                            return;
                                        } else {
                                            setImageUploadValid(true);
                                            setImageUploadError('');
                                            setImage(reader.result);
                                        }
                                    };
                                    img.src = reader.result;
                                };
                                if (e.target.files[0]) {
                                    reader.readAsDataURL(e.target.files[0]);
                                }
                            }} isValid={imageUploadTouched && imageUploadValid} isInvalid={imageUploadTouched && !imageUploadValid} />
                            <Form.Control.Feedback type='invalid'>{imageUploadError}</Form.Control.Feedback>
                        </Form.Group>
                    </Col>
                </Row>
                {image && <Row className="gy-1">
                    <Col xs={12}>
                        <Form.Group controlId="crop">
                            <Row>
                                <Col xs="12"><Form.Label>Select thumbnail</Form.Label></Col>
                            </Row>
                            <Row>
                                <Col xs="12">
                                    <ReactCrop
                                        minWidth={286}
                                        minHeight={180}
                                        keepSelection={true}
                                        crop={cropParams}
                                        aspect={286 / 180}
                                        onChange={(crop) => setCropParams(crop)}
                                    >
                                        <img src={image} ref={imageRef} onLoad={() => cropPoster()} />
                                    </ReactCrop>
                                </Col>
                            </Row>
                        </Form.Group>
                    </Col>
                </Row>}
            </Col>
        </Row>
        <Row className='gy-1'>
            <Col xs={12}>
                <button type='submit' disabled={!formValid}>Submit</button>
            </Col>
        </Row>
    </Form>);
};