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
import Regulation from "./pages/Regulation";
import TrendingNews from "./pages/TrendingNews";
import About from "./pages/About";
import LiveRatesBar from "./components/LiveRatesBar";

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
          <Route path="/regulation" element={<Regulation />} />
          <Route path="/trendingnews" element={<TrendingNews />} />
          <Route path="/about" element={<About />} />
        </Routes>
        <Newsletter />
        <Footer />
        <ScrollToTop />
      </div>
    </Router>
  );
}

export default App;
