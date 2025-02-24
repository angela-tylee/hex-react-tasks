import { useState, useEffect } from 'react';
import { createAsyncMessage } from '../store/messageSlice';
import { useDispatch } from 'react-redux';

const ProductModal = ({ type, tempProduct, closeProductModal, getProducts }) => {

  const {VITE_API_BASE, VITE_API_PATH} = import.meta.env;

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

  const [ imageUrl, setImageUrl ] = useState("");

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

  const dispatch = useDispatch();

  const handleProductSubmit = async () => {
    try {
      let api = `${VITE_API_BASE}/api/${VITE_API_PATH}/admin/product`;
      let method = 'post';
      if (type === 'edit') {
        method = 'put';
        api = `${VITE_API_BASE}/api/${VITE_API_PATH}/admin/product/${tempProduct.id}`;
      }
      const res = await axios[method](api, {
        data: tempData,
      });

      console.log(res);
      dispatch(createAsyncMessage(res.data));
      closeProductModal();
      getProducts();
    } catch (error) {
      console.error(error);
      dispatch(createAsyncMessage(error.response.data));
    }
  };

  return (
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
              {type === 'edit' ? (
                  <span>編輯產品</span>
                ) : (
                  <span>新增產品</span>
                )}
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
                        checked={tempData.is_enabled}
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
  )
}

export default ProductModal;