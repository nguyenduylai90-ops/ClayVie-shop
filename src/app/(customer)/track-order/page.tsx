// Trong hàm handleSearch, em thêm đoạn kiểm tra này:
const handleSearch = async (e: React.FormEvent) => {
  e.preventDefault();
  
  // Kiểm tra 10 số
  if (!/^\d{10}$/.test(phone)) {
    return alert('Số điện thoại không hợp lệ. Vui lòng nhập đúng 10 chữ số ạ! 🌸');
  }

  setLoading(true);
  // ... (phần code còn lại giữ nguyên)
};

// Trong thẻ <input>, em thêm onChange để chỉ cho phép nhập số:
<input
  type="tel"
  required
  maxLength={10}
  placeholder="Nhập số điện thoại (10 chữ số)..."
  className="flex-1 p-5 bg-transparent rounded-2xl outline-none text-lg font-bold tracking-widest"
  value={phone}
  onChange={(e) => setPhone(e.target.value.replace(/\D/g, ""))} // Chỉ lấy số
/>
