import { EntityRepository, getRepository, Repository } from 'typeorm';
import AppError from '../errors/AppError';

import Transaction from '../models/Transaction';

interface Balance {
  income: number;
  outcome: number;
  total: number;
}

@EntityRepository(Transaction)
class TransactionsRepository extends Repository<Transaction> {
  public async getBalance(): Promise<Balance> {
    const transactionsRepository = getRepository(Transaction);

    const transactions = await transactionsRepository.find();

    const income = transactions
      .filter(transaction => transaction.type === 'income')
      .reduce((acu, cur) => acu + cur.value, 0);

    const outcome = transactions
      .filter(transaction => transaction.type === 'outcome')
      .reduce((acu, cur) => acu + cur.value, 0);

    const total = income - outcome;

    if (total < 0) throw new AppError('Invalid');

    return { income, outcome, total };
  }
}

export default TransactionsRepository;
