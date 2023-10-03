const express = require('express');
const multer = require("multer");

const app = express();
const port = 3000;

app.get("/", (req, res) => {
  res.sendFile(__dirname + "/index.html");
});

app.listen(port, () => console.log(`slides-app listening on port ${port}!`));

const handleError = (err, res) => {
  res
    .status(500)
    .contentType("text/plain")
    .end("Oops! Something went wrong!");
};

const upload = multer({
  dest: "/public/images"
});

app.post(
  "/upload",
  upload.single("file"),
  (req, res) => {
    const tempPath = req.file.path;
    const targetPath = path.join(__dirname, "/public/images/image.jpg");

    if (path.extname(req.file.originalname).toLowerCase() === ".jpg") {
      fs.rename(tempPath, targetPath, err => {
        if (err) return handleError(err, res);

        res
          .status(200)
          .contentType("text/plain")
          .end("File uploaded!");
      });
    } else {
      fs.unlink(tempPath, err => {
        if (err) return handleError(err, res);

        res
          .status(403)
          .contentType("text/plain")
          .end("Only .webp files are allowed!");
      });
    }
  }
);

const Sequelize = require('sequelize');
const sequelize = new Sequelize({
  dialect: 'sqlite',
  storage: './database.sqlite'
});

sequelize
  .authenticate()
  .then(() => {
    console.log('Connection has been established successfully.');
  })
  .catch(err => {
    console.error('Unable to connect to the database:', err);
  });

const Slide = sequelize.define('slides', {
  title: Sequelize.STRING,
  content: Sequelize.TEXT,
  image: Sequelize.STRING,
  type: Sequelize.STRING,
  color: Sequelize.TEXT,
  published: Sequelize.BOOLEAN,
  order: Sequelize.INTEGER,
  publishingDate: Sequelize.DATE,
  unpublishingDate: Sequelize.DATE
});

sequelize.sync({ force: true })
  .then(() => {
    console.log(`Database & tables created!`);
  });