import data from './data';

function App() {
  return (
    <div>
      <header>
        <a href="/">Resalia</a>
      </header>
      <main>
        <h1>Menú A La Carta</h1>
        <div className="products">
          {data.products.map((product) => (
            <div className="product" key={product.slug}>
              <a href={`/product/${product.slug}`}>
                <img src={product.image} alt={product.name} />
              </a>
              <div className="productInfo">
                <a href={`/product/${product.slug}`}>
                  <p>{product.name}</p>
                </a>
                <p>
                  <i>{product.category}</i>
                </p>
                <p>
                  <strong>{product.price}€</strong>
                </p>
              </div>
            </div>
          ))}
        </div>
      </main>
    </div>
  );
}

export default App;
