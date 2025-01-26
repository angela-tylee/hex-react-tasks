import { useState, useEffect, useRef } from 'react';
import ProductModal from './components/ProductModal';
import Pagination from './components/Pagination';

// const API_BASE = "https://ec-course-api.hexschool.io/v2";
// const API_PATH = "";

const { VITE_API_BASE, VITE_API_PATH } = import.meta.env;

function App() {
  const [products, setProducts] = useState([]);
  const [pagination, setPagination] = useState({});
  const [tempProduct, setTempProduct] = useState([]);
  const [cart, setCart] = useState({});

  const productModalRef = useRef(null);

  useEffect(() => {
    productModalRef.current = new window.bootstrap.Modal('#productModal', {
      keyboard: false,
    });

    getProducts();
    getCart();
  }, []);

  function openProductModal(product) {
    setTempProduct(product);
    productModalRef.current.show();
  }

  function closeProductModal() {
    productModalRef.current.hide();
  }

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

  const getCart = async () => {
    // setIsLoadingCart(true);
    try {
      const res = await axios.get(`${VITE_API_BASE}/api/${VITE_API_PATH}/cart`);
      console.log('cart', res);
      setCart(res.data.data);
      // setIsLoadingCart(false);
    } catch (error) {
      console.error(error);
      // setIsLoadingCart(false);
    }
  };

  const addToCart = async (productId, quantity) => {
    // setIsLoadingItem(productId);
    try {
      const data = {
        data: {
          product_id: productId,
          qty: quantity,
        },
      };
      await axios.post(`${VITE_API_BASE}/api/${VITE_API_PATH}/cart`, data);
      await getCart();
      alert('已加入購物車!');
      // setIsLoadingItem(null);
    } catch (error) {
      // setIsLoadingItem(null);
      console.error(error);
      alert('失敗，請再試一次');
    }
  };

  const submit = async (data) => {
    const order = {
      data: {
        user: {
          name: `${data.firstName} ${data.lastName}`,
          email: data.email,
          tel: data.phone,
          address: `${data.streetAddress}, ${data.city}, ${data.county}, ${data.country} ${data.postCode}`,
        },
        message: '',
      },
    };

    // setIsLoading(true);

    try {
      const res = await axios.post(
        `${VITE_API_BASE}/api/${VITE_API_PATH}/order`,
        order
      );

      if (res.data.orderId) {
        await axios.post(
          `${VITE_API_BASE}/api/${VITE_API_PATH}/pay/${res.data.orderId}`
        );
      }

      // setIsLoading(false);
      getCart();
      // Clear cart and form
      // navigate(`/checkout-success/${res.data.orderId}`);
    } catch (error) {
      console.error(error);
      // setIsLoading(false);
    }
  };

  return (
    <div id="app">
      <div className="container">
        <section className="mt-4">
          {/* 產品Modal */}
          <ProductModal tempProduct={tempProduct} />
          {/* 產品Modal */}
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
                        className="btn btn-outline-secondary"
                        onClick={() => openProductModal(product)}
                      >
                        <i className="fas fa-spinner fa-pulse"></i>
                        查看更多
                      </button>
                      <button
                        type="button"
                        className="btn btn-outline-danger"
                        onClick={() => addToCart(product.id, 1)}
                      >
                        <i className="fas fa-spinner fa-pulse"></i>
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
        <section>
          <div className="text-end">
            <button className="btn btn-outline-danger" type="button">
              清空購物車
            </button>
          </div>
          <table className="table align-middle">
            <thead>
              <tr>
                <th></th>
                <th>品名</th>
                <th style={{ width: '150px' }}>數量</th>
                <th>單價</th>
              </tr>
            </thead>
            <tbody>
              {/* Cart rows here */}
              {cart.carts?.length > 0 ? (
                cart.carts.map((cartItem) => (
                  <tr key={cartItem.product.id}>
                    <td>
                      <img
                        src={cartItem.product.imagesUrl[0]}
                        alt={cartItem.product.title}
                        width="120px"
                      />
                    </td>
                    <td>{cartItem.product.title}</td>
                    <td>{cartItem.qty}</td>
                    <td>{cartItem.product.price}</td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="4" className="text-center py-5">
                    <button
                      className="btn btn-link text-dark"
                      onClick={() =>
                        window.scrollTo({ top: 0, behavior: 'smooth' })
                      }
                    >
                      新增產品到購物車
                    </button>
                  </td>
                </tr>
              )}
            </tbody>
            <tfoot>
              <tr>
                <td colSpan="3" className="text-end">
                  總計
                </td>
                <td className="text-end">{cart.total}</td>
              </tr>
              <tr>
                <td colSpan="3" className="text-end text-success">
                  折扣價
                </td>
                <td className="text-end text-success">{cart.final_total}</td>
              </tr>
            </tfoot>
          </table>
        </section>
        <section className="my-5 row justify-content-center">
          <form className="col-md-6">
            <div className="mb-3">
              <label htmlFor="email" className="form-label">
                Email
              </label>
              <input
                id="email"
                name="email"
                type="email"
                className="form-control"
                placeholder="請輸入 Email"
              />
            </div>

            <div className="mb-3">
              <label htmlFor="name" className="form-label">
                收件人姓名
              </label>
              <input
                id="name"
                name="姓名"
                type="text"
                className="form-control"
                placeholder="請輸入姓名"
              />
            </div>

            <div className="mb-3">
              <label htmlFor="tel" className="form-label">
                收件人電話
              </label>
              <input
                id="tel"
                name="電話"
                type="text"
                className="form-control"
                placeholder="請輸入電話"
              />
            </div>

            <div className="mb-3">
              <label htmlFor="address" className="form-label">
                收件人地址
              </label>
              <input
                id="address"
                name="地址"
                type="text"
                className="form-control"
                placeholder="請輸入地址"
              />
            </div>

            <div className="mb-3">
              <label htmlFor="message" className="form-label">
                留言
              </label>
              <textarea
                id="message"
                className="form-control"
                cols="30"
                rows="10"
              ></textarea>
            </div>
            <div className="text-end">
              <button type="submit" className="btn btn-danger">
                送出訂單
              </button>
            </div>
          </form>
        </section>
      </div>
    </div>
  );
}

// ReactDOM.render(<App />, document.getElementById("app"));

export default App;
