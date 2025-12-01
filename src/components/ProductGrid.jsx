import { Grid } from "@mui/material";
import ProductCard from "./ProductCard";

const ProductGrid = ({ products, onWishlistToggle }) => {
  return (
    <Grid container spacing={3}>
      {products.map((product) => (
        <Grid
          item
          xs={12}
          sm={6}
          md={3}   // ← Ensures exactly 4 cards per row
          lg={3}
          key={product.id}
          sx={{ display: "flex" }}
        >
          <ProductCard
            product={product}
            onWishlistToggle={onWishlistToggle}
            sx={{ width: "100%" }}   // ← Forces full equal width
          />
        </Grid>
      ))}
    </Grid>
  );
};

export default ProductGrid;
