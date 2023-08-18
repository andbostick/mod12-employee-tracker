INSERT INTO department (id, name)
VALUES (001, 'Devs');

INSERT INTO role (id, title, salary, department_id)
VALUES (001, 'Senior', 10000 , 001);

INSERT INTO employee (id, first_name, last_name, role_id, manager_id)
VALUES (001, "Andrew", "Bostick", 001, null);