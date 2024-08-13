import { createRoot } from "react-dom/client";
import { MainView } from "./components/MainView/main-view";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import { StrictMode } from 'react';
import { MovieList } from "./components/MovieList/movie-list";

import './index.scss';

/*const MyFlixApplication = () => {
    return (
        <MainView />
    );
};

createRoot(document.querySelector('#root')).render(<MyFlixApplication />);*/

const router = createBrowserRouter([
    {
        path: '/',
        element: <MainView />,
        children: [
            { index: true, element: <MovieList /> }
        ]
    }
]);

createRoot(document.getElementById('root')).render(
    <StrictMode>
        <RouterProvider router={router} />
    </StrictMode>
);