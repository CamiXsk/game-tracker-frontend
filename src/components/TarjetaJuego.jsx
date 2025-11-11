function TarjetaJuego({ juego, onDelete }) {
  return (
    <div
      style={{
        background: "#1a1a1a",
        padding: "15px",
        borderRadius: "10px",
        width: "200px",
        color: "white",
      }}
    >
      <img
  src={juego.image || "https://via.placeholder.com/200x120?text=Juego"}
  alt={juego.name}
  style={{ width: "100%", borderRadius: "8px" }}
/>


      <h3>{juego.name}</h3>
      <p>🎮 Plataforma: {juego.platform}</p>
      <p>⏱ Horas Jugadas: {juego.hoursPlayed}</p>

      <button
        onClick={() => onDelete(juego._id)}
        style={{
          marginTop: "10px",
          background: "#ff4d4d",
          border: "none",
          padding: "8px",
          width: "100%",
          borderRadius: "5px",
          cursor: "pointer",
        }}
      >
        Eliminar
      </button>
    </div>
  );
}

export default TarjetaJuego;
