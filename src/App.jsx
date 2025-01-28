import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Home from "./components/Home";
import Login from "./components/Login";
import Projects from "./components/Projects";
import Admin from "./components/Admin";

function App() {
  return (
    <Router>
      <Routes>
        {/* URL path "/" maps to Home component */}
        <Route path="/" element={<Home />} />
        
        {/* URL path "/login" maps to Login component */}
        <Route path="/login" element={<Login />} />
        
        {/* URL path "/projects" maps to Projects component */}
        <Route path="/projects" element={<Projects />} />

        {/* URL path "/admin" maps to Dashboard component */}
        <Route path="/admin" element={<Admin />} />
      </Routes>
    </Router>
  );
}

export default App;