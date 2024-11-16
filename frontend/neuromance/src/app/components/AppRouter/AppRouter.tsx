"use client";

import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import ReadMuse from "../ReadMuse/ReadMuse";
import Registration from "../Registration/Registration";

const AppRouter = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Registration />} />
        <Route path="/read-muse" element={<ReadMuse />} />
      </Routes>
    </Router>
  );
};

export default AppRouter;
