import { useState } from "react";
import "./CardProductos.css";

interface Props {
    id: number;
    nombre: string;
    descripcion: string;
    precio: number;
    img: string;
    categoria: string;
    editarProducto: (id: number, producto: { nombre: string; descripcion: string; precio: number; img: string; categoria: string }) => void;
    eliminarProducto: (id: number) => void;
}

function CardProductos({ id, nombre, descripcion, precio, img, categoria, editarProducto, eliminarProducto }: Props) {
    const [editando, setEditando] = useState(false);
    const [form, setForm] = useState({ nombre, descripcion, precio: String(precio), img, categoria });

    const handleGuardar = () => {
        editarProducto(id, { ...form, precio: parseFloat(form.precio) });
        setEditando(false);
    };

    if (editando) {
        return (
            <div className="CardProductos">
                <div className="card-edit-form">
                    <input value={form.nombre} onChange={(e) => setForm({ ...form, nombre: e.target.value })} placeholder="Nombre" />
                    <input value={form.descripcion} onChange={(e) => setForm({ ...form, descripcion: e.target.value })} placeholder="Descripción" />
                    <input type="number" value={form.precio} onChange={(e) => setForm({ ...form, precio: e.target.value })} placeholder="Precio" />
                    <input value={form.img} onChange={(e) => setForm({ ...form, img: e.target.value })} placeholder="URL de la imagen" />
                    <input value={form.categoria} onChange={(e) => setForm({ ...form, categoria: e.target.value })} placeholder="Categoría" />
                </div>
                <div className="card-botones">
                    <button className="btn-guardar" onClick={handleGuardar}>Guardar</button>
                    <button className="btn-cancelar" onClick={() => setEditando(false)}>Cancelar</button>
                </div>
            </div>
        );
    }

    return (
        <div className="CardProductos">
            <img src={img} alt={nombre} />
            <span className="categoria-badge">{categoria}</span>
            <h2>{nombre}</h2>
            <p className="descripcion">{descripcion}</p>
            <p className="precio">${precio.toFixed(2)}</p>
            <div className="card-botones">
                <button className="btn-editar" onClick={() => setEditando(true)}>Editar</button>
                <button className="btn-eliminar" onClick={() => eliminarProducto(id)}>Eliminar</button>
            </div>
        </div>
    );
}

export default CardProductos
