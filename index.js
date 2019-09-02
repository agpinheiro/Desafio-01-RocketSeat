const express = require("express");
const server = express();
server.use(express.json());

const projects = [];

let numberRequest = 0;

function logRequest(req, res, next) {
  numberRequest++;

  console.log(`Numero de requisições = ${numberRequest}`);
  return next();
}

server.use(logRequest);

function checkProjectExists(req, res, next) {
  if (!req.body.id) {
    return res.status(400).json({ error: "Id is require" });
  }
  if (!req.body.title) {
    return res.status(400).json({ error: "title is require" });
  }
  if (!req.body.tasks) {
    return res.status(400).json({ error: "Tasks is" });
  }

  return next();
}

function checkIdExists(req, res, next) {
  const project = projects[req.params.id];

  if (!project) {
    return res.status(400).json({ error: "Project does not exists" });
  }
  return next();
}

server.get("/projects", (req, res) => {
  return res.json(projects);
});

server.get("/projects/:id", checkIdExists, (req, res) => {
  const { id } = req.params;
  return res.json(projects[id]);
});

server.post("/projects", checkProjectExists, (req, res) => {
  const create = req.body;
  projects.push(create);

  return res.json(projects);
});

server.put("/projects/:id", checkIdExists, (req, res) => {
  const { id } = req.params;
  const { title } = req.body;

  projects[id].title = title;

  return res.json(projects[id]);
});
server.delete("/projects/:id", checkIdExists, (req, res) => {
  const { id } = req.params;
  projects.splice(id, 1);
  return res.send();
});

server.post("/projects/:id/tasks", checkIdExists, (req, res) => {
  const { id } = req.params;
  const { title } = req.body;

  projects[id].tasks.push(title);

  return res.json(projects[id]);
});

server.listen(3000);
