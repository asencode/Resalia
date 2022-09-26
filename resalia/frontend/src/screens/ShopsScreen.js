import axios from 'axios';
import React, { useEffect, useReducer } from 'react';
import { Link } from 'react-router-dom';
import ErrorMessage from '../components/ErrorMessage';
import LoadingBox from '../components/LoadingBox';

const reducer = (state, action) => {
  switch (action.type) {
    case 'FETCH_REQUEST':
      return { ...state, loading: true };
    case 'FETCH_SUCCESS':
      return { ...state, shops: action.payload, loading: false };
    case 'FETCH_FAIL':
      return { ...state, error: action.payload, loading: false };
    default:
      return state;
  }
};

export default function ShopsScreen() {
  const [{ shops, error, loading }, dispatch] = useReducer(reducer, {
    shops: [],
    error: '',
    loading: true,
  });

  useEffect(() => {
    const fetchData = async () => {
      dispatch({ type: 'FETCH_REQUEST' });
      try {
        const result = await axios.get('/api/shops');
        dispatch({ type: 'FETCH_SUCCESS', payload: result.data });
      } catch (err) {
        dispatch({ type: 'FETCH_FAIL', payload: err.message });
      }
    };
    fetchData();
  }, []);

  return (
    <div>
      <h1>Shops</h1>
      {loading ? (
        <LoadingBox />
      ) : error ? (
        <ErrorMessage>{error}</ErrorMessage>
      ) : (
        <div className="products">
          {shops.map((shop) => (
            <div className="product" key={shop.slug}>
              <Link to={`/shops/${shop.slug}`}>
                <img src={shop.image} alt={shop.name} />
              </Link>
              <div className="productInfo">
                <Link to={`/shops/${shop.slug}`}>
                  <p>{shop.name}</p>
                </Link>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
