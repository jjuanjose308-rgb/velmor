"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase";
import { isCurrentUserAdmin } from "@/lib/admin";

type Order = {
  id: number;
  customer_name: string;
  customer_email: string;
  customer_city: string;
  total: number;
  status: string;
  created_at: string;
};

export default function AdminPage() {
  const router = useRouter();
  const handleLogout = async () => {
  await supabase.auth.signOut();
  router.push("/admin/login");
};
  const [orders, setOrders] = useState<Order[]>([]);
  const [totalProducts, setTotalProducts] = useState(0);
const [totalOrders, setTotalOrders] = useState(0);
const [pendingOrders, setPendingOrders] = useState(0);
const [totalSales, setTotalSales] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadOrders() {
    
        const {
  data: { user },
} = await supabase.auth.getUser();

if (!user) {
  router.push("/admin/login");
  return;
}

const admin = await isCurrentUserAdmin();

if (!admin) {
  router.push("/");
  return;
}

      const { data, error } = await supabase
        .from("orders")
        .select(
          "id, customer_name, customer_email, customer_city, total, status, created_at"
        )
        .order("created_at", { ascending: false });

      if (error) {
        console.error("Error cargando pedidos:", error);
        setLoading(false);
        return;
      }

      const { count: productsCount } = await supabase
  .from("Products")
  .select("*", { count: "exact", head: true });

const { count: ordersCount } = await supabase
  .from("orders")
  .select("*", { count: "exact", head: true });

const { count: pendingCount } = await supabase
  .from("orders")
  .select("*", { count: "exact", head: true })
  .eq("status", "pending");

const { data: paidOrders } = await supabase
  .from("orders")
  .select("total")
  .eq("status", "paid");

const salesTotal =
  paidOrders?.reduce(
    (total, order) => total + Number(order.total),
    0
  ) ?? 0;

setTotalProducts(productsCount ?? 0);
setTotalOrders(ordersCount ?? 0);
setPendingOrders(pendingCount ?? 0);
setTotalSales(salesTotal);

      setOrders(data || []);
      setLoading(false);
    }

    loadOrders();
  }, [router]);

  return (
    <main className="min-h-screen bg-[#f7f6f2] px-6 py-12">
      <div className="mx-auto max-w-6xl">

        <p className="text-xs uppercase tracking-[0.3em] text-black/40">
          VELMOR
        </p>

        <h1 className="mt-3 font-serif text-4xl">
          Panel de administración
        </h1>

        <button
  onClick={handleLogout}
  className="rounded-md bg-black px-4 py-2 text-sm font-medium text-white transition hover:bg-[#a88a4a]"
>
  Cerrar sesión
</button>

        <p className="mt-3 text-sm text-black/50">
          Pedidos de la tienda
        </p>

        <div className="mt-8 flex flex-wrap gap-3">
  <button
    onClick={() => router.push("/admin")}
    className="bg-black px-5 py-3 text-xs font-semibold uppercase tracking-[0.15em] text-white transition hover:bg-[#a88a4a]"
  >
    Pedidos
  </button>

  <button
    onClick={() => router.push("/admin/products")}
    className="border border-black/10 bg-white px-5 py-3 text-xs font-semibold uppercase tracking-[0.15em] transition hover:border-[#a88a4a] hover:text-[#a88a4a]"
  >
    Productos
  </button>

  <button
    onClick={() => router.push("/admin/products/new")}
    className="border border-black/10 bg-white px-5 py-3 text-xs font-semibold uppercase tracking-[0.15em] transition hover:border-[#a88a4a] hover:text-[#a88a4a]"
  >
    + Nuevo producto
  </button>
</div>

<div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
  <div className="bg-white p-6 shadow-sm">
    <p className="text-xs font-semibold uppercase tracking-wider text-black/40">
      Productos
    </p>

    <p className="mt-3 text-3xl font-semibold">
      {totalProducts}
    </p>
  </div>

  <div className="bg-white p-6 shadow-sm">
    <p className="text-xs font-semibold uppercase tracking-wider text-black/40">
      Pedidos
    </p>

    <p className="mt-3 text-3xl font-semibold">
      {totalOrders}
    </p>
  </div>

  <div className="bg-white p-6 shadow-sm">
    <p className="text-xs font-semibold uppercase tracking-wider text-black/40">
      Pendientes
    </p>

    <p className="mt-3 text-3xl font-semibold">
      {pendingOrders}
    </p>
  </div>

  <div className="bg-white p-6 shadow-sm">
    <p className="text-xs font-semibold uppercase tracking-wider text-black/40">
      Ventas

    </p>

    <p className="mt-3 text-3xl font-semibold">
      ${totalSales.toLocaleString("es-CO")}
    </p>
  </div>
</div>

        <section className="mt-10 bg-white p-6 shadow-sm">

          <h2 className="text-xl font-semibold">
            Pedidos
          </h2>

          {loading ? (
            <p className="mt-6 text-sm text-black/50">
              Cargando pedidos...
            </p>
          ) : orders.length === 0 ? (
            <p className="mt-6 text-sm text-black/50">
              No hay pedidos.
            </p>
          ) : (
            <div className="mt-6 overflow-x-auto">

              <table className="w-full text-left">

                <thead>
                  <tr className="border-b border-black/10 text-xs uppercase tracking-wider text-black/40">

                    <th className="px-4 py-4">
                      Pedido
                    </th>

                    <th className="px-4 py-4">
                      Cliente
                    </th>

                    <th className="px-4 py-4">
                      Ciudad
                    </th>

                    <th className="px-4 py-4">
                      Total
                    </th>

                    <th className="px-4 py-4">
                      Estado
                    </th>

                  </tr>
                </thead>

                <tbody>

                  {orders.map((order) => (
                    <tr
                      key={order.id}
                      className="border-b border-black/5"
                    >

                      <td className="px-4 py-5">
  <button
    onClick={() =>
      router.push(`/admin/orders/${order.id}`)
    }
    className="font-medium hover:text-[#a88a4a]"
  >
    #{order.id}
  </button>
</td>

                      <td className="px-4 py-5">
                        <p className="text-sm font-medium">
                          {order.customer_name}
                        </p>

                        <p className="text-xs text-black/40">
                          {order.customer_email}
                        </p>
                      </td>

                      <td className="px-4 py-5 text-sm">
                        {order.customer_city}
                      </td>

                      <td className="px-4 py-5 text-sm font-semibold">
                        {new Intl.NumberFormat("es-CO", {
                          style: "currency",
                          currency: "COP",
                          maximumFractionDigits: 0,
                        }).format(order.total)}
                      </td>

                      <td className="px-4 py-5">
                        <span className="bg-black/5 px-3 py-1 text-xs uppercase">
                          {order.status}
                        </span>
                      </td>

                    </tr>
                  ))}

                </tbody>

              </table>

            </div>
          )}

        </section>

      </div>
    </main>
  );
}