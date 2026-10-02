"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
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

export default function EditProductPage() {
  const params = useParams();
  const router = useRouter();

  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);

  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [price, setPrice] = useState("");
  const [category, setCategory] = useState("");
  const [stock, setStock] = useState("");
  const [imageUrl, setImageUrl] = useState("");
  const [isActive, setIsActive] = useState(true);
  const [saving, setSaving] = useState(false);

const handleSave = async () => {
  if (!product) return;

  setSaving(true);

  const { error } = await supabase
    .from("Products")
    .update({
      name,
      description,
      price: Number(price),
      category,
      stock: Number(stock),
      image_url: imageUrl || null,
      is_active: isActive,
    })
    .eq("id", product.id);

  if (error) {
    console.error(error);
    alert("No se pudieron guardar los cambios.");
    setSaving(false);
    return;
  }

  setProduct({
    ...product,
    name,
    description,
    price: Number(price),
    category,
    stock: Number(stock),
    image_url: imageUrl || null,
    is_active: isActive,
  });

  alert("Producto actualizado correctamente.");
  setSaving(false);
};

  useEffect(() => {
   const loadProduct = async () => {
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

  const productId = Number(params.id);

      const { data, error } = await supabase
        .from("Products")
        .select("*")
        .eq("id", productId)
        .single();

      if (error || !data) {
        console.error(error);
        router.push("/admin/products");
        return;
      }

      setProduct(data);

      setName(data.name);
      setDescription(data.description);
      setPrice(String(data.price));
      setCategory(data.category);
      setStock(String(data.stock));
      setImageUrl(data.image_url ?? "");
      setIsActive(data.is_active);

      setLoading(false);
    };

    loadProduct();
  }, [params.id, router]);

  if (loading) {
    return (
      <main className="min-h-screen bg-[#f7f5f0] px-6 py-10">
        <p className="text-sm text-black/50">
          Cargando producto...
        </p>
      </main>
    );
  }

  if (!product) {
    return null;
  }

  return (
    <main className="min-h-screen bg-[#f7f5f0] px-6 py-10">
      <div className="mx-auto max-w-3xl">
        <button
          onClick={() => router.push("/admin/products")}
          className="mb-8 text-xs font-semibold uppercase tracking-wider text-black/50 transition hover:text-[#a88a4a]"
        >
          ← Volver a productos
        </button>

        <div className="bg-white p-8 shadow-sm">
          <p className="text-xs uppercase tracking-[0.25em] text-black/40">
            VELMOR
          </p>

          <h1 className="mt-2 text-3xl font-semibold">
            Editar producto
          </h1>

          <p className="mt-2 text-sm text-black/50">
            Producto #{product.id}
          </p>

          <div className="mt-8 space-y-6">
            <div>
              <label className="text-xs font-semibold uppercase tracking-wider">
                Nombre
              </label>

              <input
                value={name}
                onChange={(event) => setName(event.target.value)}
                className="mt-2 w-full border border-black/10 px-4 py-3 text-sm outline-none focus:border-[#a88a4a]"
              />
            </div>

            <div>
              <label className="text-xs font-semibold uppercase tracking-wider">
                Descripción
              </label>

              <textarea
                value={description}
                onChange={(event) =>
                  setDescription(event.target.value)
                }
                rows={5}
                className="mt-2 w-full resize-none border border-black/10 px-4 py-3 text-sm outline-none focus:border-[#a88a4a]"
              />
            </div>

            <div className="grid gap-6 md:grid-cols-2">
              <div>
                <label className="text-xs font-semibold uppercase tracking-wider">
                  Precio
                </label>

                <input
                  type="number"
                  min="0"
                  step="0.01"
                  value={price}
                  onChange={(event) => setPrice(event.target.value)}
                  className="mt-2 w-full border border-black/10 px-4 py-3 text-sm outline-none focus:border-[#a88a4a]"
                />
              </div>

              <div>
                <label className="text-xs font-semibold uppercase tracking-wider">
                  Stock
                </label>

                <input
                  type="number"
                  min="0"
                  value={stock}
                  onChange={(event) => setStock(event.target.value)}
                  className="mt-2 w-full border border-black/10 px-4 py-3 text-sm outline-none focus:border-[#a88a4a]"
                />
              </div>
            </div>

            <div>
              <label className="text-xs font-semibold uppercase tracking-wider">
                Categoría
              </label>

              <input
                value={category}
                onChange={(event) => setCategory(event.target.value)}
                className="mt-2 w-full border border-black/10 px-4 py-3 text-sm outline-none focus:border-[#a88a4a]"
              />
            </div>

            <div>
              <label className="text-xs font-semibold uppercase tracking-wider">
                URL de imagen
              </label>

              <input
                value={imageUrl}
                onChange={(event) => setImageUrl(event.target.value)}
                className="mt-2 w-full border border-black/10 px-4 py-3 text-sm outline-none focus:border-[#a88a4a]"
              />
            </div>

            <label className="flex items-center gap-3">
              <input
                type="checkbox"
                checked={isActive}
                onChange={(event) =>
                  setIsActive(event.target.checked)
                }
              />

              <span className="text-sm">
                Producto activo
              </span>
            </label>

            <button
  type="button"
  onClick={handleSave}
  disabled={saving}
  className="w-full bg-black px-6 py-4 text-xs font-semibold uppercase tracking-[0.2em] text-white transition hover:bg-[#a88a4a] disabled:cursor-not-allowed disabled:opacity-50"
>
  {saving ? "Guardando..." : "Guardar cambios"}
</button>
          </div>
        </div>
      </div>
    </main>
  );
}