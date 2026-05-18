import { supabase } from '@/lib/supabase';
import DashboardChart from '@/components/DashboardChart';

// Force dynamic rendering to ensure admin statistics are always real-time
export const dynamic = 'force-dynamic';

export default async function AdminDashboard() {
  // Fetch stats
  const { count: productCount } = await supabase.from('products').select('*', { count: 'exact', head: true });
  
  // Fetch all orders
  const { data: allOrders } = await supabase
    .from('orders')
    .select('id, customer_name, total_price, status, created_at')
    .order('created_at', { ascending: false });
    
  const orders = allOrders || [];

  // 1. Total Revenue: ONLY completed orders
  const completedOrders = orders.filter(o => o.status === 'completed');
  const totalRevenue = completedOrders.reduce((acc, order) => acc + order.total_price, 0);

  // 2. Total Orders: All active (non-cancelled) orders
  const activeOrders = orders.filter(o => o.status !== 'cancelled');
  const activeOrderCount = activeOrders.length;

  // 3. Processing Orders: Active orders that are not completed (pending, confirmed, shipping)
  const processingOrderCount = activeOrders.filter(o => o.status !== 'completed').length;

  // Recent orders (latest 5)
  const recentOrders = orders.slice(0, 5);

  return (
    <div className="space-y-8">
      <h1 className="text-3xl font-bold text-gray-800">Tổng quan kinh doanh</h1>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Card 1: Revenue (Completed only) */}
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
          <div className="text-sm text-gray-500 mb-1">Tổng doanh thu (Đã giao hàng)</div>
          <div className="text-3xl font-black text-pink-600">{totalRevenue.toLocaleString('vi-VN')} đ</div>
          <div className="text-xs text-green-600 mt-2">↑ 12% so với tháng trước</div>
        </div>

        {/* Card 2: Orders (Completed + Processing) */}
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
          <div className="text-sm text-gray-500 mb-1">Tổng đơn hàng (Hoạt động)</div>
          <div className="text-3xl font-black text-blue-600">{activeOrderCount}</div>
          <div className="text-xs text-blue-600 mt-2">Đang xử lý: {processingOrderCount} đơn</div>
        </div>

        {/* Card 3: Total Products */}
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
          <div className="text-sm text-gray-500 mb-1">Tổng sản phẩm</div>
          <div className="text-3xl font-black text-purple-600">{productCount || 0}</div>
          <div className="text-xs text-purple-600 mt-2">Mẫu hoa đất sét</div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Interactive Custom SVG Dashboard Chart */}
        <DashboardChart orders={orders} />

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
                    <div className="font-bold text-pink-600 text-sm">{order.total_price.toLocaleString('vi-VN')} đ</div>
                    <div className={`text-[10px] uppercase font-black px-2.5 py-0.5 rounded-full inline-block mt-1 border ${
                      order.status === 'completed' ? 'bg-green-50 text-green-600 border-green-100/50' :
                      order.status === 'confirmed' ? 'bg-blue-50 text-blue-600 border-blue-100/50' :
                      order.status === 'shipping' ? 'bg-purple-50 text-purple-600 border-purple-100/50' :
                      order.status === 'pending' ? 'bg-amber-50 text-amber-600 border-amber-100/50' :
                      'bg-rose-50 text-rose-600 border-rose-100/50'
                    }`}>
                      {order.status === 'completed' ? 'Hoàn tất' :
                       order.status === 'confirmed' ? 'Đã chấp nhận' :
                       order.status === 'shipping' ? 'Đang giao' :
                       order.status === 'pending' ? 'Đang chờ' : 'Đã hủy'}
                    </div>
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
