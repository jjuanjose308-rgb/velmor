"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";

type CartItem = {
  id: number;
  name: string;
  description: string;
  price: number;
  category: string;
  image_url: string | null;
  stock: number;
  is_active: boolean;
  quantity: number;
};

export default function CheckoutPage() {
  const [cart, setCart] = useState<CartItem[]>([]);

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    address: "",
    city: "",
  });

  useEffect(() => {
    const savedCart = localStorage.getItem("velmor-cart");

    if (savedCart) {
      try {
        setCart(JSON.parse(savedCart));
      } catch {
        setCart([]);
      }
    }
  }, []);

  const cartTotal = cart.reduce(
    (total, item) => total + item.price * item.quantity,
    0
  );

  const totalItems = cart.reduce(
    (total, item) => total + item.quantity,
    0
  );

  const handleChange = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const { name, value } = event.target;

    setFormData((current) => ({
      ...current,
      [name]: value,
    }));
  };

const handleSubmit = async (event: React.FormEvent) => {
  event.preventDefault();

  if (cart.length === 0) {
    alert("Tu carrito está vacío.");
    return;
  }

  if (
  !formData.name.trim() ||
  !formData.email.trim() ||
  !formData.phone.trim() ||
  !formData.address.trim() ||
  !formData.city.trim()
) {
  alert("Completa todos los datos de entrega.");
  return;
}

if (formData.name.trim().length < 3) {
  alert("El nombre debe tener al menos 3 caracteres.");
  return;
}

if (formData.phone.replace(/\D/g, "").length < 7) {
  alert("Ingresa un número de teléfono válido.");
  return;
}

if (formData.address.trim().length < 5) {
  alert("Ingresa una dirección válida.");
  return;
}

if (formData.city.trim().length < 2) {
  alert("Ingresa una ciudad válida.");
  return;
}

const invalidQuantity = cart.some(
  (item) =>
    !Number.isInteger(item.quantity) ||
    item.quantity <= 0
);

if (invalidQuantity) {
  alert("Hay una cantidad de producto inválida.");
  return;
}

  const { data: orderId, error: orderError } = await supabase.rpc(
    "create_velmor_order",
    {
      p_customer_name: formData.name,
      p_customer_email: formData.email,
      p_customer_phone: formData.phone,
      p_customer_address: formData.address,
      p_customer_city: formData.city,
      p_items: cart.map((item) => ({
        id: item.id,
        quantity: item.quantity,
      })),
    }
  );

  if (orderError || !orderId) {
  console.error("Error creando pedido:", orderError);

  const errorMessage =
    orderError?.message || "No se pudo crear el pedido.";

  alert(errorMessage);
  return;
}

// Pedido creado correctamente
localStorage.removeItem("velmor-cart");
setCart([]);

alert(`Pedido #${orderId} creado correctamente.`);
};

  return (
    <main className="min-h-screen bg-[#f7f6f2] px-6 py-12">
      <div className="mx-auto max-w-6xl">

        {/* ENCABEZADO */}
        <div className="mb-10">
          <p className="text-xs uppercase tracking-[0.3em] text-black/40">
            VELMOR
          </p>

          <h1 className="mt-3 font-serif text-4xl">
            Finalizar compra
          </h1>

          <p className="mt-3 text-sm text-black/50">
            Completa tus datos para continuar con tu pedido.
          </p>
        </div>

        <div className="grid gap-10 lg:grid-cols-2">

          {/* DATOS DEL CLIENTE */}
          <section className="bg-white p-8 shadow-sm">
            <h2 className="text-xl font-semibold">
              Datos de entrega
            </h2>

            <form
              onSubmit={handleSubmit}
              className="mt-8 space-y-5"
            >

              {/* NOMBRE */}
              <div>
                <label className="text-xs uppercase tracking-wider text-black/50">
                  Nombre completo
                </label>

                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  required
                  className="mt-2 w-full border border-black/15 bg-white px-4 py-3 text-sm outline-none focus:border-black"
                  placeholder="Juan José Jiménez"
                />
              </div>

              {/* CORREO */}
              <div>
                <label className="text-xs uppercase tracking-wider text-black/50">
                  Correo electrónico
                </label>

                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  required
                  className="mt-2 w-full border border-black/15 bg-white px-4 py-3 text-sm outline-none focus:border-black"
                  placeholder="correo@ejemplo.com"
                />
              </div>

              {/* TELÉFONO */}
              <div>
                <label className="text-xs uppercase tracking-wider text-black/50">
                  Teléfono
                </label>

                <input
                  type="tel"
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                  required
                  className="mt-2 w-full border border-black/15 bg-white px-4 py-3 text-sm outline-none focus:border-black"
                  placeholder="300 000 0000"
                />
              </div>

              {/* DIRECCIÓN */}
              <div>
                <label className="text-xs uppercase tracking-wider text-black/50">
                  Dirección
                </label>

                <input
                  type="text"
                  name="address"
                  value={formData.address}
                  onChange={handleChange}
                  required
                  className="mt-2 w-full border border-black/15 bg-white px-4 py-3 text-sm outline-none focus:border-black"
                  placeholder="Calle 00 #00-00"
                />
              </div>

              {/* CIUDAD */}
              <div>
                <label className="text-xs uppercase tracking-wider text-black/50">
                  Ciudad
                </label>

                <input
                  type="text"
                  name="city"
                  value={formData.city}
                  onChange={handleChange}
                  required
                  className="mt-2 w-full border border-black/15 bg-white px-4 py-3 text-sm outline-none focus:border-black"
                  placeholder="Medellín"
                />
              </div>

              {/* BOTÓN */}
              <button
                type="submit"
                className="w-full bg-[#111111] py-4 text-xs font-semibold uppercase tracking-[0.2em] text-white transition hover:bg-[#a88a4a]"
              >
                Ir al pago
              </button>

            </form>
          </section>

          {/* RESUMEN DEL PEDIDO */}
          <section className="h-fit bg-white p-8 shadow-sm">
            <h2 className="text-xl font-semibold">
              Resumen del pedido
            </h2>

            {cart.length === 0 ? (
              <div className="mt-8">
                <p className="text-sm text-black/50">
                  Tu carrito está vacío.
                </p>
              </div>
            ) : (
              <>
                <div className="mt-8 space-y-5">
                  {cart.map((item) => (
                    <div
                      key={item.id}
                      className="flex gap-4 border-b border-black/10 pb-5"
                    >
                      {item.image_url ? (
                        <img
                          src={item.image_url}
                          alt={item.name}
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
                          {item.category}
                        </p>

                        <h3 className="mt-1 text-sm font-medium">
                          {item.name}
                        </h3>

                        <p className="mt-2 text-xs text-black/50">
                          Cantidad: {item.quantity}
                        </p>

                        <p className="mt-2 text-sm font-semibold">
                          {new Intl.NumberFormat("es-CO", {
                            style: "currency",
                            currency: "COP",
                            maximumFractionDigits: 0,
                          }).format(
                            item.price * item.quantity
                          )}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>

                {/* TOTAL */}
                <div className="mt-6 border-t border-black/10 pt-6">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-black/50">
                      {totalItems} producto
                      {totalItems !== 1 ? "s" : ""}
                    </span>

                    <span className="text-xl font-semibold">
                      {new Intl.NumberFormat("es-CO", {
                        style: "currency",
                        currency: "COP",
                        maximumFractionDigits: 0,
                      }).format(cartTotal)}
                    </span>
                  </div>
                </div>
              </>
            )}
          </section>

        </div>
      </div>
    </main>
  );
}