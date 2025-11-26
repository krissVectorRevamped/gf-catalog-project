import { useState, useEffect } from "react";
import charactersData from '../json/tdoll_data.json';
import styles from "../Admin.module.css";

export default function AdminPanel() {
  const [characters, setCharacters] = useState([]);
  const [editingCharacter, setEditingCharacter] = useState(null);

  useEffect(() => {
    setCharacters(Object.values(charactersData)); // populate from JSON
  }, []);

  function handleEdit(id) {
    const char = characters.find(c => c.id === id);
    setEditingCharacter({ ...char });
  }

  function handleDelete(id) {
    if (!window.confirm("Delete this entry?")) return;
    setCharacters(characters.filter(c => c.id !== id));
    // NOTE: This won't save to JSON, only frontend.
  }

  function CharacterEditForm({ initialData, onSaved, onCancel }) {
    const [formData, setFormData] = useState(initialData);

    function handleChange(e) {
      setFormData({ ...formData, [e.target.name]: e.target.value });
    }

    function handleSubmit(e) {
      e.preventDefault();
      if (formData.id) {
        // update existing
        const updated = characters.map(c => c.id === formData.id ? formData : c);
        setCharacters(updated);
      } else {
        // add new
        formData.id = Date.now().toString();
        setCharacters([...characters, formData]);
      }
      onSaved();
    }

    return (
  <form className={styles.admin_editor} onSubmit={handleSubmit}>
    <h3>{formData.id ? "Edit Character" : "Add Character"}</h3>

    <input
      name="name"
      placeholder="Name"
      value={formData.name || ""}
      onChange={handleChange}
    />

    <input
      name="image"
      placeholder="Image URL"
      value={formData.image || ""}
      onChange={handleChange}
    />

    <input
      name="series"
      placeholder="Series"
      value={formData.series || ""}
      onChange={handleChange}
    />

    <input
      name="role"
      placeholder="Role"
      value={formData.role || ""}
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

    <div className={styles.form_buttons}>
      <button type="submit" className={styles.admin_button}>Save</button>
      <button
        type="button"
        onClick={onCancel}
        className={styles.admin_button}
      >
        Cancel
      </button>
    </div>
  </form>
);
  }

return (
  <div className={styles.admin_container}>
    <h2>Character Management</h2>

    <div className={styles.admin_list}>
      {characters.map((char) => (
        <div className={styles.admin_card} key={char.id}>
          <img src={char.image} alt="" className="thumb" />
          <div>{char.name}</div>
          <div>ID: {char.id}</div>
          <button
            onClick={() => handleEdit(char.id)}
            className={styles.admin_button}
          >
            Edit
          </button>
          <button
            onClick={() => handleDelete(char.id)}
            className={styles.admin_button}
          >
            Delete
          </button>
        </div>
      ))}
    </div>

    <button
      onClick={() => setEditingCharacter({})}
      className={styles.admin_button}
    >
      Add New Character
    </button>

    {editingCharacter && (
      <CharacterEditForm
        initialData={editingCharacter}
        onSaved={() => setEditingCharacter(null)}
        onCancel={() => setEditingCharacter(null)}
      />
    )}
  </div>
);

}
