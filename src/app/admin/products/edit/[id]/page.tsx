'use client';

import { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { supabase } from '@/lib/supabase';
import { ArrowLeft, Upload, Image as ImageIcon, X, Link as LinkIcon, AlertCircle } from 'lucide-react';
import Link from 'next/link';

export default function EditProductPage({ params }: { params: { id: string } }) {
  const router = useRouter();
  const id = params.id;
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(true);
  const [uploadProgress, setUploadProgress] = useState<'idle' | 'uploading' | 'success' | 'error'>('idle');
  const [uploadErrorMsg, setUploadErrorMsg] = useState('');
  
  const [formData, setFormData] = useState({
    name: '',
    price: '',
    description: '',
    category: '',
    stock_quantity: '0',
  });

  const [imageMode, setImageMode] = useState<'file' | 'url'>('file');
  const [imageUrl, setImageUrl] = useState('');
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [originalImageUrl, setOriginalImageUrl] = useState('');

  // Fetch current product data
  useEffect(() => {
    const fetchProduct = async () => {
      setFetching(true);
      try {
        const { data, error } = await supabase
          .from('products')
          .select('*')
          .eq('id', id)
          .single();

        if (error) throw error;

        if (data) {
          setFormData({
            name: data.name,
            price: data.price.toString(),
            description: data.description || '',
            category: data.category || '',
            stock_quantity: data.stock_quantity.toString(),
          });
          
          if (data.image_url) {
            setOriginalImageUrl(data.image_url);
            setImagePreview(data.image_url);
            // If it starts with http, we can also bind it to imageUrl for URL mode
            setImageUrl(data.image_url);
          }
        }
      } catch (err: any) {
        alert('Lỗi tải sản phẩm: ' + err.message);
        router.push('/admin/products');
      } finally {
        setFetching(false);
      }
    };

    fetchProduct();
  }, [id, router]);

  // Handle file select
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setSelectedFile(file);
      setImagePreview(URL.createObjectURL(file));
      setUploadProgress('idle');
      setUploadErrorMsg('');
    }
  };

  // Drag and Drop
  const [dragActive, setDragActive] = useState(false);
  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);

    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      const file = e.dataTransfer.files[0];
      setSelectedFile(file);
      setImagePreview(URL.createObjectURL(file));
      setUploadProgress('idle');
      setUploadErrorMsg('');
    }
  };

  const removeSelectedFile = () => {
    setSelectedFile(null);
    // Revert to original image if any, or clear
    if (originalImageUrl) {
      setImagePreview(originalImageUrl);
    } else {
      setImagePreview(null);
    }
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  // Upload file to Supabase Storage
  const uploadImage = async (file: File): Promise<string> => {
    setUploadProgress('uploading');
    
    const fileExt = file.name.split('.').pop();
    const fileName = `${Date.now()}_${Math.random().toString(36).substring(2, 9)}.${fileExt}`;
    const filePath = `products/${fileName}`;

    // Upload
    const { error: uploadError, data } = await supabase.storage
      .from('products')
      .upload(filePath, file, {
        cacheControl: '3600',
        upsert: false
      });

    if (uploadError) {
      setUploadProgress('error');
      if (uploadError.message.includes('bucket') || uploadError.message.includes('not found')) {
        throw new Error(
          "Storage bucket 'products' chưa được tạo hoặc không có quyền Public. Vui lòng vào trang quản trị Supabase > Storage > Tạo bucket tên 'products' ở chế độ PUBLIC (Công khai) và thêm RLS Policy cho phép Anonymous Upload."
        );
      }
      throw uploadError;
    }

    // Get Public URL
    const { data: { publicUrl } } = supabase.storage
      .from('products')
      .getPublicUrl(filePath);

    setUploadProgress('success');
    return publicUrl;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setUploadErrorMsg('');

    try {
      let finalImageUrl = originalImageUrl;

      if (imageMode === 'url') {
        finalImageUrl = imageUrl;
      } else if (imageMode === 'file' && selectedFile) {
        // Upload new image if selected
        finalImageUrl = await uploadImage(selectedFile);
      }

      if (!finalImageUrl) {
        throw new Error("Sản phẩm bắt buộc phải có hình ảnh.");
      }

      const { error } = await supabase
        .from('products')
        .update({
          name: formData.name,
          price: parseFloat(formData.price),
          description: formData.description,
          category: formData.category,
          stock_quantity: parseInt(formData.stock_quantity),
          image_url: finalImageUrl,
        })
        .eq('id', id);

      if (error) throw error;

      alert('Cập nhật sản phẩm thành công! 🎉');
      router.push('/admin/products');
      router.refresh();
    } catch (error: any) {
      setUploadErrorMsg(error.message);
      setUploadProgress('error');
      alert('Lỗi cập nhật: ' + error.message);
    } finally {
      setLoading(false);
    }
  };

  if (fetching) {
    return (
      <div className="max-w-3xl mx-auto py-24 flex flex-col items-center justify-center">
        <div className="w-12 h-12 border-4 border-pink-200 border-t-pink-600 rounded-full animate-spin"></div>
        <p className="text-gray-400 mt-4 font-semibold text-sm">Đang tải thông tin hoa đất sét...</p>
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto space-y-6 pb-12 animate-fadeIn">
      {/* Navigation & Title */}
      <div className="flex items-center gap-4">
        <Link 
          href="/admin/products"
          className="p-3 bg-white text-slate-600 hover:bg-pink-50 hover:text-pink-600 rounded-2xl border border-gray-100 shadow-sm transition duration-300"
        >
          <ArrowLeft size={18} />
        </Link>
        <div>
          <h1 className="text-3xl font-black text-slate-800 tracking-tight">Chỉnh sửa hoa</h1>
          <p className="text-gray-500 text-sm">Cập nhật thông tin chi tiết cho mẫu hoa đất sét của bạn</p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="bg-white rounded-3xl p-8 border border-gray-100 shadow-xl space-y-8">
        {/* Name input */}
        <div>
          <label className="block text-xs font-black text-gray-400 uppercase tracking-widest mb-3">Tên hoa đất sét</label>
          <input
            required
            type="text"
            className="w-full p-4 bg-gray-50 border-none rounded-2xl focus:ring-2 focus:ring-pink-500 outline-none font-bold text-slate-800"
            placeholder="Tên sản phẩm"
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
          />
        </div>

        {/* Pricing and Stock */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div>
            <label className="block text-xs font-black text-gray-400 uppercase tracking-widest mb-3">Giá bán (VNĐ)</label>
            <input
              required
              type="number"
              min="0"
              className="w-full p-4 bg-gray-50 border-none rounded-2xl focus:ring-2 focus:ring-pink-500 outline-none font-bold text-pink-600"
              placeholder="0"
              value={formData.price}
              onChange={(e) => setFormData({ ...formData, price: e.target.value })}
            />
          </div>
          <div>
            <label className="block text-xs font-black text-gray-400 uppercase tracking-widest mb-3">Số lượng tồn kho</label>
            <input
              required
              type="number"
              min="0"
              className="w-full p-4 bg-gray-50 border-none rounded-2xl focus:ring-2 focus:ring-pink-500 outline-none font-bold text-slate-800"
              placeholder="0"
              value={formData.stock_quantity}
              onChange={(e) => setFormData({ ...formData, stock_quantity: e.target.value })}
            />
          </div>
        </div>

        {/* Category selector */}
        <div>
          <label className="block text-xs font-black text-gray-400 uppercase tracking-widest mb-3">Danh mục sản phẩm</label>
          <select 
            required
            className="w-full p-4 bg-gray-50 border-none rounded-2xl focus:ring-2 focus:ring-pink-500 outline-none font-bold text-slate-600"
            value={formData.category}
            onChange={(e) => setFormData({ ...formData, category: e.target.value })}
          >
            <option value="">Chọn danh mục</option>
            <option value="hoa-le">Hoa lẻ (cành hoa riêng biệt)</option>
            <option value="chau-hoa">Chậu hoa (chậu trang trí sẵn)</option>
            <option value="qua-tang">Quà tặng (hộp hoa, khung tranh...)</option>
          </select>
        </div>

        {/* Description textarea */}
        <div>
          <label className="block text-xs font-black text-gray-400 uppercase tracking-widest mb-3">Mô tả chi tiết</label>
          <textarea
            className="w-full p-4 bg-gray-50 border-none rounded-2xl focus:ring-2 focus:ring-pink-500 outline-none font-medium h-32 resize-none text-slate-700"
            placeholder="Mô tả sản phẩm"
            value={formData.description}
            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
          />
        </div>

        {/* Image upload section */}
        <div className="space-y-4">
          <div className="flex justify-between items-center">
            <label className="block text-xs font-black text-gray-400 uppercase tracking-widest">Hình ảnh hoa</label>
            <div className="flex bg-gray-100 p-1 rounded-xl">
              <button
                type="button"
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-black transition ${
                  imageMode === 'file' ? 'bg-white text-slate-800 shadow-sm' : 'text-gray-400 hover:text-slate-600'
                }`}
                onClick={() => setImageMode('file')}
              >
                <Upload size={12} />
                Tải file ảnh
              </button>
              <button
                type="button"
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-black transition ${
                  imageMode === 'url' ? 'bg-white text-slate-800 shadow-sm' : 'text-gray-400 hover:text-slate-600'
                }`}
                onClick={() => setImageMode('url')}
              >
                <LinkIcon size={12} />
                Dán link URL
              </button>
            </div>
          </div>

          {imageMode === 'file' ? (
            /* File Drag & Drop */
            <div 
              onDragEnter={handleDrag}
              onDragOver={handleDrag}
              onDragLeave={handleDrag}
              onDrop={handleDrop}
              onClick={() => fileInputRef.current?.click()}
              className={`border-2 border-dashed rounded-3xl p-8 text-center cursor-pointer transition-all duration-300 ${
                dragActive ? 'border-pink-500 bg-pink-50/20' : 'border-gray-200 hover:border-pink-400 bg-gray-50/50'
              }`}
            >
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                className="hidden"
                onChange={handleFileChange}
              />
              
              {imagePreview ? (
                <div className="relative max-w-xs mx-auto group" onClick={e => e.stopPropagation()}>
                  <img src={imagePreview} alt="Preview" className="rounded-2xl max-h-48 mx-auto object-cover border shadow-md" />
                  <button
                    type="button"
                    onClick={removeSelectedFile}
                    className="absolute -top-3 -right-3 p-1.5 bg-rose-100 hover:bg-rose-500 text-rose-600 hover:text-white rounded-full transition shadow-sm"
                  >
                    <X size={16} />
                  </button>
                </div>
              ) : (
                <div className="space-y-3">
                  <div className="bg-white w-14 h-14 rounded-2xl flex items-center justify-center mx-auto shadow-md shadow-pink-50 text-pink-500">
                    <Upload size={24} />
                  </div>
                  <div className="font-bold text-slate-700 text-sm">Kéo thả hoặc Nhấp để tải file ảnh lên</div>
                  <div className="text-gray-400 text-xs">PNG, JPG, JPEG, WEBP (tối đa 5MB)</div>
                </div>
              )}
            </div>
          ) : (
            /* Paste URL */
            <div className="flex gap-3 bg-gray-50 p-3 rounded-2xl items-center border border-gray-100 focus-within:ring-2 focus-within:ring-pink-500">
              <LinkIcon size={18} className="text-gray-400 ml-2" />
              <input
                type="text"
                className="flex-1 bg-transparent border-none outline-none font-bold text-slate-800 text-sm"
                placeholder="Dán đường dẫn ảnh trực tiếp (https://...)"
                value={imageUrl}
                onChange={(e) => setImageUrl(e.target.value)}
              />
            </div>
          )}

          {/* Upload Error Warning UI */}
          {uploadProgress === 'error' && uploadErrorMsg && (
            <div className="bg-rose-50 border border-rose-100 p-4 rounded-2xl flex gap-3 text-rose-700 text-sm animate-fadeIn">
              <AlertCircle size={20} className="flex-shrink-0 mt-0.5 text-rose-500" />
              <div>
                <span className="font-black block mb-1">Cần cấu hình Supabase Storage</span>
                <span className="leading-relaxed font-medium">{uploadErrorMsg}</span>
              </div>
            </div>
          )}
        </div>

        {/* Action buttons */}
        <div className="flex gap-4 pt-4">
          <button
            type="button"
            onClick={() => router.back()}
            className="flex-1 py-4 bg-gray-50 hover:bg-gray-100 text-slate-700 font-bold rounded-2xl transition-all duration-300"
          >
            Hủy bỏ
          </button>
          <button
            disabled={loading}
            type="submit"
            className="flex-1 py-4 bg-pink-600 text-white font-bold rounded-2xl hover:bg-pink-700 transition-all duration-300 shadow-lg shadow-pink-100 disabled:bg-gray-400 disabled:shadow-none"
          >
            {loading ? (
              <span className="flex items-center justify-center gap-2">
                <span className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></span>
                {uploadProgress === 'uploading' ? 'Đang tải ảnh lên...' : 'Đang cập nhật...'}
              </span>
            ) : (
              'Cập nhật hoa'
            )}
          </button>
        </div>
      </form>
    </div>
  );
}
