import { createSlice } from "@reduxjs/toolkit";
import { axiosInstance } from "../../lib/axios";
import { toast } from "react-toastify";

const initialState = {
  loading: false,

  // products
  products: [],
  totalProducts: 0,

  // optional extra sections
  newProducts: [],
  topRatedProducts: [],

  // single product
  selectedProduct: null,

  // ui
  error: null,
  message: null,
};

const productSlice = createSlice({
  name: "product",

  initialState,

  reducers: {
    // ======================================================
    // FETCH ALL PRODUCTS
    // ======================================================

    fetchProductsRequest: (state) => {
      state.loading = true;
      state.error = null;
    },

    fetchProductsSuccess: (state, action) => {
      state.loading = false;

      state.products = action.payload.products;
      state.totalProducts =
        action.payload.totalProducts;

      state.newProducts =
        action.payload.newProducts || [];

      state.topRatedProducts =
        action.payload.topRatedProducts || [];
    },

    fetchProductsFailed: (state, action) => {
      state.loading = false;
      state.error = action.payload;
    },

    // ======================================================
    // CREATE PRODUCT
    // ======================================================

    createProductRequest: (state) => {
      state.loading = true;
      state.error = null;
    },

    createProductSuccess: (state, action) => {
      state.loading = false;

      state.products.unshift(action.payload);

      state.totalProducts += 1;

      state.message =
        "Product created successfully";
    },

    createProductFailed: (state, action) => {
      state.loading = false;
      state.error = action.payload;
    },

    // ======================================================
    // UPDATE PRODUCT
    // ======================================================

    updateProductRequest: (state) => {
      state.loading = true;
      state.error = null;
    },

    updateProductSuccess: (state, action) => {
      state.loading = false;

      state.products = state.products.map(
        (product) =>
          product._id === action.payload._id
            ? action.payload
            : product
      );

      state.message =
        "Product updated successfully";
    },

    updateProductFailed: (state, action) => {
      state.loading = false;
      state.error = action.payload;
    },

    // ======================================================
    // DELETE PRODUCT
    // ======================================================

    deleteProductRequest: (state) => {
      state.loading = true;
      state.error = null;
    },

    deleteProductSuccess: (state, action) => {
      state.loading = false;

      state.products = state.products.filter(
        (product) =>
          product._id !== action.payload
      );

      state.totalProducts = Math.max(
        0,
        state.totalProducts - 1
      );

      state.message =
        "Product deleted successfully";
    },

    deleteProductFailed: (state, action) => {
      state.loading = false;
      state.error = action.payload;
    },

    // ======================================================
    // CLEARERS
    // ======================================================

    clearProductError: (state) => {
      state.error = null;
    },

    clearProductMessage: (state) => {
      state.message = null;
    },
  },
});

// ======================================================
// EXPORT ACTIONS
// ======================================================

export const {
  fetchProductsRequest,
  fetchProductsSuccess,
  fetchProductsFailed,

  createProductRequest,
  createProductSuccess,
  createProductFailed,

  updateProductRequest,
  updateProductSuccess,
  updateProductFailed,

  deleteProductRequest,
  deleteProductSuccess,
  deleteProductFailed,

  clearProductError,
  clearProductMessage,
} = productSlice.actions;

// ======================================================
// FETCH ALL PRODUCTS
// ======================================================

export const fetchAllProducts =
  (
    page = 1,
    filters = {}
  ) =>
  async (dispatch) => {
    try {
      dispatch(fetchProductsRequest());

      const queryParams = new URLSearchParams();

      queryParams.append("page", page);
      queryParams.append("limit", 10);

      // filters
      if (filters.search) {
        queryParams.append(
          "search",
          filters.search
        );
      }

      if (filters.category) {
        queryParams.append(
          "category",
          filters.category
        );
      }

      if (filters.price) {
        queryParams.append(
          "price",
          filters.price
        );
      }

      if (filters.ratings) {
        queryParams.append(
          "ratings",
          filters.ratings
        );
      }

      if (filters.availability) {
        queryParams.append(
          "availability",
          filters.availability
        );
      }

      const { data } = await axiosInstance.get(
        `/product/?${queryParams.toString()}`
      );

      dispatch(fetchProductsSuccess(data));
    } catch (error) {
      dispatch(
        fetchProductsFailed(
          error.response?.data?.message ||
            "Failed to fetch products"
        )
      );

      toast.error(
        error.response?.data?.message ||
          "Failed to fetch products"
      );
    }
  };

// ======================================================
// CREATE PRODUCT
// ======================================================

export const createProduct =
  (formData) => async (dispatch) => {
    try {
      dispatch(createProductRequest());

      const { data } =
        await axiosInstance.post(
          "/product/admin/create",
          formData,
          {
            headers: {
              "Content-Type":
                "multipart/form-data",
            },
          }
        );

      dispatch(
        createProductSuccess(data.product)
      );

      toast.success(
        data.message ||
          "Product created successfully"
      );
    } catch (error) {
      dispatch(
        createProductFailed(
          error.response?.data?.message ||
            "Failed to create product"
        )
      );

      toast.error(
        error.response?.data?.message ||
          "Failed to create product"
      );
    }
  };

// ======================================================
// UPDATE PRODUCT
// ======================================================

export const updateProduct =
  (productId, formData) =>
  async (dispatch) => {
    try {
      dispatch(updateProductRequest());

      const { data } =
        await axiosInstance.put(
          `/product/admin/update/${productId}`,
          formData,
          {
            headers: {
              "Content-Type":
                "multipart/form-data",
            },
          }
        );

      dispatch(
        updateProductSuccess(data.product)
      );

      toast.success(
        data.message ||
          "Product updated successfully"
      );
    } catch (error) {
      dispatch(
        updateProductFailed(
          error.response?.data?.message ||
            "Failed to update product"
        )
      );

      toast.error(
        error.response?.data?.message ||
          "Failed to update product"
      );
    }
  };

// ======================================================
// DELETE PRODUCT
// ======================================================

export const deleteProduct =
  (productId, page = 1) =>
  async (dispatch, getState) => {
    try {
      dispatch(deleteProductRequest());

      const { data } =
        await axiosInstance.delete(
          `/product/admin/delete/${productId}`
        );

      dispatch(
        deleteProductSuccess(productId)
      );

      toast.success(
        data.message ||
          "Product deleted successfully"
      );

      // pagination handling
      const updatedTotal =
        getState().product.totalProducts - 1;

      const updatedPages =
        Math.ceil(updatedTotal / 10) || 1;

      const validPage = Math.min(
        page,
        updatedPages
      );

      dispatch(fetchAllProducts(validPage));
    } catch (error) {
      dispatch(
        deleteProductFailed(
          error.response?.data?.message ||
            "Failed to delete product"
        )
      );

      toast.error(
        error.response?.data?.message ||
          "Failed to delete product"
      );
    }
  };

export default productSlice.reducer;