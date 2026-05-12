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

  const updateOrder = async (id: string, updates: any) => {
    const { error } = await supabase
      .from('orders')
      .update(updates)
      .eq('id', id);

    if (!error) {
      // Cập nhật state tại chỗ để không phải load lại toàn bộ trang
      setOrders(orders.map(o => o.id === id ? { ...o, ...updates } : o));
    }
  };

  return (
    <div className="space-y-8 p-4">
      <div className="flex justify-between items-center">
        <h1 className="text-4xl font-black text-gray-900 tracking-tighter">📦 Quản lý Đơn hàng</h1>
        <button onClick={fetchOrders} className="bg-white border-2 border-gray-100 p-4 rounded-2xl font-bold hover:bg-gray-50 transition">
          🔄 Làm mới
        </button>
      </div>

      <div className="bg-white rounded-[40px] shadow-2xl shadow-gray-100 border border-gray-100 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead className="bg-gray-50/50 border-b border-gray-100">
              <tr>
                <th className="p-6 font-bold text-gray-400 text-[10px] uppercase tracking-[0.2em]">Khách hàng & Mã đơn</th>
                <th className="p-6 font-bold text-gray-400 text-[10px] uppercase tracking-[0.2em]">Tổng tiền</th>
                <th className="p-6 font-bold text-gray-400 text-[10px] uppercase tracking-[0.2em]">Đã ứng/cọc</th>
                <th className="p-6 font-bold text-gray-400 text-[10px] uppercase tracking-[0.2em]">Còn lại</th>
                <th className="p-6 font-bold text-gray-400 text-[10px] uppercase tracking-[0.2em]">Trạng thái</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {loading ? (
                <tr><td colSpan={5} className="p-20 text-center font-bold text-gray-300">Đang tải dữ liệu...</td></tr>
              ) : orders.map((order) => {
                const remaining = order.total_price - (order.paid_amount || 0);
                
                return (
                  <tr key={order.id} className="hover:bg-gray-50/50 transition-all duration-300">
                    <td className="p-6">
                      <p className="font-black text-gray-800 text-lg">{order.customer_name}</p>
                      <p className="text-xs text-gray-400 font-mono mt-1">#{order.id.slice(0, 8).toUpperCase()} • {order.customer_phone}</p>
                    </td>
                    
                    <td className="p-6">
                      <p className="font-black text-gray-800">{Number(order.total_price).toLocaleString('vi-VN')}đ</p>
                    </td>

                    <td className="p-6">
                      <div className="flex items-center gap-2">
                        <input 
                          type="number"
                          defaultValue={order.paid_amount || 0}
                          onBlur={(e) => updateOrder(order.id, { paid_amount: Number(e.target.value) })}
                          className="w-28 p-2 bg-gray-100 border-none rounded-xl font-bold text-pink-600 focus:ring-2 focus:ring-pink-500 outline-none"
                        />
                        <span className="text-[10px] font-bold text-gray-300">VNĐ</span>
                      </div>
                    </td>

                    <td className="p-6">
                      <p className={`font-black text-lg ${remaining <= 0 ? 'text-green-500' : 'text-orange-500'}`}>
                        {remaining <= 0 ? '✔️ Hết' : `${remaining.toLocaleString('vi-VN')}đ`}
                      </p>
                    </td>

                    <td className="p-6">
                      <select 
                        value={order.status}
                        onChange={(e) => updateOrder(order.id, { status: e.target.value })}
                        className={`text-[10px] font-black px-4 py-2 rounded-xl border-none outline-none cursor-pointer uppercase tracking-tighter shadow-sm ${
                          order.status === 'completed' ? 'bg-green-500 text-white' : 
                          order.status === 'received' ? 'bg-blue-500 text-white' : 
                          order.status === 'pending' ? 'bg-yellow-400 text-black' : 
                          'bg-red-500 text-white'
                        }`}
                      >
                        <option value="pending">Chờ xử lý</option>
                        <option value="received">Đã nhận đơn</option>
                        <option value="completed">Đã giao</option>
                        <option value="cancelled">Đã hủy</option>
                      </select>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
