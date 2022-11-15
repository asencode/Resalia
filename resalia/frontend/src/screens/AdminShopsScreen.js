import React, { useContext, useEffect, useReducer } from 'react';
import { Helmet } from 'react-helmet-async';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Card from 'react-bootstrap/Card';
import { Link, useNavigate } from 'react-router-dom';
import { Resalia } from '../Resalia';
import axios from 'axios';
import LoadingBox from '../components/LoadingBox';
import MessageBox from '../components/MessageBox';
import { BsPlusCircle } from 'react-icons/bs';
import { BsShop } from 'react-icons/bs';

const reducer = (state, action) => {
  switch (action.type) {
    case 'FETCH_REQUEST':
      return { ...state, loading: true };
    case 'FETCH_SUCCESS':
      return { ...state, shops: action.payload, loading: false };
    case 'FETCH_FAIL':
      return { ...state, error: action.payload, loading: false };
    default:
      return state;
  }
};

export default function AdminShopsScreen() {
  const navigate = useNavigate();
  const { state } = useContext(Resalia);
  const { userInfo } = state;

  useEffect(() => {
    if (!userInfo) {
      navigate('/signin');
    }
  });

  const [{ shops, error, loading }, dispatch] = useReducer(reducer, {
    shops: [],
    error: '',
    loading: true,
  });

  useEffect(() => {
    const fetchData = async () => {
      dispatch({ type: 'FETCH_REQUEST' });
      try {
        const result = await axios.get(`/api/shops?userId=${userInfo._id}`);
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
        <title>Resalia - Mis Establecimientos</title>
      </Helmet>
      <h2 className="mt-4 mb-5">Mis Establecimientos</h2>
      {loading ? (
        <LoadingBox />
      ) : error ? (
        <MessageBox variant="danger">{error}</MessageBox>
      ) : (
        <div className="dashboard-panel">
          <Row>
            {shops.map((shop) => (
              <Col md={4} key={shop.slug} className="dashboard-element mb-4">
                <Link to={`/admin/shops/${shop.slug}`}>
                  <Card className="h-100">
                    <Card.Body className="text-center d-flex flex-column align-items-center">
                      <h5 className="mt-3 mb-3">{shop.name}</h5>
                      <p className="text-muted">
                        {shop.address}
                        <br />
                        {shop.city}, {shop.locality}
                      </p>
                      <BsShop size={30} className="mb-3 mt-auto" />
                    </Card.Body>
                  </Card>
                </Link>
              </Col>
            ))}
            <Col md={4} className="dashboard-element mb-4">
              <Link to={`/admin/shops/create`}>
                <Card className="h-100">
                  <Card.Body className="text-center d-flex flex-column align-items-center">
                    <h5 className="mt-3 mb-3">Nuevo Establecimiento</h5>
                    <p className="text-muted">
                      Da de alta un nuevo establecimiento.
                    </p>
                    <BsPlusCircle size={30} className="mb-3 mt-auto" />
                  </Card.Body>
                </Card>
              </Link>
            </Col>
          </Row>
        </div>
      )}
    </div>
  );
}
