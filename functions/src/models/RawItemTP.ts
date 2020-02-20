/* tslint:disable:variable-name */

import {
  Column,
  CreatedAt,
  DeletedAt,
  Model,
  Table,
  UpdatedAt,
} from 'sequelize-typescript';

@Table({
  tableName: 'raw_item_tp',
})
export class RawItemTP extends Model<RawItemTP> {
  @CreatedAt
  createdAt: Date;

  @UpdatedAt
  updatedAt: Date;

  @DeletedAt
  deletedAt: Date;

  @Column
  lat: number;

  @Column
  lng: number;

  @Column
  formatted_address: string;

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
