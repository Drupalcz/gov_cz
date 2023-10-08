// Removes comments from coppied DS CSS.
// Might be removed later, if the source gets better.
const fs = require('fs');
const glob = require('glob');
const stripComments = require('strip-comments');
const path = 'assets/gov-design-system/gov-components/**/*.css';

glob(path, (err, files) => {
  if (err) {
    console.error(err);
    return;
  }

  files.forEach(file => {
    fs.readFile(file, 'utf8', (err, data) => {
      if (err) {
        console.error(err);
        return;
      }

      const strippedData = stripComments(data);
      fs.writeFile(file, strippedData, err => {
        if (err) {
          console.error(err);
        }
      });
    });
  });
});
