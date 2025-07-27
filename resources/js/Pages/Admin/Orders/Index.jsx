import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, Link, useForm } from '@inertiajs/react';
import { useState } from 'react';

// --- Komponen Modal (Pop-up) ---
function Modal({ show, onClose, children }) {
    if (!show) return null;
    return (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50 flex items-center justify-center px-4">
            <div className="relative mx-auto p-6 border w-full max-w-4xl shadow-lg rounded-xl bg-white">
                {children}
            </div>
        </div>
    );
}

// --- Komponen Form untuk Buat Pesanan ---
function OrderForm({ stores, products, onClose }) {
    const { data, setData, post, processing, errors, reset } = useForm({
        store_id: '',
        order_date: new Date().toISOString().slice(0, 10),
        items: [],
    });

    const [selectedProduct, setSelectedProduct] = useState('');

    const addItem = () => {
        if (!selectedProduct) return;
        const productToAdd = products.find(p => p.id === parseInt(selectedProduct));
        if (productToAdd && !data.items.some(item => item.product_id === productToAdd.id)) {
            setData('items', [...data.items, { product_id: productToAdd.id, name: productToAdd.name, quantity: 1, price: productToAdd.price }]);
        }
        setSelectedProduct('');
    };

    const updateQuantity = (productId, quantity) => {
        const newQuantity = Math.max(1, parseInt(quantity) || 1);
        setData('items', data.items.map(item => item.product_id === productId ? { ...item, quantity: newQuantity } : item));
    };

    const removeItem = (productId) => {
        setData('items', data.items.filter(item => item.product_id !== productId));
    };

    const totalAmount = data.items.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    
    const formatCurrency = (amount) => new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', minimumFractionDigits: 0 }).format(amount);

    const submit = (e) => {
        e.preventDefault();
        post(route('orders.store'), {
            onSuccess: () => {
                reset();
                onClose();
            }
        });
    };

    return (
        <form onSubmit={submit} className="space-y-6">
            <div className="flex justify-between items-center pb-3 border-b"><h3 className="text-2xl font-bold text-gray-900">Buat Pesanan Baru</h3><button type="button" onClick={onClose} className="text-gray-400 hover:text-gray-600 text-3xl font-bold">&times;</button></div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                    <label htmlFor="store_id" className="block text-sm font-medium text-gray-700">Pilih Toko</label>
                    <select id="store_id" value={data.store_id} onChange={e => setData('store_id', e.target.value)} className="mt-1 block w-full rounded-md border-gray-300 shadow-sm" required>
                        <option value="" disabled>-- Pilih Toko --</option>
                        {stores.map(store => <option key={store.id} value={store.id}>{store.name}</option>)}
                    </select>
                    {errors.store_id && <div className="text-red-500 text-xs mt-1">{errors.store_id}</div>}
                </div>
                <div>
                    <label htmlFor="order_date" className="block text-sm font-medium text-gray-700">Tanggal Pesan</label>
                    <input type="date" id="order_date" value={data.order_date} onChange={e => setData('order_date', e.target.value)} className="mt-1 block w-full rounded-md border-gray-300 shadow-sm" required />
                    {errors.order_date && <div className="text-red-500 text-xs mt-1">{errors.order_date}</div>}
                </div>
            </div>
            <div>
                <label className="block text-sm font-medium text-gray-700">Tambah Produk</label>
                <div className="flex gap-2 mt-1">
                    <select value={selectedProduct} onChange={e => setSelectedProduct(e.target.value)} className="flex-grow rounded-md border-gray-300 shadow-sm">
                        <option value="" disabled>-- Pilih Produk --</option>
                        {products.map(product => <option key={product.id} value={product.id}>{product.name}</option>)}
                    </select>
                    <button type="button" onClick={addItem} className="bg-gray-700 text-white font-bold py-2 px-4 rounded-lg hover:bg-gray-800">Tambah</button>
                </div>
            </div>
            <div className="border rounded-lg overflow-hidden max-h-64 overflow-y-auto">
                <table className="min-w-full"><thead className="bg-gray-50 sticky top-0"><tr><th className="p-3 text-left text-xs font-bold text-gray-500 uppercase">Produk</th><th className="p-3 text-left text-xs font-bold text-gray-500 uppercase">Kuantitas</th><th className="p-3 text-left text-xs font-bold text-gray-500 uppercase">Subtotal</th><th className="p-3 w-16"></th></tr></thead>
                    <tbody>
                        {data.items.length === 0 && <tr><td colSpan="4" className="p-4 text-center text-gray-500">Belum ada produk.</td></tr>}
                        {data.items.map(item => (<tr key={item.product_id} className="border-t"><td className="p-3">{item.name}</td><td className="p-3"><input type="number" value={item.quantity} onChange={e => updateQuantity(item.product_id, e.target.value)} className="w-20 rounded-md border-gray-300" /></td><td className="p-3 font-medium">{formatCurrency(item.price * item.quantity)}</td><td className="p-3 text-center"><button type="button" onClick={() => removeItem(item.product_id)} className="text-red-500 hover:text-red-700">Hapus</button></td></tr>))}
                    </tbody>
                </table>
            </div>
            <div className="text-right"><p className="text-gray-600">Total Harga:</p><p className="text-2xl font-bold">{formatCurrency(totalAmount)}</p></div>
            <div className="flex justify-end gap-4 pt-4 border-t"><button type="button" onClick={onClose} className="bg-gray-200 text-gray-700 font-bold py-2 px-4 rounded-lg hover:bg-gray-300">Batal</button><button type="submit" className="bg-blue-600 text-white font-bold py-2 px-4 rounded-lg shadow-md hover:bg-blue-700" disabled={processing || data.items.length === 0}>Simpan Pesanan</button></div>
        </form>
    );
}

