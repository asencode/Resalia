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
      return { ...state, items: action.payload, loading: false };
    case 'FETCH_FAIL':
      return { ...state, error: action.payload, loading: false };
    default:
      return state;
  }
};

export default function MenuScreen() {
  const params = useParams();
  const { slug } = params;

  const [{ loading, error, items }, dispatch] = useReducer(reducer, {
    loading: true,
    error: '',
    items: [],
  });

  useEffect(() => {
    const fetchData = async () => {
      dispatch({ type: 'FETCH_REQUEST' });
      try {
        const result = await axios.get(`/api/shops/${slug}/menu`);
        dispatch({ type: 'FETCH_SUCCESS', payload: result.data });
      } catch (err) {
        dispatch({ type: 'FETCH_FAIL', payload: err.message });
      }
    };
    fetchData();
  }, [slug]);

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
          {items.map((item) => (
            <div className="product" key={item.slug}>
              <Link to={`/product/${item.slug}`}>
                <img src={item.image} alt={item.name} />
              </Link>
              <div className="productInfo">
                <Link to={`/product/${item.slug}`}>
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
