import axios from 'axios';
import React, { useEffect, useReducer } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import MessageBox from '../components/MessageBox';
import LoadingBox from '../components/LoadingBox';
import { Helmet } from 'react-helmet-async';

const reducer = (state, action) => {
  switch (action.type) {
    case 'FETCH_REQUEST':
      return { ...state, loading: true };
    case 'FETCH_SUCCESS':
      return {
        ...state,
        shop: action.payload.shop,
        carts: action.payload.carts,
        menus: action.payload.menus,
        loading: false,
      };
    case 'FETCH_FAIL':
      return { ...state, loading: false, error: action.payload };
    default:
      return state;
  }
};

export default function ShopScreen() {
  const navigate = useNavigate();
  const params = useParams();
  const { slug } = params;

  const [{ loading, error, shop, carts, menus }, dispatch] = useReducer(
    reducer,
    {
      shop: [],
      carts: [],
      menus: [],
      loading: true,
      error: '',
    }
  );

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

  useEffect(() => {
    if (slug) {
      const addVisit = async () => {
        await axios.put('/api/shops/updateShopViews', { slug }).catch((err) => {
          console.log(err.message);
        });
      };
      addVisit();
    }
  }, [slug]);

  return (
    <div>
      <Helmet>
        <title>Información General</title>
      </Helmet>
      <h1 className="mt-4 mb-5">Información General</h1>
      {loading ? (
        <LoadingBox />
      ) : error ? (
        <MessageBox variant="danger">{error}</MessageBox>
      ) : (
        <div className="products">
          <div className="product" key={shop.slug}>
            <img
              src={`http://localhost:5000/images/shops/${
                shop.image || 'profile-shop-default.png'
              }`}
              alt={shop.name}
            />
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
            {menus.map((menu) => (
              <button
                key={menu.slug}
                onClick={() =>
                  navigate(`/shops/${shop.slug}/menus/${menu.slug}`)
                }
              >
                {menu.name}
              </button>
            ))}
            {carts.map((cart) => (
              <button
                key={cart.slug}
                onClick={() =>
                  navigate(`/shops/${shop.slug}/carts/${cart.slug}`)
                }
              >
                {cart.name}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
