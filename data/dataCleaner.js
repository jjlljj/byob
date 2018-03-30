const fs = require('fs');
const data = require('./data_uncleaned.json');

function cleanEmploymentData(data) {
  const cleanedData = data.reduce((acc, obj) => {
    let { FIELD1, FIELD2, FIELD4, FIELD5, FIELD6 } = obj;
    let group = FIELD1 + ', ' + FIELD2;
    if (!acc[group]) {
      acc[group] = {
        group,
        ages: FIELD4,
        gender: FIELD2,
        ethnicity: FIELD1,
        years: []
      };
    }

    acc[group].years.push({
      year: FIELD5,
      score: FIELD6
    });
    return acc;
  }, {});

  return Object.values(cleanedData);
}

function writeFile(data) {
  let output = JSON.stringify(data, null, 2);

  fs.writeFile('./employment-data.json', output, 'utf8', err => {
    if (err) {
      return console.log(err);
    }
  });
  console.log('File written');
}

writeFile(cleanEmploymentData(data));
