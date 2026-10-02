"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase";
import { isCurrentUserAdmin } from "@/lib/admin";

type Order = {
  id: number;
  customer_name: string;
  customer_email: string;
  customer_phone: string;
  customer_address: string;
  customer_city: string;
  total: number;
  status: string;
  created_at: string;
};

type OrderItem = {
  id: number;
  product_id: number;
  product_name: string;
  quantity: number;
  unit_price: number;
  subtotal: number;
};

export default function OrderDetailPage() {
  const params = useParams();
  const router = useRouter();

  const [order, setOrder] = useState<Order | null>(null);
  const [items, setItems] = useState<OrderItem[]>([]);
  const [status, setStatus] = useState("");
const [savingStatus, setSavingStatus] = useState(false);
const handleSaveStatus = async () => {
  if (!order) return;

  setSavingStatus(true);

  const { error } = await supabase
    .from("orders")
    .update({ status })
    .eq("id", order.id);

  if (error) {
    alert("No se pudo actualizar el estado.");
    setSavingStatus(false);
    return;
  }

  setOrder({
    ...order,
    status,
  });

  alert("Estado actualizado correctamente.");
  setSavingStatus(false);
};
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadOrder() {
     
const {
  data: { user },
} = await supabase.auth.getUser();

if (!user) {
  router.replace("/admin/login");
  return;
}

const admin = await isCurrentUserAdmin();

if (!admin) {
  router.push("/");
  return;
}

const orderId = Number(params.id);

      if (!orderId) {
        setLoading(false);
        return;
      }

      const { data: orderData, error: orderError } =
        await supabase
          .from("orders")
          .select("*")
          .eq("id", orderId)
          .single();

      if (orderError) {
        console.error("Error cargando pedido:", orderError);
        setLoading(false);
        return;
      }

      const { data: itemsData, error: itemsError } =
        await supabase
          .from("order_items")
          .select("*")
          .eq("order_id", orderId)
          .order("id", { ascending: true });

      if (itemsError) {
        console.error(
          "Error cargando productos:",
          itemsError
        );
        setLoading(false);
        return;
      }

      setOrder(orderData);
      setStatus(orderData.status);
      setItems(itemsData || []);
      setLoading(false);
    }

    loadOrder();
  }, [params.id, router]);

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat("es-CO", {
      style: "currency",
      currency: "COP",
      maximumFractionDigits: 0,
    }).format(price);
  };

  if (loading) {
    return (
      <main className="min-h-screen bg-[#f7f6f2] px-6 py-12">
        <div className="mx-auto max-w-5xl">
          <p className="text-sm text-black/50">
            Cargando pedido...
          </p>
        </div>
      </main>
    );
  }

  if (!order) {
    return (
      <main className="min-h-screen bg-[#f7f6f2] px-6 py-12">
        <div className="mx-auto max-w-5xl">
          <p className="text-sm text-black/50">
            No se encontró el pedido.
          </p>

          <button
            onClick={() => router.push("/admin")}
            className="mt-6 bg-[#111111] px-6 py-3 text-xs font-semibold uppercase tracking-wider text-white"
          >
            Volver a pedidos
          </button>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-[#f7f6f2] px-6 py-12">
      <div className="mx-auto max-w-5xl">

        {/* ENCABEZADO */}

        <button
          onClick={() => router.push("/admin")}
          className="text-xs uppercase tracking-wider text-black/50 hover:text-black"
        >
          ← Volver a pedidos
        </button>

        <div className="mt-6">
          <p className="text-xs uppercase tracking-[0.3em] text-black/40">
            VELMOR
          </p>

          <h1 className="mt-3 font-serif text-4xl">
            Pedido #{order.id}
          </h1>

          <p className="mt-3 text-sm text-black/50">
            {new Date(order.created_at).toLocaleString(
              "es-CO"
            )}
          </p>
        </div>

        {/* INFORMACIÓN DEL CLIENTE */}

        <div className="mt-10 grid gap-6 md:grid-cols-2">

          <section className="bg-white p-6 shadow-sm">
            <h2 className="text-lg font-semibold">
              Cliente
            </h2>

            <div className="mt-5 space-y-3 text-sm">

              <div>
                <p className="text-xs uppercase tracking-wider text-black/40">
                  Nombre
                </p>

                <p className="mt-1">
                  {order.customer_name}
                </p>
              </div>

              <div>
                <p className="text-xs uppercase tracking-wider text-black/40">
                  Correo
                </p>

                <p className="mt-1">
                  {order.customer_email}
                </p>
              </div>

              <div>
                <p className="text-xs uppercase tracking-wider text-black/40">
                  Teléfono
                </p>

                <p className="mt-1">
                  {order.customer_phone}
                </p>
              </div>

            </div>
          </section>

          <section className="bg-white p-6 shadow-sm">
            <h2 className="text-lg font-semibold">
              Entrega
            </h2>

            <div className="mt-5 space-y-3 text-sm">

              <div>
                <p className="text-xs uppercase tracking-wider text-black/40">
                  Dirección
                </p>

                <p className="mt-1">
                  {order.customer_address}
                </p>
              </div>

              <div>
                <p className="text-xs uppercase tracking-wider text-black/40">
                  Ciudad
                </p>

                <p className="mt-1">
                  {order.customer_city}
                </p>
              </div>

            </div>
          </section>

        </div>

        {/* PRODUCTOS */}

        <section className="mt-6 bg-white shadow-sm">

          <div className="border-b border-black/10 p-6">
            <h2 className="text-lg font-semibold">
              Productos
            </h2>
          </div>

          <div className="divide-y divide-black/10">

            {items.map((item) => (
              <div
                key={item.id}
                className="flex items-center justify-between gap-6 p-6"
              >

                <div>
                  <p className="text-sm font-medium">
                    {item.product_name}
                  </p>

                  <p className="mt-1 text-xs text-black/50">
                    Cantidad: {item.quantity}
                  </p>

                  <p className="mt-1 text-xs text-black/50">
                    Precio unitario:{" "}
                    {formatPrice(item.unit_price)}
                  </p>
                </div>

                <p className="text-sm font-semibold">
                  {formatPrice(item.subtotal)}
                </p>

              </div>
            ))}

          </div>

          {/* TOTAL */}

          <div className="border-t border-black/10 p-6">

            <div className="flex items-center justify-between">

              <span className="text-sm text-black/50">
                Total
              </span>

              <span className="text-2xl font-semibold">
                {formatPrice(order.total)}
              </span>

            </div>

          </div>

        </section>

        {/* ESTADO */}

        <section className="mt-6 bg-white p-6 shadow-sm">

          <p className="text-xs uppercase tracking-wider text-black/40">
            Estado del pedido
          </p>

          <select
  value={status}
  onChange={(event) => setStatus(event.target.value)}
  className="mt-3 border border-black/10 bg-white px-4 py-2 text-xs font-semibold uppercase tracking-wider outline-none focus:border-[#a88a4a]"
>
  <option value="pending">Pendiente</option>
  <option value="paid">Pagado</option>
  <option value="cancelled">Cancelado</option>
</select>

<button
  onClick={handleSaveStatus}
  disabled={savingStatus}
  className="ml-3 bg-black px-4 py-2 text-xs font-semibold uppercase tracking-wider text-white transition hover:bg-[#a88a4a] disabled:cursor-not-allowed disabled:opacity-50"
>
  {savingStatus ? "Guardando..." : "Guardar estado"}
</button>

        </section>

      </div>
    </main>
  );
}