import { Sequelize } from 'sequelize-typescript';
import configs from '../../config/config.json';
import { Meta } from '../models/Meta';
import { RawItemTP } from '../models/RawItemTP';

import cert from '../../config/client-cert.pem';
import key from '../../config/client-key.pem';
import ca from '../../config/server-ca.pem';

const config = (process.env.NODE_ENV === 'production'
  ? configs.production
  : configs.development) as {
  username: string;
  password: string;
  database: string;
  host?: string;
  dialect: 'mysql';
  dialectOptions?: any;
};

const dialectOptions = {
  ...config.dialectOptions,
  ...(process.env.NODE_ENV !== 'production'
    ? {
        ssl: {
          key,
          cert,
          ca,
        },
      }
    : undefined),
};

const sequelize = new Sequelize(
  config.database,
  config.username,
  config.password,
  {
    ...config,
    dialectOptions,
  }
);

sequelize.addModels([RawItemTP, Meta]);

export default sequelize;
