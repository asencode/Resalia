import axios from 'axios';
import React, { useContext, useEffect, useReducer } from 'react';
import { Link } from 'react-router-dom';
import MessageBox from '../components/MessageBox';
import LoadingBox from '../components/LoadingBox';
import { Helmet } from 'react-helmet-async';
import { Resalia } from '../Resalia';

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
  const { state } = useContext(Resalia);
  const { userInfo } = state;

  const [{ shops, error, loading }, dispatch] = useReducer(reducer, {
    shops: [],
    error: '',
    loading: true,
  });

  useEffect(() => {
    const fetchData = async () => {
      dispatch({ type: 'FETCH_REQUEST' });
      try {
        const result = await axios.get(`/api/shops?userId=${userInfo._id}`);
        dispatch({ type: 'FETCH_SUCCESS', payload: result.data });
      } catch (err) {
        dispatch({ type: 'FETCH_FAIL', payload: err.message });
      }
    };
    fetchData();
  }, [userInfo._id]);

  return (
    <div>
      <Helmet>
        <title>Resalia - Establecimientos</title>
      </Helmet>
      <h1 className="mt-4 mb-5">Resalia - Establecimientos</h1>
      {loading ? (
        <LoadingBox />
      ) : error ? (
        <MessageBox variant="danger">{error}</MessageBox>
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
