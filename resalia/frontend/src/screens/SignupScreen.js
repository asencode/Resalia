import Axios from 'axios';
import React, { useContext, useEffect, useRef, useState } from 'react';
import Container from 'react-bootstrap/Container';
import Form from 'react-bootstrap/Form';
import { Helmet } from 'react-helmet-async';
import { useLocation, useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { Resalia } from '../Resalia';
import { getError } from '../utils';
import emailjs from 'emailjs-com';
import Button from 'react-bootstrap/Button';
import { Link } from 'react-router-dom';

export default function SignupScreen() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [telefono, setTelefono] = useState('');
  const [infoAdicional, setInfoAdicional] = useState('');

  const formSignup = useRef();

  const navigate = useNavigate();
  const { search } = useLocation();
  const redirectInUrl = new URLSearchParams(search).get('redirect');
  const redirect = redirectInUrl ? redirectInUrl : '/';
  const redirectUser = redirectInUrl ? redirectInUrl : '/admin/dashboard';

  const { state, dispatch: ctxDispatch } = useContext(Resalia);
  const { userInfo } = state;

  const submitHandler = async (e) => {
    e.preventDefault();

    try {
      const { data } = await Axios.post('/api/users/signup', {
        name,
        email,
        telefono,
        infoAdicional,
      });
      ctxDispatch({ type: 'USER_SIGNUP', payload: data });
      emailjs
        .sendForm(
          'service_ixnb4oa',
          'template_qebaj5n',
          formSignup.current,
          'zCwN8x2CXMklpjpUF'
        )
        .then((result) => {
          toast.success(
            '¡Solicitud de alta recibida con éxito! Nos pondremos en contacto contigo lo antes posible.'
          );
          navigate(redirect);
        });
    } catch (err) {
      toast.error(getError(err));
    }
  };

  useEffect(() => {
    if (userInfo) {
      navigate(redirectUser);
    }
  }, [userInfo, navigate, redirectUser]);

  return (
    <Container className="small-container">
      <Helmet>
        <title>Resalia - Registro</title>
      </Helmet>
      <h1 className="mt-4 mb-5">Registro</h1>

      <Form ref={formSignup} onSubmit={submitHandler}>
        <Form.Group className="mb-3" controlId="name">
          <Form.Label>Nombre</Form.Label>
          <Form.Control
            type="text"
            name="name"
            required
            onChange={(e) => {
              setName(e.target.value);
            }}
          />
        </Form.Group>
        <Form.Group className="mb-3" controlId="email">
          <Form.Label>Email</Form.Label>
          <Form.Control
            type="email"
            name="email"
            required
            onChange={(e) => {
              setEmail(e.target.value);
            }}
          />
        </Form.Group>
        <Form.Group className="mb-3" controlId="telefono">
          <Form.Label>Telefono</Form.Label>
          <Form.Control
            type="text"
            name="telefono"
            required
            onChange={(e) => {
              setTelefono(e.target.value);
            }}
          />
        </Form.Group>
        <Form.Group className="mb-3" controlId="infoAdicional">
          <Form.Label>Información Adicional (opcional)</Form.Label>
          <Form.Control
            as="textarea"
            name="infoAdicional"
            rows={3}
            onChange={(e) => {
              setInfoAdicional(e.target.value);
            }}
          />
        </Form.Group>
        <div className="mb-3">
          <p>
            ¿Ya tienes cuenta? <Link to="/signin">Acceder</Link>
          </p>
        </div>
        <div className="mb-3">
          <Button type="submit">Enviar</Button>
        </div>
      </Form>
    </Container>
  );
}
