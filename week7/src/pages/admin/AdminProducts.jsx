import { useState, useEffect, useRef } from 'react';
import ProductModal from '../../components/ProductModal';
import Pagination from '../../components/Pagination';

const { VITE_API_BASE, VITE_API_PATH } = import.meta.env;

const AdminProducts = () => {
  const [products, setProducts] = useState([]);
  const [tempProduct, setTempProduct] = useState({});
  const [pagination, setPagination] = useState({});
  const [type, setType] = useState('');
  const productModalRef = useRef(null);

  async function getProducts(page) {
    try {
      const res = await axios.get(
        `${VITE_API_BASE}/api/${VITE_API_PATH}/admin/products?page=${page}`
      );
      setProducts(res.data.products);
      setPagination(res.data.pagination);
    } catch (error) {
      console.error(error.response);
    }
  }

  useEffect(() => {
    productModalRef.current = new window.bootstrap.Modal('#productModal', {
      keyboard: false,
    });
    getProducts();
  }, []);

  function openProductModal(type, product) {
    setTempProduct(product);
    setType(type);
    productModalRef.current.show();
  }

  function closeProductModal() {
    productModalRef.current.hide();
  }

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

  return (
    <>
      <ProductModal
        type={type}
        tempProduct={tempProduct}
        closeProductModal={closeProductModal}
        getProducts={getProducts}
      />
      <div className="container">
        {/* <div className="row mt-5">
      <div className="col-md-6">
        <h2>產品列表</h2>
        <table className="table">
          <thead>
            <tr>
              <th>產品名稱</th>
              <th>原價</th>
              <th>售價</th>
              <th>是否啟用</th>
              <th>查看細節</th>
            </tr>
          </thead>
          <tbody>
            {products && products.length > 0 ? (
              products.map((item) => (
                <tr key={item.id}>
                  <td>{item.title}</td>
                  <td>{item.origin_price}</td>
                  <td>{item.price}</td>
                  <td>{item.is_enabled ? '啟用' : '未啟用'}</td>
                  <td>
                    <button
                      className="btn btn-primary"
                      onClick={() => setTempProduct(item)}
                    >
                      查看細節
                    </button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="5">尚無產品資料</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
      <div className="col-md-6">
        <h2>單一產品細節</h2>
        {tempProduct ? (
          <div className="card mb-3">
            <img
              src={tempProduct.imagesUrl[0]}
              className="card-img-top primary-image"
              alt="主圖"
            />
            <div className="card-body">
              <h5 className="card-title">
                {tempProduct.title}
                <span className="badge bg-primary ms-2">
                  {tempProduct.category}
                </span>
              </h5>
              <p className="card-text">
                商品描述：{tempProduct.category}
              </p>
              <p className="card-text">
                商品內容：{tempProduct.description}
              </p>
              <div className="d-flex">
                <p className="card-text text-secondary">
                  <del>{tempProduct.origin_price}</del>
                </p>
                元 / {tempProduct.price} 元
              </div>
              <h5 className="mt-3">更多圖片：</h5>
              <div className="d-flex flex-wrap">
                {tempProduct.imagesUrl?.map((url, index) => (
                  <img
                    key={index}
                    src={url}
                    className="images"
                    alt="副圖"
                  />
                ))}
              </div>
            </div>
          </div>
        ) : (
          <p className="text-secondary">請選擇一個商品查看</p>
        )}
      </div>
    </div> */}
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
    </>
  );
};

export default AdminProducts;
