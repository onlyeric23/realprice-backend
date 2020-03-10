/* tslint:disable:variable-name */

import {
  Column,
  CreatedAt,
  DataType,
  DeletedAt,
  HasMany,
  Model,
  Table,
  Unique,
  UpdatedAt,
} from 'sequelize-typescript';
import { RawLocation } from './RawLocation';

export class Geo extends Model<Geo> {
  @Unique
  @Column
  formattedAddress: string;

  @Column({ type: DataType.DECIMAL(9, 6) })
  latitude: number;

  @Column({ type: DataType.DECIMAL(9, 6) })
  longitude: number;

  @Unique
  @Column
  placeId: string;

  @Column
  @CreatedAt
  createdAt: Date;

  @UpdatedAt
  updatedAt: Date;

  @DeletedAt
  deletedAt: Date;

  @HasMany(() => RawLocation)
  locations: RawLocation[];
}
