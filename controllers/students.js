const mongodb = require('../db/database');
const ObjectId = require('mongodb').ObjectId;


const getAll = (req, res) => {
    //#swagger.tags=['students']  
    const result = mongodb.getDatabase().db().collection('students').find();
    result.toArray()
        .then(students => {
            res.setHeader('Content-Type', 'application/json');
            res.status(200).json(students);
        })
        .catch(err => {
            res.status(400).json({ message: err });
        });
};


const getSingle = (req, res) => {
    //#swagger.tags=['students']
    if (!ObjectId.isValid(req.params.id)) {
        return res.status(400).json('Must use a valid students id to find an students.');
    }

    const studentsId = new ObjectId(req.params.id);
    const result = mongodb.getDatabase().db().collection('students').find({ _id: studentsId });

    result.toArray()
        .then(students => {
            if (students.length === 0) {
                return res.status(404).json('students not found.');
            }

            res.setHeader('Content-Type', 'application/json');
            res.status(200).json(students[0]);
        })
        .catch(err => {
            res.status(400).json({ message: err });
        });
};


const createStudents = async (req, res) => {
    //#swagger.tags=['students']
    const students = {
        firstName: req.body.firstName,
        lastName: req.body.lastName,
        studentsId: req.body.studentsId,
        birthdate: req.body.birthdate,
        major: req.body.major,
        department: req.body.department,
        gender: req.body.gender,
        address: req.body.address,
        studentStatus: req.body.studentStatus
    };

    try {
        const response = await mongodb.getDatabase().db().collection('students').insertOne(students);

        if (response.acknowledged > 0) {
            res.status(204).send();
        } else {
            res.status(500).json('Failed to insert the students. No documents were created.');
        }
    } catch (error) {
        console.error('Error during students creation:', error);
        res.status(500).json(error.message || 'Some error occurred while creating the students.');
    }
};



const updateStudents = async (req, res) => {
    //#swagger.tags=['students']
    if (!ObjectId.isValid(req.params.id)) {
        res.status(400).json('Must use a valid students id to find an students.');
    }
    const studentsId = new ObjectId(req.params.id);
    const students = {
        firstName: req.body.firstName,
        lastName: req.body.lastName,
        studentsId: req.body.studentsId,
        birthdate: req.body.birthdate,
        major: req.body.major,
        department: req.body.department,
        gender: req.body.gender,
        address: req.body.address,
        studentStatus: req.body.studentStatus
                
    };
    const response = await mongodb.getDatabase().db().collection('students').replaceOne({ _id: studentsId}, students);
    if (response.modifiedCount > 0) {
        res.status(204).send();        
    }
    else {
        res.status(500).json(response.error || 'Some error occurred while updating the students.');
    }
};

const deleteStudents = async (req, res) => {
    //#swagger.tags=['students']
    if (!ObjectId.isValid(req.params.id)) {
        res.status(400).json('Must use a valid students id to find an students.');
    }
    const studentsId = new ObjectId(req.params.id);
    const response = await mongodb.getDatabase().db().collection('students').deleteOne({ _id: studentsId});
    if (response.deletedCount > 0) {
        res.status(204).send();        
    }
    else {
        res.status(500).json(response.error || 'Some error occurred while updating the students.');
    }
};

module.exports = {
    getAll,
    getSingle,
    createStudents,
    updateStudents,
    deleteStudents
}