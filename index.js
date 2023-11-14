const express = require("express");const xlsx = require("xlsx");
const cors = require("cors");
const https = require("https");
const app = express();
const fs = require("fs");

require("dotenv").config();

const port = process.env.PORT;

app.use(express.json({ limit: "50mb" }));
app.use(express.urlencoded({ limit: "50mb" }));

app.use(cors());

const file = xlsx.readFile(`./${process.env.ARCHIVE_XLSX_FILE}`);
let archive_sheet = file.Sheets["Archive"];

function generate_id_product(name, timestamp) {
  console.log("Generating id product");

  id_product = `${timestamp}_${name}`;
  return id_product;
}

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

app.get("/read_item", (req, res) => {
  let product_data = xlsx.utils.sheet_to_json(archive_sheet);

  if (req.query.id_product) {
    let id_product = req.query.id_product;

    searched_product = product_data.find(
      product => product.Id_Product === id_product
    );
    res.send(searched_product);
  }
  if (req.query.name) {
    let name_product = req.query.name.toLowerCase();

    searched_products = product_data.filter(product =>
      product.Name.toLowerCase().includes(name_product)
    );
    res.send(searched_products);
  }
});

function convertUriToImage(uri, imageName) {
  console.log("Converting URI to Image");
  let imageUri = uri;
  var regex = /^data:.+\/(.+);base64,(.*)$/;

  var matches = imageUri.match(regex);
  var ext = matches[1];
  var data = matches[2];
  var buffer = Buffer.from(data, "base64");
  fs.writeFileSync(`${imageName}.` + ext, buffer);
}

app.post("/save_item", (req, res) => {
  console.log("Saving new item");
  try {
    id_product = generate_id_product(req.body.name, Date.now());
    if (req.body.photo) {
      convertUriToImage(req.body.photo, id_product);
    }

    /*  image = fs.open(`${id_product}.png`, "r", function (err, f) {
    console.log("Saved!");
  }); */

    xlsx.utils.add;
    xlsx.utils.sheet_add_aoa(
      archive_sheet,
      [
        [
          id_product,
          req.body.name,
          req.body.quantity,
          req.body.dimension,
          req.body.description,
        ],
      ],
      { origin: -1 }
    );

    xlsx.writeFile(file, `./${process.env.ARCHIVE_XLSX_FILE}`);
    console.log(`New item ${id_product} saved`);
    res.json({ "New item saved": "true" });
  } catch (err) {
    res.json({ "New item not saved": err });
  }
});

app.post("/update_item", (req, res) => {
  console.log(req.body.id_product);
  console.log(req.body.quantity);
  //xlsx.utils.sheet_add_aoa(archive_sheet, [["new value"]], { origin: "D4" });

  res.send(JSON.stringify({ id_product: "Updated" }));
});

app.listen(port, () => {
  console.log(`Scan Manager listening at http://localhost:${port}`);
});
