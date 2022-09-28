import { BrowserRouter, Routes, Route, Link } from 'react-router-dom';
import AdminDashboardScreen from './screens/AdminDashboardScreen';
import CartScreen from './screens/CartScreen';
import HomeScreen from './screens/HomeScreen';
import MenuScreen from './screens/MenuScreen';
import ProductScreen from './screens/ProductScreen';
import RestaurantScreen from './screens/RestaurantScreen';
import ShopsScreen from './screens/ShopsScreen';
import SigninScreen from './screens/SigninScreen';
import SignupScreen from './screens/SignupScreen';

function App() {
  return (
    <BrowserRouter>
      <div>
        <header>
          <Link to="/">Resalia</Link>
          <Link to="/signin">Iniciar Sesión</Link>
        </header>
        <main>
          <Routes>
            <Route path="/product/:slug" element={<ProductScreen />} />

            <Route path="/shops/:slug/menu" element={<MenuScreen />} />
            <Route path="/shops/:slug/cart" element={<CartScreen />} />
            <Route path="/shops/:slug" element={<RestaurantScreen />} />
            <Route path="/shops" element={<ShopsScreen />} />
            <Route path="/signin" element={<SigninScreen />} />
            <Route path="/signup" element={<SignupScreen />} />
            <Route path="/admin/dashboard" element={<AdminDashboardScreen />} />
            <Route path="/" element={<HomeScreen />} />
          </Routes>
        </main>
      </div>
    </BrowserRouter>
  );
}

export default App;
