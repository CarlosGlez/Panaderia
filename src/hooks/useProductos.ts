import { supabase } from "../utils/supabase";
import { useState, useEffect } from "react";

interface Producto {
    nombre: string;
    descripcion: string;
    precio: number;
    img: string;
    categoria: string;
}

interface ProductoConId extends Producto {
    id: number;
}

function useProductos() {
    const [productos, setProductos] = useState<ProductoConId[]>([]);

    const traerProductos = async () => {
        const { data, error } = await supabase.from("productos").select("*");
        if (error) {
            console.error("Error al traer productos:", error);
        } else {
            setProductos(data);
        }
    }

    const insertarProducto = async (producto: Producto) => {
        const { error } = await supabase.from("productos").insert(producto);
        if (error) {
            console.error("Error al insertar producto:", error);
        } else {
            traerProductos();
        }
    };

    const editarProducto = async (id: number, producto: Producto) => {
        const { data, error } = await supabase.from("productos").update(producto).eq("id", id).select();
        if (error) {
            console.error("Error al editar producto:", error);
        } else if (!data || data.length === 0) {
            console.warn("El update no afectó ninguna fila. Verifica las políticas RLS en Supabase (tabla productos, operación UPDATE).");
        } else {
            traerProductos();
        }
    };

    const eliminarProducto = async (id: number) => {
        const { error } = await supabase.from("productos").delete().eq("id", id);
        if (error) {
            console.error("Error al eliminar producto:", error);
        } else {
            traerProductos();
        }
    };

    useEffect(() => {
        traerProductos();
    }, []);

    const subirImagen = async (archivo: File): Promise<string | null> => {
        const extension = archivo.name.split('.').pop();
        const nombreArchivo = `${Date.now()}.${extension}`;
        const { data, error } = await supabase.storage.from('productos').upload(nombreArchivo, archivo);
        if (error) {
            console.error('Error al subir imagen:', error);
            return null;
        }
        const { data: urlData } = supabase.storage.from('productos').getPublicUrl(data.path);
        return urlData.publicUrl;
    };

    return { productos, traerProductos, insertarProducto, editarProducto, eliminarProducto, subirImagen };
}

export default useProductos;
