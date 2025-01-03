"use client";

import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Home from "../../components/Home/Home";
import ReadMuse from "../../components/ReadMuse/ReadMuse";
import Registration from "../../components/Registration/Registration";
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
          <Route path="/register" element={<Registration />} />
          <Route path="/read-muse" element={<ReadMuse />} />
          <Route path="/match" element={<MatchList />} />
        </Routes>
      </Router>
    </AuthProvider>
  );
};

export default AppRouter;
