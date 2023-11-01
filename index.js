const express = require("express");
const xl = require("excel4node");
const xlsx = require("xlsx");
const cors = require("cors");
const app = express();
const port = 3001;

app.use(express.json());

app.use(cors());

/* app.get("/read_archive", (req, res) => {
  const file = xlsx.readFile("./filename1.xlsx");

  let data = [];

  const sheets = file.SheetNames;

  for (let i = 0; i < sheets.length; i++) {
    const temp = xlsx.utils.sheet_to_json(file.Sheets[file.SheetNames[i]]);
    temp.forEach(res => {
      data.push(res);
    });
  }

  // Printing data
  console.log(data);
}); */

app.get("/read_product", (req, res) => {
  let id_product = req.query.id_product;
  console.log("The id: " + id_product);
  const file = xlsx.readFile("./filename1.xlsx");

  const sheets = file.SheetNames;

  let product_data = xlsx.utils.sheet_to_json(file.Sheets[sheets[0]]);

  searched_product = product_data.find(product => product.Id_Prodotto === id_product)
  console.log(searched_product)
  return searched_product

  
});

app.post("/save_item", (req, res) => {
  // Reading our test file
  const file = xlsx.readFile("./filename1.xlsx");
  let worksheet = file.Sheets["Archive"];

  xlsx.utils.add;

  xlsx.utils.sheet_add_aoa(
    worksheet,
    [
      [
        /* self_generate_id ,*/ req.body.name,
        req.body.quantity,
        req.body.dimension,
        req.body.description,
      ],
    ],
    { origin: -1 }
  );

  xlsx.writeFile(file, "./filename1.xlsx");
  res.send("Ok");
});

app.listen(port, () => {
  console.log(`Scan Manager listening at http://localhost:${port}`);
});


