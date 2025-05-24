import { getUserById } from "@/lib/database/services/user-service";
import { notFound } from "next/navigation";
import { Badge } from "@/components/ui/badge";

export default async function UserDetailPage({ params }: { params: { id: string } }) {
  const user = await getUserById(params.id);

  if (!user) {
    notFound();
  }

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <h1 className="text-2xl font-bold">Detail Pengguna</h1>

      <div className="border rounded-lg p-4 space-y-3">
        <div>
          <span className="font-semibold">Nama:</span> {user.name}
        </div>
        <div>
          <span className="font-semibold">Email:</span> {user.email || <span className="text-gray-400 italic">Tidak tersedia</span>}
        </div>
        <div>
          <span className="font-semibold">Telepon:</span> {user.phone || <span className="text-gray-400 italic">Tidak tersedia</span>}
        </div>
        <div>
          <span className="font-semibold">Peran:</span>{" "}
          <Badge className={user.role === "admin" ? "bg-purple-100 text-purple-800" : "bg-blue-100 text-blue-800"}>
            {user.role}
          </Badge>
        </div>
        <div>
          <span className="font-semibold">Tanggal Daftar:</span> {new Date(user.createdAt).toLocaleString("id-ID")}
        </div>
        <div>
          <span className="font-semibold">Terakhir Diupdate:</span> {new Date(user.updatedAt).toLocaleString("id-ID")}
        </div>
      </div>
    </div>
  );
}
