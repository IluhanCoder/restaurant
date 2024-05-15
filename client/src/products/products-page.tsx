import { buttonStyle } from "../styles/button-styles";
import ProductsCatalogue from "./products-catalogue";
import { Link } from "react-router-dom";

const ProductsPage = () => {
  return (
    <div className="flex flex-col gap-5 pt-2">
      <div className="flex flex-col gap-2">
        <div className="flex justify-center text-3xl font-bold">меню</div>
      </div>
      <ProductsCatalogue deleteAvailable />
    </div>
  );
};

export default ProductsPage;
