// loading.jsx
//
// Hai component loading: Loading hiển thị full-screen khi tải trang,
// LoadingAnimation là spinner nhỏ dùng trong button hoặc inline.

export const Loading = () => {
  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <div className="flex flex-col items-center gap-3">
        <div className="w-12 h-12 border-4 border-gray-300 border-t-4 border-t-blue-500 rounded-full animate-spin" />
        <p className="text-gray-600 font-medium">Đang tải...</p>
      </div>
    </div>
  );
};

export const LoadingAnimation = () => {
  return (
    <div className="w-5 h-5 border-2 border-gray-300 border-t-2 border-t-white rounded-full animate-spin" />
  );
};
