import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { apiGet } from "../api/client";
import { formatPrice } from "../utils/format";

function ProductDetailPage() {
  const { slug } = useParams();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    async function loadProduct() {
      try {
        const data = await apiGet(`/products/${slug}/`);
        setProduct(data);
      } catch (err) {
        setError(err.message || "Failed to load product");
      } finally {
        setLoading(false);
      }
    }

    loadProduct();
  }, [slug]);

  if (loading) return <p>Loading product...</p>;
  if (error) return <p>Error: {error}</p>;
  if (!product) return <p>Product not found.</p>;

  return (
    <div className="glass p-6 rounded-2xl">
      <Link to="/" style={{ fontSize: 14 }}>
        ← Back to products
      </Link>

      { (product.image || product.main_image) ? (
        <div className="mt-4">
          <img
            src={product.image || product.main_image}
            alt={product.name}
            loading="lazy"
            className="w-full max-w-3xl h-auto rounded-2xl object-cover"
          />
        </div>
      ) : (
        <div className="mt-4 w-full max-w-3xl h-48 rounded-2xl bg-slate-800/30" />
      )}

      <h2 className="mt-4 text-2xl font-semibold">{product.name}</h2>

      <p style={{ color: "#6b7280", marginBottom: 8 }}>
        {product.brand?.name} • {product.category?.name}
      </p>

      <p style={{ fontWeight: "bold", fontSize: 18, marginBottom: 12 }}>
        {formatPrice(product.price)}
      </p>

      {product.long_description && (
        <p style={{ lineHeight: 1.6 }}>{product.long_description}</p>
      )}
    </div>
  );
}

export default ProductDetailPage;