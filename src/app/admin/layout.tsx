import { Toaster } from 'react-hot-toast'
import AdminAuthGuard from '@/components/admin/AdminAuthGuard'
import './admin.css'

export const metadata = {
    title: 'PowerHouse Admin Dashboard',
    description: 'Admin panel for PowerHouse fitness app',
}

export default function AdminLayout({
    children,
}: {
    children: React.ReactNode
}) {
    return (
        <AdminAuthGuard>
            <div className="admin-layout">
                <Toaster
                    position="bottom-right"
                    toastOptions={{
                        duration: 4000,
                        style: {
                            background: '#1e293b',
                            color: '#fff',
                            borderRadius: '12px',
                            padding: '16px 24px',
                        },
                        success: {
                            iconTheme: {
                                primary: '#22c55e',
                                secondary: '#fff',
                            },
                        },
                        error: {
                            iconTheme: {
                                primary: '#ef4444',
                                secondary: '#fff',
                            },
                        },
                    }}
                />
                {children}
            </div>
        </AdminAuthGuard>
    )
}