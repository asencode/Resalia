import React, { useContext, useEffect } from 'react';
import Col from 'react-bootstrap/Col';
import Row from 'react-bootstrap/Row';
import Card from 'react-bootstrap/Card';
import { Helmet } from 'react-helmet-async';
import { useNavigate } from 'react-router-dom';
import { Resalia } from '../Resalia';
import { BsPerson } from 'react-icons/bs';
import { BsShop } from 'react-icons/bs';
import { BsBook } from 'react-icons/bs';
import { BsGraphUp } from 'react-icons/bs';
import { BsCurrencyEuro } from 'react-icons/bs';
import { BsPower } from 'react-icons/bs';
import { Link } from 'react-router-dom';

export default function AdminDashboardScreen() {
  const navigate = useNavigate();
  const { state, dispatch: ctxDispatch } = useContext(Resalia);
  const { userInfo } = state;

  useEffect(() => {
    if (!userInfo) {
      navigate('/signin');
    }
  }, [userInfo, navigate]);

  const logoutHandler = () => {
    ctxDispatch({ type: 'USER_LOGOUT' });
    localStorage.removeItem('userInfo');
    window.location.href = '/signin';
  };

  return (
    <div>
      <Helmet>
        <title>Resalia - Mi Cuenta</title>
      </Helmet>
      <h2 className="mt-4 mb-5">Mi Cuenta</h2>
      <div className="dashboard-panel">
        <Row>
          <Col md={4} className="dashboard-element mb-4">
            <Link to="/admin/personal-info">
              <Card className="h-100">
                <Card.Body className="text-center d-flex flex-column align-items-center">
                  <h5 className="mt-3 mb-3">Datos Personales</h5>
                  <p className="text-muted">
                    Modifica tus datos personales, datos de contacto, etc.
                  </p>
                  <BsPerson size={30} className="mb-3 mt-auto" />
                </Card.Body>
              </Card>
            </Link>
          </Col>
          <Col md={4} className="dashboard-element mb-4">
            <Link to="/admin/shops">
              <Card className="h-100">
                <Card.Body className="text-center d-flex flex-column align-items-center">
                  <h5 className="mt-3 mb-3">Establecimientos</h5>
                  <p className="text-muted">
                    Añade un nuevo establecimiento o modifica los datos de los
                    ya existentes.
                  </p>
                  <BsShop size={30} className="mb-3 mt-auto" />
                </Card.Body>
              </Card>
            </Link>
          </Col>
          <Col md={4} className="dashboard-element mb-4">
            <Link to="/admin/carts-menus">
              <Card className="h-100">
                <Card.Body className="text-center d-flex flex-column align-items-center">
                  <h5 className="mt-3 mb-3">Cartas y Menús</h5>
                  <p className="text-muted">
                    Cambia el diseño, crea o modifica tus cartas y menús.
                  </p>
                  <BsBook size={30} className="mb-3 mt-auto" />
                </Card.Body>
              </Card>
            </Link>
          </Col>
          <Col md={4} className="dashboard-element mb-4">
            <Link to="/admin/stats">
              <Card className="h-100">
                <Card.Body className="text-center d-flex flex-column align-items-center">
                  <h5 className="mt-3 mb-3">Estadísticas</h5>
                  <p className="text-muted">
                    Visualiza los platos más vistos por tus clientes, gráficos
                    de visitas diarias, etc.
                  </p>
                  <BsGraphUp size={30} className="mb-3 mt-auto" />
                </Card.Body>
              </Card>
            </Link>
          </Col>
          <Col md={4} className="dashboard-element mb-4">
            <Link to="/admin/payments">
              <Card className="h-100">
                <Card.Body className="text-center d-flex flex-column align-items-center">
                  <h5 className="mt-3 mb-3">Mis Pagos</h5>
                  <p className="text-muted">
                    Próximos pagos, facturas pasadas, datos de facturación, etc.
                  </p>
                  <BsCurrencyEuro size={30} className="mb-3 mt-auto" />
                </Card.Body>
              </Card>
            </Link>
          </Col>
          <Col md={4} className="dashboard-element mb-4">
            <Link to="#logout" onClick={logoutHandler}>
              <Card className="h-100">
                <Card.Body className="text-center d-flex flex-column align-items-center">
                  <h5 className="mt-3 mb-3">Cerrar Sesión</h5>
                  <p className="text-muted">¡Nos vemos pronto!</p>
                  <BsPower size={30} className="mb-3 mt-auto" />
                </Card.Body>
              </Card>
            </Link>
          </Col>
        </Row>
      </div>
    </div>
  );
}
