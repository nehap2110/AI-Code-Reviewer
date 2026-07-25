import { Routes, Route } from "react-router-dom";
import Navbar from "./components/Navbar";
import Editor from "./pages/Editor";
import Login from "./pages/Login";
import Register from "./pages/Register";
import History from "./pages/History";
import ProtectedRoute from "./components/ProtectedRoute";

function App() {
  return (
    <>
      <Navbar />
      <Routes>
        <Route path="/" element={<Editor />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/history" element={<ProtectedRoute><History /></ProtectedRoute>} />
      </Routes>
    </>
  );
}

export default App;