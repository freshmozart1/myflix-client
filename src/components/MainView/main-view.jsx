import { Outlet } from 'react-router-dom';
import { AuthContext } from "../AuthProvider/auth-provider";
import Container from 'react-bootstrap/Container';
import { Col, Row } from 'react-bootstrap';
import Nav from 'react-bootstrap/Nav';
import Navbar from 'react-bootstrap/Navbar';
import { useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import './main-view.scss';


export const MainView = () => {
    const { user, setUser, setToken } = useContext(AuthContext);
    const navigate = useNavigate();
    return (
        <Container>
            <Row>
                <Col xs={12}>
                <Navbar expand="lg" className="bg-body-tertiary">
                        <Container>
                            <Navbar.Brand>myFlix</Navbar.Brand>
                            <Navbar.Toggle aria-controls="basic-navbar-nav" />
                            <Navbar.Collapse id="basic-navbar-nav">
                                <Nav className="me-auto">
                                    <Nav.Link href="/">Movies</Nav.Link>
                                    {user ?
                                        <>
                                            <Nav.Link href={'/users/' + user.username}>{user.username}</Nav.Link>
                                            <Nav.Link onClick={(event) => {
                                                event.preventDefault();
                                                setUser(null);
                                                setToken(null);
                                                navigate('/');
                                            }}>Logout</Nav.Link>
                                        </>
                                        :
                                        <>
                                            <Nav.Link href="/login">Login</Nav.Link>
                                            <Nav.Link href="/signup">Signup</Nav.Link>
                                        </>
                                    }
                                </Nav>
                            </Navbar.Collapse>
                        </Container>
                    </Navbar>
                </Col>
                <Col xs={12}>
                    <Outlet />
                </Col>
            </Row>
        </Container>
    );
};