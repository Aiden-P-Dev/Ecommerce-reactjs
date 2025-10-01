import React, { useState } from "react";

function ImageSearchAndCopy() {
  const [searchTerm, setSearchTerm] = useState("");
  const [imageResults, setImageResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [copySuccess, setCopySuccess] = useState("");

  const searchImages = async (query) => {
    setLoading(true);
    setError("");
    setCopySuccess("");
    setImageResults([]);

    try {
      const result = await image_retrieval.search({ query: query, count: 4 });

      if (result && result.results && result.results.length > 0) {
        setImageResults(result.results);
      } else {
        setError(
          "No se encontraron imágenes en la web para esa palabra clave."
        );
      }
    } catch (err) {
      console.error("Error al buscar imágenes en la web:", err);
      setError(
        "Hubo un problema al buscar imágenes. Por favor, verifica tu conexión o intenta con otra palabra."
      );
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchTerm.trim()) {
      searchImages(searchTerm.trim());
    } else {
      setError("Por favor, introduce una palabra clave para buscar.");
      setImageResults([]);
    }
  };

  const handleCopyClick = async (url) => {
    if (url) {
      try {
        await navigator.clipboard.writeText(url);
        setCopySuccess("¡URL copiada al portapapeles!");
        setTimeout(() => setCopySuccess(""), 3000);
      } catch (err) {
        console.error("Error al copiar al portapapeles:", err);
        setCopySuccess("Error al copiar. Por favor, copia manualmente.");
      }
    }
  };

  return (
    <div
      style={{
        padding: "20px",
        fontFamily: "Arial, sans-serif",
        maxWidth: "800px",
        margin: "0 auto",
        border: "1px solid #eee",
        borderRadius: "8px",
        boxShadow: "0 4px 8px rgba(0,0,0,0.05)",
      }}
    >
      <h2>Buscador de Imágenes en la Web</h2>

      <form
        onSubmit={handleSearch}
        style={{ marginBottom: "20px", display: "flex", gap: "10px" }}
      >
        <input
          type="text"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          placeholder="Escribe una palabra clave (ej: perro, playa, coche)"
          style={{
            flexGrow: 1,
            padding: "10px",
            borderRadius: "4px",
            border: "1px solid #ccc",
          }}
        />
        <button
          type="submit"
          disabled={loading}
          style={{
            padding: "10px 15px",
            backgroundColor: "#007bff",
            color: "white",
            border: "none",
            borderRadius: "4px",
            cursor: "pointer",
            opacity: loading ? 0.7 : 1,
          }}
        >
          {loading ? "Buscando..." : "Buscar Imágenes"}
        </button>
      </form>

      {error && <p style={{ color: "red", marginBottom: "15px" }}>{error}</p>}
      {copySuccess && (
        <p style={{ color: "green", marginBottom: "15px" }}>{copySuccess}</p>
      )}

      {loading && <p style={{ textAlign: "center" }}>Buscando imágenes...</p>}

      {imageResults.length > 0 && (
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
            gap: "20px",
          }}
        >
          {imageResults.map((image, index) => (
            <div
              key={image.content_url || index}
              style={{
                border: "1px solid #ddd",
                borderRadius: "8px",
                overflow: "hidden",
                boxShadow: "0 2px 4px rgba(0,0,0,0.1)",
                display: "flex",
                flexDirection: "column",
              }}
            >
              <img
                src={image.content_url}
                alt={image.description || `Imagen ${index + 1}`}
                style={{
                  width: "100%",
                  height: "180px",
                  objectFit: "cover",
                  display: "block",
                }}
              />
              <div
                style={{
                  padding: "10px",
                  flexGrow: 1,
                  display: "flex",
                  flexDirection: "column",
                  justifyContent: "space-between",
                }}
              >
                <p
                  style={{
                    fontSize: "0.9em",
                    color: "#555",
                    margin: "0 0 10px 0",
                    maxHeight: "60px",
                    overflow: "hidden",
                    textOverflow: "ellipsis",
                  }}
                >
                  {image.description || "Sin descripción"}
                </p>
                <button
                  onClick={() => handleCopyClick(image.content_url)}
                  style={{
                    padding: "8px 12px",
                    backgroundColor: "#28a745",
                    color: "white",
                    border: "none",
                    borderRadius: "4px",
                    cursor: "pointer",
                    alignSelf: "flex-start",
                  }}
                >
                  Copiar URL
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default ImageSearchAndCopy;
