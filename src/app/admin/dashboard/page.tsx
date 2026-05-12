import { supabase } from '@/lib/supabase';

export default async function AdminDashboard() {
  // Fetch stats
  const { count: productCount } = await supabase.from('products').select('*', { count: 'exact', head: true });
  const { count: orderCount } = await supabase.from('orders').select('*', { count: 'exact', head: true });
  
  const { data: orders } = await supabase.from('orders').select('total_price, created_at');
  const totalRevenue = orders?.reduce((acc, order) => acc + order.total_price, 0) || 0;

  // Recent orders
  const { data: recentOrders } = await supabase
    .from('orders')
    .select('*')
    .order('created_at', { ascending: false })
    .limit(5);

  return (
    <div className="space-y-8">
      <h1 className="text-3xl font-bold text-gray-800">Tổng quan kinh doanh</h1>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
          <div className="text-sm text-gray-500 mb-1">Tổng doanh thu</div>
          <div className="text-3xl font-black text-pink-600">{totalRevenue.toLocaleString('vi-VN')} đ</div>
          <div className="text-xs text-green-600 mt-2">↑ 12% so với tháng trước</div>
        </div>
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
          <div className="text-sm text-gray-500 mb-1">Tổng đơn hàng</div>
          <div className="text-3xl font-black text-blue-600">{orderCount || 0}</div>
          <div className="text-xs text-blue-600 mt-2">Đang xử lý: 3 đơn</div>
        </div>
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
          <div className="text-sm text-gray-500 mb-1">Tổng sản phẩm</div>
          <div className="text-3xl font-black text-purple-600">{productCount || 0}</div>
          <div className="text-xs text-purple-600 mt-2">Mẫu hoa đất sét</div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Placeholder for Chart */}
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
          <h2 className="text-xl font-bold mb-6 text-gray-800">Biểu đồ Doanh thu</h2>
          <div className="h-64 bg-gray-50 rounded-xl flex items-center justify-center border-2 border-dashed border-gray-200">
            <div className="text-center">
              <div className="text-4xl mb-2">📈</div>
              <p className="text-gray-400 text-sm">Biểu đồ sẽ hiển thị khi có dữ liệu bán hàng hàng ngày.</p>
            </div>
          </div>
        </div>

        {/* Recent Orders List */}
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
          <h2 className="text-xl font-bold mb-6 text-gray-800">Đơn hàng mới nhất</h2>
          <div className="space-y-4">
            {recentOrders && recentOrders.length > 0 ? (
              recentOrders.map((order) => (
                <div key={order.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-xl">
                  <div>
                    <div className="font-bold text-gray-800 text-sm">{order.customer_name}</div>
                    <div className="text-xs text-gray-500">{new Date(order.created_at).toLocaleDateString('vi-VN')}</div>
                  </div>
                  <div className="text-right">
                    <div className="font-bold text-pink-600 text-sm">{order.total_price.toLocaleString('vi-VN')}đ</div>
                    <div className="text-[10px] text-gray-400 uppercase font-bold">{order.status}</div>
                  </div>
                </div>
              ))
            ) : (
              <p className="text-center text-gray-400 py-12">Chưa có đơn hàng nào.</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
