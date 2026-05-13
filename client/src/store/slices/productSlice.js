import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { axiosInstance } from "../../lib/axios";
import { toast } from "react-toastify";

// FETCH ALL PRODUCTS
export const fetchAllProducts = createAsyncThunk(
  "product/fetchAll",
  async (
    {
      availability = "",
      price = "0-10000",
      category = "",
      ratings = "",
      search = "",
      page = 1,
    } = {},
    thunkAPI
  ) => {
    try {
      const params = new URLSearchParams();

      if (category) params.append("category", category);
      if (availability)
        params.append("availability", availability);
      if (price) params.append("price", price);
      if (ratings) params.append("ratings", ratings);
      if (search) params.append("search", search);
      if (page) params.append("page", page);

      const res = await axiosInstance.get(
        `/product?${params.toString()}`
      );

      return res.data;
    } catch (error) {
      return thunkAPI.rejectWithValue(
        error.response?.data?.message ||
          "Failed to fetch products"
      );
    }
  }
);

// FETCH SINGLE PRODUCT DETAILS
export const fetchProductDetails = createAsyncThunk(
  "product/fetchDetails",
  async (id, thunkAPI) => {
    try {
      const res = await axiosInstance.get(
        `/product/singleProduct/${id}`
      );

      return res.data;
    } catch (error) {
      return thunkAPI.rejectWithValue(
        error.response?.data?.message ||
          "Failed to fetch product details"
      );
    }
  }
);

// POST PRODUCT REVIEW
export const postProductReview = createAsyncThunk(
  "product/postReview",
  async (
    { productId, rating, comment },
    thunkAPI
  ) => {
    try {
      const res = await axiosInstance.put(
        `/product/post-new/review/${productId}`,
        {
          rating,
          comment,
        }
      );

      toast.success(
        res.data.message ||
          "Review posted successfully"
      );

      return res.data.review;
    } catch (error) {
      toast.error(
        error.response?.data?.message ||
          "Failed to post review"
      );

      return thunkAPI.rejectWithValue(
        error.response?.data?.message ||
          "Failed to post review"
      );
    }
  }
);

// DELETE PRODUCT REVIEW
export const deleteProductReview = createAsyncThunk(
  "product/deleteReview",
  async (
    { productId, reviewId },
    thunkAPI
  ) => {
    try {
      const res = await axiosInstance.delete(
        `/product/delete/review/${productId}?reviewId=${reviewId}`
      );

      toast.success(
        res.data.message ||
          "Review deleted successfully"
      );

      return reviewId;
    } catch (error) {
      toast.error(
        error.response?.data?.message ||
          "Failed to delete review"
      );

      return thunkAPI.rejectWithValue(
        error.response?.data?.message ||
          "Failed to delete review"
      );
    }
  }
);

// AI FILTERED PRODUCTS
export const fetchAIFilteredProducts =
  createAsyncThunk(
    "product/fetchAIFiltered",
    async ({ userPrompt }, thunkAPI) => {
      try {
        const res = await axiosInstance.post(
          `/product/ai-search`,
          { userPrompt }
        );

        return res.data;
      } catch (error) {
        toast.error(
          error.response?.data?.message ||
            "Failed to fetch AI filtered products"
        );

        return thunkAPI.rejectWithValue(
          error.response?.data?.message ||
            "Failed to fetch AI filtered products"
        );
      }
    }
  );

const initialState = {
  loading: false,

  // PRODUCTS PAGE
  products: [],
  totalProducts: 0,

  // HOME PAGE
  newProducts: [],
  topRatedProducts: [],

  // DETAILS
  productDetails: null,

  // AI
  aiProducts: [],

  // FLAGS
  aiSearching: false,
  isReviewDeleting: false,
  isPostingReview: false,

  productReviews: [],
  error: null,
};

const productSlice = createSlice({
  name: "product",
  initialState,

  reducers: {},

  extraReducers: (builder) => {
    builder

      // FETCH ALL PRODUCTS
      .addCase(fetchAllProducts.pending, (state) => {
        state.loading = true;
        state.error = null;
      })

      .addCase(
        fetchAllProducts.fulfilled,
        (state, action) => {
          state.loading = false;
          state.products =
            action.payload.products || [];

          state.newProducts =
            action.payload.newProducts || [];

          state.topRatedProducts =
            action.payload.topRatedProducts || [];

          state.totalProducts =
            action.payload.totalProducts || 0;
        }
      )

      .addCase(
        fetchAllProducts.rejected,
        (state, action) => {
          state.loading = false;
          state.error = action.payload;

          toast.error(
            action.payload ||
              "Failed to fetch products"
          );
        }
      )

      // FETCH PRODUCT DETAILS
      .addCase(
        fetchProductDetails.pending,
        (state) => {
          state.loading = true;
          state.error = null;
        }
      )

      .addCase(
        fetchProductDetails.fulfilled,
        (state, action) => {
          state.loading = false;

          state.productDetails =
            action.payload.product;

          state.productReviews =
            action.payload.reviews || [];
        }
      )

      .addCase(
        fetchProductDetails.rejected,
        (state, action) => {
          state.loading = false;
          state.error = action.payload;

          toast.error(
            action.payload ||
              "Failed to fetch product details"
          );
        }
      )

      // POST REVIEW
      .addCase(
        postProductReview.pending,
        (state) => {
          state.isPostingReview = true;
        }
      )

      .addCase(
        postProductReview.fulfilled,
        (state, action) => {
          state.isPostingReview = false;

          state.productReviews = [
            action.payload,
            ...state.productReviews,
          ];
        }
      )

      .addCase(
        postProductReview.rejected,
        (state) => {
          state.isPostingReview = false;
        }
      )

      // DELETE REVIEW
      .addCase(
        deleteProductReview.pending,
        (state) => {
          state.isReviewDeleting = true;
        }
      )

      .addCase(
        deleteProductReview.fulfilled,
        (state, action) => {
          state.isReviewDeleting = false;

          state.productReviews =
            state.productReviews.filter(
              (review) =>
                review.review_id !==
                action.payload
            );
        }
      )

      .addCase(
        deleteProductReview.rejected,
        (state) => {
          state.isReviewDeleting = false;
        }
      )

      // AI FILTERED PRODUCTS
      .addCase(
        fetchAIFilteredProducts.pending,
        (state) => {
          state.aiSearching = true;
        }
      )

      .addCase(
        fetchAIFilteredProducts.fulfilled,
        (state, action) => {
          state.aiSearching = false;

          state.products =
            action.payload.products || [];

          state.newProducts =
            action.payload.newProducts || [];

          state.topRatedProducts =
            action.payload.topRatedProducts || [];

          state.totalProducts =
            action.payload.products?.length || 0;
        }
      )

      .addCase(
        fetchAIFilteredProducts.rejected,
        (state, action) => {
          state.aiSearching = false;

          toast.error(
            action.payload ||
              "Failed to fetch AI filtered products"
          );
        }
      );
  },
});

export default productSlice.reducer;