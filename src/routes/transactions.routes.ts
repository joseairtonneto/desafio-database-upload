import { Router } from 'express';
import multer from 'multer';
import { getCustomRepository } from 'typeorm';

import uploadConfig from '../config/upload';

import TransactionsRepository from '../repositories/TransactionsRepository';
import CreateTransactionService from '../services/CreateTransactionService';
import DeleteTransactionService from '../services/DeleteTransactionService';
import ImportTransactionsService from '../services/ImportTransactionsService';

const transactionsRouter = Router();
const upload = multer(uploadConfig);

transactionsRouter.get('/', async (request, response) => {
  const transactionsRepository = getCustomRepository(TransactionsRepository);

  const transactions = await transactionsRepository.find();

  const balance = await transactionsRepository.getBalance();

  response.json({ transactions, balance });
});

transactionsRouter.post('/', async (request, response) => {
  const { title, value, type, category } = request.body;

  console.log({ title, value, type, category });

  // const createTransactionService = new CreateTransactionService();
  // const transaction = await createTransactionService.execute({
  //   title,
  //   value,
  //   type,
  //   category,
  // });

  return response.json({ title, value, type, category });
});

transactionsRouter.delete('/:id', async (request, response) => {
  const { id } = request.params;

  const deleteTransactionService = new DeleteTransactionService();

  await deleteTransactionService.execute(id);

  return response.json();
});

transactionsRouter.post(
  '/import',
  upload.single('transactions'),
  async (request, response) => {
    const updateUserAvatar = new ImportTransactionsService();

    const { filename } = request.file;

    const transactions = await updateUserAvatar.execute({
      transactionsFileName: filename,
    });

    return response.json(transactions);
  },
);

export default transactionsRouter;