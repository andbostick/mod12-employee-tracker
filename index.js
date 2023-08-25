const mysql = require("mysql2");
const inquirer = require("inquirer");

const db = mysql.createConnection(
  {
    host: "localhost",
    user: "root",
    password: "password",
    database: "employees_db",
  },
  console.log("connected to empoyee database")
);

const questions = [
  {
    type: "list",
    name: "intro",
    message: "What would you like to do?",
    choices: [
      "View All Departments",
      "View All Roles",
      "View All Employees",
      "Add A Department",
      "Add A Role",
      "Add An Employee",
      "Update An Employee Role",
    ],
  },
];

function init() {
  //queries to create an array for later questions
  let deptList = [];
  let roleList = [];
  let employeeList = [];

  db.query(`SELECT * FROM department`, function (err, results) {
    if (err) {
      console.log(err);
    }
    deptList = results.map((result) => result.name);
  });

  db.query(`SELECT * FROM role`, function (err, results) {
    if (err) {
      console.log(err);
    }
    roleList = results.map((result) => result.title);
  });

  db.query(`SELECT * FROM employee`, function (err, results) {
    if (err) {
      console.log(err);
    }
    employeeList = results.map((result) => result.first_name);
    console.log(employeeList)
  });

  inquirer.prompt(questions).then((answers) => {
    //If User Selects view all departments option
    if (answers.intro === "View All Departments") {
      db.query(`SELECT * FROM department ORDER BY id`, function (err, results) {
        console.log(results);
        init();
      });
    }

    //if user Selects View all roles option
    if (answers.intro === "View All Roles") {
      db.query(`SELECT * FROM role ORDER BY id`, function (err, results) {
        console.table(results);
        init();
      });
    }
    //if user selects View all employees option
    if (answers.intro === "View All Employees") {
      db.query(`SELECT * FROM employee ORDER BY id`, function (err, results) {
        console.table(results);
        init();
      });
    }
    //if user selects add a department
    if (answers.intro === "Add A Department") {
      //creates new inquirer questions
      inquirer
        .prompt([
          {
            type: "input",
            message: "Name of the Department",
            name: "name",
          },
        ])
        .then((answers) => {
          //makes a db call and adds a new department to the db
          db.query(
            `INSERT INTO department (name) VALUES (?)`,
            answers.name,
            function (err, results) {
              if (err) {
                console.log(err);
              }
              console.log(`Successfully Added ${answers.name}`);
            }
          );
        });
    }
    if (answers.intro === "Add A Role") {
      inquirer
        .prompt([
          {
            type: "input",
            message: "Title Of Role?",
            name: "title",
          },
          {
            type: "input",
            message: "Salary For Role?",
            name: "salary",
          },
          {
            type: "list",
            message: "Department For Role",
            name: "dept",
            choices: deptList,
          },
        ])
        .then((answers) => {
          //creates a promise to get the id for a department
          db.promise()
            .query(
              `SELECT id FROM department WHERE name=?`,
              answers.dept,
              function (err, results) {
                if (err) {
                  console.log(err);
                }
                return results;
              }
            )
            .then((result) => {
              //uses id from the promise to create the role
              db.query(
                `INSERT INTO role (title,salary,department_id) VALUES (?, ?,?)`,
                [answers.title, answers.salary, result[0][0].id],
                function (err, results) {
                  if (err) {
                    console.log(err);
                  }
                  console.log(`Succesfully added ${answers.title}`);
                  init();
                }
              );
            });
        });
    }
    if (answers.intro === "Add An Employee") {
      inquirer
        .prompt([
          {
            type: "input",
            message: "What is the employees first name?",
            name: "first_name",
          },
          {
            type: "input",
            message: "What is the employees last name?",
            name: "last_name",
          },
          {
            type: "list",
            message: "What is the employees role?",
            name: "role",
            choices: roleList,
          },
        ])
        .then((answers) => {
          //creates a promise to get an id from the role
          db.promise()
            .query(
              `SELECT id FROM role where title=?`,
              answers.role,
              function (err, results) {
                if (err) {
                  console.log(err);
                }
                return results;
              }
            )
            .then((result) => {
              //use that promise id to create a new employee
              db.query(
                `INSERT INTO employee(first_name, last_name, role_id, manager_id) values(?, ?, ?, ?)`,
                [answers.first_name, answers.last_name, result[0][0].id, null],
                function (err, results) {
                  if (err) {
                    console.log(err);
                  }
                  console.log(
                    `added ${answers.first_name} ${answers.last_name}`
                  );
                  init();
                }
              );
            });
        });
    }
    if (answers.intro === "Update An Employee") {
      inquirer
        .prompt([
          {
            type: "list",
            message: "What is the employees role do you want to update",
            name: "first_name",
            choices: employeeList
          },
          {
            type: "list",
            message: "What is their new role?",
            name: "last_name",
            choices: roleList
          },
         
          
        ])
    }
  });
}

init();
