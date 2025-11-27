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
  function CharacterEditForm({ initialData, onCancel }) {
    const [replaceImage, setReplaceImage] = useState(false);
    const [formData, setFormData] = useState(initialData || {});

    function handleChange(e) {
      const { name, value } = e.target;
      setFormData(prev => ({
        ...prev,
        [name]: value
      }));
    }

    function handleNameChange(idx, value) {
      const names = Array.isArray(formData.name) ? [...formData.name] : ["",""];
      names[idx] = value;
      setFormData(prev => ({ ...prev, name: names }));
    }

    function handleSubmit(e) {
      e.preventDefault();
      // convert certain fields if needed, e.g. has_MODIII to boolean
      const payload = {
        ...formData,
        has_MODIII: formData.has_MODIII === "true" || formData.has_MODIII === true
      };
      handleSave(payload);
    }

    function handleFileChange(e) {
  const file = e.target.files[0];
  if (!file) return;

  const formData = new FormData();
  formData.append("image", file);

  axios.post("http://localhost:3001/api/upload", formData, {
    headers: { "Content-Type": "multipart/form-data" },
  })
  .then(res => {
    setFormData(prev => ({ ...prev, image: res.data.url }));
    setReplaceImage(false); // optional: hide file input after successful upload
  })
  .catch(err => console.error("Upload failed:", err));
}

    return (
      <form className={styles.admin_editor} onSubmit={handleSubmit}>
        <h3>{formData.id != null ? "Edit Character" : "Add Character"}</h3>

        <input
          name="name0"
          placeholder="Name[0]"
          value={formData.name?.[0] || ""}
          onChange={e => handleNameChange(0, e.target.value)}
        />
        <input
          name="name1"
          placeholder="Name[1]"
          value={formData.name?.[1] || ""}
          onChange={e => handleNameChange(1, e.target.value)}
        />

        <input
          name="type"
          placeholder="Type"
          value={formData.type || ""}
          onChange={handleChange}
        />
        <input
          name="rarity"
          placeholder="Rarity"
          value={formData.rarity || ""}
          onChange={handleChange}
        />

        <input
          name="has_MODIII"
          placeholder="has_MODIII (true or false)"
          value={formData.has_MODIII ?? ""}
          onChange={handleChange}
        />
        <input
          name="collab"
          placeholder="Collab (optional)"
          value={formData.collab || ""}
          onChange={handleChange}
        />
        <div>
  {formData.image ? (
  <div style={{ display: 'flex', alignItems: 'center' }}>
    <img src={formData.image} alt="Preview" width={100} />
    <button type="button" onClick={() => setFormData({...formData, image: null})}>
      Change Image
    </button>
  </div>
) : (
  <input type="file" onChange={handleFileChange} />
)}


  {(replaceImage || !formData.image) && (
    <input type="file" onChange={handleFileChange} />
  )}
</div>


        <div className={styles.form_buttons}>
          <button type="submit" className={styles.admin_button}>Save</button>
          <button type="button" onClick={onCancel} className={styles.admin_button}>
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
