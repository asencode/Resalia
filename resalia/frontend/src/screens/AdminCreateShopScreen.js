import React, { useContext, useEffect, useReducer, useState } from 'react';
import Col from 'react-bootstrap/Col';
import Row from 'react-bootstrap/Row';
import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';
import { Helmet } from 'react-helmet-async';
import { useNavigate } from 'react-router-dom';
import { Resalia } from '../Resalia';
import { toast } from 'react-toastify';
import axios from 'axios';
import { getError } from '../utils';

const reducer = (state, action) => {
  switch (action.type) {
    case 'FIELD':
      return {
        ...state,
        shop: { ...state.shop, [action.fieldName]: action.payload },
      };
    default:
      return state;
  }
};

export default function AdminCreateShopScreen() {
  const navigate = useNavigate();
  const { state } = useContext(Resalia);
  const { userInfo } = state;
  const [shopImage, setShopImage] = useState({});

  useEffect(() => {
    if (!userInfo) {
      navigate('/signin');
    }
  }, [userInfo, navigate]);

  const [{ shop }, dispatch] = useReducer(reducer, {
    shop: {},
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

  const loadFileHandler = (e) => {
    const formImage = document.getElementById('output');
    formImage.src = URL.createObjectURL(e.target.files[0]);
    setShopImage(e.target.files[0]);
  };

  const submitHandler = async (e) => {
    e.preventDefault();

    try {
      const formData = new FormData();
      formData.append('image', shopImage);
      formData.append('name', name);
      formData.append('address', address);
      formData.append('city', city);
      formData.append('locality', locality);
      formData.append('postcode', postcode);
      formData.append('email', email);
      formData.append('phone1', phone1);
      formData.append('phone2', phone2 || '');

      await axios
        .post('/api/shops/insert', formData, {
          headers: { Authorization: `Bearer ${userInfo.token}` },
        })
        .then((res) => {
          toast.success('¡Establecimiento creado!');
          navigate('/admin/shops');
        })
        .catch((err) => {
          toast.error(err.message);
        });
    } catch (error) {
      toast.error(getError(error.message));
    }
  };

  return (
    <div>
      <Helmet>
        <title>Resalia - Nuevo Establecimiento</title>
      </Helmet>
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
              <Form.Group className="mb-4" controlId="locality" as={Col} md={6}>
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
              <Form.Group className="mb-4" controlId="postcode" as={Col} md={6}>
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
                  Crear Establecimiento
                </Button>
              </Col>
            </Row>
          </Form>
        </Col>
      </Row>
    </div>
  );
}
