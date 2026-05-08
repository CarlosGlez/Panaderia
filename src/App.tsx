import { useState, useMemo } from 'react'
import { useProductos } from './hooks'
import { CardProductos, Formulario, Search } from './components'
import './App.css'

function App() {
  const { productos, insertarProducto, editarProducto, eliminarProducto, subirImagen } = useProductos();
  const [busqueda, setBusqueda] = useState("");
  const [categoriaActiva, setCategoriaActiva] = useState("");

  const categorias = useMemo(() =>
    [...new Set(productos.map((p) => p.categoria))].filter(Boolean),
    [productos]
  );

  const productosFiltrados = useMemo(() =>
    productos.filter((p) => {
      const coincideNombre = p.nombre.toLowerCase().includes(busqueda.toLowerCase());
      const coincideCategoria = categoriaActiva === "" || p.categoria === categoriaActiva;
      return coincideNombre && coincideCategoria;
    }),
    [productos, busqueda, categoriaActiva]
  );

  const precioPromedio = useMemo(() => {
    if (productos.length === 0) return 0;
    return productos.reduce((acc, p) => acc + p.precio, 0) / productos.length;
  }, [productos]);

  return (
    <div className="app">
      <header className="app-header">
        <p className="app-header__tagline">— Papá, papá, ¿para qué quiere Jack Sparrow 100 kilos de harina?</p>
        <h1 className="app-header__title">Para pan, pan, para pan, pan, para pan</h1>
        <p className="app-header__sub">Pan artesanal • Pasteles • Galletas</p>
      </header>

      <main className="app-main">
        <section className="seccion-formulario">
          <h2 className="seccion-titulo">Agregar Producto</h2>
          <Formulario insertarProducto={insertarProducto} subirImagen={subirImagen} />
        </section>

        <section className="seccion-catalogo">
          <div className="catalogo-header">
            <h2 className="seccion-titulo">Nuestro Catálogo</h2>
            <div className="stats">
              <div className="stats__item">
                <span className="stats__valor">{productos.length}</span>
                <span className="stats__label">Productos</span>
              </div>
              <div className="stats__divider" />
              <div className="stats__item">
                <span className="stats__valor">${precioPromedio.toFixed(2)}</span>
                <span className="stats__label">Precio promedio</span>
              </div>
            </div>
          </div>

          <Search
            busqueda={busqueda}
            onBusqueda={setBusqueda}
            categorias={categorias}
            categoriaActiva={categoriaActiva}
            onCategoria={setCategoriaActiva}
          />

          {productosFiltrados.length === 0 ? (
            <p className="sin-resultados">No se encontraron productos.</p>
          ) : (
            <div className="lista-productos">
              {productosFiltrados.map((producto) => (
                <CardProductos
                  key={producto.id}
                  id={producto.id}
                  nombre={producto.nombre}
                  descripcion={producto.descripcion}
                  precio={producto.precio}
                  img={producto.img}
                  categoria={producto.categoria}
                  editarProducto={editarProducto}
                  eliminarProducto={eliminarProducto}
                />
              ))}
            </div>
          )}
        </section>
      </main>

      <footer className="app-footer">
        <p>© 2025 La Panadería · Tradición familiar</p>
      </footer>
    </div>
  )
}

export default App
