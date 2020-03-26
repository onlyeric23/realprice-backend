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
  tableName: 'RawLocation',
})
export class RawLocation extends Model<RawLocation> {
  @Unique
  @Column
  location: string;

  @CreatedAt
  createdAt: Date;

  @UpdatedAt
  updatedAt: Date;

  @DeletedAt
  deletedAt: Date;

  @Column
  geocodedAt: Date;

  @ForeignKey(() => Geo)
  @Column
  geoId: number;

  @BelongsTo(() => Geo)
  geo: Geo;

  @BelongsToMany(
    () => RawItemTP,
    () => LocationAssociation
  )
  rawItemTPs: Array<RawItemTP & { LocationAssociation: LocationAssociation }>;
}
