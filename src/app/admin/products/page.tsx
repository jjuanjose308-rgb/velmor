"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase";
import { isCurrentUserAdmin } from "@/lib/admin";

type Product = {
  id: number;
  name: string;
  description: string;
  price: number;
  category: string;
  image_url: string | null;
  stock: number;
  is_active: boolean;
};

export default function AdminProductsPage() {
  const router = useRouter();

  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
   
const loadProducts = async () => {
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

        .from("Products")
        .select("*")
        .order("id", { ascending: true });

      if (error) {
        console.error(error);
        setLoading(false);
        return;
      }

      setProducts(data ?? []);
      setLoading(false);
    };

    loadProducts();
  }, [router]);

  const handleDelete = async (product: Product) => {
  const confirmed = window.confirm(
    `¿Seguro que quieres eliminar "${product.name}"?`
  );

  if (!confirmed) return;

  const { error } = await supabase
    .from("Products")
    .delete()
    .eq("id", product.id);

  if (error) {
    console.error(error);

    alert(
      "No se puede eliminar este producto porque está relacionado con pedidos. Puedes desactivarlo en su lugar."
    );

    return;
  }

  setProducts((currentProducts) =>
    currentProducts.filter((item) => item.id !== product.id)
  );

  alert("Producto eliminado correctamente.");
};

  return (
    <main className="min-h-screen bg-[#f7f5f0] px-6 py-10">
      <div className="mx-auto max-w-6xl">
        <div className="mb-8 flex items-center justify-between">
          <div>
            <p className="text-xs uppercase tracking-[0.25em] text-black/40">
              VELMOR
            </p>

            <h1 className="mt-2 text-3xl font-semibold">
              Gestión de productos
            </h1>
            <button
  onClick={() => router.push("/admin/products/new")}
  className="mt-6 bg-black px-5 py-3 text-xs font-semibold uppercase tracking-[0.2em] text-white transition hover:bg-[#a88a4a]"
>
  + Nuevo producto
</button>
          </div>

          <button
            onClick={() => router.push("/admin")}
            className="border border-black/10 bg-white px-5 py-3 text-xs font-semibold uppercase tracking-wider transition hover:border-[#a88a4a] hover:text-[#a88a4a]"
          >
            Volver al panel
          </button>
        </div>

        {loading ? (
          <p className="text-sm text-black/50">
            Cargando productos...
          </p>
        ) : products.length === 0 ? (
          <div className="bg-white p-8 shadow-sm">
            <p className="text-sm text-black/60">
              No hay productos registrados.
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto bg-white shadow-sm">
            <table className="w-full text-left">
              <thead className="border-b border-black/10">
                <tr className="text-xs uppercase tracking-wider text-black/40">
                  <th className="px-5 py-4">Producto</th>
                  <th className="px-5 py-4">Categoría</th>
                  <th className="px-5 py-4">Precio</th>
                  <th className="px-5 py-4">Stock</th>
                  <th className="px-5 py-4">Estado</th>
                </tr>
              </thead>

              <tbody>
                {products.map((product) => (
                  <tr
                    key={product.id}
                    className="border-b border-black/5"
                  >
                    <td className="px-5 py-5">
                      <p className="font-medium">
                        {product.name}
                      </p>

                      <p className="mt-1 text-xs text-black/40">
                        ID: {product.id}
                      </p>
                    </td>

                    <td className="px-5 py-5 text-sm">
                      {product.category}
                    </td>

                    <td className="px-5 py-5 text-sm">
                      ${Number(product.price).toLocaleString("es-CO")}
                    </td>

                    <td className="px-5 py-5 text-sm">
                      {product.stock}
                    </td>

                    <td className="px-5 py-5">
                      <span className="text-xs font-semibold uppercase tracking-wider">
                        {product.is_active
                          ? "Activo"
                          : "Inactivo"}
                      </span>
                    </td>

<td className="px-4 py-5">
  <div className="flex gap-2">
    <button
      onClick={() =>
        router.push(`/admin/products/${product.id}`)
      }
      className="text-xs font-semibold uppercase tracking-wider hover:text-[#a88a4a]"
    >
      Editar
    </button>

    <button
      onClick={() => handleDelete(product)}
      className="text-xs font-semibold uppercase tracking-wider text-red-600 hover:text-red-800"
    >
      Eliminar
    </button>
  </div>
</td>

                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </main>
  );
}