// --- Komponen Kartu Ringkasan ---
function SummaryCard({ title, value, icon }) {
    return (
        <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-200 flex items-center gap-4">
            <div className="p-3 rounded-lg bg-gray-100">{icon}</div>
            <div><p className="text-sm font-medium text-gray-500">{title}</p><p className="text-2xl font-bold text-gray-800">{value}</p></div>
        </div>
    );
}

// --- Komponen Utama Halaman ---
export default function Index({ auth, orders, stores, products, flash }) {
    const [isModalOpen, setIsModalOpen] = useState(false);

    const header = (
        <div><h2 className="font-bold text-2xl text-gray-800">Manajemen Pesanan</h2><p className="text-sm text-gray-500">Kelola daftar pesanan dari semua toko</p></div>
    );
    
    // Fungsi untuk memformat tanggal
    const formatDate = (dateString) => new Date(dateString).toLocaleDateString('id-ID', { day: '2-digit', month: 'short', year: 'numeric' });
    
    // Fungsi untuk badge status
    const getStatusBadge = (status) => {
        const statuses = {
            pending: 'bg-yellow-100 text-yellow-700',
            processed: 'bg-blue-100 text-blue-700',
            assigned_to_trip: 'bg-indigo-100 text-indigo-700',
            delivered: 'bg-green-100 text-green-700',
            cancelled: 'bg-red-100 text-red-700',
        };
        const statusText = (status || '').replace('_', ' ');
        return <span className={`capitalize px-2.5 py-1 text-xs font-semibold rounded-full ${statuses[status] || 'bg-gray-100 text-gray-700'}`}>{statusText}</span>;
    };

    // Menghitung ringkasan dari data pesanan
    const summary = {
        total_orders: orders.length,
        pending_orders: orders.filter(o => o.status === 'pending').length,
        completed_orders: orders.filter(o => o.status === 'delivered').length,
    };

    return (
        <AuthenticatedLayout user={auth.user} header={header}>
            <Head title="Manajemen Pesanan" />
            {flash?.success && <div className="bg-green-100 border-green-400 text-green-700 px-4 py-3 rounded mx-8 mt-4"><span className="block sm:inline">{flash.success}</span></div>}
            <div className="p-4 md:p-8">
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
                    <SummaryCard title="Total Pesanan" value={summary.total_orders} icon="📦" />
                    <SummaryCard title="Pesanan Pending" value={summary.pending_orders} icon="⏳" />
                    <SummaryCard title="Pesanan Selesai" value={summary.completed_orders} icon="✅" />
                </div>
                <div className="flex justify-end mb-6">
                    <button onClick={() => setIsModalOpen(true)} className="bg-blue-600 text-white font-bold py-2 px-4 rounded-lg shadow-md hover:bg-blue-700 flex items-center gap-2 h-fit">
                        <span className="text-xl">+</span><span>Buat Pesanan</span>
                    </button>
                </div>
                <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-x-auto">
                    <table className="min-w-full divide-y divide-gray-200">
                        <thead className="bg-white">
                            <tr>
                                <th className="px-6 py-4 text-left text-xs font-bold text-gray-500 uppercase">Order ID</th>
                                <th className="px-6 py-4 text-left text-xs font-bold text-gray-500 uppercase">Nama Toko</th>
                                <th className="px-6 py-4 text-left text-xs font-bold text-gray-500 uppercase">Tgl Pesan</th>
                                <th className="px-6 py-4 text-left text-xs font-bold text-gray-500 uppercase">Total Barang</th>
                                <th className="px-6 py-4 text-left text-xs font-bold text-gray-500 uppercase">Status</th>
                            </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-200">
                            {orders.map(order => (
                                <tr key={order.id} className="hover:bg-gray-50">
                                    <td className="px-6 py-4 text-sm font-medium text-gray-900">#{order.id}</td>
                                    <td className="px-6 py-4 text-sm text-gray-500">{order.store?.name || 'N/A'}</td>
                                    <td className="px-6 py-4 text-sm text-gray-500">{formatDate(order.order_date)}</td>
                                    <td className="px-6 py-4 text-sm font-medium text-gray-800">{order.total_quantity} pcs</td>
                                    <td className="px-6 py-4 text-sm">{getStatusBadge(order.status)}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
            <Modal show={isModalOpen} onClose={() => setIsModalOpen(false)}>
                <OrderForm stores={stores} products={products} onClose={() => setIsModalOpen(false)} />
            </Modal>
        </AuthenticatedLayout>
    );
}