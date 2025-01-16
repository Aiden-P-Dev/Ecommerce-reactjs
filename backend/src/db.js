import mongoose from "mongoose";

export const conectDB = async () => {
  try {
    await mongoose.connect(
      "mongodb+srv://aidenpdeveloper:kF8so8iBifTbNecI@cluster.rqppn.mongodb.net/?retryWrites=true&w=majority&appName=Cluster"
    );
    console.log("esta conectado a la base de datos");
  } catch (error) {
    console.log(error);
  }
};

// mongodb+srv://aidenpdeveloper:kF8so8iBifTbNecI@cluster.rqppn.mongodb.net/

// mongodb+srv://aidenpdeveloper:kF8so8iBifTbNecI@cluster.rqppn.mongodb.net/?retryWrites=true&w=majority&appName=Cluster

// mongodb+srv://aidenpdeveloper:kF8so8iBifTbNecI@cluster.rqppn.mongodb.net/?retryWrites=true&w=majority&appName=Cluster

// ("mongodb+srv://aidenpdeveloper:caribeno@cluster.rqppn.mongodb.net/?retryWrites=true&w=majority&appName=Cluster");

// "mongodb://localhost/caribeno"

// "mongodb+srv://aidenpdeveloper:IXLKYLuM6A0q1J9y@cluster.rqppn.mongodb.net/?retryWrites=true&w=majority&appName=Cluster"

// mongodb+srv://aidenpdeveloper:<db_password>@cluster.rqppn.mongodb.net/?retryWrites=true&w=majority&appName=Cluster

// "mongodb://localhost/merndb"

// mongodb+srv://aidenpdeveloper:<db_password>@cluster.rqppn.mongodb.net/?retryWrites=true&w=majority&appName=Cluster

// 9Jg5iBTcc34oW9Zd

// mongodb+srv://aidenpdeveloper:9Jg5iBTcc34oW9Zd@cluster.rqppn.mongodb.net/?retryWrites=true&w=majority&appName=Cluster
