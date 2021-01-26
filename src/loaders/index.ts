import express from 'express';
import mysqlLoader from './mysql';
import expressLoader from './express';

export default async (app: express.Application): Promise<void> => {
  console.log('Starting loading !');
  await mysqlLoader();
  console.log('MySQL loaded !');
  expressLoader(app);
  console.log('Express loaded !');
};
