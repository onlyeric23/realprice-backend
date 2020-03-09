/* tslint:disable:variable-name */

import {
  AllowNull,
  Column,
  CreatedAt,
  DeletedAt,
  Model,
  Table,
  Unique,
  UpdatedAt,
} from 'sequelize-typescript';

@Table({
  tableName: 'transformed_file',
})
export class TransformedFile extends Model<TransformedFile> {
  @AllowNull(false)
  @Unique
  @Column
  name: string;

  @Column
  num_entries: number;

  @CreatedAt
  createdAt: Date;

  @UpdatedAt
  updatedAt: Date;

  @DeletedAt
  deletedAt: Date;
}
