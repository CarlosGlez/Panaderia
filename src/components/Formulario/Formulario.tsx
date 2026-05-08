import "./Formulario.css"
import { useState, useRef } from "react"

interface Props {
    insertarProducto: (producto: { nombre: string; descripcion: string; precio: number; img: string; categoria: string }) => void;
    subirImagen: (archivo: File) => Promise<string | null>;
}

function Formulario({ insertarProducto, subirImagen }: Props) {
    const [nombre, setNombre] = useState("");
    const [descripcion, setDescripcion] = useState("");
    const [precio, setPrecio] = useState("");
    const [categoria, setCategoria] = useState("");
    const [archivo, setArchivo] = useState<File | null>(null);
    const [previstaUrl, setPrevistaUrl] = useState<string>("");
    const [subiendo, setSubiendo] = useState(false);
    const [error, setError] = useState<string>("");
    const inputFileRef = useRef<HTMLInputElement>(null);

    const handleArchivo = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;
        setArchivo(file);
        setPrevistaUrl(URL.createObjectURL(file));
    };

    const manejarSubmit = async (e: React.SyntheticEvent) => {
        e.preventDefault();
        setError("");
        if (!archivo) {
            setError("Selecciona una imagen antes de continuar.");
            return;
        }

        setSubiendo(true);
        const urlImagen = await subirImagen(archivo);
        if (!urlImagen) {
            setError("No se pudo subir la imagen. Verifica las políticas del bucket en Supabase Storage.");
            setSubiendo(false);
            return;
        }

        insertarProducto({ nombre, descripcion, precio: parseFloat(precio), img: urlImagen, categoria });

        setNombre("");
        setDescripcion("");
        setPrecio("");
        setCategoria("");
        setArchivo(null);
        setPrevistaUrl("");
        setSubiendo(false);
        if (inputFileRef.current) inputFileRef.current.value = "";
    };

    return (
        <form onSubmit={manejarSubmit} className="formulario">
            <input type="text" placeholder="Nombre" value={nombre} onChange={(e) => setNombre(e.target.value)} required />
            <input type="text" placeholder="Descripción" value={descripcion} onChange={(e) => setDescripcion(e.target.value)} required />
            <input type="number" placeholder="Precio" value={precio} onChange={(e) => setPrecio(e.target.value)} required />
            <input type="text" placeholder="Categoría" value={categoria} onChange={(e) => setCategoria(e.target.value)} required />

            <label className="formulario__file-label">
                {previstaUrl
                    ? <img src={previstaUrl} alt="Vista previa" className="formulario__preview" />
                    : <span>📷 Seleccionar imagen</span>
                }
                <input
                    ref={inputFileRef}
                    type="file"
                    accept="image/*"
                    onChange={handleArchivo}
                    required
                    className="formulario__file-input"
                />
            </label>

            {error && <p className="formulario__error">{error}</p>}

            <button type="submit" disabled={subiendo}>
                {subiendo ? "Subiendo..." : "Agregar Producto"}
            </button>
        </form>
    );
}

export default Formulario
