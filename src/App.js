// App.js

import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Auth from './pages/Auth/Auth';
import HomeScreen from './pages/HomeScreen/HomeScreen';
import './App.css';

function App() {

  return (
    <Router>
      <Routes>
        <Route exact path='/' element={<Auth />} />
        <Route
          path='/home'
          element={<HomeScreen />}
        />
      </Routes>
    </Router>
  );
}

export default App;
