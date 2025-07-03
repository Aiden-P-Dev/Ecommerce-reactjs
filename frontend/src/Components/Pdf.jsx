import {
  Document,
  Page,
  View,
  Text,
  Image,
  StyleSheet,
} from "@react-pdf/renderer";
import { Cart } from "./Cart.jsx";

const style = StyleSheet.create({
  pagina: { backgroundColor: "#fff", height: "29.7cm", width: "21cm" },
  titulo: {
    backgroundColor: "#ffcc03",
    textAlign: "center",
    padding: "3 2",
    gap: "5px",
    h1: {
      fontSize: "50px",
      fontWeight: "600",
      color: "#f8f8f8",
      backgroundColor: "#000",

      borderTopLeftRadius: "50px",
      borderTopRightradius: "50px",
      borderBottomLeftRadius: "50px",
      borderBottomRightRadius: "50px",
    },
    h2: {
      fontSize: "25px",

      borderTopLeftRadius: "15px",
      borderTopRightradius: "15px",
      borderBottomLeftRadius: "15px",
      borderBottomRightRadius: "15px",

      padding: "5px",
      backgroundColor: "#fff",
      display: "inline-block",
    },
  },
  productos: {
    borderTopLeftRadius: "50px",
    borderTopRightRadius: "50px",
    borderBottomLeftRadius: "50px",
    borderBottomRightRadius: "50px",

    backgroundColor: "#999",

    padding: "1rem 0.5rem",
    margin: "20px 40px",

    img: {
      backgroundColor: "#e0e0e0",

      borderTopLeftRadius: "50px",
      borderTopRightradius: "50px",
      borderBottomLeftRadius: "50px",
      borderBottomRightRadius: "50px",

      width: "15%",

      objectFit: "contain",
      objectPosition: "center",

      border: "solid ",
      borderColor: "#555",
      borderHeigt: "5px",
      margin: "10px",
    },
    li: {
      display: "flex",

      flexDirection: "row",
      flexWrap: "wrap",
      alignItems: "center",
      margin: "5px",
      div: {
        borderTopLeftRadius: "50px",
        borderTopRightradius: "50px",
        borderBottomLeftRadius: "50px",
        borderBottomRightRadius: "50px",

        backgroundColor: "#e0e0e0",

        fontSize: "40px",
        fontWeight: "600",
        padding: "0 30px",
        strong: { fontSize: "30px", color: "#222222" },
      },
      footer: {
        small: {
          textDecoration: "underline #000",
          fontSize: "30px",
          fontWeight: 500,
          padding: "0 20px",
        },
      },
    },
  },
});

const CartItem = ({ thumbnail, price, title, quantity }) => (
  <View style={style.productos}>
    <View style={style.productos.li}>
      <Image src={thumbnail} style={style.productos.img} />
      <View style={style.productos.div}>
        <Text style={style.productos.strong}>{title}</Text>
        <Text>{price}</Text>
        <Text style={style.productos.footer}>Qty: {quantity}</Text>
      </View>
    </View>
  </View>
);

const Pdf = ({ cart = [] }) => (
  <Document>
    <Page size="A4" style={style.pagina}>
      <View>
        <View style={style.titulo}>
          <Text style={style.titulo.h1}>El Caribeño</Text>
          <Text style={style.titulo.h2}>Pedido</Text>
        </View>
      </View>
      <View>
        {cart.map((products) => (
          <CartItem
            key={products.id}
            thumbnail={products.thumbnail}
            price={products.price}
            title={products.title}
            quantity={products.quantity}
          />
        ))}
      </View>
    </Page>
  </Document>
);

export default Pdf;

// original
// const CartItem = ({ thumbnail, price, title, quantity }) => (
//   <View style={{ marginBottom: 10, display: "flex", flexDirection: "row" }}>
//     <Image src={thumbnail} style={{ width: 50, height: 50, marginRight: 10 }} />
//     <View>
//       <Text style={{ fontWeight: "bold" }}>{title}</Text>
//       <Text>${price}</Text>
//       <Text>Qty: {quantity}</Text>
//     </View>
//   </View>
// );
