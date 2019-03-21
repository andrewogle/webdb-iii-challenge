const express = require('express');
const helmet = require('helmet');
const knex = require("knex");

const dbConfig = require('./knexfile.js')
const db = knex(dbConfig.development);

const server = express();

server.use(express.json());
server.use(helmet());

// endpoints here
server.get("/api/cohorts", async (req, res) => {
  try {
    const cohorts = await db("cohorts");
    res.status(200).json(cohorts); 
  } catch (error) {
    res.status(500).json(error);
  }
});

server.get("/api/cohorts/:id", async (req, res) => {
  try {
    const cohort = await db("cohorts")
      .where({ id: req.params.id })
      .first();
    res.status(200).json(cohort);
  } catch (error) {
    res.status(500).json(error);
  }
});
server.get("/api/cohorts/:id/students", async (req, res) => {
  try {
    const cohort = await db("cohorts as c")
      .join('students as s', 's.cohort_id','c.id')
      .where('s.cohort_id',{ id: req.params.id })

      res.status(200).json(cohort)
     
  } catch (error) {
    res.status(500).json(error);
  }
});

const errors = {
  "19": "Another record with that value exists"
};

server.post("/api/cohorts", async (req, res) => {
  try {
    const [id] = await db("cohorts").insert(req.body);

    const cohort = await db("cohorts")
      .where({ id })
      .first();
    res.status(201).json(cohort);
  } catch (error) {
    res.status(500).json({ message: errors[error.errno] });
  }
});

server.put("/api/cohorts/:id", async (req, res) => {
  try {
    const count = await db("cohorts")
      .where({ id: req.params.id })
      .update(req.body);

    if (count > 0) {
      const role = await db("cohorts")
        .where({ id: req.params.id })
        .first();

      res.status(200).json(role);
    } else {
      res.status(404).json({ message: "records not found" });
    }
  } catch (error) {
    res.status(500).json(error);
  }
});
server.delete("/api/cohorts/:id", async (req, res) => {
  try {
    const count = await db("cohorts")
      .where({ id: req.params.id })
      .del();

    if (count > 0) {
      res.status(204).end();
    } else {
      res.status(404).json({ message: "records not found" });
    }
  } catch (error) {
    res.status(500).json(error);
  }
});

const port = 9090;
server.listen(port, function() {
  console.log(`\n=== Web API Listening on http://localhost:${port} ===\n`);
});
