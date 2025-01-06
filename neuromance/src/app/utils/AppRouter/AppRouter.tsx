"use client";

import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Home from "../../components/Home/Home";
import ReadMuse from "../../components/ReadMuse/ReadMuse";
import SignUp from "../../components/Registration/SignUp";
import Login from "../../components/Registration/LogIn";
import MatchList from "../../components/MatchList/MatchList";
import { AuthProvider } from "../AuthContext/AuthContext";
import Navbar from "@/app/components/NavBar/NavBar";

const AppRouter = () => {
  return (
    <AuthProvider>
      <Router>
        <Navbar />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/sign-up" element={<SignUp />} />
          <Route path="/login" element={<Login />} />
          <Route path="/read-muse" element={<ReadMuse />} />
          <Route path="/match" element={<MatchList />} />
        </Routes>
      </Router>
    </AuthProvider>
  );
};

export default AppRouter;
