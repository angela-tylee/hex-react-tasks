const Pagination = ({ pagination, paginationTotal, changePage }) => {
  return (
    <nav aria-label="Page navigation example" className="mt-5">
      <ul className="pagination justify-content-center">
        <li className={`page-item ${pagination.has_pre ? '' : 'disabled'}`}>
          <a
            className="page-link"
            href="#"
            onClick={(e) => {
              e.preventDefault();
              changePage(pagination.current_page - 1);
            }}
          >
            Previous
          </a>
        </li>
        {Array.from({ length: paginationTotal }).map((_, index) => (
          <li
            key={index}
            className={`page-item ${
              pagination.current_page === index + 1 ? 'active' : ''
            }`}
            aria-current={
              pagination.current_page === index + 1 ? 'page' : undefined
            }
          >
            <a
              className="page-link"
              href="#"
              onClick={(e) => {
                e.preventDefault();
                changePage(index + 1);
              }}
            >
              {index + 1}
            </a>
          </li>
        ))}
        <li className={`page-item ${pagination.has_next ? '' : 'disabled'}`}>
          <a
            className="page-link"
            href="#"
            onClick={(e) => {
              e.preventDefault();
              changePage(pagination.current_page + 1);
            }}
          >
            Next
          </a>
        </li>
      </ul>
    </nav>
  );
};

export default Pagination;
