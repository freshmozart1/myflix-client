import { createRoot } from "react-dom/client";
import { MainView } from "./components/MainView/main-view";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import { StrictMode } from 'react';

import { MovieList } from "./components/MovieList/movie-list";
import { MovieView } from "./components/MovieView/movie-view";
import { SignupView } from "./components/SignupView/signup-view";
import { ProfileView } from "./components/ProfileView/profile-view";

import './index.scss';
import { LoginView } from "./components/LoginView/login-view";
import { AuthProvider } from "./components/AuthProvider/auth-provider";
import NewMovieView from "./components/CreateNewMovieView/create-new-movie-view";

const router = createBrowserRouter([
    {
        path: '/',
        element: <MainView />,
        children: [
            { index: true, element: <MovieList /> },
            { path: 'movies/:title', element: <MovieView /> },
            { path: 'login', element: <LoginView /> },
            { path: 'signup', element: <SignupView /> },
            { path: 'users/:username', element: <ProfileView /> }, //:username is not used in ProfileView
            { path: 'newmovie', element: <NewMovieView />}
        ]
    }
]);

createRoot(document.getElementById('root')).render(
    <StrictMode>
        <AuthProvider>
            <RouterProvider router={router} />
        </AuthProvider>
    </StrictMode>
);