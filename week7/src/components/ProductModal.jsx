const ProductModal = ({ tempProduct }) => {
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
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductModal;
