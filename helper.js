const readline = require("readline");
const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});
const chalk = require("chalk");

module.exports = function askQuestion(questionAsked) {
  return new Promise((resolve, reject) => {
    rl.question(
      chalk.magenta(questionAsked),
      answer => {
        resolve(answer)
      })
  })
}
