import { Sequelize } from 'sequelize';
import fs from 'fs';


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


sequelize.sync({})
  .then(() => {
    console.log(`Database & tables created!`);
  });



// Define the folder names
const publicFolder = 'public';
const imagesFolder = 'public/images';

// Create the "public" folder
fs.mkdir(publicFolder, (err) => {
  if (err) {
    console.error(`Error creating the "${publicFolder}" folder: ${err}`);
  } else {
    console.log(`"${publicFolder}" folder created successfully.`);

    // Create the "images" folder inside the "public" folder
    fs.mkdir(imagesFolder, (err) => {
      if (err) {
        console.error(`Error creating the "${imagesFolder}" folder: ${err}`);
      } else {
        console.log(`"${imagesFolder}" folder created successfully.`);
      }
    });
  }
});