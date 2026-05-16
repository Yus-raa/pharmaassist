import {
  useState,
  useEffect,
  useRef,
} from "react";

import {
  MessageCircle,
  X,
  Send,
  Bot,
  ShieldPlus,
  ShoppingCart,
  Sparkles,
} from "lucide-react";

import { useLocation } from "react-router-dom";

import { useDispatch } from "react-redux";

import { toast } from "react-toastify";

import { axiosInstance } from "../../lib/axios";

import { addToCart } from "../../store/slices/cartSlice";

const PharmaAIChat = () => {

  const [isOpen, setIsOpen] =
    useState(false);

  const [message, setMessage] =
    useState("");

  const [messages, setMessages] =
    useState([]);

  const [loading, setLoading] =
    useState(false);

  const dispatch = useDispatch();

  const location = useLocation();

  const messagesEndRef =
    useRef(null);

  // =========================
  // AUTO OPEN FROM HERO BTN
  // =========================
  useEffect(() => {

    const params =
      new URLSearchParams(
        location.search
      );

    if (
      params.get("ai") ===
      "open"
    ) {
      setIsOpen(true);
    }

  }, [location]);

  // =========================
  // AUTO SCROLL
  // =========================
  useEffect(() => {

    messagesEndRef.current
      ?.scrollIntoView({
        behavior: "smooth",
      });

  }, [messages, loading]);

  // =========================
  // SEND MESSAGE
  // =========================
  const sendMessage = async () => {

    if (!message.trim())
      return;

    const currentMessage =
      message;

    const userMessage = {
      type: "user",
      text: currentMessage,
    };

    setMessages((prev) => [
      ...prev,
      userMessage,
    ]);

    setMessage("");

    setLoading(true);

    try {

      const { data } =
        await axiosInstance.post(
          "/ai/chat",
          {
            message:
              currentMessage,
          }
        );

      const aiMessage = {
        type: "ai",
        data: data.data,
      };

      setMessages((prev) => [
        ...prev,
        aiMessage,
      ]);

    } catch (error) {

      setMessages((prev) => [
        ...prev,
        {
          type: "ai",
          text:
            "Sorry, PharmaAssist AI is currently unavailable.",
        },
      ]);
    }

    setLoading(false);
  };

  // =========================
  // ENTER KEY
  // =========================
  const handleKeyDown = (e) => {
    if (
      e.key === "Enter" &&
      !loading
    ) {
      e.preventDefault();

      sendMessage();
    }
  };

  // =========================
  // ADD TO CART
  // =========================
  const handleAddToCart = (
    product
  ) => {

    dispatch(
      addToCart({
        product,
        quantity: 1,
      })
    );

    toast.success(
      `${product.name} added to cart`
    );
  };

  return (
    <>
      {/* ========================= */}
      {/* FLOATING BUTTON */}
      {/* ========================= */}

      <button
  onClick={() => setIsOpen(true)}
  className="
    fixed
    bottom-5
    right-5
    z-40
    group
    flex
    items-center
    overflow-hidden
    rounded-full
    bg-gradient-to-r
    from-emerald-500
    to-green-600
    shadow-2xl
    transition-all
    duration-300
    hover:pr-5
    hover:scale-105
  "
>
  {/* ICON */}
  <div
    className="
      flex
      items-center
      justify-center
      w-14
      h-14
      rounded-full
      shrink-0
    "
  >
    <Bot className="w-6 h-6 text-white" />
  </div>

  {/* EXPANDING CONTENT */}
  <div
    className="
      max-w-0
      overflow-hidden
      whitespace-nowrap
      transition-all
      duration-300
      group-hover:max-w-xs
    "
  >
    <div className="pr-2">
      <p className="text-white font-semibold text-sm">
        PharmaAssist AI
      </p>

      <p className="text-white/80 text-xs">
        Smart Medical Assistant
      </p>
    </div>
  </div>
</button>

      {/* ========================= */}
      {/* CHAT MODAL */}
      {/* ========================= */}

      {isOpen && (
        <div
          className="
            fixed
            inset-0
            z-[9999]
            bg-black/40
            backdrop-blur-sm
            flex
            items-end
            sm:items-center
            justify-center
            p-0
            sm:p-6
          "
        >
          {/* CHAT CARD */}
          <div
            className="
              w-full
              sm:max-w-md
              h-[100dvh]
              sm:h-[85vh]
              bg-[#F8FFFD]
              border
              border-emerald-100
              shadow-2xl
              rounded-none
              sm:rounded-3xl
              overflow-hidden
              flex
              flex-col
            "
          >
            {/* ========================= */}
            {/* HEADER */}
            {/* ========================= */}

            <div
              className="
                relative
                bg-gradient-to-r
                from-emerald-500
                to-green-600
                px-5
                py-4
                text-white
              "
            >
              <div className="flex items-center justify-between">

                <div className="flex items-center gap-3">

                  <div
                    className="
                      w-12
                      h-12
                      rounded-2xl
                      bg-white/20
                      flex
                      items-center
                      justify-center
                    "
                  >
                    <ShieldPlus className="w-6 h-6" />
                  </div>

                  <div>
                    <h2 className="font-bold text-lg">
                      PharmaAssist AI
                    </h2>

                    <p className="text-white/80 text-xs">
                      AI Healthcare Consultant
                    </p>
                  </div>
                </div>

                <button
                  onClick={() =>
                    setIsOpen(false)
                  }
                  className="
                    w-10
                    h-10
                    rounded-full
                    hover:bg-white/20
                    transition
                    flex
                    items-center
                    justify-center
                  "
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>

            {/* ========================= */}
            {/* CHAT BODY */}
            {/* ========================= */}

            <div
              className="
                flex-1
                overflow-y-auto
                px-4
                py-5
                space-y-5
                bg-gradient-to-b
                from-[#F8FFFD]
                to-[#F2FBF7]
              "
            >
              {/* INTRO MESSAGE */}

              {messages.length ===
                0 && (
                <div className="space-y-4">

                  <div
                    className="
                      bg-white
                      border
                      border-emerald-100
                      rounded-2xl
                      p-5
                      shadow-sm
                    "
                  >
                    <div className="flex items-center gap-2 mb-3">
                      <Sparkles className="w-5 h-5 text-emerald-600" />

                      <h3 className="font-semibold text-gray-800">
                        Ask PharmaAssist AI
                      </h3>
                    </div>

                    <p className="text-sm text-gray-600 leading-relaxed">
                      Describe your symptoms
                      or medicine needs and
                      get smart healthcare
                      recommendations.
                    </p>
                  </div>

                  <div className="grid grid-cols-1 gap-3">

                    {[
                      "I have fever and headache",
                      "Suggest medicine for cough",
                      "What helps with allergies?",
                    ].map(
                      (
                        sample,
                        index
                      ) => (
                        <button
                          key={index}
                          onClick={() =>
                            setMessage(
                              sample
                            )
                          }
                          className="
                            text-left
                            bg-white
                            border
                            border-emerald-100
                            rounded-xl
                            p-4
                            hover:border-emerald-400
                            hover:shadow-md
                            transition
                          "
                        >
                          <p className="text-sm text-gray-700">
                            {sample}
                          </p>
                        </button>
                      )
                    )}
                  </div>
                </div>
              )}

              {/* ========================= */}
              {/* MESSAGES */}
              {/* ========================= */}

              {messages.map(
                (msg, index) => (
                  <div
                    key={index}
                    className="space-y-3"
                  >
                    {/* USER */}

                    {msg.type ===
                      "user" && (
                      <div className="flex justify-end">
                        <div
                          className="
                            max-w-[85%]
                            bg-gradient-to-r
                            from-emerald-500
                            to-green-600
                            text-white
                            px-4
                            py-3
                            rounded-2xl
                            rounded-br-md
                            shadow-md
                            text-sm
                          "
                        >
                          {msg.text}
                        </div>
                      </div>
                    )}

                    {/* AI */}

                    {msg.type ===
                      "ai" &&
                      msg.data && (
                        <div className="flex justify-start">
                          <div
                            className="
                              max-w-[95%]
                              bg-white
                              border
                              border-emerald-100
                              rounded-2xl
                              rounded-bl-md
                              p-4
                              shadow-sm
                              space-y-4
                            "
                          >
                            {/* AI HEADER */}

                            <div className="flex items-center gap-2">
                              <div
                                className="
                                  w-8
                                  h-8
                                  rounded-full
                                  bg-emerald-100
                                  flex
                                  items-center
                                  justify-center
                                "
                              >
                                <Bot className="w-4 h-4 text-emerald-700" />
                              </div>

                              <p className="font-semibold text-sm text-gray-800">
                                PharmaAssist AI
                              </p>
                            </div>

                            {/* REPLY */}

                            <p className="text-sm text-gray-700 leading-relaxed">
                              {
                                msg.data
                                  .reply
                              }
                            </p>

                            {/* CONDITIONS */}

                            {msg.data
                              .possibleConditions
                              ?.length >
                              0 && (
                              <div>
                                <p className="text-sm font-semibold text-gray-800 mb-2">
                                  Possible
                                  Conditions
                                </p>

                                <div className="flex flex-wrap gap-2">
                                  {msg.data.possibleConditions.map(
                                    (
                                      condition,
                                      i
                                    ) => (
                                      <span
                                        key={
                                          i
                                        }
                                        className="
                                          px-3
                                          py-1
                                          rounded-full
                                          bg-emerald-50
                                          border
                                          border-emerald-200
                                          text-emerald-700
                                          text-xs
                                          font-medium
                                        "
                                      >
                                        {
                                          condition
                                        }
                                      </span>
                                    )
                                  )}
                                </div>
                              </div>
                            )}

                            {/* MEDICINES */}

                            {msg.data
                              .recommendations
                              ?.length >
                              0 && (
                              <div className="space-y-3">

                                <p className="text-sm font-semibold text-gray-800">
                                  Suggested
                                  Medicines
                                </p>

                                {msg.data.recommendations.map(
                                  (
                                    item
                                  ) => (
                                    <div
                                      key={item._id}
                                      className="
                                        bg-[#F9FFFC]
                                        border
                                        border-emerald-100
                                        rounded-2xl
                                        p-3
                                        flex
                                        gap-3
                                        items-center
                                      "
                                    >
                                      <img
                                        src={item.images?.[0]?.url}
                                        alt={
                                          item.name
                                        }
                                        className="
                                          w-16
                                          h-16
                                          rounded-xl
                                          object-cover
                                          border
                                        "
                                      />

                                      <div className="flex-1 min-w-0">

                                        <h3
                                          className="
                                            font-semibold
                                            text-sm
                                            text-gray-800
                                            truncate
                                          "
                                        >
                                          {
                                            item.name
                                          }
                                        </h3>

                                        <p className="text-xs text-gray-500 mt-1 line-clamp-2">
                                          {
                                            item.description
                                          }
                                        </p>

                                        <p className="text-sm font-bold text-emerald-700 mt-2">
                                          Rs{" "}
                                          {
                                            item.price
                                          }
                                        </p>
                                      </div>

                                      <button
                                        onClick={() =>
                                          handleAddToCart(
                                            item
                                          )
                                        }
                                        className="
                                          flex
                                          items-center
                                          gap-1
                                          bg-gradient-to-r
                                          from-emerald-500
                                          to-green-600
                                          text-white
                                          px-3
                                          py-2
                                          rounded-xl
                                          text-xs
                                          font-medium
                                          hover:scale-105
                                          transition
                                          shadow
                                        "
                                      >
                                        <ShoppingCart className="w-3 h-3" />

                                        Add
                                      </button>
                                    </div>
                                  )
                                )}
                              </div>
                            )}

                            {/* DISCLAIMER */}

                            {msg.data
                              .disclaimer && (
                              <div
                                className="
                                  text-[11px]
                                  text-amber-700
                                  bg-amber-50
                                  border
                                  border-amber-200
                                  rounded-xl
                                  p-3
                                "
                              >
                                {
                                  msg.data
                                    .disclaimer
                                }
                              </div>
                            )}
                          </div>
                        </div>
                      )}

                    {/* FALLBACK */}

                    {msg.type ===
                      "ai" &&
                      msg.text && (
                        <div
                          className="
                            bg-red-50
                            border
                            border-red-200
                            text-red-600
                            rounded-xl
                            p-3
                            text-sm
                          "
                        >
                          {msg.text}
                        </div>
                      )}
                  </div>
                )
              )}

              {/* LOADING */}

              {loading && (
                <div className="flex justify-start">
                  <div
                    className="
                      bg-white
                      border
                      border-emerald-100
                      rounded-2xl
                      p-4
                      shadow-sm
                      flex
                      items-center
                      gap-3
                    "
                  >
                    <div className="flex gap-1">
                      <div className="w-2 h-2 rounded-full bg-emerald-500 animate-bounce" />
                      <div className="w-2 h-2 rounded-full bg-emerald-500 animate-bounce delay-100" />
                      <div className="w-2 h-2 rounded-full bg-emerald-500 animate-bounce delay-200" />
                    </div>

                    <p className="text-sm text-gray-500">
                      PharmaAssist AI
                      is thinking...
                    </p>
                  </div>
                </div>
              )}

              <div ref={messagesEndRef} />
            </div>

            {/* ========================= */}
            {/* INPUT */}
            {/* ========================= */}

            <div
              className="
                border-t
                bg-white
                p-4
              "
            >
              <div
                className="
                  flex
                  items-center
                  gap-3
                  bg-[#F6FBF8]
                  border
                  border-emerald-100
                  rounded-2xl
                  px-4
                  py-3
                "
              >
                <input
                  value={message}
                  onChange={(e) =>
                    setMessage(
                      e.target.value
                    )
                  }
                  onKeyDown={
                    handleKeyDown
                  }
                  placeholder="Describe symptoms or ask for medicine..."
                  className="
                    flex-1
                    bg-transparent
                    outline-none
                    text-sm
                    text-gray-700
                    placeholder:text-gray-400
                  "
                />

                <button
                  onClick={
                    sendMessage
                  }
                  disabled={
                    loading
                  }
                  className="
                    w-11
                    h-11
                    rounded-xl
                    bg-gradient-to-r
                    from-emerald-500
                    to-green-600
                    text-white
                    flex
                    items-center
                    justify-center
                    hover:scale-105
                    transition
                    disabled:opacity-50
                  "
                >
                  <Send className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default PharmaAIChat;