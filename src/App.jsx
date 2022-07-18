import { Route, Routes, BrowserRouter } from "react-router-dom";
import { createContext } from "react";
import MainPage from "./MainPage";
import "./index.css";

export const AppContext = createContext();

const App = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/*" element={<MainPage />} />
        {/* <Redirect from="/" to="/home"></Redirect> */}
      </Routes>
    </BrowserRouter>
  );
};

export default App;
