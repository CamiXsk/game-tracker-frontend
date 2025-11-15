import React, { useEffect, useState } from "react";
//importa rutas 
import ListaReseñas from "./components/ListaReseñas/";
import FormularioReseña from "./components/FormularioReseña/";
import TarjetaJuego from "./components/TarjetaJuego/";

function App() {
  //guardamos los datos que vienen del backend 
  const [juegos, setJuegos] = useState([]);
  const [reseñas, setReseñas] = useState([]); 
  const [nuevoJuego, setNuevoJuego] = useState({
    // Usamos las variables del formulario en español 
    titulo: "", 
    plataforma: "",
    horasJugadas: "",
    imagenPortada: "",
  });

  // Función para cargar los juegos 
  const fetchJuegos = () => {
    // Hacemos la petición a la URL del backend
    fetch("http://localhost:5000/api/juegos")
      .then((res) => {
        //revisa la respuesta
        if (!res.ok) {
          throw new Error('La respuesta de la red no fue correcta.');
        }
        return res.json(); //Convierte la respuesta en formato JSON
      })
      .then((data) => {
        console.log("✅ Datos recibidos del backend (Juegos):", data);
        setJuegos(data);
      })
      .catch((err) => console.error("❌ Error al cargar juegos:", err));
  };
  
  // Función para cargar las reseñas (igual que el fecth anterior)
  const fetchReseñas = () => {
    fetch("http://localhost:5000/api/reseñas")
      .then((res) => {
        if (!res.ok) {
          throw new Error('La respuesta de la red no fue correcta.');
        }
        return res.json();
      })
      .then((data) => {
        console.log("✅ Datos recibidos del backend (Reseñas):", data);
        setReseñas(data);
      })
      .catch((err) => console.error("❌ Error al cargar reseñas:", err));
  };


  // Cargar juegos y reseñas al montar el componente
  useEffect(() => {
    fetchJuegos();
    fetchReseñas(); // Se cargan las reseñas al inicio
  }, []);

  // ✅ Agregar juego
  const agregarJuego = (e) => {
    e.preventDefault();

    // Mapeamos las claves del formulario (en español) a las claves que el backend (GameModel) espera (en inglés)
    const juegoParaEnviar = {
      name: nuevoJuego.titulo, 
      platform: nuevoJuego.plataforma, 
      hoursPlayed: Number(nuevoJuego.horasJugadas),
      imageUrl: nuevoJuego.imagenPortada 
    };
    
    fetch("http://localhost:5000/api/juegos", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(juegoParaEnviar),
    })
      .then((res) => {
        if (!res.ok) {
          return res.json().then(errorData => {
            console.error("❌ Error del servidor al guardar:", errorData);
            throw new Error(`Fallo al guardar juego: ${errorData.message}`);
          });
        }
        return res.json();
      })
      .then((data) => {
        // Añadir el nuevo juego al estado
        setJuegos((prevJuegos) => [...prevJuegos, data]); 
        
        // Resetear el formulario
        setNuevoJuego({ titulo: "", plataforma: "", horasJugadas: "", imagenPortada: "" });
        console.log("🎉 Juego agregado con éxito:", data);
      })
      .catch((err) => console.error("❌ Error al agregar juego:", err));
      
  };

  // Función para agregar una reseña (se pasa a FormularioReseña)
  const agregarReseña = (nuevaReseña) => {
      setReseñas(prevReseñas => [...prevReseñas, nuevaReseña]);
  };
  
  // ✅ Eliminar juego
  const eliminarJuego = (id) => {
    fetch(`http://localhost:5000/api/juegos/${id}`, { method: "DELETE" })
      .then(() => setJuegos(juegos.filter((j) => j._id !== id)))
      .catch((err) => console.error("Error al eliminar juego:", err));
  };

  return (
    <div style={styles.container}>
      <h1 style={styles.titulo}>🎮 Lista de Juegos</h1>

      <form onSubmit={agregarJuego} style={styles.formulario}>
        <h2>Agregar nuevo juego</h2>

        <input
          type="text"
          placeholder="Nombre del juego"
          value={nuevoJuego.titulo}
          onChange={(e) =>
            setNuevoJuego({ ...nuevoJuego, titulo: e.target.value })
          }
          required
        />

        <input
          type="text"
          placeholder="Plataforma"
          value={nuevoJuego.plataforma}
          onChange={(e) =>
            setNuevoJuego({ ...nuevoJuego, plataforma: e.target.value })
          }
          required
        />

        <input
          type="number"
          placeholder="Horas jugadas"
          value={nuevoJuego.horasJugadas}
          onChange={(e) =>
            setNuevoJuego({ ...nuevoJuego, horasJugadas: e.target.value })
          }
          required
        />

        <input
          type="text"
          placeholder="URL de la imagen"
          value={nuevoJuego.imagenPortada}
          onChange={(e) =>
            setNuevoJuego({ ...nuevoJuego, imagenPortada: e.target.value })
          }
        />

        <button type="submit">Agregar</button>
      </form>

      <div style={styles.grid}>
        {juegos.length > 0 ? (
          juegos.map((juego) => (
            <TarjetaJuego
              key={juego._id}
              juego={juego}
              onDelete={eliminarJuego}
            />
          ))
        ) : (
          <p>No hay juegos registrados aún 😢</p>
        )}
      </div>

      <div style={{ marginTop: "40px" }}>
        <h2>📝 Reseñas</h2>
        {/* Pasamos la lista de juegos y la función para agregar reseñas al FormularioReseña */}
        <FormularioReseña juegos={juegos} onReseñaAgregada={agregarReseña} /> 
        {/* Pasamos la lista de reseñas y juegos a ListaReseñas */}
        <ListaReseñas reseñas={reseñas} juegos={juegos} />
      </div>
    </div>
  );
}

// Estilos
const styles = {
  container: {
    padding: "20px",
    backgroundColor: "#0d0d0d",
    minHeight: "100vh",
    color: "#fff",
  },
  titulo: {
    color: "#00b4d8",
  },
  formulario: {
    display: "flex",
    flexDirection: "column",
    width: "300px",
    marginBottom: "20px",
    gap: "10px",
  },
  grid: {
    display: "flex",
    flexWrap: "wrap",
    gap: "15px",
  },
};

export default App;