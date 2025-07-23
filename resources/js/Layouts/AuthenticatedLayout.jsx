import { useState } from 'react';
import Sidebar from '@/Components/Sidebar';
import { usePage } from '@inertiajs/react';

export default function AuthenticatedLayout({ header, children }) {
    const { auth } = usePage().props;
    const [sidebarOpen, setSidebarOpen] = useState(true);

    return (
        <div className="min-h-screen bg-gray-100 flex">
            <Sidebar open={sidebarOpen} user={auth.user} />

            <div className={`flex-1 flex flex-col transition-all duration-300 ${sidebarOpen ? 'lg:ml-72' : 'ml-0'}`}>
                <header className="bg-white shadow-sm sticky top-0 z-20">
                    <div className="mx-auto px-4 sm:px-6 lg:px-8">
                        <div className="flex items-center justify-between h-16">
                            <div className="flex items-center">
                                <button 
                                    onClick={() => setSidebarOpen(!sidebarOpen)} 
                                    className="p-2 rounded-md text-gray-500 hover:text-gray-800 hover:bg-gray-100"
                                >
                                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" /></svg>
                                </button>
                                <div className="ml-4">{header}</div>
                            </div>
                        </div>
                    </div>
                </header>
                
                <main className="flex-grow">
                    {children}
                </main>
            </div>
        </div>
    );
}