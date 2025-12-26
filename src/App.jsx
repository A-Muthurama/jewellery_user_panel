import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Header from './components/Header';
import Footer from './components/Footer';
import Newsletter from './components/Newsletter';
import ScrollToTop from './components/ScrollToTop';
import Home from "./pages/Home";
import Offers from "./pages/Offers";
import OfferDetails from "./pages/OfferDetails";
import Privacy from "./pages/Privacy";
import Terms from "./pages/Terms";

const App = () => {
  return (
    <Router>
      <div className="app-layout">
        <Header />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/offers" element={<Offers />} />
          <Route path="/offer/:id" element={<OfferDetails />} />
          <Route path="/privacy" element={<Privacy />} />
          <Route path="/terms" element={<Terms />} />
        </Routes>
        <Newsletter />
        <Footer />
        <ScrollToTop />
      </div>
    </Router>
  );
}

export default App;
