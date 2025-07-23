import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head } from '@inertiajs/react';

// Komponen Kartu KPI
function KpiCard({ title, value, icon, iconBgColor }) {
    return (
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200 flex items-center justify-between">
            <div>
                <p className="text-sm font-medium text-gray-500">{title}</p>
                <p className="text-3xl font-bold text-gray-800 mt-1">{value}</p>
            </div>
            <div className={`p-3 rounded-lg ${iconBgColor}`}>
                {icon}
            </div>
        </div>
    );
}

export default function Dashboard() {
    const header = (
        <div>
            <h2 className="font-bold text-2xl text-gray-800 leading-tight">Platform Distribusi AMDK KU AIRKU</h2>
            <p className="text-sm text-gray-500">Sistem Manajemen Distribusi Terintegrasi</p>
        </div>
    );
    
    return (
        <AuthenticatedLayout header={header}>
            <Head title="Dashboard" />

            <div className="p-4 md:p-8">
                {/* Bagian Kartu KPI */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                    <KpiCard title="Total Toko" value="156" icon="🏪" iconBgColor="bg-blue-100" />
                    <KpiCard title="Pesanan Aktif" value="24" icon="🛒" iconBgColor="bg-green-100" />
                    <KpiCard title="Armada Aktif" value="8" icon="🚚" iconBgColor="bg-purple-100" />
                    <KpiCard title="Tim Sales" value="12" icon="🙋‍♂️" iconBgColor="bg-orange-100" />
                </div>

                {/* Bagian Konten Tengah */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* Aktivitas Terbaru */}
                    <div className="lg:col-span-2 bg-white p-6 rounded-xl shadow-sm border border-gray-200">
                        <h3 className="text-lg font-bold text-gray-800 mb-4">Aktivitas Terbaru</h3>
                        <div className="space-y-4">
                            <div className="flex items-center gap-4">
                                <div className="p-3 bg-green-100 rounded-full">✅</div>
                                <div>
                                    <p className="font-semibold text-gray-700">Pesanan #001 berhasil dikirim</p>
                                    <p className="text-sm text-gray-500">2 jam yang lalu</p>
                                </div>
                            </div>
                            <div className="flex items-center gap-4">
                                <div className="p-3 bg-blue-100 rounded-full">➕</div>
                                <div>
                                    <p className="font-semibold text-gray-700">Toko baru ditambahkan</p>
                                    <p className="text-sm text-gray-500">4 jam yang lalu</p>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Rute Hari Ini */}
                    <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
                        <h3 className="text-lg font-bold text-gray-800 mb-4">Rute Hari Ini</h3>
                         <div className="space-y-4">
                            <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                                <div className="flex items-center gap-3">
                                    <div className="p-2 bg-blue-100 rounded-lg">🚚</div>
                                    <div>
                                        <p className="font-bold text-gray-800">Rute A - Driver 1</p>
                                        <p className="text-xs text-gray-500">8 toko tersisa</p>
                                    </div>
                                </div>
                                <span className="text-xs font-bold text-green-600 bg-green-100 px-2 py-1 rounded-full">Aktif</span>
                            </div>
                            <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                                <div className="flex items-center gap-3">
                                    <div className="p-2 bg-blue-100 rounded-lg">🚚</div>
                                    <div>
                                        <p className="font-bold text-gray-800">Rute B - Driver 2</p>
                                        <p className="text-xs text-gray-500">5 toko tersisa</p>
                                    </div>
                                </div>
                                 <span className="text-xs font-bold text-green-600 bg-green-100 px-2 py-1 rounded-full">Aktif</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}