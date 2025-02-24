import { useSelector } from 'react-redux';

const Message = () => {

  const messages = useSelector((state) => state.message);

  return (
    <div
      className="toast-container position-fixed start-50 translate-middle-x"
      style={{ top: '16px' }}
    >
      {messages?.map((message) => (
          <div
            key={message.id}
            id="myToast"
            className={`toast bg-${message.type}-subtle text-${message.type} shadow-sm align-items-center text-bg-primary border-0 mb-3 show`}
            role="alert"
            aria-live="assertive"
            aria-atomic="true"
          >
            <div className="d-flex">
              <div className="toast-body">
                {message.type === 'success' ? (
                  <i className="bi bi-check-circle-fill text-success me-1"></i>
                ) : (
                  <i className="bi bi-x-circle-fill text-danger me-1"></i>
                )}
                {message.text}
              </div>
              <button
                type="button"
                className="btn-close me-2 m-auto"
                data-bs-dismiss="toast"
                aria-label="Close"
              ></button>
            </div>
          </div>
        ))}
      {/* <div
        id="myToast"
        className={`toast bg-${messageType}-subtle text-${messageType} shadow-sm align-items-center text-bg-primary border-0`}
        role="alert"
        aria-live="assertive"
        aria-atomic="true"
      >
        <div className="d-flex">
          <div className="toast-body">
            {messageType === "success" ? (
              <i className="bi bi-check-circle-fill text-success me-1"></i>
            ) : (
              <i className="bi bi-x-circle-fill text-danger me-1"></i>
            )}
            {message}
          </div>
          <button
            type="button"
            className="btn-close me-2 m-auto"
            data-bs-dismiss="toast"
            aria-label="Close"
          ></button>
        </div>
      </div> */}
    </div>
  );
};

export default Message;
