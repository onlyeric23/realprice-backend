/* tslint:disable:variable-name */

import dayjs from 'dayjs';
import customParseFormat from 'dayjs/plugin/customParseFormat';
import {
  AllowNull,
  BelongsToMany,
  Column,
  CreatedAt,
  DeletedAt,
  Model,
  Table,
  Unique,
  UpdatedAt,
} from 'sequelize-typescript';
import { generateChecksum } from '../core/utils';
import { LocationAssociation } from './LocationAssociation';
import { RawLocation } from './RawLocation';
dayjs.extend(customParseFormat);

@Table({
  tableName: 'RawItemTP',
})
export class RawItemTP extends Model<RawItemTP> {
  static generateHash(raw: any) {
    return generateChecksum(
      [
        raw.BUILD_B,
        raw.BUILD_C,
        raw.BUILD_L,
        raw.BUILD_P,
        raw.BUILD_R,
        raw.BUITYPE,
        raw.CASE_F,
        raw.CASE_T,
        raw.DISTRICT,
        raw.FAREA,
        raw.FDATE,
        raw.RULE,
        raw.LOCATION,
        raw.LANDA,
        raw.LANDA_Z,
        raw.SDATE,
        raw.SCNT,
        raw.SBUILD,
        raw.TBUILD,
        raw.PBUILD,
        raw.MBUILD,
        raw.TPRICE,
        raw.UPRICE,
        raw.UPNOTE,
        raw.PARKTYPE,
        raw.PAREA,
        raw.PPRICE,
        raw.RMNOTE,
      ].join('')
    );
  }

  static getDateBySDATE(SDATE: string) {
    const day = SDATE.slice(-2);
    const mon = SDATE.slice(-4, -2);
    const year = parseInt(SDATE.slice(0, -4)) + 1911;
    return dayjs(`${year}-${mon}-${day} +08:00`, 'YYYY-MM-DD Z').toDate();
  }

  @AllowNull(false)
  @Unique
  @Column
  hash: string;

  @BelongsToMany(
    () => RawLocation,
    () => LocationAssociation
  )
  locations: Array<RawLocation & { LocationAssociation: LocationAssociation }>;

  @Column
  soldDate: Date;

  @CreatedAt
  createdAt: Date;

  @UpdatedAt
  updatedAt: Date;

  @DeletedAt
  deletedAt: Date;

  @Column
  geocodedAt: Date;

  // 建物現況格局_衛
  @Column
  BUILD_B: string;

  // 有無附傢俱
  @Column
  BUILD_C: string;

  // 建物現況格局_廳
  @Column
  BUILD_L: string;

  // 建物現況格局_隔間
  @Column
  BUILD_P: string;

  // 建物現況格局_房
  @Column
  BUILD_R: string;

  // 建物型態
  @Column
  BUITYPE: string;

  // 交易標的/租賃標的
  @Column
  CASE_F: string;

  // 成交案件類型
  @Column
  CASE_T: string;

  // 行政區
  @Column
  DISTRICT: string;

  // 建物移轉總面積(坪)/租賃總面積(坪)
  @Column
  FAREA: string;

  // 建築完成年月
  @Column
  FDATE: string;

  // 有無管理組織
  @Column
  RULE: string;

  // 土地區段位置或建物區門牌
  @Column
  LOCATION: string;

  // 土地移轉總面積(坪)/土地租賃總面積(坪)
  @Column
  LANDA: string;

  // 都市土地使用分區
  @Column
  LANDA_Z: string;

  // 交易年月
  @Column
  SDATE: string;

  // 交易筆棟數/租賃筆棟數
  @Column
  SCNT: string;

  // 移轉層次
  @Column
  SBUILD: string;

  // 總樓層數
  @Column
  TBUILD: string;

  // 主要用途
  @Column
  PBUILD: string;

  // 主要建材
  @Column
  MBUILD: string;

  // 交易總價(萬元)/租賃總價(萬元)
  @Column
  TPRICE: string;

  // 交易單價(萬元/坪)/租賃單價(元/坪)
  @Column
  UPRICE: string;

  // 單價是否含車位
  @Column
  UPNOTE: string;

  // 車位類別及數量
  @Column
  PARKTYPE: string;

  // 車位移轉總面積(坪)/車位租賃總面積(坪)
  @Column
  PAREA: string;

  // 車位移轉總價(萬元)/車位租賃總價(元)
  @Column
  PPRICE: string;

  // 備註
  @Column
  RMNOTE: string;
}
