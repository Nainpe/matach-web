
import AdminNavbar from "../ui/AdminNavbar";
import DashboardAdmin from "../ui/DashboardAdmin";

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
    return (
        <div style={{ display: 'flex', flexDirection: 'column' }}>
            <AdminNavbar />
            <div style={{ display: 'flex' }}>
                <DashboardAdmin />
                <main style={{ flex: 1, padding: '30px' }}>
                    {children}
                </main>
            </div>
        </div>
    );
}