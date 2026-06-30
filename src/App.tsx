import { useEffect, useState } from "react";
import "./App.css";
import type { Item } from "./types/item";

const API_URL =
  import.meta.env.VITE_API_URL ?? "https://z-prefix-inventory-api.onrender.com";

function App() {
  const [items, setItems] = useState<Item[]>([]);

  async function fetchItems() {
    const response = await fetch(`${API_URL}/items`);
    const data = await response.json();

    setItems(data);
  }

  async function handleDeleteItem(id: number) {
    await fetch(`${API_URL}/items/${id}`, {
      method: "DELETE",
    });

    await fetchItems();
  }

  useEffect(() => {
    fetchItems();
  }, []);

  return (
    <main>
      <h1>Inventory Manager</h1>
      <p>Track your inventory items</p>

      <section>
        <h2>Items</h2>

        {items.length === 0 ? (
          <p>No inventory items yet.</p>
        ) : (
          items.map((item) => (
            <article key={item.id}>
              <h3>{item.name}</h3>
              <p>Quantity: {item.quantity}</p>
              <p>{item.description}</p>
              <button type="button" onClick={() => handleDeleteItem(item.id)}>
                Delete
              </button>
            </article>
          ))
        )}
      </section>
    </main>
  );
}

export default App;
