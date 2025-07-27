import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, Link, useForm, router } from '@inertiajs/react';
import { useState } from 'react';

// --- Komponen Modal (Pop-up) ---
function Modal({ show, onClose, children }) {
    if (!show) return null;
    return <div className="fixed inset-0 bg-gray-600 bg-opacity-50 z-50 flex items-center justify-center"><div className="relative mx-auto p-5 border w-full max-w-2xl shadow-lg rounded-md bg-white">{children}</div></div>;
}

// --- Komponen Form untuk Tambah Produk ---
function CreateProductForm({ onClose }) {
    const { data, setData, post, processing, errors, reset } = useForm({ name: '', price: '', sku: '', stock: 0, low_stock_threshold: 0 });
    const submit = (e) => { e.preventDefault(); post(route('products.store'), { onSuccess: () => { reset(); onClose(); } }); };
    return (
        <form onSubmit={submit} className="space-y-6 p-4">
            <div className="flex justify-between items-center mb-4"><h3 className="text-2xl font-bold text-gray-900">Tambah Produk Baru</h3><button type="button" onClick={onClose} className="text-gray-400 hover:text-gray-600 text-3xl font-bold">&times;</button></div>
            <div><label htmlFor="name" className="block text-sm font-medium text-gray-700">Nama Produk</label><input id="name" type="text" value={data.name} onChange={(e) => setData('name', e.target.value)} className="mt-1 block w-full rounded-md border-gray-300 shadow-sm" required />{errors.name && <div className="text-red-500 text-xs mt-1">{errors.name}</div>}</div>
            <div><label htmlFor="price" className="block text-sm font-medium text-gray-700">Harga</label><input id="price" type="number" step="0.01" value={data.price} onChange={(e) => setData('price', e.target.value)} className="mt-1 block w-full rounded-md border-gray-300 shadow-sm" required />{errors.price && <div className="text-red-500 text-xs mt-1">{errors.price}</div>}</div>
            <div><label htmlFor="sku" className="block text-sm font-medium text-gray-700">SKU (Opsional)</label><input id="sku" type="text" value={data.sku} onChange={(e) => setData('sku', e.target.value)} className="mt-1 block w-full rounded-md border-gray-300 shadow-sm" />{errors.sku && <div className="text-red-500 text-xs mt-1">{errors.sku}</div>}</div>
            <div><label htmlFor="stock" className="block text-sm font-medium text-gray-700">Stok</label><input id="stock" type="number" value={data.stock} onChange={(e) => setData('stock', e.target.value)} className="mt-1 block w-full rounded-md border-gray-300 shadow-sm" required />{errors.stock && <div className="text-red-500 text-xs mt-1">{errors.stock}</div>}</div>
            <div><label htmlFor="low_stock_threshold" className="block text-sm font-medium text-gray-700">Ambang Batas Stok Rendah</label><input id="low_stock_threshold" type="number" value={data.low_stock_threshold} onChange={(e) => setData('low_stock_threshold', e.target.value)} className="mt-1 block w-full rounded-md border-gray-300 shadow-sm" required />{errors.low_stock_threshold && <div className="text-red-500 text-xs mt-1">{errors.low_stock_threshold}</div>}</div>
            <div className="flex justify-end gap-4 pt-4"><button type="button" onClick={onClose} className="bg-gray-200 text-gray-700 font-bold py-2 px-4 rounded-lg hover:bg-gray-300">Batal</button><button type="submit" className="bg-blue-600 text-white font-bold py-2 px-4 rounded-lg shadow-md hover:bg-blue-700" disabled={processing}>Simpan Produk</button></div>
        </form>
    );
}

// --- Komponen Form untuk Edit Produk ---
function EditProductForm({ product, onClose }) {
    const { data, setData, put, processing, errors, reset } = useForm({
        name: product.name || '',
        price: product.price || '',
        sku: product.sku || '',
        stock: product.stock || 0,
        low_stock_threshold: product.low_stock_threshold || 0,
    });
    const submit = (e) => { e.preventDefault(); put(route('products.update', product.id), { onSuccess: () => { reset(); onClose(); } }); };
    return (
        <form onSubmit={submit} className="space-y-6 p-4">
            <div className="flex justify-between items-center mb-4"><h3 className="text-2xl font-bold text-gray-900">Edit Produk: {product.name}</h3><button type="button" onClick={onClose} className="text-gray-400 hover:text-gray-600 text-3xl font-bold">&times;</button></div>
            <div><label htmlFor="name-edit" className="block text-sm font-medium text-gray-700">Nama Produk</label><input id="name-edit" type="text" value={data.name} onChange={(e) => setData('name', e.target.value)} className="mt-1 block w-full rounded-md border-gray-300 shadow-sm" required />{errors.name && <div className="text-red-500 text-xs mt-1">{errors.name}</div>}</div>
            <div><label htmlFor="price-edit" className="block text-sm font-medium text-gray-700">Harga</label><input id="price-edit" type="number" step="0.01" value={data.price} onChange={(e) => setData('price', e.target.value)} className="mt-1 block w-full rounded-md border-gray-300 shadow-sm" required />{errors.price && <div className="text-red-500 text-xs mt-1">{errors.price}</div>}</div>
            <div><label htmlFor="sku-edit" className="block text-sm font-medium text-gray-700">SKU (Opsional)</label><input id="sku-edit" type="text" value={data.sku} onChange={(e) => setData('sku', e.target.value)} className="mt-1 block w-full rounded-md border-gray-300 shadow-sm" />{errors.sku && <div className="text-red-500 text-xs mt-1">{errors.sku}</div>}</div>
            <div><label htmlFor="stock-edit" className="block text-sm font-medium text-gray-700">Stok</label><input id="stock-edit" type="number" value={data.stock} onChange={(e) => setData('stock', e.target.value)} className="mt-1 block w-full rounded-md border-gray-300 shadow-sm" required />{errors.stock && <div className="text-red-500 text-xs mt-1">{errors.stock}</div>}</div>
            <div><label htmlFor="low_stock_threshold-edit" className="block text-sm font-medium text-gray-700">Ambang Batas Stok Rendah</label><input id="low_stock_threshold-edit" type="number" value={data.low_stock_threshold} onChange={(e) => setData('low_stock_threshold', e.target.value)} className="mt-1 block w-full rounded-md border-gray-300 shadow-sm" required />{errors.low_stock_threshold && <div className="text-red-500 text-xs mt-1">{errors.low_stock_threshold}</div>}</div>
            <div className="flex justify-end gap-4 pt-4"><button type="button" onClick={onClose} className="bg-gray-200 text-gray-700 font-bold py-2 px-4 rounded-lg hover:bg-gray-300">Batal</button><button type="submit" className="bg-blue-600 text-white font-bold py-2 px-4 rounded-lg shadow-md hover:bg-blue-700" disabled={processing}>Update Produk</button></div>
        </form>
    );
}


