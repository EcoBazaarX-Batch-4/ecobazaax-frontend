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
          md={4}
          lg={3}
          key={product.id}
          sx={{ display: "flex" }}
        >
          <ProductCard
            product={product}
            onWishlistToggle={onWishlistToggle}
            sx={{ flexGrow: 1, height: "100%" }}
          />
        </Grid>
      ))}
    </Grid>
  );
};

export default ProductGrid;
