import { useEffect, useState } from "react";
import "./App.css";
import type { Item } from "./types/item";

const API_URL =
  import.meta.env.VITE_API_URL ?? "https://z-prefix-inventory-api.onrender.com";

function getPreviewDescription(description: string) {
  if (description.length <= 100) {
    return description;
  }

  return `${description.slice(0, 100)}...`;
}

function App() {
  const [items, setItems] = useState<Item[]>([]);
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [quantity, setQuantity] = useState("");
  const [editingItemId, setEditingItemId] = useState<number | null>(null);
  const [editedName, setEditedName] = useState("");
  const [editedDescription, setEditedDescription] = useState("");
  const [editedQuantity, setEditedQuantity] = useState("");

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

  async function handleAddItem(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();

    await fetch(`${API_URL}/items`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        name,
        description,
        quantity: Number(quantity),
      }),
    });

    setName("");
    setDescription("");
    setQuantity("");

    await fetchItems();
  }

  function startEditingItem(item: Item) {
    setEditingItemId(item.id);
    setEditedName(item.name);
    setEditedDescription(item.description);
    setEditedQuantity(String(item.quantity));
  }

  async function handleUpdateItem(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (editingItemId === null) {
      return;
    }

    await fetch(`${API_URL}/items/${editingItemId}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        name: editedName,
        description: editedDescription,
        quantity: Number(editedQuantity),
      }),
    });

    setEditingItemId(null);
    setEditedName("");
    setEditedDescription("");
    setEditedQuantity("");

    await fetchItems();
  }

  return (
    <main className="app">
      <header className="app-header">
        <h1>Inventory Manager</h1>
        <p>Track your inventory items</p>
      </header>

      <form className="item-form" onSubmit={handleAddItem}>
        <label>
          Name
          <input
            value={name}
            onChange={(event) => setName(event.target.value)}
          />
        </label>

        <label>
          Quantity
          <input
            type="number"
            value={quantity}
            onChange={(event) => setQuantity(event.target.value)}
          />
        </label>

        <label>
          Description
          <input
            value={description}
            onChange={(event) => setDescription(event.target.value)}
          />
        </label>

        <button type="submit">Add Item</button>
      </form>

      <section className="items-section">
        <h2>Items</h2>

        {items.length === 0 ? (
          <p>No inventory items yet.</p>
        ) : (
          <div className="item-list">
            {items.map((item) => (
              <article className="item-card" key={item.id}>
                {editingItemId === item.id ? (
                  <form className="edit-form" onSubmit={handleUpdateItem}>
                    <label>
                      Name
                      <input
                        value={editedName}
                        onChange={(event) => setEditedName(event.target.value)}
                      />
                    </label>

                    <label>
                      Quantity
                      <input
                        type="number"
                        value={editedQuantity}
                        onChange={(event) =>
                          setEditedQuantity(event.target.value)
                        }
                      />
                    </label>

                    <label>
                      Description
                      <input
                        value={editedDescription}
                        onChange={(event) =>
                          setEditedDescription(event.target.value)
                        }
                      />
                    </label>

                    <div className="item-actions">
                      <button type="submit">Save</button>

                      <button
                        type="button"
                        onClick={() => setEditingItemId(null)}
                      >
                        Cancel
                      </button>
                    </div>
                  </form>
                ) : (
                  <>
                    <h3>{item.name}</h3>
                    <p>Quantity: {item.quantity}</p>
                    <p>{getPreviewDescription(item.description)}</p>

                    <div className="item-actions">
                      <button
                        type="button"
                        onClick={() => startEditingItem(item)}
                      >
                        Edit
                      </button>
                      <button
                        type="button"
                        onClick={() => handleDeleteItem(item.id)}
                      >
                        Delete
                      </button>
                    </div>
                  </>
                )}
              </article>
            ))}
          </div>
        )}
      </section>
    </main>
  );
}

export default App;
