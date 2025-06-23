import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { DataProviderFactory } from './providers/DataProviderFactory';
import { parseSubdomain } from './utils/subdomainParser';
import { SubdomainInfo } from './types';
import HomePage from './pages/HomePage';
import AboutPage from './pages/AboutPage';
import ContactPage from './pages/ContactPage';
import SitemapPage from './pages/SitemapPage';
import AddBusinessPage from './pages/AddBusinessPage';
import Layout from './components/Layout';

function App() {
  // Configure the data provider factory
  React.useEffect(() => {
    DataProviderFactory.configure({
      type: 'json', // Use JSON provider by default
      // In production, you might configure:
      // type: 'api',
      // apiBaseUrl: 'https://api.near-me.us',
      // apiKey: process.env.REACT_APP_API_KEY,
      // timeout: 10000,
      // retryAttempts: 3
    });
  }, []);

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
          <Route path="/add-business" element={<AddBusinessPage subdomainInfo={subdomainInfo} />} />
        </Routes>
      </Layout>
    </Router>
  );
}

export default App;