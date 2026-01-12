import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { CartProvider } from './contexts/CartContext';
import { UserProvider } from './contexts/UserContext';
import { AnnouncementProvider } from './contexts/AnnouncementContext';
import { useAnnouncement } from './contexts/announcement.core';
import Header from './components/Header/Header';
import Footer from './components/Footer/Footer';
import ScrollToTop from './components/ScrollToTop/ScrollToTop';
import HomePage from './pages/HomePage/HomePage';
import ProductsPage from './pages/ProductsPage/ProductsPage';
import ProductDetailPage from './pages/ProductDetailPage/ProductDetailPage';
import CheckoutPage from './pages/CheckoutPage/CheckoutPage';
import BlogPage from './pages/BlogPage/BlogPage';
import BlogDetailPage from './pages/BlogDetailPage/BlogDetailPage';
import LoginPage from './pages/LoginPage/LoginPage';
import SignupPage from './pages/SignupPage/SignupPage';
// Legal pages
import TermsOfService from './pages/Legal/TermsOfService';
import PrivacyPolicy from './pages/Legal/PrivacyPolicy';
import CookiePolicy from './pages/Legal/CookiePolicy';
import DoNotSellMyInfo from './pages/Legal/DoNotSellMyInfo';
import CAPrivacyRights from './pages/Legal/CAPrivacyRights';
import YourPrivacyChoices from './pages/Legal/YourPrivacyChoices';
import AccessibilityStatement from './pages/Legal/AccessibilityStatement';
import CASupplyChainAct from './pages/Legal/CASupplyChainAct';
import { ROUTES } from './constants';
import './App.css';

function App() {
  return (
    <CartProvider>
      <UserProvider>
        <AnnouncementProvider>
          <Router basename={import.meta.env.BASE_URL}>
            <ScrollToTop />
            <div className="app">
              <LiveRegion />
              <Header />
              <main className="main-content">
                <Routes>
                  <Route path={ROUTES.HOME} element={<HomePage />} />
                  <Route path="/product" element={<Navigate to={ROUTES.PRODUCTS} replace />} />
                  <Route path={ROUTES.PRODUCTS} element={<ProductsPage />} />
                  <Route path={ROUTES.PRODUCT_DETAIL} element={<ProductDetailPage />} />
                  <Route path={ROUTES.CHECKOUT} element={<CheckoutPage />} />
                  <Route path={ROUTES.BLOG} element={<BlogPage />} />
                  <Route path="/blog/:slug" element={<BlogDetailPage />} />
                  <Route path={ROUTES.LOGIN} element={<LoginPage />} />
                  <Route path={ROUTES.SIGNUP} element={<SignupPage />} />
                  {/* Legal pages */}
                  <Route path={ROUTES.TERMS_OF_SERVICE} element={<TermsOfService />} />
                  <Route path={ROUTES.PRIVACY_POLICY} element={<PrivacyPolicy />} />
                  <Route path={ROUTES.COOKIE_POLICY} element={<CookiePolicy />} />
                  <Route path={ROUTES.DO_NOT_SELL} element={<DoNotSellMyInfo />} />
                  <Route path={ROUTES.CA_PRIVACY_RIGHTS} element={<CAPrivacyRights />} />
                  <Route path={ROUTES.YOUR_PRIVACY_CHOICES} element={<YourPrivacyChoices />} />
                  <Route path={ROUTES.ACCESSIBILITY} element={<AccessibilityStatement />} />
                  <Route path={ROUTES.CA_SUPPLY_CHAIN_ACT} element={<CASupplyChainAct />} />
                </Routes>
              </main>
              <Footer />
            </div>
          </Router>
        </AnnouncementProvider>
      </UserProvider>
    </CartProvider>
  );
}

function LiveRegion() {
  const { message } = useAnnouncement();
  return (
    <div role="status" aria-live="polite" aria-atomic="true" className="sr-only live-region">
      {message}
    </div>
  );
}

export default App;
