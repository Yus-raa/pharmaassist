import React, { useMemo, useState } from "react";
import {
  Star,
  Trash2,
  MessageSquareText,
  ShieldCheck,
} from "lucide-react";

import { useDispatch, useSelector } from "react-redux";

import {
  postProductReview,
  deleteProductReview,
} from "../../store/slices/productSlice";

const ReviewsContainer = ({ product, productReviews = [] }) => {
  const dispatch = useDispatch();

  const { authUser } = useSelector((state) => state.auth);

  const { isPostingReview, isReviewDeleting } = useSelector(
    (state) => state.product
  );

  const [rating, setRating] = useState(0);
  const [hoverRating, setHoverRating] = useState(0);
  const [comment, setComment] = useState("");

  // Check if logged in user already reviewed
  const alreadyReviewed = useMemo(() => {
    if (!authUser) return false;

    return productReviews.some(
      (review) => review?.user?._id === authUser?._id
    );
  }, [authUser, productReviews]);

  // Handle submit review
  const handleReviewSubmit = async (e) => {
    e.preventDefault();

    if (!rating || !comment.trim()) return;

    await dispatch(
      postProductReview({
        productId: product._id,
        rating,
        comment,
      })
    );

    setRating(0);
    setComment("");
  };

  // Handle delete review
  const handleDeleteReview = async (reviewId) => {
    await dispatch(
      deleteProductReview({
        productId: product._id,
        reviewId,
      })
    );
  };

  return (
    <div className="mt-14">
      {/* Section Header */}
      <div className="flex items-center gap-3 mb-8">
        <div className="w-12 h-12 rounded-2xl bg-[#E6F7F7] flex items-center justify-center">
          <MessageSquareText className="w-6 h-6 text-[#0F766E]" />
        </div>

        <div>
          <h2 className="text-2xl font-bold text-gray-800">
            Customer Reviews
          </h2>

          <p className="text-sm text-gray-500">
            Trusted feedback from PharmaAssist customers
          </p>
        </div>
      </div>

      {/* Review Form */}
      {authUser && !alreadyReviewed && (
        <div className="bg-white border border-[#D6EEEE] rounded-3xl p-6 shadow-sm mb-10">
          <div className="flex items-center gap-2 mb-5">
            <ShieldCheck className="w-5 h-5 text-[#0F766E]" />

            <h3 className="text-lg font-semibold text-gray-800">
              Leave a Review
            </h3>
          </div>

          <form onSubmit={handleReviewSubmit} className="space-y-5">
            {/* Rating */}
            <div>
              <p className="text-sm font-medium text-gray-700 mb-3">
                Your Rating
              </p>

              <div className="flex items-center gap-1">
                {[1, 2, 3, 4, 5].map((star) => (
                  <button
                    key={star}
                    type="button"
                    onClick={() => setRating(star)}
                    onMouseEnter={() => setHoverRating(star)}
                    onMouseLeave={() => setHoverRating(0)}
                    className="transition-transform hover:scale-110"
                  >
                    <Star
                      className={`w-7 h-7 ${
                        star <= (hoverRating || rating)
                          ? "fill-yellow-400 text-yellow-400"
                          : "text-gray-300"
                      }`}
                    />
                  </button>
                ))}
              </div>
            </div>

            {/* Review Textarea */}
            <div>
              <label className="text-sm font-medium text-gray-700 block mb-2">
                Your Review
              </label>

              <textarea
                rows={5}
                placeholder="Share your experience with this product..."
                value={comment}
                onChange={(e) => setComment(e.target.value)}
                className="w-full rounded-2xl border border-[#D6EEEE] bg-[#FAFEFE] px-4 py-3 text-gray-700 placeholder:text-gray-400 outline-none transition-all resize-none focus:border-[#14B8A6] focus:ring-4 focus:ring-[#14B8A6]/10"
              />
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={
                isPostingReview || !rating || !comment.trim()
              }
              className={`w-full md:w-fit px-6 py-3 rounded-2xl font-semibold text-white transition-all duration-200
              
              ${
                isPostingReview
                  ? "bg-[#0F766E]/70 cursor-not-allowed"
                  : "bg-[#0F766E] hover:bg-[#115E59] hover:shadow-lg"
              }`}
            >
              {isPostingReview
                ? "Submitting Review..."
                : "Submit Review"}
            </button>
          </form>
        </div>
      )}

      {/* Already Reviewed Message */}
      {authUser && alreadyReviewed && (
        <div className="mb-8 rounded-2xl border border-emerald-200 bg-emerald-50 px-5 py-4">
          <p className="text-sm text-emerald-700">
            You have already reviewed this product.
          </p>
        </div>
      )}

      {/* Reviews List */}
      <div className="space-y-5">
        {productReviews?.length > 0 ? (
          productReviews.map((review) => {
            const isAuthor =
              authUser?._id === review?.user?._id;

            return (
              <div
                key={review._id}
                className="bg-white border border-[#D6EEEE] rounded-3xl p-6 shadow-sm"
              >
                <div className="flex items-start justify-between gap-4">
                  {/* Left */}
                  <div className="flex gap-4">
                    {/* Avatar */}
                    <img
                      src={
                        review?.user?.avatar?.url ||
                        "/default-avatar.png"
                      }
                      alt={review?.user?.name}
                      className="w-14 h-14 rounded-full object-cover border border-[#D6EEEE]"
                    />

                    <div>
                      {/* Name */}
                      <h4 className="font-semibold text-gray-800">
                        {review?.user?.name}
                      </h4>

                      {/* Stars */}
                      <div className="flex items-center gap-1 mt-1">
                        {[1, 2, 3, 4, 5].map((star) => (
                          <Star
                            key={star}
                            className={`w-4 h-4 ${
                              star <= review.rating
                                ? "fill-yellow-400 text-yellow-400"
                                : "text-gray-300"
                            }`}
                          />
                        ))}
                      </div>

                      {/* Comment */}
                      <p className="text-gray-600 mt-3 leading-relaxed">
                        {review.comment}
                      </p>
                    </div>
                  </div>

                  {/* Delete Review */}
                  {isAuthor && (
                    <button
                      onClick={() =>
                        handleDeleteReview(review._id)
                      }
                      disabled={isReviewDeleting}
                      className="flex items-center gap-2 text-sm px-4 py-2 rounded-xl border border-red-200 text-red-600 hover:bg-red-50 transition-colors disabled:opacity-50"
                    >
                      <Trash2 className="w-4 h-4" />

                      {isReviewDeleting
                        ? "Deleting..."
                        : "Delete"}
                    </button>
                  )}
                </div>
              </div>
            );
          })
        ) : (
          <div className="bg-white border border-dashed border-[#C7E8E8] rounded-3xl p-10 text-center">
            <div className="w-16 h-16 mx-auto rounded-full bg-[#F0FAFA] flex items-center justify-center mb-4">
              <MessageSquareText className="w-8 h-8 text-[#0F766E]" />
            </div>

            <h3 className="text-lg font-semibold text-gray-800 mb-2">
              No Reviews Yet
            </h3>

            <p className="text-gray-500 max-w-md mx-auto">
              Be the first customer to share your experience
              with this healthcare product on PharmaAssist.
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default ReviewsContainer;