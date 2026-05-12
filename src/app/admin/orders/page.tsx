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
      setOrders(orders.map(o => o.id === id ? { ...o, ...updates } : o));
    }
  };

  // Hàm định dạng số có dấu chấm (Ví dụ: 500000 -> 500.000)
  const formatCurrencyInput = (val: string) => {
    if (!val) return '0';
    const num = val.replace(/\D/g, ""); // Xóa ký tự không phải số
    return Number(num).toLocaleString('vi-VN');
  };

  return (
    <div className="space-y-8 p-4">
      <div className="flex justify-between items-center px-4">
        <h1 className="text-4xl font-black text-gray-900 tracking-tighter">📦 Quản lý Đơn hàng</h1>
        <button onClick={fetchOrders} className="bg-pink-600 text-white px-8 py-3 rounded-2xl font-bold hover:bg-pink-700 transition shadow-lg shadow-pink-100">
          🔄 Làm mới
        </button>
      </div>

      <div className="bg-white rounded-[40px] shadow-2xl shadow-gray-100 border border-gray-100 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead className="bg-gray-50/50 border-b border-gray-100">
              <tr>
                <th className="p-6 font-bold text-gray-400 text-[10px] uppercase tracking-[0.2em]">Khách hàng</th>
                <th className="p-6 font-bold text-gray-400 text-[10px] uppercase tracking-[0.2em]">Số điện thoại</th>
                <th className="p-6 font-bold text-gray-400 text-[10px] uppercase tracking-[0.2em]">Yêu cầu/Ghi chú</th>
                <th className="p-6 font-bold text-gray-400 text-[10px] uppercase tracking-[0.2em]">Tài chính (Ứng/Còn)</th>
                <th className="p-6 font-bold text-gray-400 text-[10px] uppercase tracking-[0.2em]">Trạng thái</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {loading ? (
                <tr><td colSpan={5} className="p-20 text-center font-bold text-gray-300 italic">Đang tải đơn hàng...</td></tr>
              ) : orders.map((order) => {
                const remaining = order.total_price - (order.paid_amount || 0);
                
                return (
                  <tr key={order.id} className="hover:bg-gray-50/50 transition-all duration-300">
                    <td className="p-6">
                      <p className="font-black text-gray-800 text-lg">{order.customer_name}</p>
                      <p className="text-[10px] text-gray-400 font-mono">#{order.id.slice(0, 8).toUpperCase()}</p>
                    </td>
                    
                    <td className="p-6">
                      <a href={`tel:${order.customer_phone}`} className="font-bold text-blue-600">
                        {order.customer_phone}
                      </a>
                    </td>

                    <td className="p-6 max-w-xs">
                      <p className="text-sm text-gray-600 line-clamp-2 italic">
                        {order.customer_notes || 'Không có ghi chú'}
                      </p>
                    </td>

                    <td className="p-6">
                      <div className="space-y-1">
                        <p className="text-xs text-gray-400">Tổng: <span className="font-bold text-gray-800">{Number(order.total_price).toLocaleString('vi-VN')}đ</span></p>
                        <div className="flex items-center gap-2">
                          <span className="text-[10px] font-bold text-gray-300 uppercase">Ứng:</span>
                          <input 
                            type="text"
                            value={Number(order.paid_amount || 0).toLocaleString('vi-VN')}
                            onChange={(e) => {
                              const rawValue = e.target.value.replace(/\D/g, "");
                              updateOrder(order.id, { paid_amount: Number(rawValue) });
                            }}
                            className="w-32 p-2 bg-gray-100 border-none rounded-xl font-black text-pink-600 text-sm outline-none focus:ring-2 focus:ring-pink-500"
                          />
                        </div>
                        <p className={`text-xs font-bold ${remaining <= 0 ? 'text-green-500' : 'text-orange-500'}`}>
                          Còn: {remaining <= 0 ? 'Hết' : `${remaining.toLocaleString('vi-VN')}đ`}
                        </p>
                      </div>
                    </td>

                    <td className="p-6 text-right">
                      <select 
                        value={order.status}
                        onChange={(e) => updateOrder(order.id, { status: e.target.value })}
                        className={`w-full text-[10px] font-black px-4 py-2 rounded-xl border-none outline-none cursor-pointer uppercase tracking-tighter shadow-sm ${
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
                      <p className="text-[10px] text-gray-300 mt-2 font-bold uppercase">{new Date(order.created_at).toLocaleDateString('vi-VN')}</p>
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
