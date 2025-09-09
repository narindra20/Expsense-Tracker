import { BrowserRouter, Routes, Route } from "react-router-dom";
import Login from "./assets/Authentification/Login";
import SignUp from "./assets/Authentification/SignUp";
import PrivateRoute from "./assets/Authentification/PrivateRoute";
import ExpenseTracker from "./assets/Expense/ExpenseTracker";

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
              <ExpenseTracker />
            </PrivateRoute>
          }
        />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
