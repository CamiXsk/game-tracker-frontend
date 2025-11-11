import React, { useState } from 'react';

// Estado inicial para limpiar el formulario después de enviar
const INITIAL_STATE = {
    juegoId: '', // ID del juego seleccionado, MANDATORIO
    puntuacion: 5, // Puntuación de 1 a 5
    textoReseña: '',
    horasJugadas: 0,
    dificultad: 'Media', // 'Baja', 'Media', 'Alta'
    recomendaria: true, // Si o No
};

// Recibe 'juegos' (lista de App.jsx) y 'onReseñaAgregada' (función de ListaReseñas.jsx)
function FormularioReseña({ juegos, onReseñaAgregada }) {
    const [formData, setFormData] = useState(INITIAL_STATE);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [error, setError] = useState(null);

    // Maneja los cambios de todos los inputs (texto, números, select)
    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;
        setFormData(prevData => ({
            ...prevData,
            // Si es checkbox usa 'checked', si no, usa 'value'
            [name]: type === 'checkbox' ? checked : value,
        }));
    };

    // Maneja el envío del formulario
    const handleSubmit = async (e) => {
        e.preventDefault();
        setError(null);

        // Validación básica: Debe seleccionar un juego
        if (!formData.juegoId) {
            setError("Por favor, selecciona un juego para reseñar.");
            return;
        }

        setIsSubmitting(true);
        
        // Convertir horas y puntuación a números antes de enviar
        const reseñaParaEnviar = {
            ...formData,
            horasJugadas: Number(formData.horasJugadas),
            puntuacion: Number(formData.puntuacion),
        };

        try {
            // RUTA DE API para POST de reseñas
            const response = await fetch('http://localhost:5000/api/reseñas', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(reseñaParaEnviar),
            });

            const data = await response.json();

            if (!response.ok) {
                // Si el backend devuelve un error (ej. 400 Bad Request)
                throw new Error(data.message || 'Error al guardar la reseña en el servidor.');
            }

            // Éxito:
            // Llama a la función de ListaReseñas para actualizar la lista de reseñas
            onReseñaAgregada(data); 
            setFormData(INITIAL_STATE); // Limpia el formulario

        } catch (err) {
            console.error("Error al enviar reseña:", err);
            setError(`Error al enviar: ${err.message}. Asegúrate que el backend está corriendo.`);
        } finally {
            setIsSubmitting(false);
        }
    };

    const styles = {
        formContainer: { // Renombrado a camelCase
            display: 'flex',
            flexDirection: 'column',
            gap: '15px',
            padding: '20px',
            backgroundColor: '#2b2b2b',
            borderRadius: '8px',
            marginBottom: '20px',
        },
        inputField: { // Renombrado a camelCase para evitar conflictos
            padding: '10px',
            borderRadius: '4px',
            border: '1px solid #444',
            backgroundColor: '#333',
            color: '#e0e0e0',
        },
        labelText: { // Renombrado a camelCase
            display: 'flex',
            flexDirection: 'column',
            gap: '5px',
            fontSize: '14px',
            color: '#bbb',
        },
        submitButton: {
            padding: '10px 15px',
            borderRadius: '4px',
            backgroundColor: isSubmitting ? '#0077b6' : '#00b4d8',
            color: 'white',
            border: 'none',
            cursor: isSubmitting ? 'not-allowed' : 'pointer',
            fontWeight: 'bold',
            marginTop: '10px',
            transition: 'background-color 0.2s',
        },
        errorBox: { // Renombrado a camelCase
            color: '#ff6b6b',
            backgroundColor: '#401f1f',
            padding: '10px',
            borderRadius: '4px',
        },
        checkboxContainer: {
            display: 'flex',
            alignItems: 'center',
            gap: '10px',
        }
    };

    return (
        <form onSubmit={handleSubmit} style={styles.formContainer}>
            {error && <p style={styles.errorBox}>{error}</p>}

            {/* Campo 1: Selección de Juego (el más importante) */}
            <label style={styles.labelText}>
                Juego a reseñar (Obligatorio):
                <select
                    name="juegoId"
                    value={formData.juegoId}
                    onChange={handleChange}
                    style={styles.inputField}
                    required
                >
                    <option value="">-- Selecciona un juego --</option>
                    {/* ESTE ES EL CAMBIO CLAVE: Usa juego.name en lugar de juego.titulo */}
                    {juegos && juegos.map(juego => (
                        <option key={juego._id} value={juego._id}>
                            {juego.name} 
                        </option>
                    ))}
                </select>
                {/* Muestra mensaje si no hay juegos para seleccionar */}
                {juegos && juegos.length === 0 && (
                    <small style={{ color: '#ffcc00' }}>
                        No hay juegos disponibles. ¡Añade uno primero!
                    </small>
                )}
            </label>

            {/* Campo 2: Puntuación */}
            <label style={styles.labelText}>
                Puntuación (1-5):
                <input
                    type="number"
                    name="puntuacion"
                    value={formData.puntuacion}
                    onChange={handleChange}
                    style={styles.inputField}
                    min="1"
                    max="5"
                    required
                />
            </label>

            {/* Campo 3: Texto de la reseña */}
            <label style={styles.labelText}>
                Tu Reseña:
                <textarea
                    name="textoReseña"
                    value={formData.textoReseña}
                    onChange={handleChange}
                    style={{ ...styles.inputField, minHeight: '80px' }}
                    placeholder="Escribe tu opinión sobre el juego..."
                    required
                />
            </label>

            {/* Campo 4: Horas Jugadas */}
            <label style={styles.labelText}>
                Horas Jugadas:
                <input
                    type="number"
                    name="horasJugadas"
                    value={formData.horasJugadas}
                    onChange={handleChange}
                    style={styles.inputField}
                    min="0"
                    required
                />
            </label>

            {/* Campo 5: Dificultad */}
            <label style={styles.labelText}>
                Nivel de Dificultad:
                <select
                    name="dificultad"
                    value={formData.dificultad}
                    onChange={handleChange}
                    style={styles.inputField}
                >
                    <option value="Baja">Baja</option>
                    <option value="Media">Media</option>
                    <option value="Alta">Alta</option>
                </select>
            </label>

            {/* Campo 6: ¿Lo recomendarías? (Checkbox) */}
            <div style={styles.checkboxContainer}>
                <label style={{...styles.labelText, flexDirection: 'row', alignItems: 'center'}}>
                    <input
                        type="checkbox"
                        name="recomendaria"
                        checked={formData.recomendaria}
                        onChange={handleChange}
                        style={{ width: 'auto' }}
                    />
                    ¿Recomendarías este juego?
                </label>
            </div>

            <button type="submit" style={styles.submitButton} disabled={isSubmitting}>
                {isSubmitting ? 'Enviando...' : 'Guardar Reseña'}
            </button>
        </form>
    );
}

export default FormularioReseña;