import csv from 'csvtojson';
import path from 'path';

import uploadConfig from '../config/upload';

import CreateTransactionService from './CreateTransactionService';

import Transaction from '../models/Transaction';

interface Request {
  transactionsFileName: string;
}

class ImportTransactionsService {
  async execute({ transactionsFileName }: Request): Promise<Transaction[]> {
    const transactionsFilePath = path.join(
      uploadConfig.directory,
      transactionsFileName,
    );

    const transactionsCSV = await csv().fromFile(transactionsFilePath);

    const createTransactionService = new CreateTransactionService();

    const transactions: Transaction[] = await Promise.all(
      transactionsCSV.map(async transaction => {
        await createTransactionService.execute(transaction);

        return transaction;
      }),
    );

    return transactions;
  }
}

export default ImportTransactionsService;
