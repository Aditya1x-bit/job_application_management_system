const express = require("express");
const app = express();

const PORT = process.env.PORT || 3000;
const HOST = "127.0.0.1";

//middleware
//static file
app.use(express.static("public/"));

app.use(express.urlencoded({ extended: true }));

// db connection

app.use(express.json());

var connection = require("./config/db");

// multer

var multer = require("multer");
const e = require("express");
const { name } = require("ejs");

const storage = multer.diskStorage({
  destination: "public/uploads/",
  filename: (req, file, cb) => {
    cb(null, Date.now() + file.originalname);
  },
});

const upload = multer({ storage: storage });

app.get("/", (req, res) => {
  res.render("Home.ejs");
});

app.post("/saveform", upload.single("cv"), async (req, res) => {
  //   Create table applications (id INT Primary KEY AUTO_INCREMENT, name VARCHAR(100), email VARCHAR(150), position VARCHAR(200), experience VARCHAR(150), message VARCHAR(200), file VARCHAR(200));
  //   res.send("form saved");
  try {
    const { name, email, position, experience, message } = req.body;
    const file = req.file ? req.file.filename : null;

    // var sql = `insert into applications (name, email, experience, message, file) values(${name}, ${email}, ${experience}, ${message}, ${file})`;
    var sql = `insert into applications (name, email, position, experience, message, file) values(?,?,?,?,?)`;
    await connection.execute(sql, [
      name,
      email,
      position,
      experience,
      message,
      file,
    ]);
    // res.send(sql)
    // res.send(result);
    // console.log(result)
    // console.log(result[0])
    // res.send({
    //     file: req.file,
    //     data: req.body,
    //     sql: sql
    // })
    // res.send("Application data saved successfully!");

    res.redirect("/applications");
  } catch (err) {
    console.error("Error saving applicatn details:", err);
    res.status(500).send("Error saving applicant details.");
    return;
  }
});

app.get("/applications", async (req, res) => {
  var sql = `select * from applications`;
  const result = await connection.execute(sql);
  // console.log(result[0])

  // res.send(result[0]);
  const obj = { data: result[0] };
  res.render("applications.ejs", obj);
});

app.get("/edit", async (req, res) => {
  try {
    var id = req.query.id;

    const sql = `SELECT * FROM applications WHERE id = ?`;
    const result = await connection.execute(sql, [id]);
    // console.log(result[0]);

    // res.send("Edit user")
    // res.send(result[0])

    const obj = { data: result[0][0] };
    res.render("editapp.ejs", obj);
  } catch (err) {
    console.error("Error loading the form for editing applicant details:", err);
    res
      .status(500)
      .send("Error loading the form for editing applicant details.");
    return;
  }
});

app.get("/delete/:id", async (req, res) => {
  try {
    var id = req.params.id;

    var sql = `delete from applications where id='${id}'`;
    await connection.execute(sql);

    // res.send("Deleted user"+id)

    res.redirect("/applications");
  } catch (err) {
    console.error("Error deleting applicant details:", err);
    res.status(500).send("Error deleting applicant details.");
    return;
  }
});

app.post("/updateform", upload.single("cv"), async (req, res) => {
    const { id, name, email, position, experience, message, file1 } = req.body;
  
    const filename = req.file ? req.file.filename : file1;
  
    const sql = `
      UPDATE applications
      SET name = ?, email = ?, position=?, experience = ?, message = ?, file = ?
      WHERE id = ?
    `;
  
    await connection.execute(sql, [name, email, position, experience, message, filename, id]);
  
    res.redirect("/applications");

    // res.send({ 
    // body: req.body, 
    // file: req.file, 
    // filename
    // });
  });
  

app.listen(PORT, HOST, () => {
  console.log(`Server started at http://${HOST}:${PORT}`);
});
