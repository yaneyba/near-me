import React, { useState } from 'react';
import { SubdomainInfo } from '@/types';
import { Code, Database, Globe, Layers, Zap } from 'lucide-react';
import SmartDoorFlowDiagram from '@/components/shared/ui/SmartDoorFlowDiagram';

interface ArchitecturePageProps {
  subdomainInfo: SubdomainInfo;
}

const ArchitecturePage: React.FC<ArchitecturePageProps> = ({ subdomainInfo }) => {
  const [activeSection, setActiveSection] = useState<string>('overview');

  const sections = [
    { id: 'overview', title: 'System Overview', icon: Layers },
    { id: 'smart-door', title: 'Smart Door Routing', icon: Globe },
    { id: 'data-flow', title: 'Data Architecture', icon: Database },
    { id: 'scaling', title: 'Scaling Strategy', icon: Zap },
    { id: 'tech-stack', title: 'Technology Stack', icon: Code }
  ];

  const techStack = [
    { name: 'Frontend', tech: 'React + TypeScript + Vite', description: 'Modern, fast development with type safety' },
    { name: 'Styling', tech: 'Tailwind CSS', description: 'Utility-first CSS framework for rapid UI development' },
    { name: 'Routing', tech: 'React Router v6', description: 'Client-side routing with subdomain intelligence' },
    { name: 'Database', tech: 'Cloudflare D1 (SQLite)', description: 'Edge-distributed database for low latency' },
    { name: 'API Layer', tech: 'Cloudflare Functions', description: 'Serverless functions at the edge' },
    { name: 'Hosting', tech: 'Cloudflare Pages', description: 'Global CDN with automatic deployments' },
    { name: 'Analytics', tech: 'Custom tracking', description: 'Business engagement and performance metrics' }
  ];

  const architecturalPrinciples = [
    {
      title: 'Subdomain Intelligence',
      description: 'Each subdomain (water-refill.near-me.us, nail-salons.chicago.near-me.us) routes to specialized experiences',
      benefits: ['SEO optimization', 'User-focused navigation', 'Clean URL structure']
    },
    {
      title: 'Edge-First Architecture',
      description: 'Data and compute distributed globally via Cloudflare\'s edge network',
      benefits: ['Sub-100ms response times', 'Global availability', 'Automatic scaling']
    },
    {
      title: 'Component Worlds',
      description: 'Self-contained routing universes (WaterRefillWorld, BusinessWorld, ServicesWorld)',
      benefits: ['Code isolation', 'Independent deployments', 'Easier maintenance']
    },
    {
      title: 'Data Provider Pattern',
      description: 'Abstracted data layer that can switch between local/remote/cached sources',
      benefits: ['Environment flexibility', 'Testing isolation', 'Performance optimization']
    }
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-indigo-600 via-purple-600 to-blue-700 text-white py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h1 className="text-4xl md:text-6xl font-bold mb-6">
              Near Me Architecture
            </h1>
            <p className="text-xl md:text-2xl mb-8 text-blue-100">
              Explore the technical architecture powering our intelligent local business platform
            </p>
            <div className="flex justify-center space-x-4">
              <div className="bg-white/20 rounded-lg px-4 py-2">
                <span className="text-sm font-medium">Subdomain: {subdomainInfo.category}</span>
              </div>
              <div className="bg-white/20 rounded-lg px-4 py-2">
                <span className="text-sm font-medium">City: {subdomainInfo.city || 'All'}</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Navigation Tabs */}
      <section className="bg-white border-b sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <nav className="flex space-x-8 overflow-x-auto">
            {sections.map((section) => {
              const Icon = section.icon;
              return (
                <button
                  key={section.id}
                  onClick={() => setActiveSection(section.id)}
                  className={`flex items-center space-x-2 py-4 px-2 border-b-2 font-medium text-sm whitespace-nowrap transition-colors ${
                    activeSection === section.id
                      ? 'border-indigo-500 text-indigo-600'
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  <span>{section.title}</span>
                </button>
              );
            })}
          </nav>
        </div>
      </section>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Overview Section */}
        {activeSection === 'overview' && (
          <div className="space-y-12">
            <div className="text-center">
              <h2 className="text-3xl font-bold text-gray-900 mb-4">System Overview</h2>
              <p className="text-xl text-gray-600 max-w-3xl mx-auto">
                Near Me is built as a scalable, edge-first platform that intelligently routes users 
                to specialized experiences based on their subdomain and location.
              </p>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
              {architecturalPrinciples.map((principle, index) => (
                <div key={index} className="bg-white rounded-lg shadow-md p-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-3">
                    {principle.title}
                  </h3>
                  <p className="text-gray-600 mb-4 text-sm">
                    {principle.description}
                  </p>
                  <ul className="space-y-1">
                    {principle.benefits.map((benefit, i) => (
                      <li key={i} className="text-xs text-indigo-600 flex items-center">
                        <div className="w-1 h-1 bg-indigo-600 rounded-full mr-2"></div>
                        {benefit}
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>

            {/* Quick Stats */}
            <div className="bg-gradient-to-r from-indigo-50 to-purple-50 rounded-lg p-8">
              <h3 className="text-2xl font-bold text-gray-900 mb-6 text-center">Platform Statistics</h3>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
                <div>
                  <div className="text-3xl font-bold text-indigo-600">3</div>
                  <div className="text-sm text-gray-600">Component Worlds</div>
                </div>
                <div>
                  <div className="text-3xl font-bold text-indigo-600">∞</div>
                  <div className="text-sm text-gray-600">Subdomain Combinations</div>
                </div>
                <div>
                  <div className="text-3xl font-bold text-indigo-600">&lt;100ms</div>
                  <div className="text-sm text-gray-600">Edge Response Time</div>
                </div>
                <div>
                  <div className="text-3xl font-bold text-indigo-600">99.9%</div>
                  <div className="text-sm text-gray-600">Uptime (Cloudflare)</div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Smart Door Section */}
        {activeSection === 'smart-door' && (
          <div className="space-y-12">
            <div className="text-center">
              <h2 className="text-3xl font-bold text-gray-900 mb-4">Smart Door Routing System</h2>
              <p className="text-xl text-gray-600 max-w-3xl mx-auto">
                Our intelligent routing system analyzes incoming URLs and directs users to the 
                appropriate "world" based on subdomain patterns and business logic.
              </p>
            </div>

            {/* Flow Diagram */}
            <div className="bg-white rounded-lg shadow-lg p-8">
              <SmartDoorFlowDiagram />
            </div>

            {/* Routing Examples */}
            <div className="bg-white rounded-lg shadow-md p-8">
              <h3 className="text-2xl font-bold text-gray-900 mb-6">Routing Examples</h3>
              <div className="space-y-4">
                <div className="border-l-4 border-blue-500 pl-4">
                  <code className="text-sm bg-gray-100 px-2 py-1 rounded">water-refill.near-me.us</code>
                  <p className="text-gray-600 mt-1">→ WaterRefillWorld (Special service with custom experience)</p>
                </div>
                <div className="border-l-4 border-green-500 pl-4">
                  <code className="text-sm bg-gray-100 px-2 py-1 rounded">nail-salons.chicago.near-me.us</code>
                  <p className="text-gray-600 mt-1">→ BusinessWorld (Category + City specific)</p>
                </div>
                <div className="border-l-4 border-purple-500 pl-4">
                  <code className="text-sm bg-gray-100 px-2 py-1 rounded">services.near-me.us</code>
                  <p className="text-gray-600 mt-1">→ ServicesWorld (General services directory)</p>
                </div>
                <div className="border-l-4 border-orange-500 pl-4">
                  <code className="text-sm bg-gray-100 px-2 py-1 rounded">near-me.us</code>
                  <p className="text-gray-600 mt-1">→ ServicesWorld (Default fallback)</p>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Data Flow Section */}
        {activeSection === 'data-flow' && (
          <div className="space-y-12">
            <div className="text-center">
              <h2 className="text-3xl font-bold text-gray-900 mb-4">Data Architecture</h2>
              <p className="text-xl text-gray-600 max-w-3xl mx-auto">
                Our data layer is designed for flexibility, performance, and scalability across 
                development, staging, and production environments.
              </p>
            </div>

            <div className="grid lg:grid-cols-2 gap-8">
              {/* Data Provider Pattern */}
              <div className="bg-white rounded-lg shadow-md p-6">
                <h3 className="text-xl font-semibold text-gray-900 mb-4">Data Provider Pattern</h3>
                <div className="space-y-3">
                  <div className="bg-blue-50 p-3 rounded">
                    <strong className="text-blue-900">LocalDataProvider</strong>
                    <p className="text-blue-700 text-sm">Development: Fast, file-based data for rapid iteration</p>
                  </div>
                  <div className="bg-green-50 p-3 rounded">
                    <strong className="text-green-900">CloudflareDataProvider</strong>
                    <p className="text-green-700 text-sm">Production: D1 database with global edge distribution</p>
                  </div>
                  <div className="bg-purple-50 p-3 rounded">
                    <strong className="text-purple-900">CachedDataProvider</strong>
                    <p className="text-purple-700 text-sm">Optimization: In-memory caching layer</p>
                  </div>
                </div>
              </div>

              {/* Database Schema */}
              <div className="bg-white rounded-lg shadow-md p-6">
                <h3 className="text-xl font-semibold text-gray-900 mb-4">Database Schema</h3>
                <div className="space-y-3 text-sm">
                  <div>
                    <strong>businesses</strong> - Core business directory
                    <div className="text-gray-600 ml-2">id, name, category, city, state, address, etc.</div>
                  </div>
                  <div>
                    <strong>categories</strong> - Service categories
                    <div className="text-gray-600 ml-2">slug, name, description, icon</div>
                  </div>
                  <div>
                    <strong>cities</strong> - Geographic data
                    <div className="text-gray-600 ml-2">name, slug, state, coordinates</div>
                  </div>
                  <div>
                    <strong>engagements</strong> - User interactions
                    <div className="text-gray-600 ml-2">business_id, type, timestamp, metadata</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Scaling Section */}
        {activeSection === 'scaling' && (
          <div className="space-y-12">
            <div className="text-center">
              <h2 className="text-3xl font-bold text-gray-900 mb-4">Scaling Strategy</h2>
              <p className="text-xl text-gray-600 max-w-3xl mx-auto">
                Built for global scale using Cloudflare's edge network and modern architectural patterns.
              </p>
            </div>

            <div className="grid md:grid-cols-3 gap-8">
              <div className="bg-white rounded-lg shadow-md p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-3">Horizontal Scaling</h3>
                <ul className="space-y-2 text-sm text-gray-600">
                  <li>• Edge functions auto-scale globally</li>
                  <li>• Static assets cached worldwide</li>
                  <li>• Database replicated to 300+ locations</li>
                  <li>• Zero-downtime deployments</li>
                </ul>
              </div>

              <div className="bg-white rounded-lg shadow-md p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-3">Performance Optimization</h3>
                <ul className="space-y-2 text-sm text-gray-600">
                  <li>• Component-level code splitting</li>
                  <li>• Intelligent data prefetching</li>
                  <li>• Image optimization & CDN</li>
                  <li>• Service worker caching</li>
                </ul>
              </div>

              <div className="bg-white rounded-lg shadow-md p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-3">Monitoring & Analytics</h3>
                <ul className="space-y-2 text-sm text-gray-600">
                  <li>• Real-time error tracking</li>
                  <li>• Performance metrics</li>
                  <li>• Business engagement analytics</li>
                  <li>• Custom dashboard insights</li>
                </ul>
              </div>
            </div>
          </div>
        )}

        {/* Tech Stack Section */}
        {activeSection === 'tech-stack' && (
          <div className="space-y-12">
            <div className="text-center">
              <h2 className="text-3xl font-bold text-gray-900 mb-4">Technology Stack</h2>
              <p className="text-xl text-gray-600 max-w-3xl mx-auto">
                Modern, battle-tested technologies chosen for performance, developer experience, and scalability.
              </p>
            </div>

            <div className="grid gap-6">
              {techStack.map((item, index) => (
                <div key={index} className="bg-white rounded-lg shadow-md p-6 flex items-start space-x-4">
                  <div className="bg-indigo-100 rounded-lg p-3">
                    <Code className="w-6 h-6 text-indigo-600" />
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center justify-between mb-2">
                      <h3 className="text-lg font-semibold text-gray-900">{item.name}</h3>
                      <span className="text-sm font-medium text-indigo-600 bg-indigo-50 px-2 py-1 rounded">
                        {item.tech}
                      </span>
                    </div>
                    <p className="text-gray-600">{item.description}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* CTA Section */}
      <section className="bg-indigo-600 text-white py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-bold mb-4">Ready to Explore?</h2>
          <p className="text-xl text-indigo-100 mb-8">
            Dive into our platform and see the architecture in action
          </p>
          <div className="flex justify-center space-x-4">
            <a
              href="/"
              className="bg-white text-indigo-600 px-6 py-3 rounded-lg font-semibold hover:bg-gray-100 transition-colors"
            >
              Go to Services
            </a>
            <a
              href="https://water-refill.near-me.us"
              className="bg-indigo-700 text-white px-6 py-3 rounded-lg font-semibold hover:bg-indigo-800 transition-colors"
            >
              Try Water Refill
            </a>
          </div>
        </div>
      </section>
    </div>
  );
};

export default ArchitecturePage;
