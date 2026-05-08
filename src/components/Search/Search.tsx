import "./Search.css";

interface Props {
    busqueda: string;
    onBusqueda: (valor: string) => void;
    categorias: string[];
    categoriaActiva: string;
    onCategoria: (categoria: string) => void;
}

function Search({ busqueda, onBusqueda, categorias, categoriaActiva, onCategoria }: Props) {
    return (
        <div className="search-bar">
            <input
                type="text"
                placeholder="Buscar producto..."
                value={busqueda}
                onChange={(e) => onBusqueda(e.target.value)}
                className="search-bar__input"
            />
            <div className="search-bar__categorias">
                <button
                    className={`search-bar__cat-btn ${categoriaActiva === "" ? "activo" : ""}`}
                    onClick={() => onCategoria("")}
                >
                    Todos
                </button>
                {categorias.map((cat) => (
                    <button
                        key={cat}
                        className={`search-bar__cat-btn ${categoriaActiva === cat ? "activo" : ""}`}
                        onClick={() => onCategoria(cat)}
                    >
                        {cat}
                    </button>
                ))}
            </div>
        </div>
    );
}

export default Search;
