import React, { useContext } from 'react';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import { Helmet } from 'react-helmet-async';
import { Link } from 'react-router-dom';
import { Resalia } from '../Resalia';

export default function HomeScreen() {
  const { state } = useContext(Resalia);
  const { userInfo } = state;

  return (
    <div>
      <Helmet>
        <title>Resalia - La mejor App de Cartas QR</title>
      </Helmet>
      <h1 className="mt-4 mb-5">Home</h1>
      {userInfo ? (
        <Link to="/shops">Mis Negocios</Link>
      ) : (
        <Row>
          <Col>
            <p>Home Page</p>
          </Col>
        </Row>
      )}
    </div>
  );
}
