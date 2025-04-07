// import React from "react";
// import HomePage from "./pages/HomePage";
// import LoginPage from "./pages/AuthinticationPage/LoginPage";
// import Register from "./pages/AuthinticationPage/RegisterPage";
// import MainPage from "./pages/PlanningPage/MainPage";
// import  HotelPage  from "./pages/Hotel/HotelPage";
// import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
// import MenuPage from "./pages/Hotel/MenuPage";
// import Navbar from "./components/Navbar";

// const App = () => {
//   return (
//     // <LoadScript googleMapsApiKey={googleApiKey} libraries={["places"]}>
//       <Router>
//         <Navbar/>
//         <Routes>
//           <Route path='/' element={<HomePage/>}/>
//           <Route path='/login' element={<LoginPage/>}/>
//           <Route path='/signup' element={<Register/>}/>
//           <Route path='/plan' element={<MainPage/>}/>
//           <Route path="hotels" element={<HotelPage/>}/>
//           <Route path="/menu/:id" element={<MenuPage />} />
//         </Routes>
//       </Router>
//     // </LoadScript>
//   );
// };

// export default App;



import React from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import Navbar from "./components/Navbar";
import HomePage from "./pages/HomePage";
import LoginPage from "./pages/AuthinticationPage/LoginPage";
import Register from "./pages/AuthinticationPage/RegisterPage";
import MainPage from "./pages/PlanningPage/MainPage";
import HotelPage from "./pages/Hotel/HotelPage";
import LoginAsAdmin from "./pages/AuthinticationPage/LoginAsAdmin";
import MenuPage from "./pages/Hotel/MenuPage";
import AdminMainPage from "./pages/AdminPage/AdminMainPage";
import BlogPage from "./pages/Blog/BlogPage";
import CreateBlogPage from "./pages/Blog/CreateBlogPage";
import AdventurePage from "./pages/AdventurePage/AdventurePage";


const App = () => {
  return (
    <Router>
      {/* Global Navbar appears on every page */}
      {/* <Navbar /> */}
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/signup" element={<Register />} />
        <Route path="/plan" element={<MainPage />} />
        <Route path="/hotels" element={<HotelPage />} />
        <Route path="/menu/:id" element={<MenuPage />} />
        <Route path="/loginAsAdmin" element={<LoginAsAdmin/>}/>
        <Route path="/admin" element={<AdminMainPage/>}/>
        <Route path="/blog" element={<BlogPage/>}/>
        <Route path="create-blog" element={<CreateBlogPage/>}/>
        <Route path="adventure" element={<AdventurePage/>} />
      </Routes>
    </Router>
  );
};
export default App;

