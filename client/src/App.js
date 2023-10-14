import React from "react";
import {BrowserRouter,Routes,Route} from "react-router-dom"
import Register from "./components/Register";
import Login from "./components/Login";
import WebCamp from "./components/WebCamp";
import Capture from "./components/Capture";
import DisplayData from "./components/DisplayData";

function App() {
  return (
    <div>
      <BrowserRouter>
        <Routes>
          <Route path='/' element={<Register/>}/>
          <Route path='/login' element={<Login/>}/>
          <Route path='/cam' element={<WebCamp/>}/>
          <Route path='/capture' element={<Capture/>}/>
          <Route path='/display/:email' element={<DisplayData/>}/>
        </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;

