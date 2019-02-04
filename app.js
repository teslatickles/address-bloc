const inquirer = require('inquirer');
const MenuController = require('./controllers/MenuController');
const menu = new MenuController();

menu.clear();
menu.main();

















// const questions = [
//     {
//         type: "list",
//         name: "status",
//         message: "Are you hungry?: ",
//         choices: [
//             "Yes",
//             "No"
//         ]
//     }
// ]

// inquirer.prompt(questions).then((answers) => {
//     if (answers.status === "Yes") {
//         console.log("Get up and eat!");
//     } else {
//         console.log("Get back to work!");
//     }
// })
//     .catch((err) => {
//         console.log(err);
//     });

