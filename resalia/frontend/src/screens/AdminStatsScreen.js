import axios from 'axios';
import React, { useContext, useEffect, useReducer } from 'react';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Card from 'react-bootstrap/Card';
import { Helmet } from 'react-helmet-async';
import { useNavigate } from 'react-router-dom';
import { useSpring, animated } from 'react-spring';
import LoadingBox from '../components/LoadingBox';
import MessageBox from '../components/MessageBox';
import { Resalia } from '../Resalia';
import { BsShop } from 'react-icons/bs';

function Number({ n }) {
  const { number } = useSpring({
    from: { number: 0 },
    number: n,
    delay: 200,
    config: { mass: 1, tension: 20, friction: 10 },
  });
  return (
    <animated.div className="mb-3">
      {number.to((n) => n.toFixed(0))}
    </animated.div>
  );
}

const reducer = (state, action) => {
  switch (action.type) {
    case 'FETCH_REQUEST':
      return { ...state, loading: true };
    case 'FETCH_SUCCESS':
      return {
        ...state,
        shops: action.payload.shops,
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

export default function AdminStatsScreen() {
  const navigate = useNavigate();
  const { state } = useContext(Resalia);
  const { userInfo } = state;

  const [{ shops, carts, menus, error, loading }, dispatch] = useReducer(
    reducer,
    {
      shops: [],
      carts: [],
      menus: [],
      error: '',
      loading: true,
    }
  );

  useEffect(() => {
    if (!userInfo) {
      navigate('/signin');
    }
  }, [userInfo, navigate]);

  useEffect(() => {
    const fetchData = async () => {
      dispatch({ type: 'FETCH_REQUEST' });
      try {
        const result = await axios.get(`/api/shops/stats/${userInfo._id}`);
        dispatch({ type: 'FETCH_SUCCESS', payload: result.data });
      } catch (err) {
        dispatch({ type: 'FETCH_FAIL', payload: err.message });
      }
    };
    fetchData();
  }, [userInfo._id]);

  return (
    <div>
      <Helmet>
        <title>Resalia - Mis Estadísticas</title>
      </Helmet>
      <h1 className="mt-4 mb-5">Mis Estadísticas</h1>
      {loading ? (
        <LoadingBox />
      ) : error ? (
        <MessageBox variant="danger">{error}</MessageBox>
      ) : (
        <div className="dashboard-panel">
          <Row>
            {shops.map((shop) => (
              <Col md={12} key={shop.slug} className="dashboard-element mb-4">
                <Card className="h-100">
                  <Card.Body className="d-flex flex-column">
                    <Row>
                      <Col md={12} className="text-center">
                        <BsShop size={40} className="mb-4 mt-4" />
                        <h3 className="mt-2 mb-4">{shop.name}</h3>
                        <Number n={shop.views} />
                        <Row className="mt-4 mb-3">
                          <Col md={12} className="mb-3">
                            <h4>TOP PLATOS DE LA/S CARTA/S</h4>
                          </Col>
                          {carts
                            .filter((s) => s.shop === shop.slug)
                            .map((cart) => (
                              <Col md={4} className="text-left" key={cart.slug}>
                                <h5>{cart.name}</h5>
                                {cart.items
                                  .sort((a, b) => {
                                    return b.views - a.views;
                                  })
                                  .slice(0, 3)
                                  .map((item) => (
                                    <div key={item.slug}>
                                      <h5 className="mt-3 mb-3">{item.name}</h5>
                                      <Number n={item.views} />
                                    </div>
                                  ))}
                              </Col>
                            ))}
                        </Row>
                        <Row className="mt-4 mb-3">
                          <Col md={12} className="mb-3">
                            <h4>TOP PLATOS DEL MENÚ</h4>
                          </Col>
                          {menus
                            .filter((s) => s.shop === shop.slug)
                            .map((menu) => (
                              <Col md={4} className="text-left" key={menu.slug}>
                                <h5>{menu.name}</h5>
                                {menu.items
                                  .sort((a, b) => {
                                    return b.views - a.views;
                                  })
                                  .slice(0, 3)
                                  .map((item) => (
                                    <div key={item.slug}>
                                      <h5 className="mt-3 mb-3">{item.name}</h5>
                                      <Number n={item.views} />
                                    </div>
                                  ))}
                              </Col>
                            ))}
                        </Row>
                      </Col>
                    </Row>
                  </Card.Body>
                </Card>
              </Col>
            ))}
          </Row>
        </div>
      )}
    </div>
  );
}
