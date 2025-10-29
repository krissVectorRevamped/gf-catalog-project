import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

export default function Catalog() {
  const [characters, setCharacters] = useState([]);

  useEffect(() => {
    fetch("/data/characters.json")
      .then((res) => res.json())
      .then(setCharacters)
      .catch(console.error);
  }, []);

  return (
    <div className="p-4">
      <h1 className="text-2xl mb-2">Character Catalog</h1>
      <Link to="/admin" className="text-blue-500 underline">Go to Admin Panel</Link>

      <div className="grid grid-cols-4 gap-4 mt-4">
        {characters.map((c) => (
          <div key={c.index} className="p-3 border rounded">
            <h2 className="font-bold">{c.name[1] ?? c.name[0]}</h2>
            <p>Type: {c.type}</p>
            <p>Rarity: {c.rarity}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
