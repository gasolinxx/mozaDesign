const ProductList = ({ products, onSelect }) => (
  <ul className="product-list">
    {products.map(p => (
      <li key={p.id} onClick={() => onSelect(p.id)}>
        {p.name}
      </li>
    ))}
  </ul>
);
export default ProductList;
