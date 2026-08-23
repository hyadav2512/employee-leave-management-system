function Pagination({ page, totalPages, onChange }) {
  if (totalPages <= 1) return null;
  return <nav className="pagination" aria-label="Leave requests pages"><button type="button" disabled={page === 1} onClick={() => onChange(page - 1)}>Previous</button>{Array.from({ length: totalPages }, (_, index) => index + 1).map((number) => <button key={number} type="button" className={number === page ? 'current' : ''} aria-current={number === page ? 'page' : undefined} onClick={() => onChange(number)}>{number}</button>)}<button type="button" disabled={page === totalPages} onClick={() => onChange(page + 1)}>Next</button></nav>;
}
export default Pagination;
