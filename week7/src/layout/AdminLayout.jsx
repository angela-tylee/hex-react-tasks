import { useEffect} from 'react';
import { NavLink, Outlet, useNavigate } from 'react-router-dom';
import Message from '../components/Message';

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

  
  async function logout() {
    try {
      await axios.post(`${VITE_API_BASE}/logout`);
      
      document.cookie = "carpento=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
      
      navigate('../login');
    } catch (error) {
      console.error('Logout failed:', error);
      alert('登出失敗，請稍後再試');
    }
  };

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
          <div className="collapse navbar-collapse justify-content-between" id="navbarNav">
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
            <div className="nav-item py-2 py-lg-0" onClick={logout} style={{cursor: 'pointer'}}>
              登出
            </div>
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
