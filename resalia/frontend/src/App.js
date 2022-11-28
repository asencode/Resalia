import { BrowserRouter, Routes, Route, Link } from 'react-router-dom';

import AdminDashboardScreen from './screens/AdminDashboardScreen';
import AdminPersonalInfoScreen from './screens/AdminPersonalInfoScreen';
import AdminShopsScreen from './screens/AdminShopsScreen';
import AdminCreateShopScreen from './screens/AdminCreateShopScreen';
import AdminCartsMenusScreen from './screens/AdminCartsMenusScreen';
import AdminStatsScreen from './screens/AdminStatsScreen';
import AdminPaymentsScreen from './screens/AdminPaymentsScreen';
import AdminShopScreen from './screens/AdminShopScreen';
import CartScreen from './screens/CartScreen';
import HomeScreen from './screens/HomeScreen';
import MenuScreen from './screens/MenuScreen';
import ShopScreen from './screens/ShopScreen';
import ShopsScreen from './screens/ShopsScreen';
import SigninScreen from './screens/SigninScreen';
import SignupScreen from './screens/SignupScreen';

import Navbar from 'react-bootstrap/Navbar';
import Container from 'react-bootstrap/Container';
import Nav from 'react-bootstrap/Nav';
import NavDropdown from 'react-bootstrap/NavDropdown';
import { LinkContainer } from 'react-router-bootstrap';
import { useContext } from 'react';
import { Resalia } from './Resalia';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import CartItemScreen from './screens/CartItemScreen';
import MenuItemScreen from './screens/MenuItemScreen';

function App() {
  const { state, dispatch: ctxDispatch } = useContext(Resalia);
  const { userInfo } = state;

  const logoutHandler = () => {
    ctxDispatch({ type: 'USER_LOGOUT' });
    localStorage.removeItem('userInfo');
    window.location.href = '/signin';
  };

  return (
    <BrowserRouter>
      <div>
        <ToastContainer position="bottom-center" limit={1} />
        <header>
          <Navbar variant="dark" bg="dark" expand="lg">
            <Container>
              <LinkContainer to="/">
                <Navbar.Brand>Resalia</Navbar.Brand>
              </LinkContainer>

              <Navbar.Toggle aria-controls="basic-navbar-nav" />
              <Navbar.Collapse id="basic-navbar-nav">
                <Nav className="me-auto w-100 justify-content-end">
                  {userInfo ? (
                    <NavDropdown title={userInfo.name} id="basic-nav-dropdown">
                      <LinkContainer to="/admin/dashboard">
                        <NavDropdown.Item>Mi Cuenta</NavDropdown.Item>
                      </LinkContainer>
                      <LinkContainer to="/shops">
                        <NavDropdown.Item>Mis Tiendas</NavDropdown.Item>
                      </LinkContainer>
                      <NavDropdown.Divider />
                      <Link
                        className="dropdown-item"
                        to="#logout"
                        onClick={logoutHandler}
                      >
                        Cerrar Sesión
                      </Link>
                    </NavDropdown>
                  ) : (
                    <Link to="/signin" className="nav-link">
                      Iniciar Sesión
                    </Link>
                  )}
                </Nav>
              </Navbar.Collapse>
            </Container>
          </Navbar>
        </header>
        <main>
          <Container className="mt-3">
            <Routes>
              <Route
                path="/shops/:shop/cart/:cart/:slug"
                element={<CartItemScreen />}
              />
              <Route
                path="/shops/:shop/menu/:menu/:slug"
                element={<MenuItemScreen />}
              />
              <Route path="/shops/:shop/menus/:slug" element={<MenuScreen />} />
              <Route path="/shops/:shop/carts/:slug" element={<CartScreen />} />
              <Route path="/shops/:slug" element={<ShopScreen />} />
              <Route path="/shops" element={<ShopsScreen />} />
              <Route path="/signin" element={<SigninScreen />} />
              <Route path="/signup" element={<SignupScreen />} />
              <Route
                path="/admin/dashboard"
                element={<AdminDashboardScreen />}
              />
              <Route
                path="/admin/personal-info"
                element={<AdminPersonalInfoScreen />}
              />
              <Route path="/admin/shops" element={<AdminShopsScreen />} />
              <Route
                path="/admin/shops/create"
                element={<AdminCreateShopScreen />}
              />
              <Route path="/admin/shops/:slug" element={<AdminShopScreen />} />
              <Route
                path="/admin/carts-menus"
                element={<AdminCartsMenusScreen />}
              />
              <Route path="/admin/stats" element={<AdminStatsScreen />} />
              <Route path="/admin/payments" element={<AdminPaymentsScreen />} />
              <Route path="/" element={<HomeScreen />} />
            </Routes>
          </Container>
        </main>
        <footer>
          <div className="text-center">All rights reserved</div>
        </footer>
      </div>
    </BrowserRouter>
  );
}

export default App;
