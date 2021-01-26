import express from 'express';
import * as cors from 'cors';
import * as bodyParser from 'body-parser';
import { errors } from 'celebrate';
import config from '../config';
import routes from '../api';
import errorHandling from '../api/middlewares/error';

export default (app: express.Application) => {
  // if behind a proxy, shows the real IP
  app.enable('trust proxy');
  app.use(cors());
  app.use(bodyParser.json());
  app.use(config.api.prefix, routes());

  // handling celebrate errors
  app.use(errors());
  // handling other errors
  app.use(errorHandling);
};
