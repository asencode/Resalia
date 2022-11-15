import React, { useContext, useEffect, useReducer } from 'react';
import { Helmet } from 'react-helmet-async';
import Form from 'react-bootstrap/Form';
import { Resalia } from '../Resalia';
import Button from 'react-bootstrap/Button';
import { toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { getError } from '../utils';
import LoadingBox from '../components/LoadingBox';
import MessageBox from '../components/MessageBox';

const reducer = (state, action) => {
  switch (action.type) {
    case 'FIELD':
      return {
        ...state,
        user: { ...state.user, [action.fieldName]: action.payload },
      };
    case 'FETCH_REQUEST':
      return { ...state, loading: true };
    case 'FETCH_SUCCESS':
      return { ...state, user: action.payload, loading: false };
    case 'FETCH_FAIL':
      return { ...state, error: action.payload, loading: false };
    default:
      return state;
  }
};

export default function AdminPersonalInfoScreen() {
  const navigate = useNavigate();
  const { state } = useContext(Resalia);
  const { userInfo } = state;
  const { email, _id } = userInfo || {};

  useEffect(() => {
    if (!userInfo) {
      navigate('/signin');
    }
  }, [userInfo, navigate]);

  const [{ user, error, loading }, dispatch] = useReducer(reducer, {
    loading: true,
    user: {},
    error: '',
  });

  const {
    name,
    surname,
    phone1,
    phone2,
    address1,
    address2,
    city,
    province,
    postcode,
  } = user;

  useEffect(() => {
    const fetchData = async () => {
      dispatch({ type: 'FETCH_REQUEST' });
      try {
        const result = await axios.get(`/api/users/personal-info/${_id}`);
        dispatch({ type: 'FETCH_SUCCESS', payload: result.data });
      } catch (err) {
        dispatch({ type: 'FETCH_FAIL', payload: err.message });
      }
    };
    if (_id) {
      fetchData();
    }
  }, [_id]);

  const submitHandler = async (e) => {
    e.preventDefault();

    try {
      const { data } = await axios.put(
        '/api/users/personal-info',
        {
          email,
          name,
          surname,
          phone1,
          phone2,
          address1,
          address2,
          city,
          province,
          postcode,
        },
        {
          headers: { Authorization: `Bearer ${userInfo.token}` },
        }
      );
      localStorage.setItem('userInfo', JSON.stringify(data));
      toast.success('Datos guardados con éxito');
    } catch (err) {
      toast.error(getError(err));
    }
  };

  return (
    <div>
      <Helmet>
        <title>Resalia - Mis Datos Personales</title>
      </Helmet>
      <h2 className="mt-4 mb-5">Mis Datos Personales</h2>
      {loading ? (
        <LoadingBox />
      ) : error ? (
        <MessageBox variant="danger">{error}</MessageBox>
      ) : (
        <Form onSubmit={submitHandler}>
          <Form.Group className="mb-4" controlId="name">
            <Form.Label>Nombre</Form.Label>
            <Form.Control
              type="text"
              required
              value={user.name}
              onChange={(e) => {
                dispatch({
                  type: 'FIELD',
                  fieldName: 'name',
                  payload: e.currentTarget.value,
                });
              }}
            />
          </Form.Group>
          <Form.Group className="mb-4" controlId="surname">
            <Form.Label>Apellidos</Form.Label>
            <Form.Control
              type="text"
              value={surname}
              onChange={(e) => {
                dispatch({
                  type: 'FIELD',
                  fieldName: 'surname',
                  payload: e.currentTarget.value,
                });
              }}
            />
          </Form.Group>
          <Form.Group className="mb-4" controlId="email">
            <Form.Label>Email</Form.Label>
            <Form.Control type="email" value={email} required disabled />
          </Form.Group>
          <Form.Group className="mb-4" controlId="phone1">
            <Form.Label>Teléfono de Contacto</Form.Label>
            <Form.Control
              type="phone"
              value={phone1}
              required
              onChange={(e) => {
                dispatch({
                  type: 'FIELD',
                  fieldName: 'phone1',
                  payload: e.currentTarget.value,
                });
              }}
            />
          </Form.Group>
          <Form.Group className="mb-4" controlId="phone2">
            <Form.Label>Teléfono Adicional</Form.Label>
            <Form.Control
              type="phone"
              value={phone2}
              onChange={(e) => {
                dispatch({
                  type: 'FIELD',
                  fieldName: 'phone2',
                  payload: e.currentTarget.value,
                });
              }}
            />
          </Form.Group>
          <Form.Group className="mb-4" controlId="address1">
            <Form.Label>Dirección (nombre de la vía y número)</Form.Label>
            <Form.Control
              type="text"
              value={address1}
              onChange={(e) => {
                dispatch({
                  type: 'FIELD',
                  fieldName: 'address1',
                  payload: e.currentTarget.value,
                });
              }}
            />
          </Form.Group>
          <Form.Group className="mb-4" controlId="address2">
            <Form.Label>Dirección 2 (piso y puerta si procede)</Form.Label>
            <Form.Control
              type="text"
              value={address2}
              onChange={(e) => {
                dispatch({
                  type: 'FIELD',
                  fieldName: 'address2',
                  payload: e.currentTarget.value,
                });
              }}
            />
          </Form.Group>
          <Form.Group className="mb-4" controlId="city">
            <Form.Label>Municipio</Form.Label>
            <Form.Control
              type="text"
              value={city}
              onChange={(e) => {
                dispatch({
                  type: 'FIELD',
                  fieldName: 'city',
                  payload: e.currentTarget.value,
                });
              }}
            />
          </Form.Group>
          <Form.Group className="mb-4" controlId="province">
            <Form.Label>Provincia</Form.Label>
            <Form.Control
              type="text"
              value={province}
              onChange={(e) => {
                dispatch({
                  type: 'FIELD',
                  fieldName: 'province',
                  payload: e.currentTarget.value,
                });
              }}
            />
          </Form.Group>
          <Form.Group className="mb-4" controlId="postcode">
            <Form.Label>Código Postal</Form.Label>
            <Form.Control
              type="text"
              value={postcode}
              onChange={(e) => {
                dispatch({
                  type: 'FIELD',
                  fieldName: 'postcode',
                  payload: e.currentTarget.value,
                });
              }}
            />
          </Form.Group>
          <div className="mb-3">
            <Button variant="primary" type="submit">
              Guardar Cambios
            </Button>
          </div>
        </Form>
      )}
    </div>
  );
}
