const express = require("express");
const cors = require("cors");
const { uuid, isUuid } = require('uuidv4');

const app = express();

app.use(express.json());
app.use(cors());

const repositories = [];
const likes = [];

function logRequests(request, response, next) {
  const { method, url } = request;

  const logLabel = `[${method.toUpperCase()}] ${url}`;

  console.time(logLabel);

  next();

  console.timeEnd(logLabel);
}

function validateRequestID(request, response, next){
  const { id } = request.params;

  if(!isUuid(id)){
      console.log(`ERROR: Invalid ID ${id}`)
      return response.status(400).json({ error: 'Invalid ID!'});
  }

  return next();
}

app.use(logRequests);

app.get("/repositories", (request, response) => {
  return response.json(repositories);
});

app.post("/repositories", (request, response) => {
  const { title, url, techs } = request.body;

  const repo = { id: uuid(), title, url, techs, likes: 0 };

  repositories.push(repo);

  return response.json(repo);
});

app.put("/repositories/:id", validateRequestID, (request, response) => {
  const { id } = request.params;
  const { title, url, techs } = request.body;

  const indexRepo = repositories.findIndex(repo => repo.id === id);

  if(indexRepo < 0){
    return response.status(400).json({ error: 'The repository does not exist!'});
  }

  const repo = {
    ...repositories[indexRepo],
    title: title ? title : repositories[indexRepo].title,
    url: url ? url: repositories[indexRepo].url,
    techs: techs ? techs : repositories[indexRepo].techs
  }

  repositories[indexRepo] = repo;

  return response.json(repo);
});

app.delete("/repositories/:id", validateRequestID, (request, response) => {
  const { id } = request.params;

  const indexRepo = repositories.findIndex(repo => repo.id === id);

  if(indexRepo < 0){
    return response.status(400).json({ error: 'The repository does not exist!'});
  }

  repositories.splice(indexRepo, 1);

  return response.status(204).send();
});

app.post("/repositories/:id/like", validateRequestID, (request, response) => {
  const { id: idRepo } = request.params;

  const indexRepo = repositories.findIndex(repo => repo.id === idRepo);

  if(indexRepo < 0){
    return response.status(400).json({ error: 'The repository does not exist!'});
  }

  const like = {
    idRepo,
    idUser: uuid()
  }

  repositories[indexRepo].likes += 1;

  likes.push(like);

  return response.json(repositories[indexRepo]);
});

app.get("/repositories/:id/like", validateRequestID, (request, response) => {
  const { id: idRepo } = request.params;

  const indexRepo = repositories.findIndex(repo => repo.id === idRepo);

  if(indexRepo < 0){
    return response.status(400).json({ error: 'The repository does not exist!'});
  }

  const listLikes = likes.filter(like => like.idRepo === idRepo);

  return response.json(listLikes);
});

module.exports = app;
