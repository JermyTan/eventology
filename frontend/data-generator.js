const faker = require("faker");

console.log(faker.internet.userName());
console.log(faker.internet.email());
console.log(faker.internet.avatar());
console.log(faker.lorem.sentence());
console.log(faker.lorem.paragraphs());
console.log(faker.address.streetAddress());

function shuffle(array) {
  var currentIndex = array.length,
    temporaryValue,
    randomIndex;

  // While there remain elements to shuffle...
  while (0 !== currentIndex) {
    // Pick a remaining element...
    randomIndex = Math.floor(Math.random() * currentIndex);
    currentIndex -= 1;

    // And swap it with the current element.
    temporaryValue = array[currentIndex];
    array[currentIndex] = array[randomIndex];
    array[randomIndex] = temporaryValue;
  }

  return array;
}

const images = [
  faker.image.nature(),
  faker.image.food(),
  faker.image.people(),
  faker.image.fashion(),
  faker.image.transport(),
  faker.image.city(),
  faker.image.cats(),
  faker.image.business(),
];
console.log(shuffle(images).slice(0, 3).join(","));
