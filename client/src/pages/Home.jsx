import React from "react";
import HeroSlider from "../components/Home/HeroSlider";
import CategoryGrid from "../components/Home/CategoryGrid";
import ProductSlider from "../components/Home/ProductSlider";
import FeatureSection from "../components/Home/FeatureSection";
import NewsletterSection from "../components/Home/NewsletterSection";
import { useEffect } from "react";

//

import {
  useDispatch,
  useSelector,
} from "react-redux";

import { fetchAllProducts } from "../store/slices/productSlice";

const Index = () => {
  const dispatch = useDispatch();

  const { topRatedProducts, newProducts } =
    useSelector((state) => state.product);

  useEffect(() => {
    dispatch(fetchAllProducts({}));
  }, [dispatch]);

//
  return (
    <div className="min-h-screen">
      <HeroSlider />
      <div className="container mx-auto px-4 pt-20">
        <CategoryGrid />
        {newProducts.length > 0 && (
          <ProductSlider title="New Arrivals" products={newProducts} />
        )}
        {topRatedProducts.length > 0 && (
          <ProductSlider
            title="Top Rated Products"
            products={topRatedProducts}
          />
        )}
        <FeatureSection />
        <NewsletterSection />
      </div>
    </div>
  );
};

export default Index;
