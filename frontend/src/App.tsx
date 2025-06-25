import { Route, Routes } from "react-router-dom";
import Images from "./pages/Images";
import Signup from "./pages/Signup";
import Signin from "./pages/Signin";
import Upload from "./pages/Upload";
import View from "./pages/View";
import Home from "./pages/Home";
import Payment from "./pages/Payment";

function App() {
  return (
    <>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/images" element={<Images />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/signin" element={<Signin />} />
        <Route path="/upload" element={<Upload />} />
        <Route path="/view" element={<View />} />
        <Route path="/pay" element={<Payment />} />
      </Routes>
    </>
  );
}

export default App;
