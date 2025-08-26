import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Login from "./assets/Page/Login";
import SignUp from "./assets/Page/SignUp";


function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/signup" element={<SignUp />} />
      </Routes>
    </Router>
  );
}

export default App;
