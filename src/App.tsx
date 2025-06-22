import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { parseSubdomain } from './utils/subdomainParser';
import { SubdomainInfo } from './types';
import HomePage from './pages/HomePage';
import AboutPage from './pages/AboutPage';
import ContactPage from './pages/ContactPage';
import SitemapPage from './pages/SitemapPage';
import Layout from './components/Layout';

function App() {
  // Parse subdomain info once at app level
  const subdomainInfo: SubdomainInfo = parseSubdomain();

  return (
    <Router>
      <Layout subdomainInfo={subdomainInfo}>
        <Routes>
          <Route path="/" element={<HomePage subdomainInfo={subdomainInfo} />} />
          <Route path="/about" element={<AboutPage subdomainInfo={subdomainInfo} />} />
          <Route path="/contact" element={<ContactPage subdomainInfo={subdomainInfo} />} />
          <Route path="/sitemap-generator" element={<SitemapPage />} />
        </Routes>
      </Layout>
    </Router>
  );
}

export default App;