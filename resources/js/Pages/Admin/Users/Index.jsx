import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, useForm } from '@inertiajs/react';
import { useState, useEffect } from 'react';

// --- Komponen Modal (Pop-up) ---
function Modal({ show, onClose, children }) {
    if (!show) return null;
    return (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50 flex items-center justify-center">
            <div className="relative mx-auto p-5 border w-full max-w-2xl shadow-lg rounded-md bg-white">
                {children}
            </div>
        </div>
    );
}

// --- Komponen Form untuk Buat/Edit User ---
function UserForm({ user, onClose }) {
    const isEditing = !!user;
    const { data, setData, post, put, processing, errors, reset, clearErrors } = useForm({
        name: '',
        email: '',
        role: '',
        password: '',
        password_confirmation: '',
    });
    
    useEffect(() => {
        if (isEditing) {
            setData({
                name: user.name || '',
                email: user.email || '',
                role: user.role || '',
                password: '',
                password_confirmation: '',
            });
        } else {
            reset(); // Pastikan form kosong saat mode 'Tambah User'
        }
        clearErrors();
    }, [isEditing, user]);

    const submit = (e) => {
        e.preventDefault();
        const onFinish = () => {
            reset();
            onClose();
        };

        if (isEditing) {
            put(route('users.update', user.id), { onSuccess: onFinish, preserveScroll: true });
        } else {
            post(route('users.store'), { onSuccess: onFinish, preserveScroll: true });
        }
    };

    return (
        <form onSubmit={submit} className="space-y-6 p-4">
            <div className="flex justify-between items-center mb-4">
                <h3 className="text-2xl font-bold text-gray-900">{isEditing ? 'Edit User' : 'Tambah User Baru'}</h3>
                <button type="button" onClick={onClose} className="text-gray-400 hover:text-gray-600 text-3xl font-bold">&times;</button>
            </div>
            <div>
                <label htmlFor="name" className="block text-sm font-medium text-gray-700">Nama Lengkap</label>
                <input id="name" type="text" value={data.name} onChange={(e) => setData('name', e.target.value)} className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500" required />
                {errors.name && <div className="text-red-500 text-xs mt-1">{errors.name}</div>}
            </div>
            <div>
                <label htmlFor="email" className="block text-sm font-medium text-gray-700">Email</label>
                <input id="email" type="email" value={data.email} onChange={(e) => setData('email', e.target.value)} className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500" required />
                {errors.email && <div className="text-red-500 text-xs mt-1">{errors.email}</div>}
            </div>
            <div>
                <label htmlFor="role" className="block text-sm font-medium text-gray-700">Role</label>
                <select id="role" value={data.role} onChange={(e) => setData('role', e.target.value)} className="mt-1 block w-full py-2 px-3 border border-gray-300 bg-white rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500" required>
                    <option value="" disabled>Pilih Role</option>
                    <option value="admin">Admin</option>
                    <option value="sales">Sales</option>
                    <option value="driver">Driver</option>
                </select>
                {errors.role && <div className="text-red-500 text-xs mt-1">{errors.role}</div>}
            </div>
            <div>
                <label htmlFor="password" className="block text-sm font-medium text-gray-700">Password</label>
                <input id="password" type="password" value={data.password} onChange={(e) => setData('password', e.target.value)} className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500" placeholder={isEditing ? 'Kosongkan jika tidak ingin ganti' : ''} required={!isEditing} />
                {errors.password && <div className="text-red-500 text-xs mt-1">{errors.password}</div>}
            </div>
             <div>
                <label htmlFor="password_confirmation" className="block text-sm font-medium text-gray-700">Konfirmasi Password</label>
                <input id="password_confirmation" type="password" value={data.password_confirmation} onChange={(e) => setData('password_confirmation', e.target.value)} className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"/>
            </div>
            <div className="flex justify-end gap-4 pt-4">
                <button type="button" onClick={onClose} className="bg-gray-200 text-gray-700 font-bold py-2 px-4 rounded-lg hover:bg-gray-300">Batal</button>
                <button type="submit" className="bg-blue-600 text-white font-bold py-2 px-4 rounded-lg shadow-md hover:bg-blue-700" disabled={processing}>
                    {isEditing ? 'Update User' : 'Simpan User'}
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
export default function Index({ auth, users, flash }) {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingUser, setEditingUser] = useState(null);
    const { delete: destroy } = useForm();
    
    const header = (
        <div>
            <h2 className="font-bold text-2xl text-gray-800 leading-tight">Manajemen User</h2>
            <p className="text-sm text-gray-500">Kelola akun sales dan driver</p>
        </div>
    );

    const openModal = (user = null) => {
        setEditingUser(user);
        setIsModalOpen(true);
    };

    const closeModal = () => {
        setIsModalOpen(false);
        setEditingUser(null);
    };

    // === PERUBAHAN UTAMA ADA DI SINI ===
    const deleteUser = (user) => {
        if (confirm(`Apakah Anda yakin ingin menghapus user ${user.name}?`)) {
            destroy(route('users.destroy', user.id), {
                // `preserveScroll` menjaga posisi scroll halaman.
                preserveScroll: true,
                // `preserveState` menjaga state lokal komponen, membuat update lebih mulus.
                preserveState: true, 
                onError: () => {
                    // Tambahkan notifikasi jika ada error
                    alert('Gagal menghapus user.');
                }
            });
        }
    };
    
    const userList = users || [];
    const totalUsers = userList.length;
    const totalAdmins = userList.filter(user => ['admin', 'administrator'].includes(user.role)).length;
    const totalSales = userList.filter(user => user.role === 'sales').length;
    const totalDrivers = userList.filter(user => user.role === 'driver').length;
    
    const getRoleBadgeColor = (role) => {
        switch (role?.toLowerCase()) {
            case 'administrator': case 'admin': return 'bg-purple-100 text-purple-700';
            case 'sales': return 'bg-blue-100 text-blue-700';
            case 'driver': return 'bg-orange-100 text-orange-700';
            default: return 'bg-gray-100 text-gray-700';
        }
    };

    return (
        <AuthenticatedLayout user={auth.user} header={header}>
            <Head title="Manajemen User" />

            {flash?.success && <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded relative mx-8 mt-4" role="alert"><span className="block sm:inline">{flash.success}</span></div>}
            {flash?.error && <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative mx-8 mt-4" role="alert"><span className="block sm:inline">{flash.error}</span></div>}

            <div className="p-4 md:p-8">
                <div className="flex flex-wrap justify-between items-center gap-6 mb-6">
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                        <SummaryCard title="Total Akun" value={totalUsers} icon="👥" />
                        <SummaryCard title="Total Admin" value={totalAdmins} icon="👑" />
                        <SummaryCard title="Total Sales" value={totalSales} icon="🙋‍♂️" />
                        <SummaryCard title="Total Driver" value={totalDrivers} icon="🚚" />
                    </div>
                    <button onClick={() => openModal()} className="bg-blue-600 text-white font-bold py-2 px-4 rounded-lg shadow-md hover:bg-blue-700 flex items-center gap-2 h-fit">
                        <span className="text-xl">+</span>
                        <span>Tambah User</span>
                    </button>
                </div>
                
                <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-x-auto">
                    <table className="min-w-full divide-y divide-gray-200">
                        <thead className="bg-white">
                            <tr>
                                <th className="px-6 py-4 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">Nama</th>
                                <th className="px-6 py-4 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">Email</th>
                                <th className="px-6 py-4 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">Role</th>
                                <th className="px-6 py-4 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">Status</th>
                                <th className="px-6 py-4 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">Dibuat</th>
                                <th className="px-6 py-4 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">Aksi</th>
                            </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-200">
                            {userList.map(user => (
                                <tr key={user.id} className="hover:bg-gray-50">
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <div className="flex items-center gap-3">
                                            <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                                                <span className="font-bold text-blue-600">{user.name.charAt(0).toUpperCase()}</span>
                                            </div>
                                            <span className="text-sm font-medium text-gray-900">{user.name}</span>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{user.email}</td>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <span className={`text-xs font-semibold px-2.5 py-1 rounded-md ${getRoleBadgeColor(user.role)}`}>{user.role}</span>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <span className="text-xs font-semibold px-2.5 py-1 rounded-md bg-green-100 text-green-700">Aktif</span>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                        {new Date(user.created_at).toLocaleDateString('id-ID', { year: 'numeric', month: '2-digit', day: '2-digit' })}
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                                        <div className="flex items-center gap-3">
                                            <button onClick={() => openModal(user)} className="text-gray-400 hover:text-blue-600" title="Edit">
                                                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor"><path d="M17.414 2.586a2 2 0 00-2.828 0L7 10.172V13h2.828l7.586-7.586a2 2 0 000-2.828z" /><path fillRule="evenodd" d="M2 6a2 2 0 012-2h4a1 1 0 010 2H4v10h10v-4a1 1 0 112 0v4a2 2 0 01-2 2H4a2 2 0 01-2-2V6z" clipRule="evenodd" /></svg>
                                            </button>
                                            {/* Tombol hapus sekarang memanggil fungsi `deleteUser` yang sudah diperbaiki */}
                                            <button onClick={() => deleteUser(user)} className="text-gray-400 hover:text-red-600" title="Hapus">
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
                <UserForm user={editingUser} onClose={closeModal} />
            </Modal>
        </AuthenticatedLayout>
    );
}