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

@Table({
  tableName: 'location_association',
})
export class LocationAssociation extends Model<LocationAssociation> {
  @ForeignKey(() => RawLocation)
  @Column
  location_id: number;

  @ForeignKey(() => RawItemTP)
  @Column
  raw_item_tp_id: number;

  @Column
  @CreatedAt
  createdAt: Date;

  @UpdatedAt
  updatedAt: Date;

  @DeletedAt
  deletedAt: Date;
}
