import logo from './logo.svg';
import './App.css';

import Login from './component/Login';
import Main from './component/Main';
import {Route,Routes} from "react-router-dom"

function App() {
  return (
    <div className="App">
      <Routes>
        <Route path="/login" element={<Login/>}/>
        <Route path="/*" element={<Main/>}/>
     
      </Routes>
    </div>
  );
}

export default App;
