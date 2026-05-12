'use client';

import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';

export default function OrdersPage() {
  const [orders, setOrders] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from('orders')
      .select('*')
      .order('created_at', { ascending: false });

    if (!error) {
      setOrders(data);
    }
    setLoading(false);
  };

  const updateStatus = async (id: string, newStatus: string) => {
    const { error } = await supabase
      .from('orders')
      .update({ status: newStatus })
      .eq('id', id);

    if (!error) {
      fetchOrders(); // Tải lại danh sách sau khi cập nhật
    }
  };

  return (
    <div className="space-y-8">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold text-gray-800">📦 Quản lý Đơn hàng</h1>
        <button onClick={fetchOrders} className="text-pink-600 hover:underline">Làm mới</button>
      </div>

      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
        <table className="w-full text-left">
          <thead className="bg-gray-50 border-b border-gray-100">
            <tr>
              <th className="p-4 font-bold text-gray-600">Khách hàng</th>
              <th className="p-4 font-bold text-gray-600">Số điện thoại</th>
              <th className="p-4 font-bold text-gray-600">Tổng tiền</th>
              <th className="p-4 font-bold text-gray-600">Trạng thái</th>
              <th className="p-4 font-bold text-gray-600">Ngày đặt</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-50">
            {loading ? (
              <tr><td colSpan={5} className="p-10 text-center text-gray-400">Đang tải đơn hàng...</td></tr>
            ) : orders.length === 0 ? (
              <tr><td colSpan={5} className="p-10 text-center text-gray-400">Chưa có đơn hàng nào.</td></tr>
            ) : (
              orders.map((order) => (
                <tr key={order.id} className="hover:bg-gray-50 transition">
                  <td className="p-4 font-medium">{order.customer_name}</td>
                  <td className="p-4 text-gray-600">{order.customer_phone}</td>
                  <td className="p-4 font-bold text-pink-600">{Number(order.total_price).toLocaleString('vi-VN')}đ</td>
                  <td className="p-4">
                    <select 
                      value={order.status}
                      onChange={(e) => updateStatus(order.id, e.target.value)}
                      className={`text-xs font-bold px-3 py-1 rounded-full border-none outline-none ${
                        order.status === 'completed' ? 'bg-green-100 text-green-600' : 
                        order.status === 'pending' ? 'bg-yellow-100 text-yellow-600' : 
                        'bg-red-100 text-red-600'
                      }`}
                    >
                      <option value="pending">Chờ xử lý</option>
                      <option value="completed">Đã giao</option>
                      <option value="cancelled">Đã hủy</option>
                    </select>
                  </td>
                  <td className="p-4 text-gray-400 text-sm">
                    {new Date(order.created_at).toLocaleDateString('vi-VN')}
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
