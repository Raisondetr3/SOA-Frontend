import { Route, Routes } from 'react-router-dom';
import PersonManagementPage from './pages/PersonManagementPage.jsx';
import NotFound from './pages/NotFound';
import { ToastContainer } from './components/Toast/Toast';
import './App.css';

const App = () => {
    return (
        <div className="app-container">
            <Routes>
                <Route path="/" element={<PersonManagementPage/>}/>
                <Route path="*" element={<NotFound/>}/>
            </Routes>
            <ToastContainer/>
        </div>
    );
};

export default App;