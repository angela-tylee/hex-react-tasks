import { useState, useEffect, useRef } from 'react';
import ProductModal from './components/ProductModal';
import Pagination from './components/Pagination';

// const API_BASE = 'https://ec-course-api.hexschool.io/v2';
// const API_PATH = 'angela-carpento';

const {VITE_API_BASE, VITE_API_PATH} = import.meta.env;

function App() {
  const [formData, setFormData] = useState({
    username: '',
    password: '',
  });
  const [isAuth, setIsAuth] = useState(false);
  const [products, setProducts] = useState([]);
  const [tempProduct, setTempProduct] = useState({});
  const [pagination, setPagination] = useState({});
  // const [tempData, setTempData] = useState({
  //   title: '',
  //   category: '',
  //   origin_price: 0,
  //   price: 0,
  //   unit: 'unit',
  //   description: '',
  //   content: {
  //     info: '',
  //     size: '',
  //     maintenance: '',
  //   },
  //   is_enabled: 1,
  //   imageUrl: '',
  //   imagesUrl: [],
  //   tag: '',
  // });
  const [type, setType] = useState('');
  const productModalRef = useRef(null);

  useEffect(() => {
    const token = document.cookie
      .split('; ')
      .find((row) => row.startsWith('hexToken='))
      ?.split('=')[1];

    axios.defaults.headers.common['Authorization'] = token;

    checkAdmin();

    productModalRef.current = new window.bootstrap.Modal('#productModal', {
      keyboard: false,
    });

    getProducts();
  }, []);

  // useEffect(() => {
  //   if (type === 'create') {
  //     setTempData({
  //       title: '',
  //       category: '',
  //       origin_price: 0,
  //       price: 0,
  //       unit: 'unit',
  //       description: '',
  //       content: {
  //         info: '',
  //         size: '',
  //         maintenance: '',
  //       },
  //       is_enabled: 1,
  //       imageUrl: '',
  //       imagesUrl: [],
  //       tag: '',
  //     });
  //   } else if (type === 'edit') {
  //     setTempData(tempProduct);
  //   }
  // }, [type, tempProduct]);

  function openProductModal(type, product) {
    setTempProduct(product);
    setType(type);
    productModalRef.current.show();
  }

  function closeProductModal() {
    productModalRef.current.hide();
  }

  // const handleProductInputChange = (e) => {
  //   const { name, value, checked } = e.target;

  //   if (['info', 'size', 'maintenance'].includes(name)) {
  //     setTempData((tempData) => ({
  //       ...tempData,
  //       content: {
  //         ...tempData.content,
  //         [name]: value,
  //       },
  //     }));
  //   } else if (['price', 'origin_price'].includes(name)) {
  //     setTempData({
  //       ...tempData,
  //       [name]: Number(value),
  //     });
  //   } else if (name === 'is_enabled') {
  //     setTempData({
  //       ...tempData,
  //       [name]: Number(checked),
  //     });
  //   // } else if (name === 'imagesUrl') {
  //   //   addImages(e);
  //   } else {
  //     setTempData({
  //       ...tempData,
  //       [name]: value,
  //     });
  //   }
  // };

  // const [ imageUrl, setImageUrl] = useState("");

  // const addImages = (e) => {
  //   e.preventDefault();

  //   if (tempData.imagesUrl.length >= 3) {
  //     alert('最多上傳 3 張照片');
  //     return;
  //   }

  //   setTempData({
  //     ...tempData,
  //     imagesUrl: [...tempData.imagesUrl, imageUrl],
  //   });

  //   setImageUrl('');
  // };

  // const removeImage = () => {
  //   setTempData((prevData) => {
  //     const images = [...prevData.imagesUrl];
  //     images.pop();
  //     return { ...prevData, imagesUrl: images };
  //   });
  // }

  // const handleProductSubmit = async () => {
  //   try {
  //     let api = `${API_BASE}/api/${API_PATH}/admin/product`;
  //     let method = 'post';
  //     if (type === 'edit') {
  //       method = 'put';
  //       api = `${API_BASE}/api/${API_PATH}/admin/product/${tempProduct.id}`;
  //     }
  //     const res = await axios[method](api, {
  //       data: tempData,
  //     });

  //     console.log(res);
  //     closeProductModal();
  //     getProducts();
  //   } catch (error) {
  //     console.error(error);
  //   }
  // };

  const deleteProduct = async (id) => {
    try {
      const res = await axios.delete(
        `${VITE_API_BASE}/api/${VITE_API_PATH}/admin/product/${id}`
      );
      console.log(res);
      alert(res.data.message);
      getProducts();
    } catch (error) {
      console.error(error);
    }
  };

  const checkAdmin = async () => {
    try {
      await axios.post(`${VITE_API_BASE}/api/user/check`);
      setIsAuth(true);
    } catch (err) {
      console.log(err.response.data.message);
    }
  };

  const handleInputChange = (e) => {
    const { id, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [id]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post(`${VITE_API_BASE}/admin/signin`, formData);
      const { token, expired } = response.data;
      document.cookie = `hexToken=${token};expires=${new Date(expired)};`;
      axios.defaults.headers.common.Authorization = token;
      setIsAuth(true);
    } catch (error) {
      alert('登入失敗: ' + error.response.data.message);
    }
  };

  const getProducts = async (page) => {
    try {
      const res = await axios.get(`${VITE_API_BASE}/api/${VITE_API_PATH}/admin/products?page=${page}`);
      console.log(res);
      setProducts(res.data.products);
      setPagination(res.data.pagination);
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <>
      {isAuth ? (
        <div>
          <div className="container">
            <div className="text-end mt-4">
              <button
                className="btn btn-primary"
                onClick={() => openProductModal('create', {})}
              >
                建立新的產品
              </button>
            </div>
            <table className="table mt-4">
              <thead>
                <tr>
                  <th width="120">分類</th>
                  <th>產品名稱</th>
                  <th width="120">原價</th>
                  <th width="120">售價</th>
                  <th width="100">是否啟用</th>
                  <th width="120">編輯</th>
                </tr>
              </thead>
              <tbody>
                {products &&
                  products.map((product) => (
                    <tr key={product.id}>
                      <td>{product.category}</td>
                      <td>{product.title}</td>
                      <td className="text-end">{product.origin_price}</td>
                      <td className="text-end">{product.price}</td>
                      <td>
                        {product.is_enabled ? (
                          <span className="text-success">啟用</span>
                        ) : (
                          <span>未啟用</span>
                        )}
                      </td>
                      <td>
                        <div className="btn-group">
                          <button
                            type="button"
                            className="btn btn-outline-primary btn-sm"
                            onClick={() => {
                              openProductModal('edit', product);
                            }}
                          >
                            編輯
                          </button>
                          <button
                            type="button"
                            className="btn btn-outline-danger btn-sm"
                            onClick={() => {
                              deleteProduct(product.id);
                            }}
                          >
                            刪除
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
          </div>
        </div>
      ) : (
        <div className="container login">
          <div className="row justify-content-center">
            <h1 className="h3 mb-3 font-weight-normal">請先登入</h1>
            <div className="col-8">
              <form id="form" className="form-signin" onSubmit={handleSubmit}>
                <div className="form-floating mb-3">
                  <input
                    type="email"
                    className="form-control"
                    id="username"
                    placeholder="name@example.com"
                    value={formData.username}
                    onChange={handleInputChange}
                    required
                    autoFocus
                  />
                  <label htmlFor="username">Email address</label>
                </div>
                <div className="form-floating">
                  <input
                    type="password"
                    className="form-control"
                    id="password"
                    placeholder="Password"
                    value={formData.password}
                    onChange={handleInputChange}
                    required
                  />
                  <label htmlFor="password">Password</label>
                </div>
                <button
                  className="btn btn-lg btn-primary w-100 mt-3"
                  type="submit"
                >
                  登入
                </button>
              </form>
            </div>
          </div>
          <p className="mt-5 mb-3 text-muted">&copy; 2024~∞ - 六角學院</p>
        </div>
      )}
      <ProductModal
        type={type}
        tempProduct={tempProduct}
        closeProductModal={closeProductModal}
        getProducts={getProducts}
      />
    </>
  );
}

export default App;
