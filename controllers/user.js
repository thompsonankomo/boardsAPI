const mongodb = require('../db/database');
const ObjectId = require('mongodb').ObjectId;


const getAll = async (req, res) => {
    //#swagger.tags=['user']
    const result = await mongodb.getDatabase().db().collection('user').find();
    result.toArray()
        .then(user => {
            res.setHeader('Content-Type', 'application/json');
            res.status(200).json(user);
        })
        .catch(err => {
            res.status(400).json({ message: err });
        });
};

const getSingle = async (req, res) => {
    //#swagger.tags=['user']
    if (!ObjectId.isValid(req.params.id)) {
        res.status(400).json('Must use a valid user id to find a user.');
    }
    const userId = new ObjectId(req.params.id);
    const result = await mongodb.getDatabase().db().collection('user').find({ _id: userId });
    result.toArray().then((err, user) => {
        if (err) {
            res.status(400).json({ message: err });
        }
        res.setHeader('Content-Type', 'application/json');
        res.status(200).json(user[0]);
    });
};

const createUser = async (req, res) => {
    //#swagger.tags=['user']
    const user = {
        employeeId: req.body.employeeId,
        firstName: req.body.firstName,
        lastName: req.body.lastName,
        email: req.body.email,
        password: req.body.password,

    };

    try {
        const response = await mongodb.getDatabase().db().collection('user').insertOne(user);

        if (response.acknowledged > 0) {
            res.status(204).send();
        } else {
            res.status(500).json('Failed to insert the User. No documents were created.');
        }
    } catch (error) {
        console.error('Error during employee creation:', error);
        res.status(500).json(error.message || 'Some error occurred while creating the user.');
    }
};


const updateUser = async (req, res) => {
    //#swagger.tags=['user']
    if (!ObjectId.isValid(req.params.id)) {
        res.status(400).json('Must use a valid user id to find a user.');
    }
    const userId = new ObjectId(req.params.id);
    const user = {
        employeeId: req.body.employeeId,
        firstName: req.body.firstName,
        lastName: req.body.lastName,
        email: req.body.email,
        password: req.body.password,

    };
    const response = await mongodb.getDatabase().db().collection('user').replaceOne({ _id: userId }, user);
    if (response.modifiedCount > 0) {
        res.status(204).send();
    }
    else {
        res.status(500).json(response.error || 'Some error occurred while updating the user.');
    }
};

const deleteUser = async (req, res) => {
    //#swagger.tags=['user']
    if (!ObjectId.isValid(req.params.id)) {
        res.status(400).json('Must use a valid user id to find a user.');
    }
    const userId = new ObjectId(req.params.id);
    const response = await mongodb.getDatabase().db().collection('user').deleteOne({ _id: userId });
    if (response.deletedCount > 0) {
        res.status(204).send();
    }
    else {
        res.status(500).json(response.error || 'Some error occurred while updating the user.');
    }
};

module.exports = {
    getAll,
    getSingle,
    createUser,
    updateUser,
    deleteUser
}