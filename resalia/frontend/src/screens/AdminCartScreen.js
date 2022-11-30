import axios from 'axios';
import React, { useContext, useEffect, useReducer } from 'react';
import { Helmet } from 'react-helmet-async';
import { useNavigate, useParams } from 'react-router-dom';
import { toast } from 'react-toastify';
import LoadingBox from '../components/LoadingBox';
import MessageBox from '../components/MessageBox';
import { Resalia } from '../Resalia';
import { getError } from '../utils';
import Table from 'react-bootstrap/Table';
import Form from 'react-bootstrap/Form';
import { BsEye } from 'react-icons/bs';

const reducer = (state, action) => {
  switch (action.type) {
    case 'FETCH_REQUEST':
      return { ...state, loading: true };
    case 'FETCH_SUCCESS':
      return {
        ...state,
        cart: action.payload.cart,
        currency: action.payload.currency,
        loading: false,
      };
    case 'FETCH_FAIL':
      return { ...state, error: action.payload, loading: false };
    default:
      return state;
  }
};

export default function AdminCartScreen() {
  const navigate = useNavigate();
  const params = useParams();
  const { shop, slug } = params;
  const { state } = useContext(Resalia);
  const { userInfo } = state;

  const [{ cart, currency, error, loading }, dispatch] = useReducer(reducer, {
    cart: {},
    currency: '',
    error: '',
    loading: true,
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
        const result = await axios.get(`/api/shops/${shop}/carts/${slug}`);
        dispatch({ type: 'FETCH_SUCCESS', payload: result.data });
      } catch (err) {
        dispatch({ type: 'FETCH_FAIL', payload: err.message });
        toast.error(getError(err));
      }
    };
    fetchData();
  }, [shop, slug]);

  const handleItemAvailability = async (e, item) => {
    const { slug: itemSlug } = item;
    const available = document.getElementById(itemSlug).checked;

    await axios
      .put(
        '/api/carts/updateItemVisibility',
        { shop, slug, itemSlug, available },
        { headers: { Authorization: `Bearer ${userInfo.token}` } }
      )
      .then((res) => {
        cart.items.map((x) => {
          if (x.slug === itemSlug) {
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
      //TODO: abrir modal y volcar datos del item actual.
      alert(item.slug);
    }
  };

  return (
    <div>
      <Helmet>
        <title>Resalia - Mis Cartas y Menús</title>
      </Helmet>
      {loading ? (
        <LoadingBox />
      ) : error ? (
        <MessageBox variant="danger">{error}</MessageBox>
      ) : (
        <>
          {cart && (
            <div>
              <h1 className="mt-4 mb-5">{cart.name}</h1>
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
                  {cart.items.map((item) => (
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
            </div>
          )}
        </>
      )}
    </div>
  );
}
