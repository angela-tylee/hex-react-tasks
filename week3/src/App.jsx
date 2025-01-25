import { useState, useEffect, useRef } from 'react';

const API_BASE = 'https://ec-course-api.hexschool.io/v2';
const API_PATH = 'angela-carpento';

function App() {
  const [formData, setFormData] = useState({
    username: '',
    password: '',
  });
  const [isAuth, setIsAuth] = useState(false);
  const [products, setProducts] = useState([]);
  const [tempProduct, setTempProduct] = useState({});
  const [tempData, setTempData] = useState({
    title: '',
    category: '',
    origin_price: 0,
    price: 0,
    unit: 'unit',
    description: '',
    content: {
      info: '',
      size: '',
      maintenance: '',
    },
    is_enabled: 1,
    imageUrl: '',
    imagesUrl: [],
    tag: '',
  });
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

  useEffect(() => {
    if (type === 'create') {
      setTempData({
        title: '',
        category: '',
        origin_price: 0,
        price: 0,
        unit: 'unit',
        description: '',
        content: {
          info: '',
          size: '',
          maintenance: '',
        },
        is_enabled: 1,
        imageUrl: '',
        imagesUrl: [],
        tag: '',
      });
    } else if (type === 'edit') {
      setTempData(tempProduct);
    }
  }, [type, tempProduct]);

  function openProductModal(type, product) {
    setTempProduct(product);
    setType(type);
    console.log('openProductModal', type, product);
    productModalRef.current.show();
  }

  function closeProductModal() {
    productModalRef.current.hide();
  }

  const handleProductInputChange = (e) => {
    const { name, value, checked } = e.target;

    if (['info', 'size', 'maintenance'].includes(name)) {
      setTempData((tempData) => ({
        ...tempData,
        content: {
          ...tempData.content,
          [name]: value,
        },
      }));
    } else if (['price', 'origin_price'].includes(name)) {
      setTempData({
        ...tempData,
        [name]: Number(value),
      });
    } else if (name === 'is_enabled') {
      setTempData({
        ...tempData,
        [name]: Number(checked),
      });
    // } else if (name === 'imagesUrl') {
    //   addImages(e);
    } else {
      setTempData({
        ...tempData,
        [name]: value,
      });
    }
  };

  const [ imageUrl, setImageUrl] = useState("");

  const addImages = (e) => {
    e.preventDefault();

    if (tempData.imagesUrl.length >= 3) {
      alert('最多上傳 3 張照片');
      return;
    }

    setTempData({
      ...tempData,
      imagesUrl: [...tempData.imagesUrl, imageUrl],
    });

    setImageUrl('');
  };

  const removeImage = () => {
    setTempData((prevData) => {
      const images = [...prevData.imagesUrl];
      images.pop();
      return { ...prevData, imagesUrl: images };
    });
  }

  const handleProductSubmit = async () => {
    try {
      let api = `${API_BASE}/api/${API_PATH}/admin/product`;
      let method = 'post';
      if (type === 'edit') {
        method = 'put';
        api = `${API_BASE}/api/${API_PATH}/admin/product/${tempProduct.id}`;
      }
      const res = await axios[method](api, {
        data: tempData,
      });

      console.log(res);
      closeProductModal();
      getProducts();
    } catch (error) {
      console.error(error);
    }
  };

  const deleteProduct = async (id) => {
    try {
      const res = await axios.delete(`${API_BASE}/api/${API_PATH}/admin/product/${id}`)
      console.log(res);
      alert(res.data.message);
      getProducts();
    } catch (error) {
      console.error(error);
    }
  }

  const checkAdmin = async () => {
    try {
      await axios.post(`${API_BASE}/api/user/check`);
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
      const response = await axios.post(`${API_BASE}/admin/signin`, formData);
      const { token, expired } = response.data;
      document.cookie = `hexToken=${token};expires=${new Date(expired)};`;
      axios.defaults.headers.common.Authorization = token;
      setIsAuth(true);
    } catch (error) {
      alert('登入失敗: ' + error.response.data.message);
    }
  };

  const getProducts = async () => {
    try {
      const res = await axios.get(`${API_BASE}/api/${API_PATH}/admin/products`);
      console.log(products);
      setProducts(res.data.products);
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
                              deleteProduct(product.id)
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
      <div
        id="productModal"
        className="modal fade"
        tabIndex="-1"
        aria-labelledby="productModalLabel"
        aria-hidden="true"
      >
        <div className="modal-dialog modal-xl">
          <div className="modal-content border-0">
            <div className="modal-header bg-dark text-white">
              <h5 id="productModalLabel" className="modal-title">
                <span>新增產品</span>
              </h5>
              <button
                type="button"
                className="btn-close"
                data-bs-dismiss="modal"
                aria-label="Close"
              ></button>
            </div>
            <div className="modal-body">
              <div className="row">
                <div className="col-sm-4">
                  <form className="mb-2" onSubmit={addImages}>
                    <div className="mb-3">
                      <label htmlFor="imageUrl" className="form-label">
                        輸入圖片網址
                      </label>
                      <input
                        type="text"
                        className="form-control"
                        placeholder="請輸入圖片連結"
                        id="imageUrl"
                        name="imageUrl"
                        value={imageUrl}
                        onChange={(e) => {setImageUrl(e.target.value)}}
                      />
                    </div>
                    {tempData.imagesUrl && tempData.imagesUrl.map((image, index) => (
                      <img key={index} className="img-fluid" src={image} alt="" />
                    ))}
                    <button className="btn btn-outline-primary btn-sm d-block w-100">
                      新增圖片
                    </button>
                  </form>
                    <div>
                      <button className="btn btn-outline-danger btn-sm d-block w-100" onClick={removeImage}>
                        刪除圖片
                      </button>
                    </div>
                </div>
                <div className="col-sm-8">
                  <div className="mb-3">
                    <label htmlFor="title" className="form-label">
                      標題
                    </label>
                    <input
                      id="title"
                      type="text"
                      className="form-control"
                      placeholder="請輸入標題"
                      name="title"
                      value={tempData.title}
                      onChange={handleProductInputChange}
                    />
                  </div>

                  <div className="row">
                    <div className="mb-3 col-md-6">
                      <label htmlFor="category" className="form-label">
                        分類
                      </label>
                      <input
                        id="category"
                        type="text"
                        className="form-control"
                        placeholder="請輸入分類"
                        name="category"
                        value={tempData.category}
                        onChange={handleProductInputChange}
                      />
                    </div>
                    <div className="mb-3 col-md-6">
                      <label htmlFor="unit" className="form-label">
                        單位
                      </label>
                      <input
                        id="unit"
                        type="text"
                        className="form-control"
                        placeholder="請輸入單位"
                        name="unit"
                        value={tempData.unit}
                        onChange={handleProductInputChange}
                      />
                    </div>
                  </div>

                  <div className="row">
                    <div className="mb-3 col-md-6">
                      <label htmlFor="origin_price" className="form-label">
                        原價
                      </label>
                      <input
                        id="origin_price"
                        type="number"
                        min="0"
                        className="form-control"
                        placeholder="請輸入原價"
                        name="origin_price"
                        value={tempData.origin_price}
                        onChange={handleProductInputChange}
                      />
                    </div>
                    <div className="mb-3 col-md-6">
                      <label htmlFor="price" className="form-label">
                        售價
                      </label>
                      <input
                        id="price"
                        type="number"
                        min="0"
                        className="form-control"
                        placeholder="請輸入售價"
                        name="price"
                        value={tempData.price}
                        onChange={handleProductInputChange}
                      />
                    </div>
                  </div>
                  <hr />

                  <div className="mb-3">
                    <label htmlFor="description" className="form-label">
                      產品描述
                    </label>
                    <textarea
                      id="description"
                      className="form-control"
                      placeholder="請輸入產品描述"
                      name="description"
                      value={tempData.description}
                      onChange={handleProductInputChange}
                    ></textarea>
                  </div>
                  <div className="mb-3">
                    <label htmlFor="info" className="form-label">
                      說明內容：Info
                    </label>
                    <textarea
                      id="info"
                      className="form-control"
                      placeholder="請輸入說明內容"
                      name="info"
                      value={tempData.content.info}
                      onChange={handleProductInputChange}
                    ></textarea>
                  </div>
                  <div className="mb-3">
                    <label htmlFor="size" className="form-label">
                      說明內容：Size
                    </label>
                    <textarea
                      id="size"
                      className="form-control"
                      placeholder="請輸入說明內容"
                      name="size"
                      value={tempData.content.size}
                      onChange={handleProductInputChange}
                    ></textarea>
                  </div>
                  <div className="mb-3">
                    <label htmlFor="maintenance" className="form-label">
                      說明內容：Maintenance
                    </label>
                    <textarea
                      id="maintenance"
                      className="form-control"
                      placeholder="請輸入說明內容"
                      name="maintenance"
                      value={tempData.content.maintenance}
                      onChange={handleProductInputChange}
                    ></textarea>
                  </div>
                  <div className="mb-3">
                    <div className="form-check">
                      <input
                        id="is_enabled"
                        className="form-check-input"
                        type="checkbox"
                        name="is_enabled"
                        value={tempData.is_enabled}
                        onChange={handleProductInputChange}
                      />
                      <label className="form-check-label" htmlFor="is_enabled">
                        是否啟用
                      </label>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div className="modal-footer">
              <button
                type="button"
                className="btn btn-outline-secondary"
                data-bs-dismiss="modal"
              >
                取消
              </button>
              <button type="button" className="btn btn-primary" onClick={handleProductSubmit}>
                確認
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

// ReactDOM.render(<App />, document.getElementById("root"));

export default App;
