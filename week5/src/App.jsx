import { useState, useEffect, useRef } from 'react';
import ProductModal from './components/ProductModal';
import Pagination from './components/Pagination';
import { useForm } from "react-hook-form";
import ReactLoading from 'react-loading';

// const API_BASE = "https://ec-course-api.hexschool.io/v2";
// const API_PATH = "";

const { VITE_API_BASE, VITE_API_PATH } = import.meta.env;

function App() {
  const [products, setProducts] = useState([]);
  const [pagination, setPagination] = useState({});
  const [tempProduct, setTempProduct] = useState([]);
  const [cart, setCart] = useState({});
  
  const [isLoadingOrder, setIsLoadingOrder] = useState(false);
  const [isLoadingRemoveCart, setIsLoadingRemoveCart] = useState(false);
  const [isLoadingCartItem, setIsLoadingCartItem] = useState(null);

  const productModalRef = useRef(null);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm({
    defaultValues: {
      email: '',
      name: '',
      tel: '',
      address: '',
      message: '',
    },
    mode: 'onTouched',
  });

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
    try {
      const res = await axios.get(`${VITE_API_BASE}/api/${VITE_API_PATH}/cart`);
      console.log('cart', res);
      setCart(res.data.data);
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
      await axios.post(`${VITE_API_BASE}/api/${VITE_API_PATH}/cart`, data);
      await getCart();
      alert('已加入購物車!');
      setIsLoadingCartItem(null);
    } catch (error) {
      setIsLoadingCartItem(null);
      console.error(error);
      alert('失敗，請再試一次');
    }
  };

  const removeCartAll = async () => {
    setIsLoadingRemoveCart(true);
    try {
      const res = await axios.delete(`${VITE_API_BASE}/api/${VITE_API_PATH}/carts`)
      console.log(res);
      alert("已清空購物車")
      setIsLoadingRemoveCart(false);
      getCart();
    } catch (error) {
      console.error(error);
      setIsLoadingRemoveCart(false);
    }
  }

  const onSubmit = async (data) => {
    const order = {
      data: {
        user: {
          name: data.name,
          email: data.email,
          tel: data.tel,
          address: data.address,
        },
        message: data.message,
      },
    };

    setIsLoadingOrder(true);

    try {
      const res = await axios.post(
        `${VITE_API_BASE}/api/${VITE_API_PATH}/order`,
        order
      );

      console.log(res);
      if (res.data.orderId) {
        await axios.post(
          `${VITE_API_BASE}/api/${VITE_API_PATH}/pay/${res.data.orderId}`
        );
      }

      setIsLoadingOrder(false);
      reset();
      alert(res.data.message);
      getCart();

    } catch (error) {
      console.error(error);
      setIsLoadingOrder(false);
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
                        className="btn btn-outline-secondary d-flex"
                        onClick={() => openProductModal(product)}
                      >
                        查看更多
                      </button>
                      <button
                        type="button"
                        className="btn btn-outline-danger d-flex"
                        onClick={() => addToCart(product.id, 1)}
                        disabled={isLoadingCartItem === product.id}
                      >
                        <ReactLoading type="spinningBubbles" width="16px" height="16px" color="red" className={`me-2 ${isLoadingCartItem === product.id ? '' : 'd-none'}`}/>
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
            <button className="btn btn-outline-danger d-flex" type="button"
            onClick={removeCartAll}
            disabled={isLoadingRemoveCart}
            >
              <ReactLoading type="spinningBubbles" width="16px" height="16px" color="red" className={`me-2 ${isLoadingRemoveCart ? '': 'd-none'}`}/>
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
          <form className="col-md-6" onSubmit={handleSubmit(onSubmit)}>
            <div className="mb-3">
              <label htmlFor="email" className="form-label">
                Email<span className="text-danger">*</span>
              </label>
              <input
                id="email"
                type="email"
                className={`form-control ${errors.email && 'is-invalid'}`}
                placeholder="請輸入 Email"
                {...register('email', {
                  required: {
                    value: true,
                    message: 'Email 為必填',
                  },
                  pattern: {
                    value: /^\S+@\S+$/i,
                    message: 'Email 格式錯誤',
                  },
                })}
              />
              {errors.email && (
                <div className="invalid-feedback">
                  {errors?.email?.message}
                </div>
              )}
            </div>

            <div className="mb-3">
              <label htmlFor="name" className="form-label">
                收件人姓名<span className="text-danger">*</span>
              </label>
              <input
                id="name"
                type="text"
                className={`form-control ${errors.name && 'is-invalid'}`}
                placeholder="請輸入姓名"
                {...register('name', {
                  required: {
                    value: true,
                    message: '姓名為必填',
                  },
                })}
              />
              {errors.name && (
                <div className="invalid-feedback">
                  {errors?.name?.message}
                </div>
              )}
            </div>

            <div className="mb-3">
              <label htmlFor="tel" className="form-label">
                收件人電話<span className="text-danger">*</span>
              </label>
              <input
                id="tel"
                name="電話"
                type="tel"
                className={`form-control ${errors.tel && 'is-invalid'}`}
                placeholder="請輸入電話"
                {...register('tel', {
                  required: {
                    value: true,
                    message: '電話為必填',
                  },
                  minLength: {
                    value: 8,
                    message: '電話需至少 8 碼',
                  },
                })}
              />
              {errors.tel && (
                <div className="invalid-feedback">
                  {errors?.tel?.message}
                </div>
              )}
            </div>

            <div className="mb-3">
              <label htmlFor="address" className="form-label">
                收件人地址<span className="text-danger">*</span>
              </label>
              <input
                id="address"
                type="text"
                className={`form-control ${errors.address && 'is-invalid'}`}
                placeholder="請輸入地址"
                {...register('address', {
                  required: {
                    value: true,
                    message: '地址為必填',
                  },
                })}
              />
              {errors.address && (
                <div className="invalid-feedback">
                  {errors?.address?.message}
                </div>
              )}
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
              <button type="submit" className="btn btn-danger d-flex"
              disabled={cart.carts?.length === 0}>
                <ReactLoading type="spinningBubbles" width="16px" height="16px" className={`me-2 ${isLoadingOrder ? '': 'd-none'}`}/>
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
