import axios from 'axios';
import React, { useContext, useEffect, useReducer, useState } from 'react';
import { Helmet } from 'react-helmet-async';
import { useNavigate, useParams } from 'react-router-dom';
import { toast } from 'react-toastify';
import LoadingBox from '../components/LoadingBox';
import MessageBox from '../components/MessageBox';
import { Resalia } from '../Resalia';
import { getError } from '../utils';
import Table from 'react-bootstrap/Table';
import Form from 'react-bootstrap/Form';
import Modal from 'react-bootstrap/Modal';
import Button from 'react-bootstrap/Button';
import { BsCheck, BsEye, BsPencil, BsPlusCircle, BsX } from 'react-icons/bs';
import Row from 'react-bootstrap/esm/Row';
import Col from 'react-bootstrap/esm/Col';

const reducer = (state, action) => {
  switch (action.type) {
    case 'FETCH_REQUEST':
      return { ...state, loading: true };
    case 'UPDATE_REQUEST':
      return { ...state, loadingModal: true };
    case 'FETCH_SUCCESS':
      return {
        ...state,
        menu: action.payload.menu,
        currency: action.payload.currency,
        loading: false,
      };
    case 'UPDATE_SUCCESS':
      return {
        ...state,
        menu: action.payload.menu,
        loadingModal: false,
      };
    case 'FETCH_FAIL':
      return { ...state, error: action.payload, loading: false };
    case 'UPDATE_FAIL':
      return { ...state, error: action.payload, loadingModal: false };
    default:
      return state;
  }
};

