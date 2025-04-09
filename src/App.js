import React from "react";
import RegisterForm from "./components/register"; 
import LoginForm from "./components/login";
import PeopleList from "./components/people"; 
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<LoginForm />} />
        <Route path="/register" element={<RegisterForm />} />
        <Route path="/people" element={<PeopleList />} />
        {/* Diğer sayfaların route'ları */}
      </Routes>
    </Router>
  );
}

export default App;
