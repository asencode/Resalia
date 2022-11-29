import axios from 'axios';
import React, { useContext, useEffect, useReducer, useState } from 'react';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Card from 'react-bootstrap/Card';
import Modal from 'react-bootstrap/Modal';
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';
import { Helmet } from 'react-helmet-async';
import { useNavigate, useParams } from 'react-router-dom';
import LoadingBox from '../components/LoadingBox';
import MessageBox from '../components/MessageBox';
import { Resalia } from '../Resalia';
import { BsPlus, BsShop } from 'react-icons/bs';
import { Link } from 'react-router-dom';
import { toast } from 'react-toastify';
import { getError } from '../utils';

const reducer = (state, action) => {
  switch (action.type) {
    case 'FETCH_REQUEST':
      return { ...state, loading: true };
    case 'FETCH_SUCCESS':
      return {
        ...state,
        carts: action.payload.carts,
        menus: action.payload.menus,
        loading: false,
      };
    case 'FETCH_FAIL':
      return { ...state, error: action.payload, loading: false };
    default:
      return state;
  }
};

export default function AdminShopCartsMenusScreen() {
  const navigate = useNavigate();
  const { state } = useContext(Resalia);
  const { userInfo } = state;
  const params = useParams();
  const { shop } = params;
  const [showNewCartModal, setShowCartModal] = useState(false);
  const [showNewMenuModal, setShowMenuModal] = useState(false);
  const [cartName, setCartName] = useState('');
  const [menuName, setMenuName] = useState('');

  const handleCloseNewCart = () => setShowCartModal(false);
  const handleCloseNewMenu = () => setShowMenuModal(false);
  const handleShowNewCart = () => setShowCartModal(true);
  const handleShowNewMenu = () => setShowMenuModal(true);

  const [{ carts, menus, loading, error }, dispatch] = useReducer(reducer, {
    carts: [],
    menus: [],
    loading: true,
    error: '',
  });

  useEffect(() => {
    if (!userInfo) {
      navigate('/signin');
    }
  }, [userInfo, navigate]);

  useEffect(() => {
    const fetchData = async () => {
      dispatch({ type: 'FETCH_REQUEST' });
      try {
        const result = await axios.get(`/api/shops/${shop}`);
        dispatch({ type: 'FETCH_SUCCESS', payload: result.data });
      } catch (err) {
        dispatch({ type: 'FETCH_FAIL', payload: err.message });
      }
    };
    fetchData();
  }, [shop]);

  const handleNewCart = (e) => {
    e.preventDefault();

    if (
      userInfo.isAdmin ||
      userInfo.plan === 'premium' ||
      carts?.length + menus?.length < 1
    ) {
      setCartName('');
      handleShowNewCart();
    } else {
      alert('paga');
    }
  };

  const handleNewMenu = (e) => {
    e.preventDefault();

    if (
      userInfo.isAdmin ||
      userInfo.plan === 'premium' ||
      carts?.length + menus?.length < 1
    ) {
      setMenuName('');
      handleShowNewMenu();
    } else {
      alert('paga');
    }
  };

  const newCartHandler = async (e) => {
    e.preventDefault();
    dispatch({ type: 'FETCH_REQUEST' });

    await axios
      .post(
        '/api/carts/createCart',
        { cartName, shop },
        { headers: { Authorization: `Bearer ${userInfo.token}` } }
      )
      .then((res) => {
        toast.success('¡Nueva carta creada!');
        handleCloseNewCart();
        dispatch({ type: 'FETCH_SUCCESS', payload: res.data });
      })
      .catch((err) => {
        dispatch({ type: 'FETCH_FAIL', payload: err.message });
        toast.error(getError(err));
      });
  };

  const newMenuHandler = async (e) => {
    e.preventDefault();
    dispatch({ type: 'FETCH_REQUEST' });

    await axios
      .post(
        '/api/menus/createMenu',
        { menuName, shop },
        { headers: { Authorization: `Bearer ${userInfo.token}` } }
      )
      .then((res) => {
        toast.success('¡Nuevo menú creado!');
        handleCloseNewMenu();
        dispatch({ type: 'FETCH_SUCCESS', payload: res.data });
      })
      .catch((err) => {
        dispatch({ type: 'FETCH_FAIL', payload: err.message });
        toast.error(getError(err));
      });
  };

  return (
    <>
      <div>
        <Helmet>
          <title>Resalia - Mis Cartas y Menús</title>
        </Helmet>
        <h1 className="mt-4 mb-5">Mis Cartas y Menús</h1>
        {loading ? (
          <LoadingBox />
        ) : error ? (
          <MessageBox variant="danger">{error}</MessageBox>
        ) : (
          <>
            <div className="dashboard-panel">
              <h4>Cartas</h4>
              <Row>
                {carts?.map((cart) => (
                  <Col
                    key={cart.slug}
                    md={4}
                    className="dashboard-element mb-4"
                  >
                    <Link to={`/admin/carts-menus/${shop}/cart/${cart.slug}`}>
                      <Card className="h-100">
                        <Card.Body className="text-center d-flex flex-column align-items-center">
                          <h5 className="mt-3 mb-3">{cart.name}</h5>
                          <BsShop size={30} className="mb-3 mt-auto" />
                        </Card.Body>
                      </Card>
                    </Link>
                  </Col>
                ))}

                <Col className="dashboard-element mb-4" md={4}>
                  <Link onClick={handleNewCart}>
                    <Card className="h-100">
                      <Card.Body className="text-center d-flex flex-column align-items-center">
                        <h5 className="mt-3 mb-3">Añadir Carta</h5>
                        <BsPlus size={30} className="mb-3 mt-auto" />
                      </Card.Body>
                    </Card>
                  </Link>
                </Col>
              </Row>
            </div>
            <div className="dashboard-panel">
              <h4>Menús</h4>
              <Row>
                {menus?.map((menu) => (
                  <Col
                    key={menu.slug}
                    className="dashboard-element mb-4"
                    md={4}
                  >
                    <Link to={`/admin/carts-menus/${shop}/menu/${menu.slug}`}>
                      <Card className="h-100">
                        <Card.Body className="text-center d-flex flex-column align-items-center">
                          <h5 className="mt-3 mb-3">{menu.name}</h5>
                          <BsShop size={30} className="mb-3 mt-auto" />
                        </Card.Body>
                      </Card>
                    </Link>
                  </Col>
                ))}
                <Col className="dashboard-element mb-4" md={4}>
                  <Link onClick={handleNewMenu}>
                    <Card className="h-100">
                      <Card.Body className="text-center d-flex flex-column align-items-center">
                        <h5 className="mt-3 mb-3">Añadir Menú</h5>
                        <BsPlus size={30} className="mb-3 mt-auto" />
                      </Card.Body>
                    </Card>
                  </Link>
                </Col>
              </Row>
            </div>
          </>
        )}
      </div>

      <Modal show={showNewCartModal} onHide={handleCloseNewCart}>
        <Modal.Header closeButton>
          <Modal.Title>Nueva Carta</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form onSubmit={newCartHandler}>
            <Form.Group className="mb-4" controlId="name">
              <Form.Label>Nombre de la carta</Form.Label>
              <Form.Control
                type="text"
                required
                value={cartName || ''}
                onChange={(e) => setCartName(e.target.value)}
              />
            </Form.Group>
            <Button variant="secondary" onClick={handleCloseNewCart}>
              Cancelar
            </Button>
            <Button type="submit" variant="primary">
              Aceptar
            </Button>
          </Form>
        </Modal.Body>
      </Modal>

      <Modal show={showNewMenuModal} onHide={handleCloseNewMenu}>
        <Modal.Header closeButton>
          <Modal.Title>Nuevo Menú</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form onSubmit={newMenuHandler}>
            <Form.Group className="mb-4" controlId="name">
              <Form.Label>Nombre del menú</Form.Label>
              <Form.Control
                type="text"
                required
                value={menuName || ''}
                onChange={(e) => setMenuName(e.target.value)}
              />
            </Form.Group>
            <Button variant="secondary" onClick={handleCloseNewMenu}>
              Cancelar
            </Button>
            <Button type="submit" variant="primary">
              Aceptar
            </Button>
          </Form>
        </Modal.Body>
      </Modal>
    </>
  );
}
