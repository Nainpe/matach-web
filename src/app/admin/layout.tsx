import { auth } from "@/auth.config";
import { redirect } from "next/navigation";

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
    const session = await auth();

    console.log("Session data:", session); // Para depuración

    if (!session?.user || session.user.role !== "Admin") {
        redirect("/");
    }

    return (
        <div>
            {children}
        </div>
    );
}
