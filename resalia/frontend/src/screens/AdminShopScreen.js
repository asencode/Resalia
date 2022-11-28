import axios from 'axios';
import React, { useContext, useEffect, useReducer } from 'react';
import { Helmet } from 'react-helmet-async';
import { useNavigate, useParams } from 'react-router-dom';
import LoadingBox from '../components/LoadingBox';
import MessageBox from '../components/MessageBox';
import { Resalia } from '../Resalia';
import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';
import { toast } from 'react-toastify';
import { getError } from '../utils';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';

const reducer = (state, action) => {
  switch (action.type) {
    case 'FIELD':
      return {
        ...state,
        shop: { ...state.shop, [action.fieldName]: action.payload },
      };
    case 'FETCH_REQUEST':
      return { ...state, loading: true };
    case 'FETCH_SUCCESS':
      return { ...state, shop: action.payload.shop, loading: false };
    case 'FETCH_FAIL':
      return { ...state, error: action.payload, loading: false };
    default:
      return state;
  }
};

export default function AdminShopScreen() {
  const navigate = useNavigate();
  const { state } = useContext(Resalia);
  const { userInfo } = state;
  const { _id } = userInfo || {};
  const params = useParams();
  const { slug } = params;

  useEffect(() => {
    if (!userInfo) {
      navigate('/signin');
    }
  }, [userInfo, navigate]);

  const [{ shop, error, loading }, dispatch] = useReducer(reducer, {
    shop: {},
    error: '',
    loading: true,
  });

  const {
    name,
    image,
    address,
    city,
    locality,
    postcode,
    email,
    phone1,
    phone2,
  } = shop;

  useEffect(() => {
    const fetchData = async () => {
      dispatch({ type: 'FETCH_REQUEST' });
      try {
        const result = await axios.get(`/api/shops/${slug}`);
        dispatch({ type: 'FETCH_SUCCESS', payload: result.data });
      } catch (err) {
        dispatch({ type: 'FETCH_FAIL', payload: err.message });
      }
    };
    if (_id) {
      fetchData();
    }
  }, [slug, _id]);

  const loadFileHandler = async (e) => {
    try {
      const imageData = new FormData();
      imageData.append('profileImg', e.target.files[0]);
      imageData.append('slug', slug);

      await axios.put('/api/shops/upload-image', imageData, {
        headers: { Authorization: `Bearer ${userInfo.token}` },
      });

      const formImage = document.getElementById('output');
      formImage.src = URL.createObjectURL(e.target.files[0]);
    } catch (err) {
      toast.error(getError(err));
    }
  };

  const submitHandler = async (e) => {
    e.preventDefault();

    try {
      await axios.put(
        '/api/shops/update',
        {
          slug,
          name,
          address,
          city,
          locality,
          postcode,
          email,
          phone1,
          phone2,
        },
        {
          headers: { Authorization: `Bearer ${userInfo.token}` },
        }
      );
      toast.success('Datos guardados con éxito');
    } catch (err) {
      toast.error(getError(err));
    }
  };

  return (
    <div>
      <Helmet>
        <title>Resalia - Detalles del Establecimiento</title>
      </Helmet>
      {loading ? (
        <LoadingBox />
      ) : error ? (
        <MessageBox variant="danger">{error}</MessageBox>
      ) : (
        <Row className="mt-4">
          <Col lg={{ span: 8, offset: 2 }}>
            <Form onSubmit={submitHandler}>
              <Row>
                <Col>
                  <div className="profile-pic mb-4">
                    <label className="-label" htmlFor="file">
                      <span>Cambiar Imagen</span>
                    </label>
                    <input
                      id="file"
                      type="file"
                      onChange={(e) => {
                        loadFileHandler(e);
                      }}
                    />
                    <img
                      src={`http://localhost:5000/images/shops/${
                        image || 'profile-shop-default.png'
                      }`}
                      alt={name}
                      id="output"
                      width="200"
                    />
                  </div>
                </Col>
              </Row>
              <Row>
                <Form.Group className="mt-4 mb-4" controlId="name" as={Col}>
                  <Form.Label>Nombre</Form.Label>
                  <Form.Control
                    type="text"
                    required
                    value={name || ''}
                    onChange={(e) => {
                      dispatch({
                        type: 'FIELD',
                        fieldName: 'name',
                        payload: e.currentTarget.value,
                      });
                    }}
                  />
                </Form.Group>
              </Row>

              <Row>
                <Form.Group className="mb-4" controlId="address" as={Col}>
                  <Form.Label>Dirección</Form.Label>
                  <Form.Control
                    type="text"
                    required
                    value={address || ''}
                    onChange={(e) => {
                      dispatch({
                        type: 'FIELD',
                        fieldName: 'address',
                        payload: e.currentTarget.value,
                      });
                    }}
                  />
                </Form.Group>
              </Row>
              <Row>
                <Form.Group className="mb-4" controlId="city" as={Col} md={6}>
                  <Form.Label>Municipio</Form.Label>
                  <Form.Control
                    type="text"
                    required
                    value={city || ''}
                    onChange={(e) => {
                      dispatch({
                        type: 'FIELD',
                        fieldName: 'city',
                        payload: e.currentTarget.value,
                      });
                    }}
                  />
                </Form.Group>
                <Form.Group
                  className="mb-4"
                  controlId="locality"
                  as={Col}
                  md={6}
                >
                  <Form.Label>Provincia</Form.Label>
                  <Form.Control
                    type="text"
                    required
                    value={locality || ''}
                    onChange={(e) => {
                      dispatch({
                        type: 'FIELD',
                        fieldName: 'locality',
                        payload: e.currentTarget.value,
                      });
                    }}
                  />
                </Form.Group>
              </Row>
              <Row>
                <Form.Group
                  className="mb-4"
                  controlId="postcode"
                  as={Col}
                  md={6}
                >
                  <Form.Label>Código Postal</Form.Label>
                  <Form.Control
                    type="text"
                    required
                    value={postcode || ''}
                    onChange={(e) => {
                      dispatch({
                        type: 'FIELD',
                        fieldName: 'postcode',
                        payload: e.currentTarget.value,
                      });
                    }}
                  />
                </Form.Group>
                <Form.Group className="mb-4" controlId="email" as={Col} md={6}>
                  <Form.Label>Mail Contacto</Form.Label>
                  <Form.Control
                    type="email"
                    required
                    value={email || ''}
                    onChange={(e) => {
                      dispatch({
                        type: 'FIELD',
                        fieldName: 'email',
                        payload: e.currentTarget.value,
                      });
                    }}
                  />
                </Form.Group>
              </Row>
              <Row className="mb-4">
                <Form.Group className="mb-4" controlId="phone1" as={Col} md={6}>
                  <Form.Label>Teléfono Contacto</Form.Label>
                  <Form.Control
                    type="text"
                    required
                    value={phone1 || ''}
                    onChange={(e) => {
                      dispatch({
                        type: 'FIELD',
                        fieldName: 'phone1',
                        payload: e.currentTarget.value,
                      });
                    }}
                  />
                </Form.Group>
                <Form.Group className="mb-4" controlId="phone2" as={Col} md={6}>
                  <Form.Label>Teléfono Adicional</Form.Label>
                  <Form.Control
                    type="text"
                    value={phone2 || ''}
                    onChange={(e) => {
                      dispatch({
                        type: 'FIELD',
                        fieldName: 'phone2',
                        payload: e.currentTarget.value,
                      });
                    }}
                  />
                </Form.Group>
              </Row>
              <Row className="mb-4">
                <Col md={12} className="d-grid">
                  <Button variant="dark" type="submit">
                    Guardar Cambios
                  </Button>
                </Col>
              </Row>
            </Form>
          </Col>
        </Row>
      )}
    </div>
  );
}
