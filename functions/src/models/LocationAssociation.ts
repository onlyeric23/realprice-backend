/* tslint:disable:variable-name */

import {
  Column,
  CreatedAt,
  DeletedAt,
  ForeignKey,
  Model,
  Table,
  UpdatedAt,
} from 'sequelize-typescript';
import { RawItemTP } from './RawItemTP';
import { RawLocation } from './RawLocation';

export class LocationAssociation extends Model<LocationAssociation> {
  @ForeignKey(() => RawLocation)
  @Column
  locationId: number;

  @ForeignKey(() => RawItemTP)
  @Column
  rawItemTPId: number;

  @Column
  @CreatedAt
  createdAt: Date;

  @UpdatedAt
  updatedAt: Date;

  @DeletedAt
  deletedAt: Date;
}
