import { useState, useEffect } from 'react';
import { NavLink } from 'react-router-dom';
import Pagination from '../../components/Pagination';
import ReactLoading from 'react-loading';
import { createAsyncMessage } from '../../store/messageSlice';
import { useDispatch } from 'react-redux';

const { VITE_API_BASE, VITE_API_PATH } = import.meta.env;

const Products = () => {

  const [products, setProducts] = useState([]);
  const [pagination, setPagination] = useState({});
  
  const [isLoadingCartItem, setIsLoadingCartItem] = useState(null);

  const dispatch = useDispatch();

  useEffect(() => {
    getProducts();
  }, []);

  const getProducts = async (page) => {
    try {
      const res = await axios.get(
        `${VITE_API_BASE}/api/${VITE_API_PATH}/products?page=${page}`
      );
      console.log('product', res);
      setProducts(res.data.products);
      setPagination(res.data.pagination);
    } catch (error) {
      console.error(error);
    }
  };
  const addToCart = async (productId, quantity) => {
    setIsLoadingCartItem(productId);
    try {
      const data = {
        data: {
          product_id: productId,
          qty: quantity,
        },
      };
      const res = await axios.post(`${VITE_API_BASE}/api/${VITE_API_PATH}/cart`, data);
      // alert('已加入購物車!');
      dispatch(createAsyncMessage(res.data));
      setIsLoadingCartItem(null);
    } catch (error) {
      setIsLoadingCartItem(null);
      console.error(error);
      // alert('失敗，請再試一次');
      dispatch(createAsyncMessage(error.response.data));
    }
  };


  return (
    <section className="mt-4">
      <table className="table align-middle">
        <thead>
          <tr>
            <th>圖片</th>
            <th>商品名稱</th>
            <th>價格</th>
            <th></th>
          </tr>
        </thead>
        <tbody>
          {products.map((product) => (
            <tr key={product.id}>
              <td style={{ width: '120px' }}>
                <div
                  style={{
                    height: '100px',
                    backgroundImage: `url(${product.imagesUrl[0]})`,
                    backgroundSize: 'cover',
                    backgroundPosition: 'center',
                  }}
                ></div>
              </td>
              <td>{product.title}</td>
              <td>
                <div className="h5">
                  {product.price}
                  <del className="h5 ms-3">{product.origin_price}</del>
                </div>
              </td>
              <td>
                <div className="btn-group btn-group-sm">
                  <button
                    type="button"
                    className="btn btn-outline-secondary d-flex"
                    // onClick={() => openProductModal(product)}
                  >
                    <NavLink to={`/product/${product.id}`} className="text-decoration-none">查看更多</NavLink>
                  </button>
                  <button
                    type="button"
                    className="btn btn-outline-danger d-flex"
                    onClick={() => addToCart(product.id, 1)}
                    disabled={isLoadingCartItem === product.id}
                  >
                    <ReactLoading
                      type="spinningBubbles"
                      width="16px"
                      height="16px"
                      color="red"
                      className={`me-2 ${
                        isLoadingCartItem === product.id ? '' : 'd-none'
                      }`}
                    />
                    加到購物車
                  </button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      <Pagination
        pagination={pagination}
        paginationTotal={pagination.total_pages}
        changePage={getProducts}
      />
    </section>
  )
}

export default Products;