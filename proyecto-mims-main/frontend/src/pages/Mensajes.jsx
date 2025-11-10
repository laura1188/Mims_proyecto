// src/pages/Mensajes.jsx
import React, { useEffect, useState } from "react";
import api from "../services/api";
import Modal from "../components/Modal";

export default function Mensajes() {
  const [msgs, setMsgs] = useState([]);
  const [open, setOpen] = useState(false);
  const [selected, setSelected] = useState(null);

  useEffect(() => { fetchMsgs(); }, []);

  const fetchMsgs = async () => {
    try {
      const res = await api.get("/mensajes/"); // ajusta si tu endpoint es otro
      setMsgs(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  const view = (m) => { setSelected(m); setOpen(true); };

  return (
    <div>
      <header className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold">Mensajes</h2>
        <button onClick={fetchMsgs} className="px-4 py-2 bg-slate-100 rounded">Refrescar</button>
      </header>

      <div className="bg-white rounded-lg p-4 shadow">
        {msgs.length === 0 ? <p>No hay mensajes</p> :
          msgs.map(m => (
            <div key={m.id} className="border-b py-3 flex justify-between items-center">
              <div>
                <p className="font-semibold">{m.asunto}</p>
                <p className="text-sm text-slate-500">{m.email}</p>
              </div>
              <div>
                <button onClick={() => view(m)} className="px-3 py-1 bg-blue-600 text-white rounded">Ver</button>
              </div>
            </div>
          ))
        }
      </div>

      <Modal open={open} title={selected?.asunto || "Mensaje"} onClose={() => setOpen(false)}>
        <div>
          <p><strong>De:</strong> {selected?.email}</p>
          <p className="mt-2">{selected?.mensaje}</p>
        </div>
      </Modal>
    </div>
  );
}
