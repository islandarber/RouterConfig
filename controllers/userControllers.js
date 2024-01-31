import { pool } from '../db/pool.js';
import {body, validationResult} from 'express-validator';

export const userValidator = [
  body('first_name').isString().notEmpty(),
  body('last_name').isString().notEmpty(),
  body('age').isInt({ min: 5 }),
]

const checkExistance = (rows, res) => {
  if(rows.length === 0){
    return res.status(404).json({ error: 'User not found' });
} else {
    res.status(200).json(rows[0])
} 
}


export const getUsers = async (req, res) => {
  try {
    const {rows} = await pool.query('SELECT * FROM users');
    res.status(200).json(rows);
  } catch (error) {
    res.status(500).send(error);
  }
}

export const getUser = async(req, res) => {
  const {id} = req.params;
  try {
    const {rows} = await pool.query('SELECT * FROM users WHERE id=$1', [id]);
    checkExistance(rows, res); 
  } catch (error) {
    res.status(500).send(error);
  }
}

export const createUser = async(req, res) => {
  try {
    const {first_name, last_name, age} = req.body;
    const errors = validationResult(req);
    if (!errors.isEmpty()){
      res.status(422).send(errors);
    }
    const {rows} = await pool.query('INSERT INTO users (first_name, last_name, age) VALUES ($1, $2, $3) RETURNING *', [first_name, last_name, age]);
        res.status(201).json(rows[0])  
  } catch (error) {
    res.sendStatus(500)
  }
}

export const modifyUser = async (req, res) => {
  const {id} = req.params;
   try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
          return res.status(400).json({ errors: errors.array() });
      }
      const { first_name, last_name, age } = req.body;
      const query = 'UPDATE users SET first_name = $1, last_name = $2, age = $3 WHERE id = $4 RETURNING *;';
      const values = [first_name, last_name, age, id];
      const {rows} = await pool.query(query, values);
      checkExistance(rows, res);
   } catch(err){
      console.log(err)
      res.sendStatus(500)
   }
}


export const deleteUser = async (req, res) => {
  const {id} = req.params;
   try {
       const {rows} = await pool.query('DELETE FROM users WHERE id=$1 RETURNING *', [id]);
       checkExistance(rows, res);  
   } catch(err){
       res.sendStatus(500)
   }
}