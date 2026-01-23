import ProductList from "@/components/shared/product/product-list";
import { getLatestProducts } from "@/lib/actions/product.actions";

const HomePage = async () => {
  const latestProducts = await getLatestProducts();
  const formattedProducts = latestProducts.map((p) => ({
    ...p,
    price: p.price.toString(),
    rating: Number(p.rating), // Converting string "4.5" to number 4.5
  }));
  return (
    <>
      <ProductList data={formattedProducts} title="Newest arrivals" limit={5} />
    </>
  );
};
export default HomePage;
