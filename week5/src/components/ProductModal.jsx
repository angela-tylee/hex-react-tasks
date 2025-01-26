import { useState, useEffect } from 'react';

const ProductModal = ({ tempProduct, closeProductModal }) => {
  // const API_BASE = 'https://ec-course-api.hexschool.io/v2';
  // const API_PATH = 'angela-carpento';

  // const {VITE_API_BASE, VITE_API_PATH} = import.meta.env;

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
  //     let api = `${VITE_API_BASE}/api/${VITE_API_PATH}/admin/product`;
  //     let method = 'post';
  //     if (type === 'edit') {
  //       method = 'put';
  //       api = `${VITE_API_BASE}/api/${VITE_API_PATH}/admin/product/${tempProduct.id}`;
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
          <div className="modal-header bg-primary text-white">
            <h5 id="productModalLabel" className="modal-title">
              {tempProduct.title}
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
                <div className="mb-2">
                  {tempProduct.imagesUrl &&
                    tempProduct.imagesUrl.map((image, index) => (
                      <img
                        key={index}
                        className="img-fluid"
                        src={image}
                        alt={`img-${index + 1}`}
                      />
                    ))}
                </div>
              </div>
              <div className="col-sm-8">
                <div className="mb-3">
                  <h2 className="fs-5">
                    {tempProduct.title}
                    <span className="badge rounded-pill text-bg-primary ms-3">
                      {tempProduct.category}
                    </span>
                  </h2>
                </div>

                <div
                  className="mb-3 text-start"
                  dangerouslySetInnerHTML={{ __html: tempProduct.description }}
                ></div>
                <hr />
                <div
                  className="mb-3 text-start"
                  dangerouslySetInnerHTML={{
                    __html: tempProduct.content?.info,
                  }}
                ></div>
                <div
                  className="mb-3 text-start"
                  dangerouslySetInnerHTML={{
                    __html: tempProduct.content?.size,
                  }}
                ></div>
                <div
                  className="mb-3 text-start"
                  dangerouslySetInnerHTML={{
                    __html: tempProduct.content?.maintenance,
                  }}
                ></div>
                <hr />

                <div className="row">
                  <div className="mb-3 col-md-6">
                    原價：<del>{tempProduct.origin_price}</del>
                  </div>
                  <div className="mb-3 col-md-6">
                    特價：{tempProduct.price}
                    </div>
                </div>
              </div>
            </div>
          </div>
          <div className="modal-footer">
            {/* <button
                type="button"
                className="btn btn-outline-secondary"
                data-bs-dismiss="modal"
              >
                取消
              </button>
              <button type="button" className="btn btn-primary" onClick={handleProductSubmit}>
                確認
              </button> */}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductModal;
