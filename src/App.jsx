import { BrowserRouter, Routes, Route } from "react-router-dom";
import Login from "./assets/Page/Login";
import SignUp from "./assets/Page/SignUp";
import Dashboard from "./assets/Page/Dashboard";
import PrivateRoute from "./assets/Page/PrivateRoute";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/signup" element={<SignUp />} />
        <Route
          path="/dashboard"
          element={
            <PrivateRoute>
              <Dashboard />
            </PrivateRoute>
          }
        />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
