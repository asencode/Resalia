import React, { useEffect, useReducer } from 'react';
import axios from 'axios';
import { Link, useParams } from 'react-router-dom';
import LoadingBox from '../components/LoadingBox';
import MessageBox from '../components/MessageBox';
import { Helmet } from 'react-helmet-async';

const reducer = (state, action) => {
  switch (action.type) {
    case 'FETCH_REQUEST':
      return { ...state, loading: true };
    case 'FETCH_SUCCESS':
      return { ...state, menu: action.payload, loading: false };
    case 'FETCH_FAIL':
      return { ...state, error: action.payload, loading: false };
    default:
      return state;
  }
};

export default function MenuScreen() {
  const params = useParams();
  const { shop, slug } = params;

  const [{ loading, error, menu }, dispatch] = useReducer(reducer, {
    loading: true,
    error: '',
    menu: {},
  });

  useEffect(() => {
    const fetchData = async () => {
      dispatch({ type: 'FETCH_REQUEST' });
      try {
        const result = await axios.get(`/api/shops/${shop}/menus/${slug}`);
        dispatch({ type: 'FETCH_SUCCESS', payload: result.data });
      } catch (err) {
        dispatch({ type: 'FETCH_FAIL', payload: err.message });
      }
    };
    fetchData();
  }, [shop, slug]);

  return (
    <div>
      <Helmet>
        <title>Menú del día</title>
      </Helmet>
      <h1 className="mt-4 mb-5">Menú del día</h1>
      {loading ? (
        <LoadingBox />
      ) : error ? (
        <MessageBox variant="danger">{error}</MessageBox>
      ) : (
        <div className="products">
          <h4>{menu.name}</h4>
          {menu.items.map((item) => (
            <div className="product" key={item.slug}>
              <Link to={`/shops/${shop}/menu/${menu.slug}/${item.slug}`}>
                <img src={item.image} alt={item.name} />
              </Link>
              <div className="productInfo">
                <Link to={`/shops/${shop}/menu/${menu.slug}/${item.slug}`}>
                  <p>{item.name}</p>
                </Link>
                <p>
                  <i>{item.category}</i>
                </p>
                <p>
                  <strong>{item.price}€</strong>
                </p>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
