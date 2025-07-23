import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, useForm } from '@inertiajs/react';
import { useState, useEffect } from 'react';

// --- Komponen Modal (Pop-up) ---
function Modal({ show, onClose, children }) {
    if (!show) return null;
    return (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50 flex items-center justify-center px-4">
            <div className="relative mx-auto p-6 border w-full max-w-lg shadow-lg rounded-xl bg-white">
                {children}
            </div>
        </div>
    );
}

// --- Komponen Form untuk Buat/Edit Armada ---
function FleetForm({ fleet, onClose }) {
    const isEditing = !!fleet;
    const { data, setData, post, put, processing, errors, reset, clearErrors } = useForm({
        vehicle_name: '',
        license_plate: '',
        status: 'available', // <-- Tambahkan state untuk status
    });

    useEffect(() => {
        if (isEditing) {
            setData({
                vehicle_name: fleet.vehicle_name || '',
                license_plate: fleet.license_plate || '',
                status: fleet.status || 'available', // <-- Isi state status
            });
        } else {
            reset();
        }
        clearErrors();
    }, [isEditing, fleet]);

    const submit = (e) => {
        e.preventDefault();
        const onFinish = () => { reset(); onClose(); };
        if (isEditing) {
            put(route('fleets.update', fleet.id), { onSuccess: onFinish, preserveScroll: true });
        } else {
            post(route('fleets.store'), { onSuccess: onFinish, preserveScroll: true });
        }
    };

    return (
        <form onSubmit={submit} className="space-y-5">
            <div className="flex justify-between items-center pb-3 border-b">
                <h3 className="text-2xl font-bold text-gray-900">{isEditing ? 'Edit Armada' : 'Tambah Armada Baru'}</h3>
                <button type="button" onClick={onClose} className="text-gray-400 hover:text-gray-600 text-3xl font-bold">&times;</button>
            </div>
            <div>
                <label htmlFor="vehicle_name" className="block text-sm font-medium text-gray-700 mb-1">Nama Kendaraan</label>
                <input id="vehicle_name" type="text" value={data.vehicle_name} placeholder="Contoh: L300, Grand Max" onChange={(e) => setData('vehicle_name', e.target.value)} className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500" required />
                {errors.vehicle_name && <div className="text-red-500 text-xs mt-1">{errors.vehicle_name}</div>}
            </div>
            <div>
                <label htmlFor="license_plate" className="block text-sm font-medium text-gray-700 mb-1">Nomor Polisi</label>
                <input id="license_plate" type="text" value={data.license_plate} placeholder="Contoh: AB 1234 CD" onChange={(e) => setData('license_plate', e.target.value)} className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500" required />
                {errors.license_plate && <div className="text-red-500 text-xs mt-1">{errors.license_plate}</div>}
            </div>

            {/* === DROPDOWN STATUS BARU === */}
            <div>
                <label htmlFor="status" className="block text-sm font-medium text-gray-700 mb-1">Status Kendaraan</label>
                <select
                    id="status"
                    value={data.status}
                    onChange={(e) => setData('status', e.target.value)}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                >
                    <option value="available">✅ Tersedia</option>
                    <option value="in_use">🔄 Dipakai</option>
                    <option value="maintenance">🛠️ Perbaikan</option>
                </select>
                {errors.status && <div className="text-red-500 text-xs mt-1">{errors.status}</div>}
            </div>
            
            <div className="flex justify-end gap-4 pt-4">
                <button type="button" onClick={onClose} className="bg-gray-200 text-gray-700 font-bold py-2 px-4 rounded-lg hover:bg-gray-300 transition-colors">Batal</button>
                <button type="submit" className="bg-blue-600 text-white font-bold py-2 px-4 rounded-lg shadow-md hover:bg-blue-700 transition-colors" disabled={processing}>
                    {isEditing ? 'Update Armada' : 'Simpan Armada'}
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
export default function Index({ auth, fleets, flash }) {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingFleet, setEditingFleet] = useState(null);
    const { delete: destroy } = useForm();

    const header = (
        <div>
            <h2 className="font-bold text-2xl text-gray-800 leading-tight">Manajemen Armada</h2>
            <p className="text-sm text-gray-500">Kelola daftar kendaraan untuk distribusi</p>
        </div>
    );

    const openModal = (fleet = null) => {
        setEditingFleet(fleet);
        setIsModalOpen(true);
    };

    const closeModal = () => {
        setEditingFleet(null);
        setIsModalOpen(false);
    };

    const deleteFleet = (fleet) => {
        if (confirm(`Apakah Anda yakin ingin menghapus armada ${fleet.vehicle_name} (${fleet.license_plate})?`)) {
            destroy(route('fleets.destroy', fleet.id), { preserveScroll: true });
        }
    };

    // === FUNGSI UNTUK BADGE STATUS ===
    const getStatusBadge = (status) => {
        switch (status) {
            case 'available':
                return <span className="px-2.5 py-1 text-xs font-semibold rounded-full bg-green-100 text-green-700">✅ Tersedia</span>;
            case 'in_use':
                return <span className="px-2.5 py-1 text-xs font-semibold rounded-full bg-blue-100 text-blue-700">🔄 Dipakai</span>;
            case 'maintenance':
                return <span className="px-2.5 py-1 text-xs font-semibold rounded-full bg-yellow-100 text-yellow-700">🛠️ Perbaikan</span>;
            default:
                return <span className="px-2.5 py-1 text-xs font-semibold rounded-full bg-gray-100 text-gray-700">{status}</span>;
        }
    };

    return (
        <AuthenticatedLayout user={auth.user} header={header}>
            <Head title="Manajemen Armada" />

            {flash?.success && <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded relative mx-8 mt-4" role="alert"><span className="block sm:inline">{flash.success}</span></div>}
            {flash?.error && <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative mx-8 mt-4" role="alert"><span className="block sm:inline">{flash.error}</span></div>}

            <div className="p-4 md:p-8">
                <div className="flex flex-wrap justify-between items-center gap-6 mb-6">
                    <SummaryCard title="Total Armada" value={fleets.length} icon="🚚" />
                    <button onClick={() => openModal()} className="bg-blue-600 text-white font-bold py-2 px-4 rounded-lg shadow-md hover:bg-blue-700 flex items-center gap-2 h-fit">
                        <span className="text-xl">+</span>
                        <span>Tambah Armada</span>
                    </button>
                </div>

                <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-x-auto">
                    <table className="min-w-full divide-y divide-gray-200">
                        <thead className="bg-white">
                            <tr>
                                <th className="px-6 py-4 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">Nama Kendaraan</th>
                                <th className="px-6 py-4 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">Nomor Polisi</th>
                                {/* === KOLOM STATUS BARU === */}
                                <th className="px-6 py-4 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">Status</th>
                                <th className="px-6 py-4 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">Aksi</th>
                            </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-200">
                            {fleets.map(fleet => (
                                <tr key={fleet.id} className="hover:bg-gray-50">
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <div className="flex items-center gap-3">
                                            <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center">
                                                <span className="font-bold text-xl text-green-600">🚚</span>
                                            </div>
                                            <span className="text-sm font-medium text-gray-900">{fleet.vehicle_name}</span>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-700">{fleet.license_plate}</td>
                                    {/* === DATA STATUS BARU === */}
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                        {getStatusBadge(fleet.status)}
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                                        <div className="flex items-center gap-3">
                                            <button onClick={() => openModal(fleet)} className="text-gray-400 hover:text-blue-600" title="Edit">
                                                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor"><path d="M17.414 2.586a2 2 0 00-2.828 0L7 10.172V13h2.828l7.586-7.586a2 2 0 000-2.828z" /><path fillRule="evenodd" d="M2 6a2 2 0 012-2h4a1 1 0 010 2H4v10h10v-4a1 1 0 112 0v4a2 2 0 01-2 2H4a2 2 0 01-2-2V6z" clipRule="evenodd" /></svg>
                                            </button>
                                            <button onClick={() => deleteFleet(fleet)} className="text-gray-400 hover:text-red-600" title="Hapus">
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
                <FleetForm fleet={editingFleet} onClose={closeModal} />
            </Modal>
        </AuthenticatedLayout>
    );
}