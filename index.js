const express = require("express");const xl = require("excel4node");
const xlsx = require("xlsx");
const cors = require('cors')
const app = express();
const port = 3001;

app.use(express.json());

app.use(cors())

app.get("/read_archive", (req, res) => {
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
});

app.post("/save_item", (req, res) => {
  // Reading our test file
  const file = xlsx.readFile("./filename1.xlsx");
  let worksheet = file.Sheets["Archive"];

  xlsx.utils.add

  xlsx.utils.sheet_add_aoa(worksheet, [["Nome", "Quanità", "test", "uno"]], {origin: -1});

  // write to new file
  // formatting from OLD file will be lost!
  xlsx.writeFile(file, "./filename1.xlsx");
  res.send("Ok")
});

app.post("/save_item_test", (req, res) => {
  //res.send('ciao');

  /* 
  const data = [
    {
       "name":"Shadab Shaikh",
       "quantity":"shadab@gmail.com",
       "dimension":"1234567890"
       "description":"1234567890"
    }
   ]
*/
  const data = req.body;
  console.log(req.body);

  const wb = new xl.Workbook();
  const ws = wb.addWorksheet("Archive");

  const headingColumnNames = ["Nome", "Quantità", "Dimensione", "Descrizione"];

  let headingColumnIndex = 1;
  headingColumnNames.forEach(heading => {
    ws.cell(1, headingColumnIndex++).string(heading);
  });

  let rowIndex = 2;
  /* data.forEach( record => {
        let columnIndex = 1;
        Object.keys(record).forEach(columnName =>{
            ws.cell(rowIndex,columnIndex++)
                .string(record [columnName])
        });
        rowIndex++;
    }); */
  let columnIndex = 1;
  Object.keys(data).forEach(columnName => {
    ws.cell(rowIndex, columnIndex++).string(data[columnName]);
  });

  wb.write("filename1.xlsx");
});

app.listen(port, () => {
  console.log(`Scan Manager listening at http://localhost:${port}`);
});
