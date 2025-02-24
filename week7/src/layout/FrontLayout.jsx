import { NavLink, Outlet } from 'react-router-dom';
import Message from '../components/Message';

const FrontLayout = () => {
  return (
    <>
      <Message />
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
                <NavLink
                  to="/products"
                  className="nav-link"
                  aria-current="page"
                  href="#"
                >
                  產品
                </NavLink>
              </li>
              <li className="nav-item">
                <NavLink to="/cart" className="nav-link" href="#">
                  購物車
                </NavLink>
              </li>
              <li className="nav-item">
                <NavLink to="/login" className="nav-link" href="#">
                  登入
                </NavLink>
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
