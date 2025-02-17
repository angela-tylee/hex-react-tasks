import { Link, Outlet } from 'react-router-dom';

const FrontLayout = () => {
  return (
    <>
      <nav className="navbar navbar-expand-lg bg-body-tertiary">
        <div className="container-fluid">
          <a className="navbar-brand" href="#">
            首頁
          </a>
          <button
            className="navbar-toggler"
            type="button"
            data-bs-toggle="collapse"
            data-bs-target="#navbarNav"
            aria-controls="navbarNav"
            aria-expanded="false"
            aria-label="Toggle navigation"
          >
            <span className="navbar-toggler-icon"></span>
          </button>
          <div className="collapse navbar-collapse" id="navbarNav">
            <ul className="navbar-nav">
              <li className="nav-item">
                <Link to="/products" className="nav-link active" aria-current="page" href="#">
                  產品
                </Link>
              </li>
              <li className="nav-item">
                <Link to="/cart" className="nav-link" href="#">
                  購物車
                </Link>
              </li>
              <li className="nav-item">
                <Link to="/login" className="nav-link" href="#">
                  登入
                </Link>
              </li>
            </ul>
          </div>
        </div>
      </nav>
      <main className="container py-5">
        <Outlet />
      </main>
    </>
  );
};

export default FrontLayout;