// --- Komponen Utama Halaman ---
export default function Index({ auth, products, totalStock, flash }) {
    // --- Komponen Kartu Ringkasan ---
    function SummaryCard({ title, value, icon }) {
        return (
            <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-200 flex items-center gap-4">
                <div className="p-3 rounded-lg bg-gray-100">{icon}</div>
                <div><p className="text-sm font-medium text-gray-500">{title}</p><p className="text-2xl font-bold text-gray-800">{value}</p></div>
            </div>
        );
    }

    const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
    const [editingProduct, setEditingProduct] = useState(null);

    const openEditModal = (product) => setEditingProduct(product);
    const closeEditModal = () => setEditingProduct(null);

    const handleDelete = (product) => {
        if (window.confirm(`Apakah Anda yakin ingin menghapus produk: ${product.name}?`)) {
            router.delete(route('products.destroy', product.id), { preserveScroll: true });
        }
    };

    const header = <div><h2 className="font-bold text-2xl text-gray-800">Manajemen Produk</h2><p className="text-sm text-gray-500">Kelola semua produk AMDK KU AIRKU</p></div>;
    
    return (
        <AuthenticatedLayout user={auth.user} header={header}>
            <Head title="Manajemen Produk" />
            {flash?.success && (<div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded relative mx-8 mt-4" role="alert"><span className="block sm:inline">{flash.success}</span></div>)}
            <div className="p-4 md:p-8">
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
                    <SummaryCard title="Total Produk" value={products.length} icon="📦" />
                    <SummaryCard title="Total Stok" value={totalStock} icon="📦" />
                </div>
                <div className="flex justify-end mb-6">
                    <button onClick={() => setIsCreateModalOpen(true)} className="bg-blue-600 text-white font-bold py-2 px-4 rounded-lg shadow-md hover:bg-blue-700 flex items-center gap-2 h-fit"><span className="text-xl">+</span><span>Tambah Produk</span></button>
                </div>
                <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-x-auto">
                    <table className="min-w-full divide-y divide-gray-200">
                        <thead className="bg-white">
                            <tr>
                                <th className="px-6 py-4 text-left text-xs font-bold text-gray-500 uppercase">Nama Produk</th>
                                <th className="px-6 py-4 text-left text-xs font-bold text-gray-500 uppercase">Stok</th>
                                <th className="px-6 py-4 text-left text-xs font-bold text-gray-500 uppercase">SKU</th>
                                <th className="px-6 py-4 text-left text-xs font-bold text-gray-500 uppercase">Harga</th>
                                <th className="px-6 py-4 text-left text-xs font-bold text-gray-500 uppercase">Aksi</th>
                            </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-200">
                            {products.map(product => (
                                <tr key={product.id} className="hover:bg-gray-50">
                                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{product.name}</td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{product.stock}</td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{product.sku || '-'}</td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">Rp {new Intl.NumberFormat('id-ID').format(product.price)}</td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                                        <div className="flex items-center gap-3">
                                            <button onClick={() => openEditModal(product)} className="text-gray-400 hover:text-blue-600">
                                                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor"><path d="M17.414 2.586a2 2 0 00-2.828 0L7 10.172V13h2.828l7.586-7.586a2 2 0 000-2.828z" /><path fillRule="evenodd" d="M2 6a2 2 0 012-2h4a1 1 0 010 2H4v10h10v-4a1 1 0 112 0v4a2 2 0 01-2 2H4a2 2 0 01-2-2V6z" clipRule="evenodd" /></svg>
                                            </button>
                                            <button onClick={() => handleDelete(product)} className="text-gray-400 hover:text-red-600">
                                                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z" clipRule="evenodd" /></svg>
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
            <Modal show={isCreateModalOpen} onClose={() => setIsCreateModalOpen(false)}>
                <CreateProductForm onClose={() => setIsCreateModalOpen(false)} />
            </Modal>
            <Modal show={editingProduct !== null} onClose={closeEditModal}>
                {editingProduct && <EditProductForm product={editingProduct} onClose={closeEditModal} />}
            </Modal>
        </AuthenticatedLayout>
    );
}