import { Sequelize } from 'sequelize-typescript';
import configs from '../../config/config.json';
import { RawItemTP } from '../models/RawItemTP.js';

const config = (process.env.NODE_ENV === 'production'
  ? configs.production
  : configs.development) as {
  username: string;
  password: string;
  database: string;
  host: string;
  dialect: 'mysql';
  dialectOptions?: any;
};

const sequelize = new Sequelize(
  config.database,
  config.username,
  config.password!,
  config
);

sequelize.addModels([RawItemTP]);

export default sequelize;
