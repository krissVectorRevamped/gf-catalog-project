// src/js/AdminPanel.jsx
import { useState, useEffect } from "react";
import axios from "axios";
import styles from "../Admin.module.css";

export default function AdminPanel() {
  const [characters, setCharacters] = useState([]);
  const [editingCharacter, setEditingCharacter] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch characters from backend API when component mounts
  useEffect(() => {
    async function fetchChars() {
      try {
        setLoading(true);
        const res = await axios.get("http://localhost:3001/api/characters");
        const data = res.data;
        // Assuming backend returns an object keyed by id: convert to array
        const list = Array.isArray(data)
          ? data
          : Object.values(data);
        setCharacters(list);
      } catch (err) {
        console.error("Error fetching characters:", err);
        setError("Failed to load characters");
      } finally {
        setLoading(false);
      }
    }
    fetchChars();
  }, []);

  async function handleDelete(id) {
    if (!window.confirm("Are you sure you want to delete this character?")) return;
    try {
      await axios.delete(`http://localhost:3001/api/characters/${id}`);
      setCharacters(chars => chars.filter(c => c.id !== id));
    } catch (err) {
      console.error("Delete failed:", err);
      alert("Failed to delete character");
    }
  }

  async function handleSave(character) {
    try {
      if (character.id) {
        await axios.put(`http://localhost:3001/api/characters/${character.id}`, character);
      } else {
        await axios.post(`http://localhost:3001/api/characters`, character);
      }
      // refresh list
      const res = await axios.get("http://localhost:3001/api/characters");
      const data = res.data;
      const list = Array.isArray(data) ? data : Object.values(data);
      setCharacters(list);
      setEditingCharacter(null);
    } catch (err) {
      console.error("Save failed:", err);
      alert("Failed to save character");
    }
  }

  function handleEdit(id) {
    const char = characters.find(c => c.id === id);
    if (!char) return;
    setEditingCharacter({ ...char });
  }

  // Form component
 function CharacterEditForm({ initialData, onSaved, onCancel }) {
  const [formData, setFormData] = useState(initialData);
  const [showFileInput, setShowFileInput] = useState(!initialData.image);

  function handleChange(e) {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  }

  function handleImageChange(e) {
    setFormData({ ...formData, imageFile: e.target.files[0] });
  }

  function handleSubmit(e) {
    e.preventDefault();

    const dataToSend = new FormData();

    // attach normal text fields
    Object.keys(formData).forEach((key) => {
      if (key !== "imageFile") {
        dataToSend.append(key, formData[key]);
      }
    });

    // if user selected a new image file
    if (formData.imageFile) {
      dataToSend.append("image", formData.imageFile);
    }

    const url = formData.id
      ? `/api/characters/${formData.id}` // edit
      : `/api/characters`; // new

    const method = formData.id ? "put" : "post";

    axios({
      method: method,
      url: url,
      data: dataToSend,
      headers: { "Content-Type": "multipart/form-data" },
    })
      .then(() => onSaved())
      .catch((err) => console.error(err));
  }

  return (
    <form className="edit-form" onSubmit={handleSubmit}>
      <h3>{formData.id ? "Edit Character" : "Add New Character"}</h3>

      <input
        name="name"
        placeholder="Name"
        value={formData.name || ""}
        onChange={handleChange}
      />

      <input
        name="series"
        placeholder="Series"
        value={formData.series || ""}
        onChange={handleChange}
      />

      <input
        name="faction"
        placeholder="Faction"
        value={formData.faction || ""}
        onChange={handleChange}
      />

      <textarea
        name="description"
        placeholder="Description"
        value={formData.description || ""}
        onChange={handleChange}
      />

      {/* Intelligent Image Section */}
      <div className="image-section">
        <label>Character Image:</label>

        {formData.image && !showFileInput ? (
          <div className="existing-image-block">
            <img
              src={`/src/char_img/${formData.image}`}
              alt="Character"
              className="preview-img"
            />
            <button
              type="button"
              onClick={() => setShowFileInput(true)}
            >
              Change Picture
            </button>
          </div>
        ) : (
          <input type="file" accept="image/*" onChange={handleImageChange} />
        )}
      </div>

      <div className="form-buttons">
        <button type="submit">Save</button>
        <button type="button" onClick={onCancel}>
          Cancel
        </button>
      </div>
    </form>
  );
}



  if (loading) {
    return <div>Loading characters…</div>;
  }
  if (error) {
    return <div>Error: {error}</div>;
  }

  return (
    <div className={styles.admin_container}>
      <h2>Character Management</h2>

      <div className={styles.admin_list}>
        {characters.map((char) => (
          <div className={styles.admin_card} key={char.id}>
            {char.image && <img src={char.image} alt={char.name?.[0] || ""} className={styles.thumb} />}
            <div>{char.name?.join(" / ")}</div>
            <div>ID: {char.id}</div>
            <div>Type: {char.type || "-"}</div>
            <div>Rarity: {char.rarity || "-"}</div>
            <div>MODIII: {char.has_MODIII ? "Yes" : "No"}</div>
            <div>Collab: {char.collab || "-"}</div>
            <button onClick={() => handleEdit(char.id)} className={styles.admin_button}>Edit</button>
            <button onClick={() => handleDelete(char.id)} className={styles.admin_button}>Delete</button>
          </div>
        ))}
      </div>

      <button
        className={styles.admin_button}
        onClick={() => setEditingCharacter({ name: ["", ""], has_MODIII: false })}
      >
        Add New Character
      </button>

      {editingCharacter && (
        <CharacterEditForm
          initialData={editingCharacter}
          onCancel={() => setEditingCharacter(null)}
        />
      )}
    </div>
  );
}
