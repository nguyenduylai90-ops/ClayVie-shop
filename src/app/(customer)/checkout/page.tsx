'use client';

import { useState, useEffect, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { supabase } from '@/lib/supabase';

// Tách nội dung Checkout ra component con để dùng Suspense
function CheckoutContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const productId = searchParams.get('productId');
  
  const [loading, setLoading] = useState(false);
  const [product, setProduct] = useState<any>(null);
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    address: '',
  });

  useEffect(() => {
    if (productId) {
      const fetchProduct = async () => {
        const { data } = await supabase.from('products').select('*').eq('id', productId).single();
        setProduct(data);
      };
      fetchProduct();
    }
  }, [productId]);

  const handleCheckout = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!product) return;
    setLoading(true);

    try {
      const { data: order, error: orderError } = await supabase
        .from('orders')
        .insert([
          {
            customer_name: formData.name,
            customer_phone: formData.phone,
            customer_address: formData.address,
            total_price: product.price,
            status: 'pending',
          },
        ])
        .select()
        .single();

      if (orderError) throw orderError;

      const { error: itemError } = await supabase
        .from('order_items')
        .insert([
          {
            order_id: order.id,
            product_id: product.id,
            quantity: 1,
            price_at_time: product.price,
          },
        ]);

      if (itemError) throw itemError;

      alert('Đặt hàng thành công! ClayVie sẽ sớm liên hệ với bạn. 🌸');
      router.push('/');
    } catch (error: any) {
      alert('Lỗi đặt hàng: ' + error.message);
    } finally {
      setLoading(false);
    }
  };

  if (!productId) return <div className="p-20 text-center text-gray-500">Giỏ hàng trống hoặc sản phẩm không tồn tại.</div>;

  return (
    <div className="max-w-4xl mx-auto px-4 py-12">
      <h1 className="text-3xl font-bold mb-8">Thanh toán</h1>
      <div className="flex flex-col md:flex-row gap-12">
        <div className="flex-[2] space-y-6">
          <div className="bg-white p-8 rounded-2xl border border-gray-100 shadow-sm">
            <h2 className="text-xl font-bold mb-6">Thông tin giao hàng</h2>
            <form onSubmit={handleCheckout} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Họ và tên</label>
                <input
                  required
                  type="text"
                  className="w-full p-3 border rounded-xl focus:ring-2 focus:ring-pink-500 outline-none"
                  placeholder="Nguyễn Văn A"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Số điện thoại</label>
                <input
                  required
                  type="tel"
                  className="w-full p-3 border rounded-xl focus:ring-2 focus:ring-pink-500 outline-none"
                  placeholder="090..."
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Địa chỉ nhận hàng</label>
                <textarea
                  required
                  className="w-full p-3 border rounded-xl focus:ring-2 focus:ring-pink-500 outline-none h-24"
                  placeholder="Số nhà, tên đường, phường/xã..."
                  value={formData.address}
                  onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                />
              </div>
              <button
                disabled={loading}
                type="submit"
                className="w-full bg-pink-600 text-white font-bold py-4 rounded-xl hover:bg-pink-700 transition shadow-lg mt-4 disabled:bg-gray-300"
              >
                {loading ? 'Đang xử lý...' : 'Xác nhận Đặt hàng'}
              </button>
            </form>
          </div>
        </div>
        <div className="flex-1">
          <div className="bg-gray-50 p-6 rounded-2xl border border-gray-100 sticky top-24">
            <h2 className="text-lg font-bold mb-4">Đơn hàng của bạn</h2>
            {product && (
              <div className="space-y-4">
                <div className="flex gap-4">
                  <div className="w-16 h-16 bg-white rounded-lg border overflow-hidden flex-shrink-0">
                    <img src={product.image_url} alt={product.name} className="w-full h-full object-cover" />
                  </div>
                  <div className="flex-1">
                    <div className="font-bold text-gray-800 text-sm">{product.name}</div>
                    <div className="text-gray-500 text-xs">Số lượng: 1</div>
                  </div>
                  <div className="font-bold text-pink-600 text-sm">{product.price.toLocaleString('vi-VN')}đ</div>
                </div>
                <div className="border-t pt-4 space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-gray-500">Tạm tính:</span>
                    <span>{product.price.toLocaleString('vi-VN')}đ</span>
                  </div>
                  <div className="flex justify-between font-bold pt-2 border-t">
                    <span>Tổng cộng:</span>
                    <span className="text-pink-600">{product.price.toLocaleString('vi-VN')}đ</span>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

// Export default chính của trang, có bọc Suspense
export default function CheckoutPage() {
  return (
    <Suspense fallback={<div className="p-20 text-center">Đang tải thông tin thanh toán...</div>}>
      <CheckoutContent />
    </Suspense>
  );
}
