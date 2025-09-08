import { BrowserRouter, Routes, Route } from "react-router-dom";
import Login from "./pages/01_Login";
import HomePage from "./home/HomePage";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<HomePage/>} />
        <Route path="/login" element={<Login/>} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;