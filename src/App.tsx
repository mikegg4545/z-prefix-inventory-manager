import { useState } from "react";
import "./App.css";
import type { Item } from "./types/item";

const initialItems: Item[] = [
  {
    id: 1,
    name: "Laptop",
    quantity: 3,
    description: "Work laptops for the team",
  },
  {
    id: 2,
    name: "Monitor",
    quantity: 6,
    description: "External displays",
  },
  {
    id: 3,
    name: "Keyboard",
    quantity: 10,
    description: "USB keyboards",
  },
];

function App() {
  const [items] = useState<Item[]>(initialItems);

  return (
    <main>
      <h1>Inventory Manager</h1>
      <p>Track your inventory items</p>

      <section>
        <h2>Items</h2>

        {items.map((item) => (
          <article key={item.id}>
            <h3>{item.name}</h3>
            <p>Quantity: {item.quantity}</p>
            <p>{item.description}</p>
          </article>
        ))}
      </section>
    </main>
  );
}

export default App;
