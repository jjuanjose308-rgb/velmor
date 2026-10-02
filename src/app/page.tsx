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

type CartItem = Product & {
  quantity: number;
};

export default function Home() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [cart, setCart] = useState<CartItem[]>([]);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const cartTotal = cart.reduce(
  (total, item) => total + item.price * item.quantity,
  0
);
const cartCount = cart.reduce((total, item) => total + item.quantity, 0);

  useEffect(() => {
    async function loadProducts() {
      const { data, error } = await supabase
        .from("Products")
        .select("*")
        .eq("is_active", true)
        .order("id", { ascending: true });

      if (error) {
        setError(error.message);
        setLoading(false);
        return;
      }

      setProducts(data ?? []);
      setLoading(false);
    }

    loadProducts();
  }, []);

  return (

    <main className="min-h-screen bg-[#f7f6f2] text-[#111111]">

      {/* NAVBAR */}
<header className="sticky top-0 z-50 border-b border-black/10 bg-[#f7f6f2]/90 backdrop-blur-xl">
  <div className="mx-auto flex h-20 max-w-7xl items-center justify-between px-6 lg:px-10">

    {/* LOGO */}
    <a
      href="#inicio"
      className="group flex items-center gap-3"
    >
      <span className="font-serif text-2xl italic transition duration-300 group-hover:text-[#a88a4a]">
        V
      </span>

      <span className="text-lg font-bold tracking-[0.35em]">
        VELMOR
      </span>
    </a>

    {/* NAVEGACIÓN */}
    <nav className="hidden items-center gap-10 md:flex">

      <a
        href="#inicio"
        className="relative text-[11px] uppercase tracking-[0.2em] transition hover:text-[#a88a4a]"
      >
        Inicio
      </a>

      <a
        href="#coleccion"
        className="relative text-[11px] uppercase tracking-[0.2em] transition hover:text-[#a88a4a]"
      >
        Colección
      </a>

      <a
        href="#nosotros"
        className="relative text-[11px] uppercase tracking-[0.2em] transition hover:text-[#a88a4a]"
      >
        Nosotros
      </a>

      <a
        href="#contacto"
        className="relative text-[11px] uppercase tracking-[0.2em] transition hover:text-[#a88a4a]"
      >
        Contacto
      </a>

    </nav>

    {/* ACCIONES */}
    <div className="flex items-center gap-5">

      {/* BUSCAR */}
      <button
        aria-label="Buscar"
        className="text-lg transition duration-300 hover:scale-110 hover:text-[#a88a4a]"
      >
        ⌕
      </button>

      {/* CARRITO */}
      <button
        aria-label="Carrito"
        onClick={() => setIsCartOpen(true)}
        className="relative text-lg transition duration-300 hover:scale-110 hover:text-[#a88a4a]"
      >
        🛒

        {cartCount > 0 && (
          <span className="absolute -right-3 -top-2 flex h-5 w-5 items-center justify-center rounded-full bg-[#111111] text-[9px] font-semibold text-white">
            {cartCount}
          </span>
        )}
      </button>

      {/* MENÚ MÓVIL */}
      <button
        aria-label="Menú"
        className="text-xl transition hover:text-[#a88a4a] md:hidden"
      >
        ☰
      </button>

    </div>
  </div>
</header>


      {/* HERO */}
     <section
  id="inicio"
  className="mx-auto grid min-h-[calc(100vh-80px)] max-w-7xl grid-cols-1 lg:grid-cols-2"
>
  {/* TEXTO */}
  <div className="velmor-fade-in flex flex-col justify-center px-6 py-20 lg:px-16">

    <p className="mb-6 text-xs font-semibold tracking-[0.35em] text-[#a88a4a]">
      NUEVA COLECCIÓN · 2026
    </p>

    <h1 className="max-w-3xl font-serif text-6xl font-normal leading-[0.9] tracking-tight sm:text-7xl lg:text-8xl">
      Elegancia
      <br />
      <span className="italic text-[#a88a4a]">
        sin límites.
      </span>
    </h1>

    <p className="mt-8 max-w-lg text-sm leading-7 text-black/60">
      Diseños exclusivos creados para quienes buscan
      destacar sin necesidad de llamar la atención.
    </p>

    <div className="mt-10 flex flex-wrap gap-4">

      <a
        href="#coleccion"
        className="velmor-button bg-[#111111] px-8 py-4 text-xs font-semibold uppercase tracking-[0.2em] text-white"
      >
        Ver colección
      </a>

      <a
        href="#nosotros"
        className="border border-black px-8 py-4 text-xs font-semibold uppercase tracking-[0.2em] transition duration-300 hover:bg-black hover:text-white"
      >
        Conócenos
      </a>

    </div>

    <div className="mt-16 flex items-center gap-4">
      <div className="h-px w-12 bg-[#a88a4a]" />

      <p className="text-[10px] uppercase tracking-[0.3em] text-black/40">
        Medellín · Colombia
      </p>
    </div>

  </div>

  {/* VISUAL */}
  <div className="velmor-slide-up relative min-h-[550px] overflow-hidden bg-[#111111]">

    {/* Marco */}
    <div className="absolute inset-8 border border-white/15" />

    {/* Decoración */}
    <div className="absolute right-10 top-10">
      <p className="text-[10px] uppercase tracking-[0.4em] text-white/40">
        VELMOR
      </p>
    </div>

    <div className="absolute inset-0 flex items-center justify-center">
  <img
    src="velmor-monogram.svg"
    alt=""
    className="h-[280px] w-auto opacity-40 transition duration-700 hover:scale-105 hover:opacity-70"
  />
</div>
    

    {/* Texto inferior */}
    <div className="absolute bottom-10 left-10">
      <p className="text-xs tracking-[0.4em] text-white/40">
        VELMOR
      </p>

      <p className="mt-2 text-sm text-white/70">
        EST. 2026 · MEDELLÍN
      </p>
    </div>

    {/* Número */}
    <div className="absolute bottom-10 right-10">
      <p className="font-serif text-5xl italic text-white/10">
        01
      </p>
    </div>

  </div>
</section>


      {/* BARRA */}
      <section className="overflow-hidden bg-[#111111] py-5 text-white">
        <div className="flex min-w-max justify-around gap-16">

          <span className="text-xs tracking-[0.4em]">
            VELMOR
          </span>

          <span className="text-xs tracking-[0.4em]">
            EXCLUSIVIDAD
          </span>

          <span className="text-xs tracking-[0.4em]">
            DISEÑO
          </span>

          <span className="text-xs tracking-[0.4em]">
            ELEGANCIA
          </span>

          <span className="text-xs tracking-[0.4em]">
            VELMOR
          </span>

        </div>
      </section>


      {/* COLECCIÓN */}
      <section
        id="coleccion"
        className="mx-auto max-w-7xl px-6 py-24 lg:px-10"
      >

        <div className="mb-14 flex flex-col justify-between gap-6 sm:flex-row sm:items-end">

          <div>

            <p className="mb-4 text-xs font-semibold tracking-[0.3em] text-[#a88a4a]">
              DESCUBRE VELMOR
            </p>

            <h2 className="font-serif text-5xl font-normal">
              Colección{" "}
              <span className="italic text-[#a88a4a]">
                2026
              </span>
            </h2>

          </div>

          <a
            href="#"
            className="w-fit border-b border-black pb-2 text-xs uppercase tracking-[0.2em]"
          >
            Ver todos →
          </a>

        </div>


        {/* PRODUCTOS */}
        <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-4">

          {loading && (
  <div className="col-span-full py-10 text-center">
    <p className="text-sm text-black/50">
      Cargando colección...
    </p>
  </div>
)}

{error && (
  <div className="col-span-full py-10 text-center">
    <p className="text-sm text-red-600">
      No se pudieron cargar los productos.
    </p>
  </div>
)}

{!loading && !error && products.map((product) => (
  <article
    key={product.id}
    className="group"
  >
    <div className="relative flex aspect-[3/4] items-center justify-center overflow-hidden bg-[#e8e7e2]">

      <span className="absolute left-4 top-4 z-10 bg-[#111111] px-3 py-2 text-[9px] font-semibold tracking-[0.15em] text-white">
        VELMOR
      </span>

      {product.image_url ? (
  <img
    src={product.image_url}
    alt={product.name}
    className="h-full w-full object-cover transition duration-500 group-hover:scale-105"
  />
) : (
  <span className="font-serif text-[150px] italic text-black/10 transition duration-500 group-hover:scale-110">
    V
  </span>
)}

    <button
  aria-label={`Agregar ${product.name} al carrito`}
  onClick={() =>
  setCart((currentCart) => {
    const existingProduct = currentCart.find(
      (item) => item.id === product.id
    );

    if (existingProduct) {
      return currentCart.map((item) =>
        item.id === product.id
          ? { ...item, quantity: item.quantity + 1 }
          : item
      );
    }

    return [...currentCart, { ...product, quantity: 1 }];
  })
}
  className="absolute bottom-4 right-4 flex h-11 w-11 items-center justify-center bg-white text-xl shadow-sm transition hover:bg-[#111111] hover:text-white"
>
  +
</button>

    </div>

    <div className="pt-5">

      <p className="mb-2 text-[10px] uppercase tracking-[0.15em] text-black/40">
        {product.category}
      </p>

      <h3 className="text-sm font-medium">
        {product.name}
      </h3>

      <p className="mt-2 text-sm font-semibold">
        {new Intl.NumberFormat("es-CO", {
          style: "currency",
          currency: "COP",
          maximumFractionDigits: 0,
        }).format(product.price)}
      </p>

    </div>
  </article>
))}

        </div>

      </section>


      {/* CATEGORÍAS */}
<section className="grid grid-cols-1 md:grid-cols-3">

  {/* HOMBRES */}
  <a
    href="#coleccion"
    className="group relative flex h-[420px] items-end overflow-hidden bg-[#171717] p-10 text-white"
  >
    <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/10 to-transparent" />

    <div className="absolute right-8 top-8">
      <span className="font-serif text-7xl italic text-white/10 transition duration-500 group-hover:text-[#a88a4a]/30">
        01
      </span>
    </div>

    <div className="relative z-10">
      <p className="mb-3 text-[10px] tracking-[0.35em] text-[#a88a4a]">
        COLECCIÓN
      </p>

      <h3 className="font-serif text-5xl transition duration-300 group-hover:translate-x-2">
        Hombres
      </h3>

      <div className="mt-6 flex items-center gap-3 text-[10px] uppercase tracking-[0.25em] opacity-60 transition duration-300 group-hover:gap-5 group-hover:opacity-100">
        Explorar
        <span>→</span>
      </div>
    </div>
  </a>

  {/* MUJERES */}
  <a
    href="#coleccion"
    className="group relative flex h-[420px] items-end overflow-hidden bg-[#292929] p-10 text-white"
  >
    <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/10 to-transparent" />

    <div className="absolute right-8 top-8">
      <span className="font-serif text-7xl italic text-white/10 transition duration-500 group-hover:text-[#a88a4a]/30">
        02
      </span>
    </div>

    <div className="relative z-10">
      <p className="mb-3 text-[10px] tracking-[0.35em] text-[#a88a4a]">
        COLECCIÓN
      </p>

      <h3 className="font-serif text-5xl transition duration-300 group-hover:translate-x-2">
        Mujeres
      </h3>

      <div className="mt-6 flex items-center gap-3 text-[10px] uppercase tracking-[0.25em] opacity-60 transition duration-300 group-hover:gap-5 group-hover:opacity-100">
        Explorar
        <span>→</span>
      </div>
    </div>
  </a>

  {/* ACCESORIOS */}
  <a
    href="#coleccion"
    className="group relative flex h-[420px] items-end overflow-hidden bg-[#3c3c3c] p-10 text-white"
  >
    <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/10 to-transparent" />

    <div className="absolute right-8 top-8">
      <span className="font-serif text-7xl italic text-white/10 transition duration-500 group-hover:text-[#a88a4a]/30">
        03
      </span>
    </div>

    <div className="relative z-10">
      <p className="mb-3 text-[10px] tracking-[0.35em] text-[#a88a4a]">
        COLECCIÓN
      </p>

      <h3 className="font-serif text-5xl transition duration-300 group-hover:translate-x-2">
        Accesorios
      </h3>

      <div className="mt-6 flex items-center gap-3 text-[10px] uppercase tracking-[0.25em] opacity-60 transition duration-300 group-hover:gap-5 group-hover:opacity-100">
        Explorar
        <span>→</span>
      </div>
    </div>
  </a>

</section>


      {/* NOSOTROS */}
<section
  id="nosotros"
  className="mx-auto grid max-w-7xl grid-cols-1 items-center gap-16 px-6 py-28 lg:grid-cols-2 lg:px-10"
>
  {/* BLOQUE VISUAL */}
  <div className="group relative aspect-square overflow-hidden bg-[#deddd7]">

    {/* Marco */}
    <div className="absolute inset-8 z-10 border border-black/10" />

    {/* V */}
    <div className="flex h-full items-center justify-center">
      <span className="font-serif text-[260px] italic leading-none text-black/[0.06] transition duration-700 group-hover:scale-105">
        V
      </span>
    </div>

    {/* Número */}
    <div className="absolute left-10 top-10">
      <p className="text-[10px] font-semibold tracking-[0.35em] text-black/40">
        VELMOR
      </p>
    </div>

    {/* Texto inferior */}
    <div className="absolute bottom-10 left-10">
      <p className="text-[10px] uppercase tracking-[0.3em] text-black/40">
        EST. 2026
      </p>
    </div>

    <div className="absolute bottom-10 right-10">
      <span className="font-serif text-6xl italic text-black/[0.06]">
        02
      </span>
    </div>
  </div>

  {/* TEXTO */}
  <div className="velmor-slide-up">

    <p className="mb-5 text-xs font-semibold tracking-[0.3em] text-[#a88a4a]">
      NUESTRA HISTORIA
    </p>

    <h2 className="font-serif text-5xl leading-[1.05] sm:text-6xl">
      No seguimos
      <br />
      <span className="italic text-[#a88a4a]">
        tendencias.
      </span>
    </h2>

    <div className="mt-8 h-px w-16 bg-[#a88a4a]" />

    <p className="mt-8 max-w-lg text-sm leading-8 text-black/60">
      VELMOR nace con una idea sencilla: crear prendas
      que representen la personalidad de quienes las llevan.
    </p>

    <p className="mt-5 max-w-lg text-sm leading-8 text-black/60">
      Nuestra filosofía combina diseño contemporáneo,
      materiales cuidadosamente seleccionados y una
      estética minimalista.
    </p>

    <a
      href="#contacto"
      className="mt-10 inline-flex items-center gap-4 border-b border-black pb-3 text-xs font-semibold uppercase tracking-[0.2em] transition duration-300 hover:border-[#a88a4a] hover:text-[#a88a4a]"
    >
      Conoce VELMOR
      <span className="transition-transform duration-300 hover:translate-x-1">
        →
      </span>
    </a>

  </div>
</section>


      {/* FRASE */}
      <section className="bg-[#111111] px-6 py-32 text-center text-white">

        <p className="mb-6 text-xs tracking-[0.4em] text-[#a88a4a]">
          VELMOR
        </p>

        <h2 className="mx-auto max-w-4xl font-serif text-4xl leading-tight sm:text-6xl">
          La elegancia
          <br />
          <span className="italic text-[#a88a4a]">
            habla por sí sola.
          </span>
        </h2>

      </section>


      {/* NEWSLETTER */}
      <section
        id="contacto"
        className="mx-auto max-w-3xl px-6 py-28 text-center"
      >

        <p className="mb-5 text-xs font-semibold tracking-[0.3em] text-[#a88a4a]">
          ÚNETE A VELMOR
        </p>

        <h2 className="font-serif text-5xl">
          Sé parte de lo que viene.
        </h2>

        <p className="mx-auto mt-6 max-w-xl text-sm leading-7 text-black/50">
          Recibe novedades, nuevos lanzamientos y acceso anticipado
          a nuestras próximas colecciones.
        </p>


        <form className="mx-auto mt-10 flex max-w-xl flex-col gap-3 sm:flex-row">

          <input
            type="email"
            placeholder="Tu correo electrónico"
            className="h-14 flex-1 border border-black/20 bg-transparent px-5 text-sm outline-none focus:border-[#a88a4a]"
            required
          />

          <button
            type="submit"
            className="h-14 bg-[#111111] px-8 text-xs font-semibold uppercase tracking-[0.2em] text-white transition hover:bg-[#a88a4a]"
          >
            Suscribirme
          </button>

        </form>

      </section>


      {/* FOOTER */}
      <footer className="bg-[#111111] px-6 py-16 text-white lg:px-10">

        <div className="mx-auto grid max-w-7xl grid-cols-1 gap-12 md:grid-cols-4">

          <div className="md:col-span-2">

            <div className="text-xl font-bold tracking-[0.35em]">
              VELMOR
            </div>

            <p className="mt-5 max-w-sm text-sm leading-7 text-white/40">
              Moda contemporánea para quienes entienden que
              menos puede decir mucho más.
            </p>

          </div>


          <div>

            <h4 className="mb-5 text-xs uppercase tracking-[0.2em] text-[#a88a4a]">
              Explorar
            </h4>

            <div className="flex flex-col gap-3 text-sm text-white/60">

              <a href="#inicio" className="hover:text-white">
                Inicio
              </a>

              <a href="#coleccion" className="hover:text-white">
                Colección
              </a>

              <a href="#nosotros" className="hover:text-white">
                Nosotros
              </a>

            </div>

          </div>


          <div>

            <h4 className="mb-5 text-xs uppercase tracking-[0.2em] text-[#a88a4a]">
              Información
            </h4>

            <div className="flex flex-col gap-3 text-sm text-white/60">

              <a href="#" className="hover:text-white">
                Envíos
              </a>

              <a href="#" className="hover:text-white">
                Cambios y devoluciones
              </a>

              <a href="#" className="hover:text-white">
                Preguntas frecuentes
              </a>

            </div>

          </div>

        </div>


        <div className="mx-auto mt-16 flex max-w-7xl flex-col justify-between gap-4 border-t border-white/10 pt-6 text-xs text-white/30 sm:flex-row">

          <p>
            © 2026 VELMOR. Todos los derechos reservados.
          </p>

          <p>
            Medellín, Colombia
          </p>

        </div>

      </footer>

        {/* CARRITO */}
        {isCartOpen && (
  <div className="fixed inset-0 z-50">

    {/* Fondo oscuro */}
    <div
      className="absolute inset-0 bg-black/40"
      onClick={() => setIsCartOpen(false)}
    />

    {/* Panel */}
    <div className="absolute right-0 top-0 h-full w-full max-w-md bg-white p-6 shadow-2xl">

      <div className="flex items-center justify-between border-b pb-5">
        <h2 className="text-lg font-semibold">
          Tu carrito
        </h2>

        <button
          onClick={() => setIsCartOpen(false)}
          className="text-2xl text-black/60 hover:text-black"
          aria-label="Cerrar carrito"
        >
          ×
        </button>
      </div>

      <div className="mt-6">
        {cartCount === 0 ? (
          <p className="text-sm text-black/50">
            Tu carrito está vacío.
          </p>
        ) : (
          <>
            <div className="space-y-5">
              {cart.map((product) => (
                <div
                  key={product.id}
                  className="flex gap-4 border-b pb-5"
                >
                  {product.image_url ? (
                    <img
                      src={product.image_url}
                      alt={product.name}
                      className="h-24 w-20 object-cover"
                    />
                  ) : (
                    <div className="flex h-24 w-20 items-center justify-center bg-[#e8e7e2]">
                      <span className="font-serif text-4xl italic text-black/10">
                        V
                      </span>
                    </div>
                  )}

                  <div className="flex-1">
                    <p className="text-xs uppercase tracking-wider text-black/40">
                      {product.category}
                    </p>

                    <h3 className="mt-1 text-sm font-medium">
                      {product.name}
                    </h3>

                    <p className="mt-2 text-sm font-semibold">
                      {new Intl.NumberFormat("es-CO", {
                        style: "currency",
                        currency: "COP",
                        maximumFractionDigits: 0,
                      }).format(product.price)}
                    </p>

                    <div className="mt-3 flex items-center gap-3">
                      <button
                        onClick={() =>
                          setCart((currentCart) =>
                            currentCart
                              .map((item) =>
                                item.id === product.id
                                  ? {
                                      ...item,
                                      quantity: item.quantity - 1,
                                    }
                                  : item
                              )
                              .filter((item) => item.quantity > 0)
                          )
                        }
                        className="flex h-8 w-8 items-center justify-center border text-sm hover:bg-black hover:text-white"
                      >
                        −
                      </button>

                      <span className="min-w-5 text-center text-sm">
                        {product.quantity}
                      </span>

                      <button
                        onClick={() =>
                          setCart((currentCart) =>
                            currentCart.map((item) =>
                              item.id === product.id
                                ? {
                                    ...item,
                                    quantity: item.quantity + 1,
                                  }
                                : item
                            )
                          )
                        }
                        className="flex h-8 w-8 items-center justify-center border text-sm hover:bg-black hover:text-white"
                      >
                        +
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* TOTAL */}
            <div className="mt-8 border-t pt-6">
              <div className="flex items-center justify-between">
                <span className="text-sm uppercase tracking-wider text-black/50">
                  Total
                </span>

                <span className="text-lg font-semibold">
                  {new Intl.NumberFormat("es-CO", {
                    style: "currency",
                    currency: "COP",
                    maximumFractionDigits: 0,
                  }).format(cartTotal)}
                </span>
              </div>

              {/* BOTÓN COMPRAR */}
              <button
                onClick={() => {
  localStorage.setItem("velmor-cart", JSON.stringify(cart));
  setIsCartOpen(false);
  window.location.href = "/checkout";
}}
                className="mt-6 w-full bg-[#111111] py-4 text-xs font-semibold uppercase tracking-[0.2em] text-white transition hover:bg-[#a88a4a]"
              >
                Comprar ahora
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  </div>
)}

    </main>
  );
}