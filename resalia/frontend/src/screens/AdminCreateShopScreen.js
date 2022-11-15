import React from 'react';
import Col from 'react-bootstrap/Col';
import Row from 'react-bootstrap/Row';
import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';
import { Helmet } from 'react-helmet-async';

export default function AdminCreateShopScreen() {
  const submitHandler = async (e) => {
    e.preventDefault();
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
                  value={name}
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
                  value={address}
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
              <Form.Group className="mb-4" controlId="locality" as={Col} md={6}>
                <Form.Label>Provincia</Form.Label>
                <Form.Control
                  type="text"
                  value={locality}
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
              <Form.Group className="mb-4" controlId="email" as={Col} md={6}>
                <Form.Label>Mail Contacto</Form.Label>
                <Form.Control
                  type="email"
                  value={email}
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
                  value={phone1}
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
    </div>
  );
}
