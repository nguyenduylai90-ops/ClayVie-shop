// Phần hiển thị bảng, anh sửa đoạn <select> thành như sau:
<select 
  value={order.status}
  onChange={(e) => updateStatus(order.id, e.target.value)}
  className={`text-xs font-bold px-3 py-1 rounded-full border-none outline-none ${
    order.status === 'completed' ? 'bg-green-100 text-green-600' : 
    order.status === 'received' ? 'bg-blue-100 text-blue-600' : 
    order.status === 'pending' ? 'bg-yellow-100 text-yellow-600' : 
    'bg-red-100 text-red-600'
  }`}
>
  <option value="pending">Chờ xử lý</option>
  <option value="received">Đã nhận đơn</option>
  <option value="completed">Đã giao</option>
  <option value="cancelled">Đã hủy</option>
</select>
