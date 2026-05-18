import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useSite } from "../../context/SiteContext";

export default function TeamAdmin() {
  const { team, updateTeamMember, addTeamMember, removeTeamMember, updateGroupPhoto } = useSite();
  const [editingMember, setEditingMember] = useState(null);
  const [groupPhotoTemp, setGroupPhotoTemp] = useState(team.groupPhoto);

  const handleImageUpload = (e, callback) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        callback(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleGroupPhotoSave = () => {
    updateGroupPhoto(groupPhotoTemp);
  };

  const handleEdit = (member) => {
    setEditingMember({ ...member });
  };

  const handleSaveMember = (e) => {
    e.preventDefault();
    if (editingMember.id && team.members.find(m => m.id === editingMember.id)) {
      updateTeamMember(editingMember.id, editingMember);
    } else {
      addTeamMember(editingMember);
    }
    setEditingMember(null);
  };

  return (
    <div>
      <div style={{ marginBottom: "var(--space-2xl)", backgroundColor: "#111111", padding: "var(--space-md)", borderRadius: "var(--radius-md)", border: "1px solid #222" }}>
        <h3 style={{ fontSize: "var(--type-h3)", fontFamily: "var(--font-display)", color: "var(--color-volt)", marginBottom: "var(--space-sm)" }}>Foto Grupal</h3>
        <div style={{ display: "flex", gap: "var(--space-sm)", alignItems: "center" }}>
          <input 
            type="text" 
            className="admin-input" 
            value={groupPhotoTemp} 
            onChange={e => setGroupPhotoTemp(e.target.value)} 
            placeholder="URL o sube una imagen..." 
            style={{ flex: 1 }} 
          />
          <input 
            type="file" 
            accept="image/*" 
            onChange={e => handleImageUpload(e, setGroupPhotoTemp)}
            style={{ display: 'none' }}
            id="group-photo-upload"
          />
          <label htmlFor="group-photo-upload" className="btn btn--secondary btn--sm" style={{ color: "#F5F5F5", borderColor: "#555", cursor: "pointer", margin: 0 }}>
            Subir Imagen
          </label>
          <button className="btn btn--secondary btn--sm" onClick={handleGroupPhotoSave} style={{ color: "#F5F5F5", borderColor: "#555" }}>Actualizar Foto</button>
        </div>
        {team.groupPhoto && (
          <img src={team.groupPhoto} alt="Group" style={{ marginTop: "var(--space-md)", width: "100%", maxWidth: "300px", borderRadius: "var(--radius-sm)", border: "1px solid #333" }} />
        )}
      </div>

      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "var(--space-md)" }}>
        <h3 style={{ fontSize: "var(--type-h3)", fontFamily: "var(--font-display)", color: "#F5F5F5" }}>Miembros del Equipo</h3>
        {!editingMember && (
          <button className="btn btn--volt btn--sm" onClick={() => setEditingMember({ name: "", email: "", initials: "", photo: "" })}>+ Añadir Miembro</button>
        )}
      </div>

      <AnimatePresence mode="wait">
        {editingMember && (
          <motion.form 
            initial={{ opacity: 0, y: -10 }} 
            animate={{ opacity: 1, y: 0 }} 
            exit={{ opacity: 0, height: 0 }} 
            onSubmit={handleSaveMember}
            style={{ display: "grid", gap: "var(--space-md)", backgroundColor: "#0D0D0D", padding: "var(--space-xl)", border: "1px solid #222", borderRadius: "var(--radius-md)", marginBottom: "var(--space-xl)" }}
          >
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "var(--space-md)" }}>
              <div>
                <label className="admin-label">Nombre</label>
                <input required className="admin-input" type="text" value={editingMember.name} onChange={e => setEditingMember({...editingMember, name: e.target.value})} />
              </div>
              <div>
                <label className="admin-label">Email</label>
                <input required className="admin-input" type="email" value={editingMember.email} onChange={e => setEditingMember({...editingMember, email: e.target.value})} />
              </div>
              <div>
                <label className="admin-label">Iniciales</label>
                <input required className="admin-input" type="text" value={editingMember.initials} onChange={e => setEditingMember({...editingMember, initials: e.target.value})} maxLength={2} />
              </div>
              <div>
                <label className="admin-label">URL Foto / Subir Imagen</label>
                <div style={{ display: "flex", gap: "var(--space-xs)" }}>
                  <input className="admin-input" type="text" value={editingMember.photo} onChange={e => setEditingMember({...editingMember, photo: e.target.value})} style={{ flex: 1 }} />
                  <input 
                    type="file" 
                    accept="image/*" 
                    onChange={e => handleImageUpload(e, (base64) => setEditingMember({...editingMember, photo: base64}))}
                    style={{ display: 'none' }}
                    id="member-photo-upload"
                  />
                  <label htmlFor="member-photo-upload" className="btn btn--secondary btn--sm" style={{ color: "#A0A0A0", borderColor: "#333", cursor: "pointer", display: "flex", alignItems: "center", padding: "0 8px", margin: 0 }}>
                    Subir
                  </label>
                </div>
              </div>
            </div>
            <div style={{ display: "flex", justifyContent: "flex-end", gap: "var(--space-sm)", marginTop: "var(--space-sm)" }}>
              <button type="button" className="btn btn--secondary btn--sm" onClick={() => setEditingMember(null)} style={{ color: "#A0A0A0", borderColor: "#333" }}>Cancelar</button>
              <button type="submit" className="btn btn--volt btn--sm">Guardar</button>
            </div>
          </motion.form>
        )}
      </AnimatePresence>

      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(250px, 1fr))", gap: "var(--space-md)" }}>
        {team.members.map(m => (
          <div key={m.id} style={{ backgroundColor: "#111111", padding: "var(--space-md)", borderRadius: "var(--radius-md)", border: "1px solid #222", display: "flex", flexDirection: "column", gap: "var(--space-sm)" }}>
            <div style={{ display: "flex", alignItems: "center", gap: "var(--space-sm)" }}>
              {m.photo ? (
                <img src={m.photo} alt={m.name} style={{ width: "48px", height: "48px", borderRadius: "50%", objectFit: "cover", objectPosition: m.objectPosition || "center center", backgroundColor: "#333" }} />
              ) : (
                <div style={{ width: "48px", height: "48px", borderRadius: "50%", backgroundColor: "var(--color-volt)", color: "#111", display: "flex", alignItems: "center", justifyContent: "center", fontWeight: "bold" }}>{m.initials}</div>
              )}
              <div>
                <div style={{ fontWeight: "bold", color: "#F5F5F5", fontSize: "var(--type-body-sm)" }}>{m.name}</div>
                <div style={{ fontSize: "var(--type-caption)", color: "#A0A0A0" }}>{m.email}</div>
              </div>
            </div>
            <div style={{ display: "flex", justifyContent: "space-between", marginTop: "auto", paddingTop: "var(--space-sm)", borderTop: "1px solid #222" }}>
              <button className="btn btn--secondary btn--sm" onClick={() => handleEdit(m)} style={{ padding: "4px 8px", fontSize: "var(--type-micro)" }}>Editar</button>
              <button className="btn btn--danger btn--sm" onClick={() => removeTeamMember(m.id)} style={{ padding: "4px 8px", fontSize: "var(--type-micro)" }}>Eliminar</button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
