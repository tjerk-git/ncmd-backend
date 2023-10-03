const express = require('express');
const multer = require("multer");
const path = require('path');
const Sequelize = require('sequelize');
const bodyParser = require('body-parser');

const sequelize = new Sequelize({
  dialect: 'sqlite',
  storage: './database.sqlite'
});
const app = express();
const port = 3000;

sequelize
  .authenticate()
  .then(() => {
    console.log('Connection has been established successfully.');
  })
  .catch(err => {
    console.error('Unable to connect to the database:', err);
  });

sequelize.sync({ force: true })
  .then(() => {
    console.log(`Database & tables created!`);
  });


app.get("/", (req, res) => {
  res.sendFile(__dirname + "/index.html");
});

app.listen(port, () => console.log(`slides-app listening on port ${port}!`));
app.use(express.static('public'));
app.use(bodyParser.json());

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

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'public/images');
  },
  filename: (req, file, cb) => {
    const extension = path.extname(file.originalname);
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, uniqueSuffix + extension);
  },
});

const upload = multer({ storage: storage });

app.get('/slides', (req, res) => {

  Slide.findAll()
    .then((slides) => {
      console.log('Slides:', slides);
      //res.send(slides);
    })
    .catch((error) => {
      console.error('Error getting slides:', error);
    });
});

app.post('/upload', upload.single('file'), (req, res) => {
  if (!req.file) {
    return res.status(400).send('No file uploaded.');
  } else {
    const { filename, size } = req.file;

    Slide.create({
      title: req.body.title,
      content: req.body.content,
      image: filename,
      type: req.body.type,
      color: req.body.color, // Replace with the desired color value
      published: true,
      order: 1,
      publishingDate: new Date(),
      unpublishingDate: req.body.unpublishingDate, // Set to null or specify a date
    })
      .then((newSlide) => {
        //console.log('New Slide created:', newSlide.get({ plain: true }));


        res.send(`Slide created`);
      })
      .catch((error) => {
        console.error('Error creating Slide:', error);
      });
  }
});


