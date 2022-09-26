import axios from 'axios';
import React, { useEffect, useReducer } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import ErrorMessage from '../components/ErrorMessage';
import LoadingBox from '../components/LoadingBox';

const reducer = (state, action) => {
  switch (action.type) {
    case 'FETCH_REQUEST':
      return { ...state, loading: true };
    case 'FETCH_SUCCESS':
      return { ...state, shop: action.payload, loading: false };
    case 'FETCH_FAIL':
      return { ...state, loading: false, error: action.payload };
    default:
      return state;
  }
};

export default function RestaurantScreen() {
  const navigate = useNavigate();
  const params = useParams();
  const { slug } = params;

  const [{ loading, error, shop }, dispatch] = useReducer(reducer, {
    shop: [],
    loading: true,
    error: '',
  });

  useEffect(() => {
    const fetchData = async () => {
      dispatch({ type: 'FETCH_REQUEST' });
      try {
        const result = await axios.get(`/api/shops/${slug}`);
        dispatch({ type: 'FETCH_SUCCESS', payload: result.data });
      } catch (err) {
        dispatch({ type: 'FETCH_FAIL', payload: err.message });
      }
    };
    fetchData();
  }, [slug]);

  return (
    <div>
      <h1>Información General</h1>
      {loading ? (
        <LoadingBox />
      ) : error ? (
        <ErrorMessage>{error}</ErrorMessage>
      ) : (
        <div className="products">
          <div className="product" key={shop.slug}>
            <img src={shop.image} alt={shop.name} />
            <div className="productInfo">
              <p>{shop.name}</p>
              <p>{shop.address}</p>
              <p>
                {shop.city}, {shop.locality} - {shop.postcode}
              </p>
              <p>{shop.phone1}</p>
              <p>{shop.phone2}</p>
            </div>
          </div>
          <div>
            <button onClick={() => navigate(`/shops/${shop.slug}/menu`)}>
              Ver Menú del Día
            </button>
            <button onClick={() => navigate(`/shops/${shop.slug}/cart`)}>
              Ver Carta
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
