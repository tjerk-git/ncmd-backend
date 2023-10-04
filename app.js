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

app.use(express.static('public'))

app.engine('handlebars', engine());
app.set('view engine', 'handlebars');
app.set('views', './views');
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


app.get("/", (req, res) => {
  let slidesArray = [];

  // Find all slides and populate the slidesArray
  Slide.findAll()
    .then((slides) => {
      // Loop through the slides and push them into the slidesArray
      slides.forEach((slide) => {
        slidesArray.push(slide.toJSON());
      });

      res.render('slides/index', {
        slides: slidesArray
      });
    })
    .catch((error) => {
      console.error('Error getting slides:', error);
    });
})

app.get("/slides/manage", (req, res) => {
  let slidesArray = [];

  Slide.findAll()
    .then((slides) => {
      slides.forEach((slide) => {
        slidesArray.push(slide.toJSON());
      });

      res.render('slides/manage', {
        slides: slidesArray
      });
    })
    .catch((error) => {
      console.error('Error getting slides:', error);
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
    const { filename } = req.file;
    const { title, content, type, color, unpublishingDate } = req.body;

    Slide.create({
      title: title,
      content: content,
      image: filename,
      type: type,
      color: color,
      published: true,
      order: 1,
      publishingDate: new Date(),
      unpublishingDate: unpublishingDate,
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


