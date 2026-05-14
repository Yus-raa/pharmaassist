import React, { useMemo, useState } from "react";
import { Star, Trash2, MessageSquareText, ShieldCheck } from "lucide-react";
import { useDispatch, useSelector } from "react-redux";
import defaultAvatar from "../../assets/default-avatar.png";
import { fetchProductDetails } from "../../store/slices/productSlice";
import {
  postProductReview,
  deleteProductReview,
} from "../../store/slices/productSlice";

const ReviewsContainer = ({ product, productReviews = [] }) => {
  const dispatch = useDispatch();
  const { authUser } = useSelector((state) => state.auth);
  const { isPostingReview } = useSelector((state) => state.product);

  const [rating, setRating] = useState(0);
  const [hoverRating, setHoverRating] = useState(0);
  const [comment, setComment] = useState("");

  // SAFE normalization (prevents crashes)
  const safeReviews = useMemo(() => {
  return (productReviews || [])
    .filter(Boolean)
    .map((r, index) => ({
      review_id: r.review_id || `temp-${index}`,
      rating: r.rating || 0,
      comment: r.comment || "",
      reviewer: {
        id: r?.reviewer?.id || "",
        name: r?.reviewer?.name || "Anonymous User",
        avatar: r?.reviewer?.avatar || null,
      },
    }));
}, [productReviews]);

  // check if user already reviewed
  const alreadyReviewed = useMemo(() => {
    if (!authUser) return false;

    return safeReviews.some(
      (r) => r.reviewer?.id === authUser?._id
    );
  }, [authUser, safeReviews]);

  // submit review
  const handleReviewSubmit = async (e) => {
  e.preventDefault();

  if (!product?._id || !rating || !comment.trim()) return;

  const result = await dispatch(
    postProductReview({
      productId: product._id,
      rating,
      comment,
    })
  );

  if (result.meta.requestStatus === "fulfilled") {
    setRating(0);
    setComment("");

    // THIS IS 
    dispatch(fetchProductDetails(product._id));
  }
};

  // delete review
  const handleDeleteReview = async (reviewId) => {
    if (!product?._id || !reviewId) return;

    await dispatch(
      deleteProductReview({
        productId: product._id,
        reviewId,
      })
    );
  };

  return (
    <div className="mt-14">
      {/* HEADER */}
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

      {/* FORM */}
      {authUser && !alreadyReviewed && (
        <div className="bg-white border rounded-3xl p-6 mb-10">
          <div className="flex items-center gap-2 mb-4">
            <ShieldCheck className="w-5 h-5 text-[#0F766E]" />
            <h3 className="font-semibold">Leave a Review</h3>
          </div>

          <form onSubmit={handleReviewSubmit} className="space-y-4">
            {/* stars */}
            <div className="flex gap-1">
              {[1,2,3,4,5].map((star) => (
                <button
                  key={star}
                  type="button"
                  onClick={() => setRating(star)}
                  onMouseEnter={() => setHoverRating(star)}
                  onMouseLeave={() => setHoverRating(0)}
                >
                  <Star
                    className={`w-6 h-6 ${
                      star <= (hoverRating || rating)
                        ? "fill-yellow-400 text-yellow-400"
                        : "text-gray-300"
                    }`}
                  />
                </button>
              ))}
            </div>

            {/* comment */}
            <textarea
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              placeholder="Write your review..."
              className="w-full border rounded-xl p-3"
            />

            <button
              type="submit"
              disabled={isPostingReview}
              className="px-5 py-2 bg-[#0F766E] text-white rounded-xl"
            >
              {isPostingReview ? "Submitting..." : "Submit Review"}
            </button>
          </form>
        </div>
      )}

      {/* REVIEWS */}
      <div className="space-y-5">
        {safeReviews.length > 0 ? (
          safeReviews.map((review) => {
            const reviewer = review.reviewer || {};
            const isOwner = authUser?._id === reviewer.id;

            return (
              <div
                key={review.review_id}
                className="bg-white border rounded-2xl p-5"
              >
                <div className="flex justify-between">
                  <div className="flex gap-4">
                    <img
                      src={reviewer.avatar?.url || defaultAvatar}
                      alt={reviewer.name}
                      className="w-12 h-12 rounded-full object-cover"
                      onError={(e) => {
                        e.target.src = defaultAvatar;
                      }}
                    />

                    <div>
                      <h4 className="font-semibold">
                        {reviewer.name}
                      </h4>

                      <div className="flex gap-1">
                        {[1,2,3,4,5].map((star) => (
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

                      <p className="text-gray-600 mt-2">
                        {review.comment}
                      </p>
                    </div>
                  </div>

                  {/* DELETE */}
                  {isOwner && (
                    <button
                      onClick={() =>
                        handleDeleteReview(review.review_id)
                      }
                      className="text-red-500"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  )}
                </div>
              </div>
            );
          })
        ) : (
          <p className="text-center text-gray-500">
            No reviews yet
          </p>
        )}
      </div>
    </div>
  );
};

export default ReviewsContainer;