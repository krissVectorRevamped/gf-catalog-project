import { useState } from "react";
import { Link } from "react-router-dom";

export default function AdminPanel() {
  const [form, setForm] = useState({
    index: "",
    name: "",
    rarity: "",
    type: "",
  });
  const [characters, setCharacters] = useState([]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  // Loads the local JSON file
  const loadCharacters = async () => {
    const res = await fetch("/json/characters.json");
    const data = await res.json();
    setCharacters(data);
  };

  // Adds new entry to memory (you still export manually)
  const handleAdd = (e) => {
    e.preventDefault();
    const newChar = {
      index: Number(form.index),
      name: form.name.split(",").map((n) => n.trim()),
      rarity: Number(form.rarity),
      type: form.type,
    };
    setCharacters((prev) => [...prev, newChar]);
  };

  // Export the edited JSON for replacement
  const exportJSON = () => {
    const blob = new Blob([JSON.stringify(characters, null, 2)], {
      type: "application/json",
    });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "characters.json";
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="p-4">
      <h1 className="text-2xl mb-2">Admin Panel</h1>
      <Link to="/" className="text-blue-500 underline">← Back to Catalog</Link>

      <form onSubmit={handleAdd} className="grid grid-cols-2 gap-2 mt-4">
        <input name="index" placeholder="Index" onChange={handleChange} value={form.index} />
        <input name="name" placeholder="Names (comma separated)" onChange={handleChange} value={form.name} />
        <input name="rarity" placeholder="Rarity" onChange={handleChange} value={form.rarity} />
        <input name="type" placeholder="Type (HG, AR...)" onChange={handleChange} value={form.type} />
        <button type="submit">Add to List</button>
      </form>

      <div className="flex gap-2 mt-4">
        <button onClick={loadCharacters}>Load Existing JSON</button>
        <button onClick={exportJSON}>Export Updated JSON</button>
      </div>

      <div className="mt-4">
        <h2>Preview:</h2>
        <pre className="bg-gray-100 p-2 overflow-x-auto text-sm">
          {JSON.stringify(characters, null, 2)}
        </pre>
      </div>
    </div>
  );
}
