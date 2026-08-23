function paginate(items, page, limit) {
  const total = items.length;
  const totalPages = total ? Math.ceil(total / limit) : 0;
  const currentPage = totalPages ? Math.min(page, totalPages) : 1;
  const start = (currentPage - 1) * limit;
  return { data: items.slice(start, start + limit), pagination: { page: currentPage, limit, total, totalPages } };
}

module.exports = { paginate };
