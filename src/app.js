const express = require("express");
const cors = require("cors");
const { uuid, isUuid } = require('uuidv4');

const app = express();

app.use(express.json());
app.use(cors());

const repositories = [];
const likes = [];

app.get("/repositories", (request, response) => {
  return response.json(repositories);
});

app.post("/repositories", (request, response) => {
  const { title, url, techs } = request.body;

  const repo = { id: uuid(), title, url, techs, likes: 0 };

  repositories.push(repo);

  return response.json(repo);
});

app.put("/repositories/:id", (request, response) => {
  const { id } = request.params;
  const { title, url, techs } = request.body;

  const indexRepo = repositories.findIndex(repo => repo.id === id);

  if(indexRepo < 0){
    return response.status(400).json({ error: 'Invalid repositorie ID!'});
  }

  const repo = {
    id: repositories[indexRepo].id,
    title,
    url,
    techs,
    likes: repositories[indexRepo].likes
  }

  repositories[indexRepo] = repo;

  return response.json(repo);
});

app.delete("/repositories/:id", (request, response) => {
  const { id } = request.params;

  const indexRepo = repositories.findIndex(repo => repo.id === id);

  if(indexRepo < 0){
    return response.status(400).json({ error: 'Invalid repositorie ID!'});
  }

  repositories.splice(indexRepo, 1);

  return response.status(204).send();
});

app.post("/repositories/:idRepo/like", (request, response) => {
  const { idRepo } = request.params;

  const indexRepo = repositories.findIndex(repo => repo.id === idRepo);

  if(indexRepo < 0){
    return response.status(400).json({ error: 'Invalid repositorie ID!'});
  }

  const like = {
    idRepo,
    idUser: uuid()
  }

  repositories[indexRepo].likes += 1;

  likes.push(like);

  return response.json(repositories[indexRepo]);
});

app.get("/repositories/:idRepo/like", (request, response) => {
  const { idRepo } = request.params;

  const listLikes = likes.filter(like => like.idRepo === idRepo);

  return response.json(listLikes);
});

module.exports = app;
