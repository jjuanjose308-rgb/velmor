"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase";

export default function NewProductPage() {
  const router = useRouter();

  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [price, setPrice] = useState("");
  const [category, setCategory] = useState("");
  const [stock, setStock] = useState("");
  const [imageUrl, setImageUrl] = useState("");
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [uploadingImage, setUploadingImage] = useState(false);
  const [isActive, setIsActive] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    const checkAuth = async () => {
      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (!user) {
        router.push("/admin/login");
      }
    };

    checkAuth();
  }, [router]);

  const handleImageUpload = async (
  event: React.ChangeEvent<HTMLInputElement>
) => {
  const file = event.target.files?.[0];

  if (!file) return;

  if (!file.type.startsWith("image/")) {
    alert("Selecciona una imagen válida.");
    return;
  }

  if (file.size > 5 * 1024 * 1024) {
    alert("La imagen no puede superar los 5 MB.");
    return;
  }

  setImageFile(file);
  setUploadingImage(true);

  const fileExtension = file.name.split(".").pop();
  const fileName = `${Date.now()}-${Math.random()
    .toString(36)
    .substring(2)}.${fileExtension}`;

  const filePath = `products/${fileName}`;

  const { error } = await supabase.storage
    .from("Products")
    .upload(filePath, file, {
      cacheControl: "3600",
      upsert: false,
    });

  if (error) {
    console.error(error);
    alert("No se pudo subir la imagen.");
    setImageFile(null);
    setUploadingImage(false);
    return;
  }

  const {
    data: { publicUrl },
  } = supabase.storage
    .from("Products")
    .getPublicUrl(filePath);

  setImageUrl(publicUrl);
  setUploadingImage(false);

  alert("Imagen subida correctamente.");
};

  const handleCreate = async () => {
    if (!name.trim()) {
      alert("Escribe el nombre del producto.");
      return;
    }

    if (!description.trim()) {
      alert("Escribe la descripción del producto.");
      return;
    }

    if (!price || Number(price) < 0) {
      alert("Escribe un precio válido.");
      return;
    }

    if (!category.trim()) {
      alert("Escribe la categoría.");
      return;
    }

    if (!stock || Number(stock) < 0) {
      alert("Escribe un stock válido.");
      return;
    }

    setSaving(true);

    const { error } = await supabase
      .from("Products")
      .insert({
        name: name.trim(),
        description: description.trim(),
        price: Number(price),
        category: category.trim(),
        stock: Number(stock),
        image_url: imageUrl.trim() || null,
        is_active: isActive,
      });

    if (error) {
      console.error(error);
      alert("No se pudo crear el producto.");
      setSaving(false);
      return;
    }

    alert("Producto creado correctamente.");

    router.push("/admin/products");
  };

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
            Nuevo producto
          </h1>

          <p className="mt-2 text-sm text-black/50">
            Agrega un nuevo producto al catálogo.
          </p>

          <div className="mt-8 space-y-6">
            <div>
              <label className="text-xs font-semibold uppercase tracking-wider">
                Nombre
              </label>

              <input
                value={name}
                onChange={(event) => setName(event.target.value)}
                placeholder="Ej: Essential Oversized"
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
                placeholder="Descripción del producto..."
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
                  onChange={(event) =>
                    setPrice(event.target.value)
                  }
                  placeholder="0"
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
                  onChange={(event) =>
                    setStock(event.target.value)
                  }
                  placeholder="0"
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
                onChange={(event) =>
                  setCategory(event.target.value)
                }
                placeholder="Ej: Camisetas"
                className="mt-2 w-full border border-black/10 px-4 py-3 text-sm outline-none focus:border-[#a88a4a]"
              />
            </div>

            <div>
              <label className="text-xs font-semibold uppercase tracking-wider">
                URL de imagen
              </label>

              <input
                value={imageUrl}
                onChange={(event) =>
                  setImageUrl(event.target.value)
                }
                placeholder="https://..."
                className="mt-2 w-full border border-black/10 px-4 py-3 text-sm outline-none focus:border-[#a88a4a]"
              />

              <p className="mt-2 text-xs text-black/40">
                Puedes pegar aquí la URL pública de una imagen de Supabase Storage.
              </p>
            </div>

            <div>
  <label className="text-xs font-semibold uppercase tracking-wider">
    Subir imagen
  </label>

  <input
  type="file"
  accept="image/*"
  onChange={handleImageUpload}
  disabled={uploadingImage}
  className="mt-2 w-full border border-black/10 bg-white px-4 py-3 text-sm disabled:opacity-50"
/>

{uploadingImage && (
  <p className="mt-2 text-xs text-black/50">
    Subiendo imagen...
  </p>
)}

{imageFile && !uploadingImage && (
  <p className="mt-2 text-xs text-green-700">
    ✓ {imageFile.name}
  </p>
)}
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
              onClick={handleCreate}
              disabled={saving}
              className="w-full bg-black px-6 py-4 text-xs font-semibold uppercase tracking-[0.2em] text-white transition hover:bg-[#a88a4a] disabled:cursor-not-allowed disabled:opacity-50"
            >
              {saving ? "Creando..." : "Crear producto"}
            </button>
          </div>
        </div>
      </div>
    </main>
  );
}