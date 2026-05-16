export default function AboutPage() {
  return (
    <div className="max-w-4xl mx-auto px-4 py-24 text-center">
      <h1 className="text-4xl md:text-5xl font-black text-gray-900 mb-8">Về ClayVie 🌸</h1>
      <div className="prose prose-pink mx-auto text-gray-600 text-lg leading-relaxed">
        <p>
          Chào mừng bạn đến với <strong>ClayVie</strong> - nơi gửi gắm tình yêu và sự tỉ mỉ vào từng cánh hoa đất sét.
        </p>
        <p className="mt-4">
          Mỗi sản phẩm tại ClayVie đều được nặn hoàn toàn bằng thủ công, mang đến vẻ đẹp tinh tế, chân thực và vĩnh cửu. Chúng tôi tin rằng hoa đất sét không chỉ là một món đồ trang trí, mà còn là một tác phẩm nghệ thuật lưu giữ những kỷ niệm đẹp đẽ vượt thời gian.
        </p>
        <div className="mt-12 p-8 bg-pink-50 rounded-3xl">
          <h3 className="text-2xl font-bold text-pink-600 mb-4">Sứ mệnh của chúng tôi</h3>
          <p className="text-gray-700">
            "Trao gửi yêu thương qua từng cánh hoa. Biến những nguyên liệu mộc mạc thành những tác phẩm đầy hồn sắc."
          </p>
        </div>
      </div>
    </div>
  );
}
