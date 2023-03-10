const mongodb = require('../db/connect');
const ObjectId = require('mongodb').ObjectId;

const getAll = (req, res) => {
  mongodb
    .getDb()
    .db()
    .collection('heroes')
    .find()
    .toArray((err, lists) => {
      if (err) {
        res.status(400).json({ message: err });
      }
      res.setHeader('Content-Type', 'application/json');
      res.status(200).json(lists);
    });
};

const getSingle = (req, res) => {
  if (!ObjectId.isValid(req.params.id)) {
    res.status(400).json('Must use a valid hero id to find a hero.');
  }
  const userId = new ObjectId(req.params.id);
  mongodb
    .getDb()
    .db()
    .collection('heroes')
    .find({ _id: userId })
    .toArray((err, result) => {
      if (err) {
        res.status(400).json({ message: err });
      }
      res.setHeader('Content-Type', 'application/json');
      res.status(200).json(result[0]);
    });
};

const createHero = async (req, res) => {
  const hero = {
    heroName: req.body.heroName,
    humanName: req.body.humanName,
    superPower: req.body.superPower,
    normalJob: req.body.normalJob,
    romanticPartner: req.body.romanticPartner,
    worstEnemy: req.body.worstEnemy,
    company: req.body.company
  };
  const response = await mongodb.getDb().db().collection('heroes').insertOne(hero);
  if (response.acknowledged) {
    res.status(201).json(response);
  } else {
    res.status(500).json(response.error || 'Some error occurred while creating the hero.');
  }
};

const updateHero = async (req, res) => {
  if (!ObjectId.isValid(req.params.id)) {
    res.status(400).json('Must use a valid hero id to update a hero.');
  }
  const userId = new ObjectId(req.params.id);
  // be aware of updateOne if you only want to update specific fields
  const hero = {
    heroName: req.body.heroName,
    humanName: req.body.humanName,
    superPower: req.body.superPower,
    normalJob: req.body.normalJob,
    romanticPartner: req.body.romanticPartner,
    worstEnemy: req.body.worstEnemy,
    company: req.body.company
  };
  const response = await mongodb
    .getDb()
    .db()
    .collection('heroes')
    .replaceOne({ _id: userId }, hero);
  console.log(response);
  if (response.modifiedCount > 0) {
    res.status(204).send();
  } else {
    res.status(500).json(response.error || 'Some error occurred while updating the hero.');
  }
};

const deleteHero = async (req, res) => {
  if (!ObjectId.isValid(req.params.id)) {
    res.status(400).json('Must use a valid hero id to delete a hero.');
  }
  const userId = new ObjectId(req.params.id);
  const response = await mongodb.getDb().db().collection('heroes').remove({ _id: userId }, true);
  console.log(response);
  if (response.deletedCount > 0) {
    res.status(200).send();
  } else {
    res.status(500).json(response.error || 'Some error occurred while deleting the hero.');
  }
};

module.exports = {
  getAll,
  getSingle,
  createHero,
  updateHero,
  deleteHero
};
