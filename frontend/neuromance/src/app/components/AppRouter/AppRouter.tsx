"use client";

import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import ReadMuse from "../ReadMuse/ReadMuse";
import Registration from "../Registration/Registration";
import MatchList from "../MatchList/MatchList";
import { AuthProvider } from "../AuthContext/AuthContext";

const AppRouter = () => {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          <Route path="/" element={<Registration />} />
          <Route path="/read-muse" element={<ReadMuse />} />
          <Route path="/match" element={<MatchList />} />
        </Routes>
      </Router>
    </AuthProvider>
  );
};

export default AppRouter;
