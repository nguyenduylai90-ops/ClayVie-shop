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
      fetchOrders(); 
    }
  };

  return (
    <div className="space-y-8">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold text-gray-800">📦 Quản lý Đơn hàng</h1>
        <button onClick={fetchOrders} className="bg-white border px-4 py-2 rounded-xl text-sm font-bold hover:bg-gray-50 transition">
          🔄 Làm mới
        </button>
      </div>

      <div className="bg-white rounded-3xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead className="bg-gray-50 border-b border-gray-100">
              <tr>
                <th className="p-6 font-bold text-gray-400 text-xs uppercase tracking-widest">Mã đơn</th>
                <th className="p-6 font-bold text-gray-400 text-xs uppercase tracking-widest">Khách hàng</th>
                <th className="p-6 font-bold text-gray-400 text-xs uppercase tracking-widest">Số điện thoại</th>
                <th className="p-6 font-bold text-gray-400 text-xs uppercase tracking-widest">Tổng tiền</th>
                <th className="p-6 font-bold text-gray-400 text-xs uppercase tracking-widest">Trạng thái</th>
                <th className="p-6 font-bold text-gray-400 text-xs uppercase tracking-widest">Ngày đặt</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {loading ? (
                <tr><td colSpan={6} className="p-10 text-center text-gray-400">Đang tải đơn hàng...</td></tr>
              ) : orders.map((order) => (
                <tr key={order.id} className="hover:bg-gray-50 transition">
                  <td className="p-6">
                    <span className="font-mono text-xs bg-gray-100 px-2 py-1 rounded text-gray-500">
                      #{order.id.slice(0, 8).toUpperCase()}
                    </span>
                  </td>
                  <td className="p-6 font-bold text-gray-800">{order.customer_name}</td>
                  <td className="p-6 text-gray-600">{order.customer_phone}</td>
                  <td className="p-6 font-black text-pink-600">{Number(order.total_price).toLocaleString('vi-VN')}đ</td>
                  <td className="p-6">
                    <select 
                      value={order.status}
                      onChange={(e) => updateStatus(order.id, e.target.value)}
                      className={`text-[10px] font-black px-4 py-1.5 rounded-full border-none outline-none cursor-pointer uppercase tracking-tighter ${
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
                  </td>
                  <td className="p-6 text-gray-400 text-sm">
                    {new Date(order.created_at).toLocaleDateString('vi-VN')}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
