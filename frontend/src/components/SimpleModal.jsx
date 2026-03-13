// SimpleModal.jsx
//
// Dropdown menu đơn giản. Đóng tự động khi click bên ngoài.
// Dùng cho menu tùy chọn (edit, delete) trên bài viết.

import { useEffect, useRef } from "react";

const SimpleModal = ({ isOpen, onClose, children, position = "right" }) => {
  const menuRef = useRef(null);

  useEffect(() => {
    // Đóng modal khi click bên ngoài để cải thiện UX
    const handleClickOutside = (event) => {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside);
      return () =>
        document.removeEventListener("mousedown", handleClickOutside);
    }
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const positionClasses = {
    center: "left-1/2 transform -translate-x-1/2 top-full mt-1",
    left: "left-0 top-full mt-1",
    right: "right-0 top-full mt-1",
  };

  return (
    <div
      className={`absolute ${positionClasses[position]} z-50 bg-white rounded-lg shadow-lg border border-gray-200 py-1 min-w-max`}
      ref={menuRef}
    >
      {children}
    </div>
  );
};

export default SimpleModal;
