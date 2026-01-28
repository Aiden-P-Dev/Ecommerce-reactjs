import React, { useState } from "react";
import "./ImageSearch.css";

function ImageSearchAndCopy() {
  const [searchTerm, setSearchTerm] = useState("");
  const [imageResults, setImageResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [copySuccess, setCopySuccess] = useState("");

  const GOOGLE_API_KEY = import.meta.env.VITE_GOOGLE_API_KEY;
  const GOOGLE_CSE_ID = import.meta.env.VITE_GOOGLE_CSE_ID;

  const searchImages = async (query) => {
    if (!GOOGLE_API_KEY || !GOOGLE_CSE_ID) {
      setError("Faltan las claves de la API de Google.");
      return;
    }

    setLoading(true);
    setError("");
    setCopySuccess("");
    setImageResults([]);

    try {
      const url = `https://www.googleapis.com/customsearch/v1?q=${encodeURIComponent(query)}&cx=${GOOGLE_CSE_ID}&key=${GOOGLE_API_KEY}&searchType=image&num=10`;

      const response = await fetch(url);
      if (!response.ok) throw new Error("Error en la API de Google.");

      const data = await response.json();

      if (data.items && data.items.length > 0) {
        const mappedResults = data.items.map((item) => ({
          content_url: item.link,
          description: item.title,
          visible: true,
        }));
        setImageResults(mappedResults);
      } else {
        setError("No se encontraron imágenes.");
      }
    } catch (err) {
      setError("Hubo un problema al buscar imágenes.");
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchTerm.trim()) searchImages(searchTerm.trim());
  };

  const handleImageError = (index) => {
    setImageResults((prevResults) => {
      const newResults = [...prevResults];
      newResults[index].visible = false;
      return newResults;
    });
  };

  const handleCopyClick = async (url) => {
    try {
      await navigator.clipboard.writeText(url);
      setCopySuccess("¡URL copiada!");
      setTimeout(() => setCopySuccess(""), 3000);
    } catch (err) {
      setCopySuccess("Error al copiar.");
    }
  };

  return (
    <div className="Image-search" id="Image-search">
      <div className="Image-container">
        <h2 className="title">Buscador de Imágenes</h2>

        <form className="form-search" onSubmit={handleSearch}>
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Escribe un Producto..."
            className="buscador"
          />
          <button type="submit" disabled={loading} className="boton-buscar">
            {loading ? "Buscando..." : "Buscar"}
          </button>
        </form>

        {error && <p className="message message-error">{error}</p>}
        {copySuccess && (
          <p className="message message-success">{copySuccess}</p>
        )}

        <div className="image-grid">
          {imageResults.map(
            (image, index) =>
              image.visible && (
                <div key={index} className="image-card">
                  <img
                    src={image.content_url}
                    alt={image.description}
                    className="image-thumbnail"
                    onError={() => handleImageError(index)}
                  />
                  <div className="image-info">
                    <p className="image-description">{image.description}</p>
                    <button
                      onClick={() => handleCopyClick(image.content_url)}
                      className="btn-copy-url"
                    >
                      Copiar URL
                    </button>
                  </div>
                </div>
              ),
          )}
        </div>
      </div>
    </div>
  );
}

export default ImageSearchAndCopy;
