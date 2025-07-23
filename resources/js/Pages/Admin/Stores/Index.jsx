import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, useForm } from '@inertiajs/react';
import { useState, useEffect } from 'react';

// === PENTING: Import library Leaflet dan CSS-nya ===
import 'leaflet/dist/leaflet.css';
import { MapContainer, TileLayer, Marker, useMap } from 'react-leaflet';
// =======================================================

// Komponen kecil untuk mengupdate posisi peta secara dinamis
function ChangeMapView({ coords }) {
    const map = useMap();
    map.setView(coords, 16); // Angka 16 adalah level zoom
    return null;
}

// --- Komponen Modal (Pop-up) ---
function Modal({ show, onClose, children }) {
    if (!show) return null;

    return (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-gray-600 bg-opacity-50 px-4 py-6">
            <div className="relative mx-auto w-full max-w-2xl transform rounded-xl bg-white p-6 shadow-xl transition-all">
                {children}
            </div>
        </div>
    );
}
// --- Komponen Form untuk Buat/Edit Toko ---
function StoreForm({ store, onClose }) {
    const isEditing = !!store;
    const { data, setData, post, put, processing, errors, reset, clearErrors } = useForm({
        name: '', address: '', pic_name: '', phone_number: '', latitude: '', longitude: '',
    });

    const [gmapsLink, setGmapsLink] = useState('');

    const parseGmapsLink = (link) => {
        const regex = /@(-?\d+\.\d+),(-?\d+\.\d+)/;
        const match = link.match(regex);
        if (match && match.length >= 3) {
            setData({ ...data, latitude: match[1], longitude: match[2] });
        }
    };

    useEffect(() => {
        if (gmapsLink) parseGmapsLink(gmapsLink);
    }, [gmapsLink]);

    useEffect(() => {
        if (isEditing) {
            setData({
                name: store.name || '', address: store.address || '', pic_name: store.pic_name || '',
                phone_number: store.phone_number || '', latitude: store.latitude || '', longitude: store.longitude || '',
            });
        } else {
            reset();
        }
        setGmapsLink('');
        clearErrors();
    }, [isEditing, store]);

    const submit = (e) => {
        e.preventDefault();
        const onFinish = () => { reset(); setGmapsLink(''); onClose(); };
        if (isEditing) {
            put(route('stores.update', store.id), { onSuccess: onFinish, preserveScroll: true });
        } else {
            post(route('stores.store'), { onSuccess: onFinish, preserveScroll: true });
        }
    };

    const mapPosition = [
        data.latitude && !isNaN(data.latitude) ? parseFloat(data.latitude) : -7.7956, // Default: Yogyakarta
        data.longitude && !isNaN(data.longitude) ? parseFloat(data.longitude) : 110.3695 // Default: Yogyakarta
    ];

    return (
        <form onSubmit={submit} className="space-y-5">
            <div className="flex justify-between items-center pb-3 border-b">
                <h3 className="text-2xl font-bold text-gray-900">{isEditing ? 'Edit Toko' : 'Tambah Toko Baru'}</h3>
                <button type="button" onClick={onClose} className="text-gray-400 hover:text-gray-600 text-3xl font-bold">×</button>
            </div>
            
            <div>
                <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">Nama Toko</label>
                <input id="name" type="text" value={data.name} onChange={(e) => setData('name', e.target.value)} className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500" required />
            </div>
            <div>
                <label htmlFor="address" className="block text-sm font-medium text-gray-700 mb-1">Alamat Lengkap</label>
                <textarea id="address" value={data.address} onChange={(e) => setData('address', e.target.value)} className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500" rows="3" required />
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                 <div>
                    <label htmlFor="pic_name" className="block text-sm font-medium text-gray-700 mb-1">Nama PIC</label>
                    <input id="pic_name" type="text" value={data.pic_name} onChange={(e) => setData('pic_name', e.target.value)} className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500" required />
                </div>
                <div>
                    <label htmlFor="phone_number" className="block text-sm font-medium text-gray-700 mb-1">Nomor Telepon</label>
                    <input id="phone_number" type="text" value={data.phone_number} onChange={(e) => setData('phone_number', e.target.value)} className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500" required />
                </div>
            </div>
            <div>
                <label htmlFor="gmaps_link" className="block text-sm font-medium text-gray-700 mb-1">Link Google Maps (Opsional)</label>
                <input 
                    id="gmaps_link" 
                    type="text" 
                    value={gmapsLink} 
                    onChange={(e) => setGmapsLink(e.target.value)}
                    placeholder="Tempel link dari Google Maps di sini"
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500" 
                />
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                    <label htmlFor="latitude" className="block text-sm font-medium text-gray-700 mb-1">Latitude (Otomatis)</label>
                    <input id="latitude" type="text" value={data.latitude} onChange={(e) => setData('latitude', e.target.value)} className="mt-1 block w-full rounded-md border-gray-300 shadow-sm bg-gray-50 cursor-not-allowed" readOnly />
                </div>
                <div>
                    <label htmlFor="longitude" className="block text-sm font-medium text-gray-700 mb-1">Longitude (Otomatis)</label>
                    <input id="longitude" type="text" value={data.longitude} onChange={(e) => setData('longitude', e.target.value)} className="mt-1 block w-full rounded-md border-gray-300 shadow-sm bg-gray-50 cursor-not-allowed" readOnly />
                </div>
            </div>

            <div className="h-64 w-full rounded-lg overflow-hidden z-0">
                <MapContainer center={mapPosition} zoom={13} scrollWheelZoom={false} style={{ height: '100%', width: '100%' }}>
                    <TileLayer
                        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                    />
                    {data.latitude && data.longitude && (
                        <Marker position={mapPosition} />
                    )}
                    <ChangeMapView coords={mapPosition} />
                </MapContainer>
            </div>
            
            <div className="flex justify-end gap-4 pt-4">
                <button type="button" onClick={onClose} className="bg-gray-200 text-gray-700 font-bold py-2 px-4 rounded-lg hover:bg-gray-300 transition-colors">Batal</button>
                <button type="submit" className="bg-blue-600 text-white font-bold py-2 px-4 rounded-lg shadow-md hover:bg-blue-700 transition-colors" disabled={processing}>
                    {isEditing ? 'Update Toko' : 'Simpan Toko'}
                </button>
            </div>
        </form>
    );
}

