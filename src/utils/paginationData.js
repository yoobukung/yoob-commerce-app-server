exports.getPagingData = (data, page, limit) => {
  const { count: totalItems, rows: products } = data;
  const currentPage = page ? +page : 0;
  const totalPages = Math.ceil(totalItems / limit);

  return { totalItems, products, totalPages, currentPage };
};

exports.getPagination = (page, size) => {
  const limit = size ? +size : 1;
  const offset = page ? page * limit : 0;

  return { limit, offset };
};
