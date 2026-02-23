import React from "react";
import { Document, Page, View, Text, StyleSheet } from "@react-pdf/renderer";

const styles = StyleSheet.create({
  pagina: { padding: 30, backgroundColor: "#fff", fontFamily: "Helvetica" },
  header: {
    backgroundColor: "#ffcc03",
    borderRadius: 15,
    padding: 15,
    textAlign: "center",
    marginBottom: 15,
  },
  tituloBanner: {
    backgroundColor: "#000",
    color: "#fff",
    fontSize: 22,
    padding: 10,
    borderRadius: 50,
    marginBottom: 5,
    textAlign: "center",
  },
  resumenGris: {
    flexDirection: "row",
    justifyContent: "space-between",
    backgroundColor: "#f2f2f2",
    padding: 12,
    borderRadius: 10,
    border: "1px solid #ddd",
    marginBottom: 20,
  },
  productoRow: {
    flexDirection: "row",
    paddingVertical: 10,
    borderBottom: "1px solid #eee",
    alignItems: "center",
  },
  colInfo: { flex: 1 },
  colPrecio: { alignItems: "flex-end", minWidth: 120 },
  textoPrincipal: { fontSize: 11, fontWeight: "bold" },
  textoSecundario: { fontSize: 9, color: "#444" },
  tipoTexto: {
    fontSize: 8,
    color: "#18a560",
    marginTop: 2,
    fontWeight: "bold",
  },
  totalDolar: { fontSize: 18, color: "#18a560", fontWeight: "bold" },
  totalBs: { fontSize: 14, fontWeight: "bold" },
  // Contenedor para forzar espacios
  usuarioContenedor: {
    flexDirection: "row",
    flexWrap: "wrap",
    marginTop: 2,
  },
  usuarioInfo: {
    fontSize: 11,
    color: "#000",
    fontWeight: "bold",
    marginRight: 4, // Espacio físico real entre palabras
  },
});

const Pdf = ({ cart = [], tasaDolar = 0, userName = "Cliente" }) => {
  const shortCode = Math.floor(1000 + Math.random() * 9000);
  const totalDolar = cart.reduce(
    (acc, item) => acc + item.price * item.quantity,
    0,
  );
  const totalBs = (totalDolar * tasaDolar).toLocaleString("de-DE", {
    minimumFractionDigits: 2,
  });
  const fecha = new Date().toLocaleString();

  // Función de limpieza profunda
  const getWords = (text) => {
    if (!text) return ["Cliente"];
    let n = text.includes("@") ? text.split("@")[0] : text;
    // Separar por puntos, guiones y CamelCase, luego limpiar
    n = n.replace(/([a-z])([A-Z])/g, "$1 $2").replace(/[._-]/g, " ");
    return n
      .trim()
      .split(/\s+/)
      .map((w) => w.charAt(0).toUpperCase() + w.slice(1).toLowerCase());
  };

  const palabrasNombre = getWords(userName);

  return (
    <Document title={`Pedido_${shortCode}`}>
      <Page size="A4" style={styles.pagina}>
        <View style={styles.header}>
          <Text style={styles.tituloBanner}>El Caribeño</Text>
          <Text style={{ fontSize: 12 }}>Pedido #{shortCode}</Text>
          <Text style={{ fontSize: 8 }}>Generado: {fecha}</Text>
        </View>

        <View style={{ marginBottom: 15, paddingLeft: 5 }}>
          <Text style={{ fontSize: 9, color: "#777" }}>VENDEDOR:</Text>
          {/* RENDERIZADO PALABRA POR PALABRA PARA FORZAR ESPACIOS */}
          <View style={styles.usuarioContenedor}>
            {palabrasNombre.map((palabra, index) => (
              <Text key={index} style={styles.usuarioInfo}>
                {palabra}
              </Text>
            ))}
          </View>
        </View>

        <View style={styles.resumenGris}>
          <View>
            <Text style={{ fontSize: 10, fontWeight: "bold" }}>
              TASA: {tasaDolar} Bs/$
            </Text>
            <Text style={styles.textoSecundario}>Resumen de productos</Text>
          </View>
          <View style={{ alignItems: "flex-end" }}>
            <Text style={styles.totalDolar}>
              Total: ${totalDolar.toFixed(2)}
            </Text>
            <Text style={styles.totalBs}>{totalBs} Bs</Text>
          </View>
        </View>

        {cart.map((p) => {
          const subtotalDolar = (p.price * p.quantity).toFixed(2);
          const subtotalBs = (p.price * p.quantity * tasaDolar).toLocaleString(
            "de-DE",
            { minimumFractionDigits: 2 },
          );
          return (
            <View key={p.id} style={styles.productoRow}>
              <View style={styles.colInfo}>
                <Text style={styles.textoPrincipal}>{p.title}</Text>
                {p.tipo_venta_seleccionado && (
                  <Text style={styles.tipoTexto}>
                    VENTA POR: {p.tipo_venta_seleccionado.toUpperCase()}
                  </Text>
                )}
                <Text style={styles.textoSecundario}>
                  Cant: {p.quantity} x ${Number(p.price).toFixed(2)}
                </Text>
              </View>
              <View style={styles.colPrecio}>
                <Text style={styles.textoPrincipal}>${subtotalDolar}</Text>
                <Text style={styles.textoSecundario}>{subtotalBs} Bs</Text>
              </View>
            </View>
          );
        })}

        <View
          style={{
            marginTop: 30,
            textAlign: "center",
            borderTop: "1px solid #eee",
            paddingTop: 10,
          }}
        >
          <Text style={{ fontSize: 9, color: "#999" }}>
            Gracias por su compra en El Caribeño
          </Text>
        </View>
      </Page>
    </Document>
  );
};

export default Pdf;