// --- Komponen Kartu Ringkasan ---
function SummaryCard({ title, value, icon }) {
    return (
        <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-200 flex items-center gap-4">
            <div className="p-3 rounded-lg bg-gray-100">{icon}</div>
            <div>
                <p className="text-sm font-medium text-gray-500">{title}</p>
                <p className="text-2xl font-bold text-gray-800">{value}</p>
            </div>
        </div>
    );
}

// --- Komponen Utama Halaman ---
export default function Index({ auth, stores, flash }) {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingStore, setEditingStore] = useState(null);
    const { delete: destroy } = useForm();
    
    const header = (
        <div>
            <h2 className="font-bold text-2xl text-gray-800 leading-tight">Manajemen Toko</h2>
            <p className="text-sm text-gray-500">Kelola daftar toko yang terdaftar</p>
        </div>
    );

    const openModal = (store = null) => {
        setEditingStore(store);
        setIsModalOpen(true);
    };

    const closeModal = () => {
        setIsModalOpen(false);
        setEditingStore(null);
    };

    const deleteStore = (store) => {
        if (confirm(`Apakah Anda yakin ingin menghapus toko ${store.name}?`)) {
            destroy(route('stores.destroy', store.id), { preserveScroll: true });
        }
    };
    
    const formatDate = (dateString) => {
        if (!dateString) return '-';
        return new Date(dateString).toLocaleDateString('id-ID', {
            day: '2-digit',
            month: 'short',
            year: 'numeric'
        });
    };

    return (
        <AuthenticatedLayout user={auth.user} header={header}>
            <Head title="Manajemen Toko" />

            {flash?.success && <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded relative mx-8 mt-4" role="alert"><span className="block sm:inline">{flash.success}</span></div>}
            {flash?.error && <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative mx-8 mt-4" role="alert"><span className="block sm:inline">{flash.error}</span></div>}

            <div className="p-4 md:p-8">
                <div className="flex flex-wrap justify-between items-center gap-6 mb-6">
                    <SummaryCard title="Total Toko" value={stores.length} icon="🏪" />
                    <button onClick={() => openModal()} className="bg-blue-600 text-white font-bold py-2 px-4 rounded-lg shadow-md hover:bg-blue-700 flex items-center gap-2 h-fit">
                        <span className="text-xl">+</span>
                        <span>Tambah Toko</span>
                    </button>
                </div>
                
                <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-x-auto">
                    <table className="min-w-full divide-y divide-gray-200">
                        <thead className="bg-white">
                            <tr>
                                <th className="px-6 py-4 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">Nama Toko</th>
                                <th className="px-6 py-4 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">PIC</th>
                                <th className="px-6 py-4 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">Telepon</th>
                                <th className="px-6 py-4 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">Tgl Bergabung</th>
                                <th className="px-6 py-4 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">Terakhir Pesan</th>
                                <th className="px-6 py-4 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">Aksi</th>
                            </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-200">
                            {stores.map(store => (
                                <tr key={store.id} className="hover:bg-gray-50">
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <div className="flex items-center gap-3">
                                            <div className="w-10 h-10 bg-orange-100 rounded-full flex items-center justify-center">
                                                <span className="font-bold text-orange-600">{store.name.charAt(0).toUpperCase()}</span>
                                            </div>
                                            <div>
                                                <div className="text-sm font-medium text-gray-900">{store.name}</div>
                                                <div className="text-xs text-gray-500">{store.address}</div>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{store.pic_name}</td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{store.phone_number}</td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{formatDate(store.created_at)}</td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                        {store.latest_order ? formatDate(store.latest_order.created_at) : 'Belum Pernah'}
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                                        <div className="flex items-center gap-3">
                                            <button onClick={() => openModal(store)} className="text-gray-400 hover:text-blue-600" title="Edit">
                                                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor"><path d="M17.414 2.586a2 2 0 00-2.828 0L7 10.172V13h2.828l7.586-7.586a2 2 0 000-2.828z" /><path fillRule="evenodd" d="M2 6a2 2 0 012-2h4a1 1 0 010 2H4v10h10v-4a1 1 0 112 0v4a2 2 0 01-2 2H4a2 2 0 01-2-2V6z" clipRule="evenodd" /></svg>
                                            </button>
                                            <button onClick={() => deleteStore(store)} className="text-gray-400 hover:text-red-600" title="Hapus">
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
            
            <Modal show={isModalOpen} onClose={closeModal}>
                <StoreForm store={editingStore} onClose={closeModal} />
            </Modal>
        </AuthenticatedLayout>
    );
}