
const express = require('express');
const router = express.Router();

const {
  createBoard,
  getBoard
} = require('../controllers/board.controller');

router.post('/', createBoard);
router.get('/:boardId', getBoard);

module.exports = router;
