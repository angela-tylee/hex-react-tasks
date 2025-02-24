import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import ReactLoading from 'react-loading';

const { VITE_API_BASE, VITE_API_PATH } = import.meta.env;

const Cart = () => {
  const [cart, setCart] = useState({});
  const [isLoadingOrder, setIsLoadingOrder] = useState(false);
  const [isLoadingRemoveCart, setIsLoadingRemoveCart] = useState(false);
  const [isLoadingQty, setIsLoadingQty] = useState(null);

  useEffect(() => {
    getCart();
  },[])

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

  const getCart = async () => {
    try {
      const res = await axios.get(`${VITE_API_BASE}/api/${VITE_API_PATH}/cart`);
      console.log('cart', res);
      setCart(res.data.data);
    } catch (error) {
      console.error(error);
    }
  };

  const updateQty = async (cartItem, newQty) => {
    setIsLoadingQty(cartItem.id);
    try {
      await axios.put(
        `${VITE_API_BASE}/api/${VITE_API_PATH}/cart/${cartItem.id}`,
        {
          data: {
            product_id: cartItem.product_id,
            qty: newQty,
          },
        }
      );
      setIsLoadingQty(null);
      getCart();
    } catch (error) {
      console.error(error);
      setIsLoadingQty(null);
      alert('失敗，請再試一次');
    }
  };

  const deleteCartItem = async (id) => {
    try {
      const res = await axios.delete(
        `${VITE_API_BASE}/api/${VITE_API_PATH}/cart/${id}`
      );
      alert(res.data.message);
      getCart();
    } catch (error) {
      alert(error.response.data.message);
    }
  };

  const removeCartAll = async () => {
    setIsLoadingRemoveCart(true);
    try {
      const res = await axios.delete(
        `${VITE_API_BASE}/api/${VITE_API_PATH}/carts`
      );
      console.log(res);
      alert('已清空購物車');
      setIsLoadingRemoveCart(false);
      getCart();
    } catch (error) {
      console.error(error);
      setIsLoadingRemoveCart(false);
    }
  };

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
    <>
      <h1>This is Cart</h1>
      <section>
        <div className="text-end">
          <button
            className="btn btn-outline-danger d-flex"
            type="button"
            onClick={removeCartAll}
            disabled={isLoadingRemoveCart}
          >
            <ReactLoading
              type="spinningBubbles"
              width="16px"
              height="16px"
              color="red"
              className={`me-2 ${isLoadingRemoveCart ? '' : 'd-none'}`}
            />
            清空購物車
          </button>
        </div>
        <table className="table align-middle">
          <thead>
            <tr>
              <th></th>
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
                    <button
                      type="button"
                      className="btn-close"
                      onClick={() => {
                        deleteCartItem(cartItem.id);
                      }}
                    ></button>
                  </td>
                  <td>
                    <img
                      src={cartItem.product.imagesUrl[0]}
                      alt={cartItem.product.title}
                      width="120px"
                    />
                  </td>
                  <td>{cartItem.product.title}</td>
                  <td>
                    <div className="input-group">
                      <button
                        className="btn btn-outline-secondary text-dark px-1 px-sm-auto"
                        type="button"
                        id="button-addon1"
                        onClick={() => updateQty(cartItem, cartItem.qty - 1)}
                        disabled={isLoadingQty || cartItem.qty === 1}
                      >
                        <i className="bi bi-dash"></i>
                      </button>
                      {isLoadingQty === cartItem.id ? (
                        <div className="form-control text-center px-1 px-sm-auto">
                          <ReactLoading
                            type="spinningBubbles"
                            width="12px"
                            height="12px"
                            color="gray"
                            className={`mb-3 mx-auto ${
                              isLoadingQty === cartItem.id ? '' : 'd-none'
                            }`}
                          />
                        </div>
                      ) : (
                        <input
                          type="text"
                          className="form-control text-center px-1 px-sm-auto"
                          aria-label="Example text with button addon"
                          aria-describedby="button-addon1"
                          value={cartItem.qty}
                          readOnly
                        />
                      )}

                      <button
                        className="btn btn-outline-secondary text-dark px-1 px-sm-auto"
                        type="button"
                        id="button-addon1"
                        onClick={() => updateQty(cartItem, cartItem.qty + 1)}
                        disabled={isLoadingQty}
                      >
                        <i className="bi bi-plus"></i>
                      </button>
                    </div>
                  </td>
                  <td>{cartItem.product.price}</td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="5" className="text-center py-5">
                  目前購物車沒有商品，
                  <button
                    className="btn btn-link text-dark ps-0"
                    onClick={() =>
                      window.scrollTo({ top: 0, behavior: 'smooth' })
                    }
                  >
                    立刻前往購買
                  </button>
                </td>
              </tr>
            )}
          </tbody>
          <tfoot>
            <tr>
              <td colSpan="4" className="text-end">
                總計
              </td>
              <td>{cart.total}</td>
            </tr>
            <tr>
              <td colSpan="4" className="text-end text-success">
                折扣價
              </td>
              <td className="text-success">{cart.final_total}</td>
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
              <div className="invalid-feedback">{errors?.email?.message}</div>
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
              <div className="invalid-feedback">{errors?.name?.message}</div>
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
              <div className="invalid-feedback">{errors?.tel?.message}</div>
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
              <div className="invalid-feedback">{errors?.address?.message}</div>
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
            <button
              type="submit"
              className="btn btn-danger d-flex"
              disabled={cart.carts?.length === 0}
            >
              <ReactLoading
                type="spinningBubbles"
                width="16px"
                height="16px"
                className={`me-2 ${isLoadingOrder ? '' : 'd-none'}`}
              />
              送出訂單
            </button>
          </div>
        </form>
      </section>
    </>
  );
};

export default Cart;
