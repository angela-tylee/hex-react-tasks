import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { createAsyncMessage } from '../../store/messageSlice';
import { useDispatch } from 'react-redux';

const { VITE_API_BASE, VITE_API_PATH } = import.meta.env;

const ProductPage = () => {
  const { id } = useParams();

  const [product, setProduct] = useState({});
  const [cartQty, setCartQty] = useState(1);
  const [isLoading, setIsLoading] = useState(false);

  const dispatch = useDispatch();


  const getProduct = async (id) => {
    try {
      const res = await axios.get(
        `${VITE_API_BASE}/api/${VITE_API_PATH}/product/${id}`
      );
      console.log('product', res);
      setProduct(res.data.product);
    } catch (error) {
      console.error(error);
    }
  };

  const addToCart = async (productId, quantity) => {
    setIsLoading(productId);
    try {
      const data = {
        data: {
          product_id: productId,
          qty: quantity,
        },
      };
      const res = await axios.post(`${VITE_API_BASE}/api/${VITE_API_PATH}/cart`, data);
      // await getCart();
      // alert('已加入購物車!');
      dispatch(createAsyncMessage(res.data));
      setIsLoading(null);
    } catch (error) {
      setIsLoading(null);
      console.error(error);
      // alert('失敗，請再試一次');
      dispatch(createAsyncMessage(error.response.data));
    }
  };

  useEffect(() => {
    getProduct(id);
  }, [id]);

  return (
    <div>
      <div className="row">
        <div className="col-sm-4">
          <div className="mb-2">
            {product.imagesUrl &&
              product.imagesUrl.map((image, index) => (
                <img
                  key={index}
                  className="img-fluid"
                  src={image}
                  alt={`img-${index + 1}`}
                />
              ))}
          </div>
          <div className="mt-3">
            <div className="row">
              <div className="col-md-6">
                原價：<del>{product.origin_price}</del>
              </div>
              <div className="col-md-6">特價：{product.price}</div>
            </div>
            <hr />
            <div className="input-group">
              <button
                className="btn btn-outline-secondary text-dark"
                type="button"
                id="button-addon1"
                onClick={() =>
                  setCartQty((pre) => (pre === 1 ? pre : pre - 1))
                }
              >
                <i className="bi bi-dash-lg "></i>
              </button>
              <input
                type="text"
                className="form-control text-center"
                placeholder=""
                aria-label=""
                value={cartQty}
                readOnly
              />
              <button
                className="btn btn-outline-secondary text-dark"
                type="button"
                id="button-addon1"
                onClick={() => setCartQty((pre) => pre + 1)}
              >
                <i className="bi bi-plus-lg"></i>
              </button>
            </div>
            <button
              type="button"
              className="btn btn-primary w-100 mt-3"
              onClick={() => {
                addToCart(product.id, cartQty);
              }}
              disabled={isLoading}
            >
              <div
                className={`spinner-border spinner-border-sm text-light opacity-50 me-1 ${
                  isLoading ? '' : 'd-none'
                }`}
                role="status"
              >
                <span className="visually-hidden">Loading...</span>
              </div>
              Add to Cart
            </button>
          </div>
        </div>
        <div className="col-sm-8">
          <div className="mb-3">
            <h2 className="fs-5">
              {product.title}
              <span className="badge rounded-pill text-bg-primary ms-3">
                {product.category}
              </span>
            </h2>
          </div>

          <div
            className="mb-3 text-start"
            dangerouslySetInnerHTML={{ __html: product.description }}
          ></div>
          <hr />
          <div
            className="mb-3 text-start"
            dangerouslySetInnerHTML={{
              __html: product.content?.info,
            }}
          ></div>
          <div
            className="mb-3 text-start"
            dangerouslySetInnerHTML={{
              __html: product.content?.size,
            }}
          ></div>
          <div
            className="mb-3 text-start"
            dangerouslySetInnerHTML={{
              __html: product.content?.maintenance,
            }}
          ></div>
        </div>
      </div>
    </div>
  );
};

export default ProductPage;
