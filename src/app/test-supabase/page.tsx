"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";

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

export default function TestSupabase() {
  const [products, setProducts] = useState<Product[]>([]);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function loadProducts() {
      const { data, error } = await supabase
        .from("Products")
        .select("*")
        .eq("is_active", true);

      if (error) {
        setError(error.message);
        return;
      }

      setProducts(data ?? []);
    }

    loadProducts();
  }, []);

  return (
    <main style={{ padding: "40px" }}>
      <h1>Prueba Supabase - VELMOR</h1>

      {error && (
        <p style={{ color: "red" }}>
          Error: {error}
        </p>
      )}

      {!error && products.length === 0 && (
        <p>Cargando productos...</p>
      )}

      {products.map((product) => (
        <div key={product.id} style={{ marginBottom: "20px" }}>
          <h2>{product.name}</h2>
          <p>{product.description}</p>
          <p>${product.price}</p>
          <p>Categoría: {product.category}</p>
          <p>Stock: {product.stock}</p>
        </div>
      ))}
    </main>
  );
}