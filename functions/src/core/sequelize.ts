import { Sequelize } from 'sequelize-typescript';
import config from '../../config/config';
import { Geo } from '../models/Geo';
import { LocationAssociation } from '../models/LocationAssociation';
import { Meta } from '../models/Meta';
import { RawItemTP } from '../models/RawItemTP';
import { RawLocation } from '../models/RawLocation';
import { TransformedFile } from '../models/TransformedFile';

const env = process.env.NODE_ENV || 'development';

const db = config[env];

const sequelize = new Sequelize(db.database, db.username, db.password, db);

sequelize.addModels([
  Meta,
  TransformedFile,
  Geo,
  RawItemTP,
  RawLocation,
  LocationAssociation,
]);

export default sequelize;
