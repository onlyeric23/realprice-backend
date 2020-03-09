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

@Table({
  tableName: 'geo',
})
export class Geo extends Model<Geo> {
  @Unique
  @Column
  formatted_address: string;

  @Column({ type: DataType.DECIMAL(9, 6) })
  latitude: number;

  @Column({ type: DataType.DECIMAL(9, 6) })
  longitude: number;

  @Unique
  @Column
  place_id: string;

  @Column
  @CreatedAt
  createdAt: Date;

  @UpdatedAt
  updatedAt: Date;

  @DeletedAt
  deletedAt: Date;

  @HasMany(() => RawLocation)
  raw_locations: RawLocation[];
}
