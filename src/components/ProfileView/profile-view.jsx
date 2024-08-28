import Container from 'react-bootstrap/Container';
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';
import { useContext, useState } from 'react';
import { AuthContext } from "../AuthProvider/auth-provider";
import { Col, Row } from 'react-bootstrap';
import { MovieList } from '../MovieList/movie-list';

export const ProfileView = () => {
    const { user, token, setUser, setToken } = useContext(AuthContext);
    if (!user || !token) {
        window.location.href = '/';
        return;
    }
    const [newUsername, setNewUsername] = useState({ value: user.username, valid: false, errorMessage: '' });
    const [newPassword, setNewPassword] = useState({ value: '', valid: false, errorMessage: '' });
    const [newEmail, setNewEmail] = useState({ value: user.email, valid: false, errorMessage: '' });
    const [newBirthday, setNewBirthday] = useState({ value: user.birthday, valid: false, errorMessage: '' });
    //const [favourites, setFavourites] = useState(null);
    
    const validateUsername = async (username) => {
        if ((!username) || (username === user.username)) return setNewUsername({ value: user.username, valid: false, errorMessage: '' });
        if (!(new RegExp(`^[a-zA-Z0-9]{${process.env.USERNAME_LENGTH},}$`)).test(username)) {
            return setNewUsername({
                value: user.username,
                valid: false,
                errorMessage: 'Username must be at least ' + process.env.USERNAME_LENGTH + ' characters long and contain only letters and numbers.'
            });
        }
        const _userExistsStatus = (await fetch(process.env.HEROKU + '/users/' + username)).status;
        if (_userExistsStatus === 200) {
            return setNewUsername({ value: user.username, valid: false, errorMessage: 'Username already exists.' });
        } else if (_userExistsStatus === 404) {
            return setNewUsername({ value: username, valid: true, errorMessage: '' });
        } else {
            return setNewUsername({ value: user.username, valid: false, errorMessage: 'An error occurred.' });
        }
    };

    const validatePassword = (password) => {
        if (!password) return setNewPassword({ value: '', valid: false, errorMessage: '' });
        if (!(new RegExp(`^.{${process.env.PASSWORD_LENGTH},}$`)).test(password)) {
            return setNewPassword({
                value: password,
                valid: false,
                errorMessage: 'Password must be at least ' + process.env.PASSWORD_LENGTH + ' characters long.'
            });
        }
        return setNewPassword({ value: password, valid: true, errorMessage: '' });
    };

    const validateEmail = (email) => {
        if (!email) return setNewEmail({ value: user.email, valid: false, errorMessage: '' });
        return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email) ? setNewEmail({ value: email, valid: true, errorMessage: '' }) : setNewEmail({ value: email, valid: false, errorMessage: 'Invalid email address.' });
    };

    const validateBirthday = (birthday) => {
        if (!birthday) return setNewBirthday({ value: user.birthday, valid: false, errorMessage: '' });
        return /^\d{4}-(0[1-9]|1[0-2])-(0[1-9]|[12]\d|3[01])$/.test(birthday) ? setNewBirthday({ value: birthday, valid: true, errorMessage: '' }) : setNewBirthday({ value: birthday, valid: false, errorMessage: 'Invalid date.' });
    };
    const patchField = async (field, value) => {
        fetch(`${process.env.HEROKU}/users/${user.username}`, {
            method: 'PATCH',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify({ [field]: value })
        }).then(response => {
            if (response.status === 200) {
                response.json().then(newUser => {
                    setUser(newUser);
                });
            } else {
                response.text().then(error => console.error(`Error updating user: ${response.statusText}: ${error}`));
            }
        });
    };

   /*const fetchFavourites = () => {
        if (user.favourites) {
            fetch(process.env.HEROKU + '/movies').then(response => response.json()).then(movies => {
                setFavourites(movies.filter(movie => user.favourites.includes(movie._id)));
            });
        } else {
            setFavourites(null);
        }
    };*/

    const deleteUser = () => {
        fetch(`${process.env.HEROKU}/users/${user.username}`, {
            method: 'DELETE',
            headers: {
                'Authorization': `Bearer ${token}`
            }
        }).then(response => {
            if (response.ok) {
                setUser(null);
                setToken(null);
                window.location.href = '/';
                return;
            } else {
                response.json().then(error => {
                    console.error('Error deleting user: ' + error.message);
                });
            }
        });
    };

    //useEffect(() => fetchFavourites(), [user.favourites]);

    return (
        <Container>
            <Row>
                <Col>
                    <Form noValidate validated={newUsername.valid} onSubmit={(e) => {
                        e.preventDefault();
                        patchField('username', newUsername.value);
                        setNewUsername({value: newUsername.value, valid: false, errorMessage: ''});
                    }}>
                        <Form.Group as={Row} controlId="profile_username" className="d-flex align-items-center">
                            <Form.Label as={Col} xs="1">Username</Form.Label>
                            <Col xs="3">
                                <Form.Control
                                    type="text"
                                    placeholder={user.username}
                                    onChange={event => validateUsername(event.target.value)}
                                    isValid={newUsername.valid}
                                />
                            </Col>
                            <Col xs="1">
                                <Button variant={newUsername.valid ? 'success' : 'secondary'} type="submit" disabled={!newUsername.valid}><i className="bi bi-check"></i></Button>
                            </Col>
                        </Form.Group>
                        <Row>
                            <Form.Text as={Col} xs="12">{newUsername.errorMessage}</Form.Text>
                        </Row>
                    </Form>
                </Col>
            </Row>
            <Row>
                <Col>
                    <Form noValidate validated={newPassword.valid} onSubmit={(e) => {
                        e.preventDefault();
                        patchField('password', newPassword.value);
                        setNewPassword({value: '', valid: false, errorMessage: ''});
                    }}>
                        <Form.Group as={Row} controlId="profile_password" className="d-flex align-items-center">
                            <Form.Label as={Col} xs="1">Password</Form.Label>
                            <Col xs="3">
                                <Form.Control
                                    type="password"
                                    placeholder="New password"
                                    onChange={(event) => {
                                        validatePassword(event.target.value);
                                        console.log('event fired');
                                    }}
                                    isValid={newPassword.valid}
                                />
                            </Col>
                            <Col xs="1">
                                <Button variant={newPassword.valid ? 'success' : 'secondary'} type="submit" disabled={!newPassword.valid}><i className="bi bi-check"></i></Button>
                            </Col>
                        </Form.Group>
                        <Row>
                            <Form.Text as={Col} xs="12">{newPassword.errorMessage}</Form.Text>
                        </Row>
                    </Form>
                </Col>
            </Row>
            <Row>
                <Col>
                    <Form noValidate onSubmit={(e) => {
                        e.preventDefault();
                        patchField('email', newEmail.value);
                        setNewEmail({value: newEmail.value, valid: false, errorMessage: ''});
                    }}>
                        <Form.Group as={Row} controlId="profile_email" className="d-flex align-items-center">
                            <Form.Label as={Col} xs="1">Email</Form.Label>
                            <Col xs="3">
                                <Form.Control
                                    type="email"
                                    placeholder={user.email}
                                    onChange={(event) => validateEmail(event.target.value)}
                                    isValid={newEmail.valid}
                                />
                            </Col>
                            <Col xs="1">
                                <Button variant={newEmail.valid ? 'success' : 'secondary'} type="submit" disabled={!newEmail.valid}><i className="bi bi-check"></i></Button>
                            </Col>
                        </Form.Group>
                        <Row>
                            <Form.Text as={Col} xs="12">{newEmail.errorMessage}</Form.Text>
                        </Row>
                    </Form>
                </Col>
            </Row>
            <Row>
                <Col>
                    <Form noValidate onSubmit={(e) => {
                        e.preventDefault();
                        patchField('birthday', newBirthday.value);
                        setNewBirthday({value: newBirthday.value, valid: false, errorMessage: ''});
                    }}>
                        <Form.Group as={Row} controlId='profile_birthday' className="d-flex align-items-center">
                            <Form.Label as={Col} xs="1">Birthday</Form.Label>
                            <Col xs="3">
                                <Form.Control
                                    type="text"
                                    onFocus={(event) => event.target.type = 'date'}
                                    onBlur={(event) => event.target.type = 'text'}
                                    placeholder={user.birthday ? (new Date(user.birthday)).toLocaleDateString() : 'enter birthday'}
                                    onChange={(event) => validateBirthday(event.target.value)}
                                    isValid={newBirthday.valid}
                                />
                            </Col>
                            <Col xs="1">
                                <Button variant={newBirthday.valid ? 'success' : 'secondary'} type="submit" disabled={!newBirthday.valid}><i className="bi bi-check"></i></Button>
                            </Col>
                        </Form.Group>
                    </Form>
                </Col>
            </Row>
            <Row>
                <Col xs="12">
                    <h3>Favourites</h3>
                </Col>
                {
                    user.favourites ?
                        <Col>
                            <MovieList movies={user.favourites} />
                        </Col>
                        :
                        <Col>
                            <p>No favourites</p>
                        </Col>
                }
            </Row>
            <Row>
                <Col>
                    <Button variant="danger" onClick={deleteUser}>Delete account</Button>
                </Col>
            </Row>
        </Container>
    );
};