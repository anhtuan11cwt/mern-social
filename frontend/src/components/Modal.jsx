// Modal.jsx
//
// Modal hiển thị danh sách người dùng (followers, following, likes).
// Cho phép click vào người dùng để xem profile.

import { Link } from "react-router-dom";

const Modal = ({ value, title, setShow }) => {
  return (
    <div
      aria-modal="true"
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/50"
      onClick={() => setShow(false)}
      onKeyDown={(e) => e.key === "Enter" && setShow(false)}
      role="dialog"
      tabIndex={-1}
    >
      <div className="bg-white w-80 max-h-80 rounded-lg shadow-xl overflow-hidden">
        <div className="flex items-center justify-between p-4 border-b border-gray-200">
          <h3 className="font-semibold text-gray-800 text-lg">{title}</h3>
          <button
            className="text-gray-500 hover:text-gray-700 text-2xl leading-none cursor-pointer"
            onClick={() => setShow(false)}
            type="button"
          >
            &times;
          </button>
        </div>

        <div className="overflow-y-auto max-h-64">
          {value && value.length > 0 ? (
            <ul className="py-2">
              {value.map((user, index) => (
                <li key={user?._id || index}>
                  <Link
                    className="flex items-center gap-3 px-4 py-2 hover:bg-gray-100 transition-colors cursor-pointer"
                    onClick={() => setShow(false)}
                    to={`/user/${user?._id}`}
                  >
                    <span className="text-gray-400 text-sm w-6">
                      {index + 1}
                    </span>
                    <img
                      alt={user?.name}
                      className="w-10 h-10 rounded-full object-cover"
                      src={
                        user?.profilePic?.url ||
                        "https://via.placeholder.com/40"
                      }
                    />
                    <span className="font-medium text-gray-800">
                      {user?.name || "Người dùng"}
                    </span>
                  </Link>
                </li>
              ))}
            </ul>
          ) : (
            <p className="py-8 text-center text-gray-500">
              {title === "Người theo dõi"
                ? "Chưa có người theo dõi"
                : "Chưa theo dõi ai"}
            </p>
          )}
        </div>
      </div>
    </div>
  );
};

export default Modal;