export default function AdminMenuScreen() {
  const navigate = useNavigate();
  const params = useParams();
  const { shop, slug } = params;
  const { state } = useContext(Resalia);
  const { userInfo } = state;
  const [showItemModal, setShowItemModal] = useState(false);
  const [showFormatsModal, setShowFormatsModal] = useState(false);
  const [updateFlag, setUpdateFlag] = useState(true);

  const [itemName, setItemName] = useState('');
  const [itemSlug, setItemSlug] = useState('');
  const [itemCategory, setItemCategory] = useState('');
  const [itemImage, setItemImage] = useState('');
  const [objectImage, setObjectImage] = useState({});
  const [itemPrice, setItemPrice] = useState('');
  const [itemDescription, setItemDescription] = useState('');
  const [itemIsVegetariano, setItemIsVegetariano] = useState(false);
  const [itemIsVegano, setItemIsVegano] = useState(false);
  const [itemIsFeatured, setItemIsFeatured] = useState(false);
  const [itemFormats, setItemFormats] = useState([{}]);
  const [itemAlergenos, setItemAlergenos] = useState({});
  const [itemTrazas, setItemTrazas] = useState({});

  const [oldItemFormatName, setOldItemFormatName] = useState('');
  const [oldItemFormatPrice, setOldItemFormatPrice] = useState(0);
  const [newItemFormatName, setNewItemFormatName] = useState('');
  const [newItemFormatPrice, setNewItemFormatPrice] = useState(0);

  const {
    isGlutenAlergeno,
    isMariscoAlergeno,
    isHuevosAlergeno,
    isPescadoAlergeno,
    isCacahuetesAlergeno,
    isSojaAlergeno,
    isLacteosAlergeno,
    isFrutosSecosAlergeno,
    isApioAlergeno,
    isMostazaAlergeno,
    isGranosSesamoAlergeno,
    isSulfitosAlergeno,
    isAltramucesAlergeno,
    isMoluscosAlergeno,
  } = itemAlergenos;

  const {
    isGlutenTraza,
    isMariscoTraza,
    isHuevosTraza,
    isPescadoTraza,
    isCacahuetesTraza,
    isSojaTraza,
    isLacteosTraza,
    isFrutosSecosTraza,
    isApioTraza,
    isMostazaTraza,
    isGranosSesamoTraza,
    isSulfitosTraza,
    isAltramucesTraza,
    isMoluscosTraza,
  } = itemTrazas;

  const handleCloseItemModal = () => setShowItemModal(false);
  const handleShowItemModal = () => setShowItemModal(true);

  const handleCloseFormatsModal = () => setShowFormatsModal(false);
  const handleShowFormatsModal = () => setShowFormatsModal(true);

  const [{ menu, currency, error, loading, loadingModal }, dispatch] =
    useReducer(reducer, {
      menu: {},
      currency: '',
      error: '',
      loading: true,
      loadingModal: false,
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
        const result = await axios.get(`/api/shops/${shop}/menus/${slug}`);
        dispatch({ type: 'FETCH_SUCCESS', payload: result.data });
      } catch (err) {
        dispatch({ type: 'FETCH_FAIL', payload: err.message });
        toast.error(getError(err));
      }
    };
    fetchData();
  }, [shop, slug]);

  const handleItemAvailability = async (e, item) => {
    const { slug: itemSlug2 } = item;
    const available = document.getElementById(itemSlug2).checked;

    await axios
      .put(
        '/api/menus/updateItemVisibility',
        { shop, slug, itemSlug2, available },
        { headers: { Authorization: `Bearer ${userInfo.token}` } }
      )
      .then((res) => {
        menu.items.map((x) => {
          if (x.slug === itemSlug2) {
            x.isAvailable = !x.isAvailable;
          }
          return x;
        });
      })
      .catch((err) => {
        toast.error(getError(err));
      });
  };

  const modalItemInfo = (e, item) => {
    //info: existe sobreposición de esta función con la de cambio del checkbox.
    //se ha intentado parar la propagación pero no hace caso.
    //con esta condición, la función procede siempre y cuando no haya sido
    //lanzada haciendo click en alguno de los checkboxes de la tabla.
    if (e.target.tagName.toLowerCase() !== 'input') {
      setItemName(item.name);
      setItemSlug(item.slug);
      setItemCategory(item.category);
      setItemImage(item.image);
      setItemPrice(item.price);
      setItemDescription(item.description);
      setItemIsVegetariano(item.isVegetariano);
      setItemIsVegano(item.isVegano);
      setItemIsFeatured(item.isFeatured);
      setItemFormats(item.formats);
      setItemAlergenos(item.alergenos);
      setItemTrazas(item.trazas);
      setUpdateFlag(true);
      handleShowItemModal();
    }
  };

  const handleNewItemModal = () => {
    setItemName('');
    setItemSlug('');
    setItemCategory('');
    setItemImage('');
    setItemPrice(0);
    setItemDescription('');
    setItemIsVegetariano(false);
    setItemIsVegano(false);
    setItemIsFeatured(false);
    setItemFormats([]);
    setItemAlergenos({});
    setItemTrazas({});
    setUpdateFlag(false);
    handleShowItemModal();
  };

  const handleOpenFormatModal = (format) => {
    setUpdateFlag(format ? true : false);
    setOldItemFormatName(format ? format.name : '');
    setOldItemFormatPrice(format ? format.price : 0);
    setNewItemFormatName(format ? format.name : '');
    setNewItemFormatPrice(format ? format.price : 0);
    handleShowFormatsModal();
  };

  const newItemFormatHandler = async (e) => {
    e.preventDefault();
    await axios
      .put(
        '/api/menus/createItemFormat',
        {
          name: newItemFormatName,
          price: newItemFormatPrice,
          shop,
          slug,
          itemSlug,
        },
        {
          headers: { Authorization: `Bearer ${userInfo.token}` },
        }
      )
      .then((res) => {
        dispatch({ type: 'UPDATE_SUCCESS', payload: res.data });
        setItemFormats([
          ...itemFormats,
          { name: newItemFormatName, price: newItemFormatPrice },
        ]);
        handleCloseFormatsModal();
        toast.success('Formato añadido con éxito!');
      })
      .catch((err) => {
        toast.error(getError(err));
        handleCloseFormatsModal();
      });
  };

  const updateItemFormatHandler = async (e) => {
    e.preventDefault();
    await axios
      .put(
        '/api/menus/updateItemFormat',
        {
          shop,
          slug,
          itemSlug,
          oldName: oldItemFormatName,
          oldPrice: oldItemFormatPrice,
          name: newItemFormatName,
          price: newItemFormatPrice,
        },
        {
          headers: { Authorization: `Bearer ${userInfo.token}` },
        }
      )
      .then((res) => {
        dispatch({ type: 'UPDATE_SUCCESS', payload: res.data });
        const auxItemFormats = itemFormats.map((x) => {
          if (x.name === oldItemFormatName && x.price === oldItemFormatPrice) {
            return { ...x, name: newItemFormatName, price: newItemFormatPrice };
          } else {
            return x;
          }
        });
        setItemFormats(auxItemFormats);
        handleCloseFormatsModal();
        toast.success('Formato modificado con éxito!');
      })
      .catch((err) => {
        toast.error(getError(err));
        handleCloseFormatsModal();
      });
  };

  const removeItemFormatHandler = async (format) => {
    await axios
      .put(
        '/api/menus/removeItemFormat',
        {
          shop,
          slug,
          itemSlug,
          name: format.name,
          price: format.price,
        },
        {
          headers: { Authorization: `Bearer ${userInfo.token}` },
        }
      )
      .then((res) => {
        dispatch({ type: 'UPDATE_SUCCESS', payload: res.data });
        const auxItemFormats = itemFormats.filter((x) => {
          return !(x.name === format.name && x.price === format.price);
        });
        setItemFormats(auxItemFormats);
        toast.success('Formato eliminado con éxito!');
      })
      .catch((err) => {
        toast.error(getError(err));
      });
  };

  const loadFileHandler = async (e) => {
    const imageData = new FormData();
    imageData.append('itemImg', e.target.files[0]);
    imageData.append('shop', shop);
    imageData.append('slug', slug);
    imageData.append('itemSlug', itemSlug);
    await axios
      .put('/api/menus/upload-image', imageData, {
        headers: { Authorization: `Bearer ${userInfo.token}` },
      })
      .then((res) => {
        const formImage = document.getElementById('output');
        formImage.src = URL.createObjectURL(e.target.files[0]);
        dispatch({ type: 'UPDATE_SUCCESS', payload: res.data });
      })
      .catch((err) => {
        toast.error(getError(err));
      });
  };

  const updateItemHandler = async (e) => {
    e.preventDefault();

    dispatch({ type: 'UPDATE_REQUEST' });
    try {
      await axios
        .put(
          '/api/menus/updateCartItem',
          {
            shop,
            slug,
            itemSlug,
            itemName,
            itemCategory,
            itemPrice,
            itemDescription,
            itemIsVegetariano,
            itemIsVegano,
            itemIsFeatured,
            itemFormats,
            itemAlergenos,
            itemTrazas,
          },
          { headers: { Authorization: `Bearer ${userInfo.token}` } }
        )
        .then((res) => {
          dispatch({ type: 'UPDATE_SUCCESS', payload: res.data });
          handleCloseItemModal();
          toast.success('¡Ítem actualizado con éxito!');
        });
    } catch (err) {
      dispatch({ type: 'UPDATE_FAIL', payload: err.message });
      toast.error(getError(err));
    }
  };

  const loadNewItemFileHandler = (e) => {
    const formImage = document.getElementById('output');
    formImage.src = URL.createObjectURL(e.target.files[0]);
    setObjectImage(e.target.files[0]);
  };

  const createItemHandler = async (e) => {
    e.preventDefault();

    dispatch({ type: 'UPDATE_REQUEST' });

    const formData = new FormData();
    formData.append('image', objectImage);
    formData.append('shop', shop);
    formData.append('slug', slug);
    formData.append('name', itemName);
    formData.append('category', itemCategory);
    formData.append('price', itemPrice);
    formData.append('description', itemDescription);
    formData.append('isVegetariano', itemIsVegetariano);
    formData.append('isVegano', itemIsVegano);
    formData.append('isFeatured', itemIsFeatured);
    formData.append('formats', itemFormats);
    formData.append('alergenos', itemAlergenos);
    formData.append('trazas', itemTrazas);

    await axios
      .post('/api/menus/createMenuItem', formData, {
        headers: { Authorization: `Bearer ${userInfo.token}` },
      })
      .then((res) => {
        dispatch({ type: 'UPDATE_SUCCESS', payload: res.data });
        handleCloseItemModal();
        toast.success('¡Ítem creado con éxito!');
      })
      .catch((err) => {
        dispatch({ type: 'UPDATE_FAIL', payload: err.message });
        toast.error(getError(err));
      });
  };

  return (
    <>
      <div>
        <Helmet>
          <title>Resalia - Mis Cartas y Menús</title>
        </Helmet>
        {loading ? (
          <LoadingBox />
        ) : error ? (
          <MessageBox variant="danger">{error}</MessageBox>
        ) : (
          <div>
            <h1 className="mt-4">{menu.name}</h1>
            <div className="float-end mb-3">
              <Button variant="primary" onClick={handleNewItemModal}>
                <BsPlusCircle />
                {'   '}
                Añadir Ítem
              </Button>
            </div>

            {menu.items && (
              <Table className="text-center" hover>
                <thead>
                  <tr>
                    <th>
                      <BsEye size={22} />
                    </th>
                    <th>Nombre</th>
                    <th>Categoría</th>
                    <th>Precio</th>
                  </tr>
                </thead>
                <tbody>
                  {menu.items.map((item) => (
                    <tr
                      key={item.slug}
                      style={{ cursor: 'pointer' }}
                      onClickCapture={(e) => modalItemInfo(e, item)}
                    >
                      <td>
                        <Form.Check
                          type="switch"
                          className="switchAvailability"
                          id={item.slug}
                          defaultChecked={item.isAvailable}
                          onChange={(e) => handleItemAvailability(e, item)}
                        />
                      </td>
                      <td>{item.name}</td>
                      <td>{item.category}</td>
                      <td>
                        {item.price} {currency}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </Table>
            )}
          </div>
        )}
      </div>
      <Modal size="lg" show={showItemModal} onHide={handleCloseItemModal}>
        <Modal.Header closeButton>
          <Modal.Title>Actualizar Ítem</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {loadingModal ? (
            <LoadingBox />
          ) : (
            <Form onSubmit={updateFlag ? updateItemHandler : createItemHandler}>
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
                        updateFlag
                          ? loadFileHandler(e)
                          : loadNewItemFileHandler(e);
                      }}
                    />
                    <img
                      src={`http://localhost:5000/images/menus/${
                        itemImage || 'menu-item-default.png'
                      }`}
                      alt={itemName}
                      id="output"
                      width="200"
                    />
                  </div>
                </Col>
              </Row>
              <Form.Group className="mb-4" controlId="name">
                <Form.Label>Nombre</Form.Label>
                <Form.Control
                  type="text"
                  required
                  value={itemName || ''}
                  onChange={(e) => setItemName(e.target.value)}
                />
              </Form.Group>
              <Form.Group className="mb-4" controlId="category">
                <Form.Label>Categoría</Form.Label>
                <Form.Control
                  type="text"
                  required
                  value={itemCategory || ''}
                  onChange={(e) => setItemCategory(e.target.value)}
                />
              </Form.Group>
              <Form.Group className="mb-4" controlId="price">
                <Form.Label>Precio</Form.Label>
                <Form.Control
                  type="number"
                  required
                  value={itemPrice || ''}
                  onChange={(e) => setItemPrice(e.target.value)}
                />
              </Form.Group>
              <Form.Group className="mb-4" controlId="description">
                <Form.Label>Descripción</Form.Label>
                <Form.Control
                  type="text"
                  required
                  value={itemDescription || ''}
                  onChange={(e) => setItemDescription(e.target.value)}
                />
              </Form.Group>
              <Form.Group className="mb-4" controlId="isVegetariano">
                <Form.Label>Vegetariano</Form.Label>
                <Form.Check
                  type="switch"
                  className="switchAvailability"
                  id="vegetarianSwitch"
                  defaultChecked={itemIsVegetariano}
                  onChange={(e) => setItemIsVegetariano(!itemIsVegetariano)}
                />
              </Form.Group>
              <Form.Group className="mb-4" controlId="isVegano">
                <Form.Label>Vegano</Form.Label>
                <Form.Check
                  type="switch"
                  className="switchAvailability"
                  id="veganSwitch"
                  defaultChecked={itemIsVegano}
                  onChange={(e) => setItemIsVegano(!itemIsVegano)}
                />
              </Form.Group>
              <Form.Group className="mb-4" controlId="isFeatured">
                <Form.Label>Destacado</Form.Label>
                <Form.Check
                  type="switch"
                  className="switchAvailability"
                  id="featuredSwitch"
                  defaultChecked={itemIsFeatured}
                  onChange={(e) => setItemIsFeatured(!itemIsFeatured)}
                />
              </Form.Group>
              <div>
                <p>Formatos Disponibles</p>
                {itemFormats?.length > 0 && (
                  <Table>
                    <thead>
                      <tr>
                        <th>Formato</th>
                        <th>Precio</th>
                        <th></th>
                        <th></th>
                      </tr>
                    </thead>
                    <tbody>
                      {itemFormats.map((format, i) => (
                        <tr key={i}>
                          <td>{format.name}</td>
                          <td>
                            {format.price} {currency}
                          </td>
                          <td>
                            <BsPencil
                              size={20}
                              className="text-primary"
                              onClick={(e) => handleOpenFormatModal(format)}
                            />
                          </td>
                          <td>
                            <BsX
                              size={22}
                              className="text-danger"
                              onClick={(e) => removeItemFormatHandler(format)}
                            />
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </Table>
                )}
                <Button
                  className="mb-4"
                  variant="primary"
                  onClick={(e) => handleOpenFormatModal()}
                >
                  <BsPlusCircle />
                  {'   '}Añadir Formato
                </Button>
              </div>
              <div>
                <p>Alérgenos</p>
                <Table>
                  <thead>
                    <tr>
                      <th>
                        <BsCheck size={22} />
                      </th>
                      <th>Alérgeno</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td>
                        <Form.Check
                          type="switch"
                          className="switchAvailability"
                          id="glutenAlergenoSwitch"
                          defaultChecked={isGlutenAlergeno}
                          onChange={(e) =>
                            setItemAlergenos({
                              ...itemAlergenos,
                              isGlutenAlergeno: !isGlutenAlergeno,
                            })
                          }
                        />
                      </td>
                      <td>Glúten</td>
                    </tr>
                    <tr>
                      <td>
                        <Form.Check
                          type="switch"
                          className="switchAvailability"
                          id="mariscoAlergenoSwitch"
                          defaultChecked={isMariscoAlergeno}
                          onChange={(e) =>
                            setItemAlergenos({
                              ...itemAlergenos,
                              isMariscoAlergeno: !isMariscoAlergeno,
                            })
                          }
                        />
                      </td>
                      <td>Marisco</td>
                    </tr>
                    <tr>
                      <td>
                        <Form.Check
                          type="switch"
                          className="switchAvailability"
                          id="huevosAlergenoSwitch"
                          defaultChecked={isHuevosAlergeno}
                          onChange={(e) =>
                            setItemAlergenos({
                              ...itemAlergenos,
                              isHuevosAlergeno: !isHuevosAlergeno,
                            })
                          }
                        />
                      </td>
                      <td>Huevos</td>
                    </tr>
                    <tr>
                      <td>
                        <Form.Check
                          type="switch"
                          className="switchAvailability"
                          id="pescadoAlergenoSwitch"
                          defaultChecked={isPescadoAlergeno}
                          onChange={(e) =>
                            setItemAlergenos({
                              ...itemAlergenos,
                              isPescadoAlergeno: !isPescadoAlergeno,
                            })
                          }
                        />
                      </td>
                      <td>Pescado</td>
                    </tr>
                    <tr>
                      <td>
                        <Form.Check
                          type="switch"
                          className="switchAvailability"
                          id="cacahuetesAlergenoSwitch"
                          defaultChecked={isCacahuetesAlergeno}
                          onChange={(e) =>
                            setItemAlergenos({
                              ...itemAlergenos,
                              isCacahuetesAlergeno: !isCacahuetesAlergeno,
                            })
                          }
                        />
                      </td>
                      <td>Cacahuetes</td>
                    </tr>
                    <tr>
                      <td>
                        <Form.Check
                          type="switch"
                          className="switchAvailability"
                          id="sojaAlergenoSwitch"
                          defaultChecked={isSojaAlergeno}
                          onChange={(e) =>
                            setItemAlergenos({
                              ...itemAlergenos,
                              isSojaAlergeno: !isSojaAlergeno,
                            })
                          }
                        />
                      </td>
                      <td>Soja</td>
                    </tr>
                    <tr>
                      <td>
                        <Form.Check
                          type="switch"
                          className="switchAvailability"
                          id="lacteosAlergenoSwitch"
                          defaultChecked={isLacteosAlergeno}
                          onChange={(e) =>
                            setItemAlergenos({
                              ...itemAlergenos,
                              isLacteosAlergeno: !isLacteosAlergeno,
                            })
                          }
                        />
                      </td>
                      <td>Lácteos</td>
                    </tr>
                    <tr>
                      <td>
                        <Form.Check
                          type="switch"
                          className="switchAvailability"
                          id="frutosSecosAlergenoSwitch"
                          defaultChecked={isFrutosSecosAlergeno}
                          onChange={(e) =>
                            setItemAlergenos({
                              ...itemAlergenos,
                              isFrutosSecosAlergeno: !isFrutosSecosAlergeno,
                            })
                          }
                        />
                      </td>
                      <td>Frutos Secos</td>
                    </tr>
                    <tr>
                      <td>
                        <Form.Check
                          type="switch"
                          className="switchAvailability"
                          id="apioAlergenoSwitch"
                          defaultChecked={isApioAlergeno}
                          onChange={(e) =>
                            setItemAlergenos({
                              ...itemAlergenos,
                              isApioAlergeno: !isApioAlergeno,
                            })
                          }
                        />
                      </td>
                      <td>Apio</td>
                    </tr>
                    <tr>
                      <td>
                        <Form.Check
                          type="switch"
                          className="switchAvailability"
                          id="mostazaAlergenoSwitch"
                          defaultChecked={isMostazaAlergeno}
                          onChange={(e) =>
                            setItemAlergenos({
                              ...itemAlergenos,
                              isMostazaAlergeno: !isMostazaAlergeno,
                            })
                          }
                        />
                      </td>
                      <td>Mostaza</td>
                    </tr>
                    <tr>
                      <td>
                        <Form.Check
                          type="switch"
                          className="switchAvailability"
                          id="granosSesamoAlergenoSwitch"
                          defaultChecked={isGranosSesamoAlergeno}
                          onChange={(e) =>
                            setItemAlergenos({
                              ...itemAlergenos,
                              isGranosSesamoAlergeno: !isGranosSesamoAlergeno,
                            })
                          }
                        />
                      </td>
                      <td>Granos de Sésamo</td>
                    </tr>
                    <tr>
                      <td>
                        <Form.Check
                          type="switch"
                          className="switchAvailability"
                          id="sulfitosAlergenoSwitch"
                          defaultChecked={isSulfitosAlergeno}
                          onChange={(e) =>
                            setItemAlergenos({
                              ...itemAlergenos,
                              isSulfitosAlergeno: !isSulfitosAlergeno,
                            })
                          }
                        />
                      </td>
                      <td>Sulfitos</td>
                    </tr>
                    <tr>
                      <td>
                        <Form.Check
                          type="switch"
                          className="switchAvailability"
                          id="altramucesAlergenoSwitch"
                          defaultChecked={isAltramucesAlergeno}
                          onChange={(e) =>
                            setItemAlergenos({
                              ...itemAlergenos,
                              isAltramucesAlergeno: !isAltramucesAlergeno,
                            })
                          }
                        />
                      </td>
                      <td>Altramuces</td>
                    </tr>
                    <tr>
                      <td>
                        <Form.Check
                          type="switch"
                          className="switchAvailability"
                          id="moluscosAlergenoSwitch"
                          defaultChecked={isMoluscosAlergeno}
                          onChange={(e) =>
                            setItemAlergenos({
                              ...itemAlergenos,
                              isMoluscosAlergeno: !isMoluscosAlergeno,
                            })
                          }
                        />
                      </td>
                      <td>Moluscos</td>
                    </tr>
                  </tbody>
                </Table>
              </div>
              <div>
                <p>Trazas</p>
                <Table>
                  <thead>
                    <tr>
                      <th>
                        <BsCheck size={22} />
                      </th>
                      <th>Traza</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td>
                        <Form.Check
                          type="switch"
                          className="switchAvailability"
                          id="glutenTrazaSwitch"
                          defaultChecked={isGlutenTraza}
                          onChange={(e) =>
                            setItemTrazas({
                              ...itemTrazas,
                              isGlutenTraza: !isGlutenTraza,
                            })
                          }
                        />
                      </td>
                      <td>Glúten</td>
                    </tr>
                    <tr>
                      <td>
                        <Form.Check
                          type="switch"
                          className="switchAvailability"
                          id="mariscoTrazaSwitch"
                          defaultChecked={isMariscoTraza}
                          onChange={(e) =>
                            setItemTrazas({
                              ...itemTrazas,
                              isMariscoTraza: !isMariscoTraza,
                            })
                          }
                        />
                      </td>
                      <td>Marisco</td>
                    </tr>
                    <tr>
                      <td>
                        <Form.Check
                          type="switch"
                          className="switchAvailability"
                          id="huevosTrazaSwitch"
                          defaultChecked={isHuevosTraza}
                          onChange={(e) =>
                            setItemTrazas({
                              ...itemTrazas,
                              isHuevosTraza: !isHuevosTraza,
                            })
                          }
                        />
                      </td>
                      <td>Huevos</td>
                    </tr>
                    <tr>
                      <td>
                        <Form.Check
                          type="switch"
                          className="switchAvailability"
                          id="pescadoTrazaSwitch"
                          defaultChecked={isPescadoTraza}
                          onChange={(e) =>
                            setItemTrazas({
                              ...itemTrazas,
                              isPescadoTraza: !isPescadoTraza,
                            })
                          }
                        />
                      </td>
                      <td>Pescado</td>
                    </tr>
                    <tr>
                      <td>
                        <Form.Check
                          type="switch"
                          className="switchAvailability"
                          id="cacahuetesTrazaSwitch"
                          defaultChecked={isCacahuetesTraza}
                          onChange={(e) =>
                            setItemTrazas({
                              ...itemTrazas,
                              isCacahuetesTraza: !isCacahuetesTraza,
                            })
                          }
                        />
                      </td>
                      <td>Cacahuetes</td>
                    </tr>
                    <tr>
                      <td>
                        <Form.Check
                          type="switch"
                          className="switchAvailability"
                          id="sojaTrazaSwitch"
                          defaultChecked={isSojaTraza}
                          onChange={(e) =>
                            setItemTrazas({
                              ...itemTrazas,
                              isSojaTraza: !isSojaTraza,
                            })
                          }
                        />
                      </td>
                      <td>Soja</td>
                    </tr>
                    <tr>
                      <td>
                        <Form.Check
                          type="switch"
                          className="switchAvailability"
                          id="lacteosTrazaSwitch"
                          defaultChecked={isLacteosTraza}
                          onChange={(e) =>
                            setItemTrazas({
                              ...itemTrazas,
                              isLacteosTraza: !isLacteosTraza,
                            })
                          }
                        />
                      </td>
                      <td>Lácteos</td>
                    </tr>
                    <tr>
                      <td>
                        <Form.Check
                          type="switch"
                          className="switchAvailability"
                          id="frutosSecosTrazaSwitch"
                          defaultChecked={isFrutosSecosTraza}
                          onChange={(e) =>
                            setItemTrazas({
                              ...itemTrazas,
                              isFrutosSecosTraza: !isFrutosSecosTraza,
                            })
                          }
                        />
                      </td>
                      <td>Frutos Secos</td>
                    </tr>
                    <tr>
                      <td>
                        <Form.Check
                          type="switch"
                          className="switchAvailability"
                          id="apioTrazaSwitch"
                          defaultChecked={isApioTraza}
                          onChange={(e) =>
                            setItemTrazas({
                              ...itemTrazas,
                              isApioTraza: !isApioTraza,
                            })
                          }
                        />
                      </td>
                      <td>Apio</td>
                    </tr>
                    <tr>
                      <td>
                        <Form.Check
                          type="switch"
                          className="switchAvailability"
                          id="mostazaTrazaSwitch"
                          defaultChecked={isMostazaTraza}
                          onChange={(e) =>
                            setItemTrazas({
                              ...itemTrazas,
                              isMostazaTraza: !isMostazaTraza,
                            })
                          }
                        />
                      </td>
                      <td>Mostaza</td>
                    </tr>
                    <tr>
                      <td>
                        <Form.Check
                          type="switch"
                          className="switchAvailability"
                          id="granosSesamoTrazaSwitch"
                          defaultChecked={isGranosSesamoTraza}
                          onChange={(e) =>
                            setItemTrazas({
                              ...itemTrazas,
                              isGranosSesamoTraza: !isGranosSesamoTraza,
                            })
                          }
                        />
                      </td>
                      <td>Granos de Sésamo</td>
                    </tr>
                    <tr>
                      <td>
                        <Form.Check
                          type="switch"
                          className="switchAvailability"
                          id="sulfitosTrazaSwitch"
                          defaultChecked={isSulfitosTraza}
                          onChange={(e) =>
                            setItemTrazas({
                              ...itemTrazas,
                              isSulfitosTraza: !isSulfitosTraza,
                            })
                          }
                        />
                      </td>
                      <td>Sulfitos</td>
                    </tr>
                    <tr>
                      <td>
                        <Form.Check
                          type="switch"
                          className="switchAvailability"
                          id="altramucesTrazaSwitch"
                          defaultChecked={isAltramucesTraza}
                          onChange={(e) =>
                            setItemTrazas({
                              ...itemTrazas,
                              isAltramucesTraza: !isAltramucesTraza,
                            })
                          }
                        />
                      </td>
                      <td>Altramuces</td>
                    </tr>
                    <tr>
                      <td>
                        <Form.Check
                          type="switch"
                          className="switchAvailability"
                          id="moluscosTrazaSwitch"
                          defaultChecked={isMoluscosTraza}
                          onChange={(e) =>
                            setItemTrazas({
                              ...itemTrazas,
                              isMoluscosTraza: !isMoluscosTraza,
                            })
                          }
                        />
                      </td>
                      <td>Moluscos</td>
                    </tr>
                  </tbody>
                </Table>
              </div>
              <Button variant="secondary" onClick={handleCloseItemModal}>
                Cancelar
              </Button>
              <Button type="submit" variant="primary">
                Aceptar
              </Button>
            </Form>
          )}
        </Modal.Body>
      </Modal>
      <Modal size="lg" show={showFormatsModal} onHide={handleCloseFormatsModal}>
        <Modal.Header closeButton>
          <Modal.Title>Formatos</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form
            onSubmit={
              updateFlag ? updateItemFormatHandler : newItemFormatHandler
            }
          >
            <Form.Group className="mb-4" controlId="newFormatName">
              <Form.Label>Nombre</Form.Label>
              <Form.Control
                type="text"
                required
                value={newItemFormatName ? newItemFormatName : ''}
                onChange={(e) => setNewItemFormatName(e.target.value)}
              />
            </Form.Group>
            <Form.Group className="mb-4" controlId="newFormatPrice">
              <Form.Label>Precio</Form.Label>
              <Form.Control
                type="number"
                required
                value={newItemFormatPrice ? newItemFormatPrice : 0}
                onChange={(e) => setNewItemFormatPrice(e.target.value)}
              />
            </Form.Group>
            <div>
              <Button variant="secondary" onClick={handleCloseFormatsModal}>
                Cancelar
              </Button>
              <Button type="submit" variant="primary">
                Aceptar
              </Button>
            </div>
          </Form>
        </Modal.Body>
      </Modal>
    </>
  );
}
