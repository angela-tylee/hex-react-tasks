import { useEffect} from 'react';
import { NavLink, Outlet, useNavigate } from 'react-router-dom';

const { VITE_API_BASE } = import.meta.env;

const AdminLayout = () => {

  const navigate = useNavigate();

  const token = document.cookie
    .split('; ')
    .find((row) => row.startsWith('carpento='))
    ?.split('=')[1];

  axios.defaults.headers.common['Authorization'] = token;

  async function check() {
    try {
      const token = document.cookie
        .split('; ')
        .find((row) => row.startsWith('carpento='))
        ?.split('=')[1];
      
      axios.defaults.headers.common['Authorization'] = token;

      await axios.post(`${VITE_API_BASE}/api/user/check`);
    
    } catch (error) {
      console.error(error);
      navigate("../login");

    }
  }

  useEffect(() => {
    if (!token) {
      navigate('../login');
      alert('驗證失敗，請重新登入');
      return;
    }

    check();

  }, [navigate, token]);

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
                <NavLink to="/admin/products" className="nav-link" aria-current="page" href="#">
                  後台產品
                </NavLink>
              </li>
              <li className="nav-item">
                <NavLink to="/admin/orders" className="nav-link" href="#">
                  後台訂單
                </NavLink>
              </li>
            </ul>
          </div>
        </div>
      </nav>
      <main className="py-5">
        <Outlet />
      </main>
    </>
  );
};

export default AdminLayout;
