/* tslint:disable:variable-name */

import {
  AllowNull,
  BelongsTo,
  BelongsToMany,
  Column,
  CreatedAt,
  DeletedAt,
  ForeignKey,
  Model,
  Table,
  Unique,
  UpdatedAt,
} from 'sequelize-typescript';
import { Geo } from './Geo';
import { LocationAssociation } from './LocationAssociation';
import { RawItemTP } from './RawItemTP';

@Table({
  tableName: 'raw_location',
})
export class RawLocation extends Model<RawLocation> {
  @AllowNull(false)
  @Unique
  @Column
  location: string;

  @CreatedAt
  createdAt: Date;

  @UpdatedAt
  updatedAt: Date;

  @DeletedAt
  deletedAt: Date;

  @ForeignKey(() => Geo)
  @Column
  geo_id: number;

  @BelongsTo(() => Geo)
  geo: Geo;

  @BelongsToMany(
    () => RawItemTP,
    () => LocationAssociation
  )
  raw_item_tps: Array<RawItemTP & { LocationAssociation: LocationAssociation }>;
}
