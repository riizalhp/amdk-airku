import { Link, usePage } from '@inertiajs/react';
import { useState, useEffect, useRef } from 'react';

export default function Sidebar({ open, user }) {
    const { url } = usePage();
    const [profileMenuOpen, setProfileMenuOpen] = useState(false);
    const menuRef = useRef(null);

    const menuItems = [
        { name: 'Dashboard', routeName: 'dashboard', path: '/dashboard' },
        { name: 'Manajemen User', routeName: 'users.index', path: '/users' },
        { name: 'Manajemen Produk', routeName: 'products.index', path: '/products' },
        { name: 'Manajemen Toko', routeName: 'stores.index', path: '/stores' },
        { name: 'Manajemen Armada', routeName: 'fleets.index', path: '/fleets' },
        { name: 'Manajemen Pesanan', routeName: 'orders.index', path: '/orders' },
        { name: 'Perencanaan Rute', routeName: 'dashboard', path: '/routes' },
        { name: 'Jadwal Kunjungan', routeName: 'dashboard', path: '/visits' },
        { name: 'Laporan Survei', routeName: 'dashboard', path: '/surveys' },
    ];

    useEffect(() => {
        function handleClickOutside(event) {
            if (menuRef.current && !menuRef.current.contains(event.target)) {
                setProfileMenuOpen(false);
            }
        }
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, [menuRef]);
    
    return (
        <aside 
            className={`bg-white text-gray-800 flex flex-col fixed top-0 left-0 h-full z-40 border-r border-gray-200 transition-all duration-300 ${open ? 'w-72' : 'w-0 overflow-hidden'}`}
        >
            <div className="p-6 flex items-center gap-3 border-b border-gray-200">
                <div className="bg-blue-600 p-2 rounded-lg">
                    <svg className="w-6 h-6 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 18.657A8 8 0 016.343 7.343S7 9 9 10c0-2 .5-5 2.986-7C14 5 16.09 5.777 17.657 7.343A8 8 0 0117.657 18.657z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.879 16.121A3 3 0 1014.12 11.88a3 3 0 00-4.242 4.242z" /></svg>
                </div>
                <h1 className="text-xl font-bold text-gray-800">AMDK KU AIRKU</h1>
            </div>
            
            <nav className="flex-grow p-4 space-y-1">
                {menuItems.map((item, index) => (
                    <Link
                        key={index}
                        href={route(item.routeName)} 
                        className={`flex items-center gap-3 rounded-md px-4 py-2 text-sm transition-colors ${
                            url.startsWith(item.path)
                                ? 'bg-blue-600 text-white font-semibold shadow-sm' 
                                : 'text-gray-500 hover:bg-gray-100 hover:text-gray-800'
                        }`}
                    >
                        <span className="text-lg">{['🏠', '👥','📦', '🏪', '🚚', '🛒', '🗺️', '🗓️', '📊'][index]}</span>
                        <span className="font-medium">{item.name}</span>
                    </Link>
                ))}
            </nav>
            
            <div className="p-4 mt-auto border-t border-gray-200 relative" ref={menuRef}>
                {profileMenuOpen && (
                    <div className="absolute bottom-full left-4 mb-2 w-56 bg-white rounded-md shadow-lg border border-gray-200 py-1">
                        <Link href={route('profile.edit')} className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">
                            View Profile
                        </Link>
                        <Link href={route('logout')} method="post" as="button" className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">
                            Log Out
                        </Link>
                    </div>
                )}
                <button 
                    onClick={() => setProfileMenuOpen(!profileMenuOpen)}
                    className="flex items-center gap-3 w-full text-left p-2 rounded-lg hover:bg-gray-100"
                >
                    <div className="w-10 h-10 bg-purple-100 rounded-full flex items-center justify-center font-bold text-purple-700">
                        {user.name.charAt(0).toUpperCase()}
                    </div>
                    <div className="flex-grow">
                        <p className="font-semibold text-gray-800">{user.name}</p>
                        <p className="text-xs text-gray-500">admin</p>
                    </div>
                    <svg className={`w-5 h-5 text-gray-400 transition-transform ${profileMenuOpen ? 'rotate-180' : ''}`} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
                    </svg>
                </button>
            </div>
        </aside>
    );
}