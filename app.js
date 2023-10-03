import express from 'express';
import multer from 'multer';
import path from 'path';
import { Sequelize } from 'sequelize';
import bodyParser from 'body-parser';
import { engine } from 'express-handlebars';

const sequelize = new Sequelize({
  dialect: 'sqlite',
  storage: './database.sqlite'
});
const app = express();
const port = 3000;

app.engine('handlebars', engine());
app.set('view engine', 'handlebars');
app.set('views', './views');
app.use(express.static('public'));
app.use(bodyParser.json());

app.listen(port, () => console.log(`slides-app listening on port ${port}!`));

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

// only at first time setup
// sequelize.sync({})
//   .then(() => {
//     console.log(`Database & tables created!`);
//   });

app.get("/", (req, res) => {
  let slidesArray = [];

  // Find all slides and populate the slidesArray
  Slide.findAll()
    .then((slides) => {
      // Loop through the slides and push them into the slidesArray
      slides.forEach((slide) => {
        slidesArray.push(slide.toJSON());
      });
    })
    .catch((error) => {
      console.error('Error getting slides:', error);
    });

  res.render('slides/index', {
    slides: slidesArray
  });
})

app.get("/slides/new", (req, res) => {
  res.render('slides/new');
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

// app.get('/api/slides', (req, res) => {


// });

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


