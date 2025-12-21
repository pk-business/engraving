import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
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
import LoginPage from './pages/LoginPage/LoginPage';
import SignupPage from './pages/SignupPage/SignupPage';
import { ROUTES } from './constants';
import './App.css';

function App() {
  return (
    <CartProvider>
      <UserProvider>
        <AnnouncementProvider>
          <Router>
            <ScrollToTop />
            <div className="app">
              <LiveRegion />
              <Header />
              <main className="main-content">
                <Routes>
                  <Route path={ROUTES.HOME} element={<HomePage />} />
                  <Route path={ROUTES.PRODUCTS} element={<ProductsPage />} />
                  <Route path={ROUTES.PRODUCT_DETAIL} element={<ProductDetailPage />} />
                  <Route path={ROUTES.CHECKOUT} element={<CheckoutPage />} />
                  <Route path={ROUTES.BLOG} element={<BlogPage />} />
                  <Route path={ROUTES.LOGIN} element={<LoginPage />} />
                  <Route path={ROUTES.SIGNUP} element={<SignupPage />} />
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
    <div
      role="status"
      aria-live="polite"
      aria-atomic="true"
      className="sr-only live-region"
    >
      {message}
    </div>
  );
}

export default App;
