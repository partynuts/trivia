const askQuestion = require('./helper');

const http = require('http');
const chalk = require("chalk");

const CATEGORY = `Please choose a category and type in the id or type in "r" for a random question!   `;
const ANSWER = `Please type "yes" whenever you would like to see the answer.  `;
const NEW_QUESTION = `Would you like a new question? Then choose an id or type "r" for random! Otherwise type "e" for exit.  `;

async function askRandomTriviaQuestion(prompt = CATEGORY) {
  console.log(chalk.yellow(`Let's play a game. Choose a category from one of these options:`));
  await getCategories();
  let answer = await askQuestion(prompt);
  console.log("answer", typeof answer);
  const _answer = Number(answer);
  console.log("Number(answer)", typeof _answer);
    await getQuestion(answer);
}

function getCategories() {
  const url = 'http://jservice.io/api/categories?count=25';

  return new Promise((resolve, reject) => {
      http.get(url, (resp) => {
        let data = '';
        resp.on('data', (chunk) => {
          data += chunk;
        });

        resp.on('end', () => {
          JSON.parse(data).map(item =>
            console.log(chalk.green(`category: ${item.title}; id: ${item.id} `))).join('\n');

          resolve();
        });

      }).on("error", (err) => {
        console.log("Error: " + err.message);
        reject(err);
      });
    }
  )
}

async function getQuestion(_id) {

  console.log("GET Question");

  const url = _id === "r" ? 'http://jservice.io/api/random' : `http://jservice.io/api/category?id=${Number(_id)}`

  console.log("URL ", url)
  return new Promise((resolve, reject) => {
    http.get(url, (resp) => {
      let data = '';
      resp.on('data', (chunk) => {
        data += chunk;
      });

      resp.on('end', async () => {
        const qAndA = {
          question: JSON.parse(data)[0].question,
          answer: JSON.parse(data)[0].answer
        }
        console.log(chalk.yellow(qAndA.question));
        console.log("");
        let answer = await askQuestion(ANSWER);
        if (answer === 'yes') {
          console.log(chalk.yellow(qAndA.answer));
          console.log("");
          let answer = await askQuestion(NEW_QUESTION);
          if (answer !== 'e') {
            await getQuestion(answer);
          } else {
            process.exit(0);
          }
        }
        resolve();
      });

    }).on("error", (err) => {
      console.log("Error: " + err.message);
      reject(err);
    });
  })
}

module.exports = {
  askRandomTriviaQuestion,
  getQuestion
};

// http://jservice.io/api/category?id=21
