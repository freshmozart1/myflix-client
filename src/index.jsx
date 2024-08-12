import { createRoot } from "react-dom/client";
import { MainView } from "./components/MainView/main-view";
import './index.scss';

const MyFlixApplication = () => {
    return (
        <MainView />
    );
};

createRoot(document.querySelector('#root')).render(<MyFlixApplication />);