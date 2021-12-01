const fs = require("fs");
const mongoose = require("mongoose");

const mongoObjectId = () => {
  var timestamp = ((new Date().getTime() / 1000) | 0).toString(16);
  return (
    timestamp +
    "xxxxxxxxxxxxxxxx"
      .replace(/[x]/g, function () {
        return ((Math.random() * 16) | 0).toString(16);
      })
      .toLowerCase()
  );
};

const destructArray = (choices) => {
  const [choice1, choice2, choice3, choice4] = choices;
  return {
    choice1,
    choice2,
    choice3,
    choice4,
  };
};

let quizzs = [];
let questions = [];

const files = fs.readdirSync("./categories");

files.forEach((file) => {
  const data = fs.readFileSync(`./categories/${file}`, "utf8");
  const json = JSON.parse(data);

  let questionsId = [];

  questions.push(
    ...json.map((question, index) => {
      const questionReturn = {
        _id: new mongoose.Types.ObjectId(mongoObjectId()),
        title: question.question,
        answer: question.answer,
        ...destructArray(question.choices),
      };

      questionsId.push(questionReturn._id);

      if (index % 20 === 0) {
        quizzs.push({
          _id: new mongoose.Types.ObjectId(mongoObjectId()),
          label: json[index].category,
          difficulty: Math.floor(Math.random() * 3) + 1,
          questions: questionsId,
        });
        questionsId = [];
      }

      return questionReturn;
    })
  );
});

fs.writeFileSync(
  `./fixtures/quizzs.json`,
  JSON.stringify(quizzs, null, 2),
  (err) => {
    if (err) {
      console.log("Error", err);
    } else {
      console.log("Success");
    }
  }
);

fs.writeFileSync(
  `./fixtures/questions.json`,
  JSON.stringify(questions, null, 2),
  (err) => {
    if (err) {
      console.log("Error", err);
    } else {
      console.log("Success");
    }
  }
);
