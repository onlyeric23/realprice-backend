import { gql, IFieldResolver } from 'apollo-server-cloud-functions';
import dayjs from 'dayjs';
import utc from 'dayjs/plugin/utc';
import { Op } from 'sequelize';
import { Geo } from '../models/Geo';
import { RawItemTP } from '../models/RawItemTP';
import { RawLocation } from '../models/RawLocation';
dayjs.extend(utc);

interface Arguments {
  id: string;
  startDate: string;
  endDate: string;
  limit: number;
  offset: number;
}

const DEFAULT_ARGS: Partial<Arguments> = {
  limit: 20,
  offset: 0,
};

export const resolver: IFieldResolver<any, any, Arguments> = async (
  _,
  args
) => {
  const { id, startDate, endDate, limit, offset } = {
    ...DEFAULT_ARGS,
    ...args,
  };

  let where = {};
  if (id) {
    where = { ...where, id };
  }
  if (startDate || endDate) {
    let soldDate;
    if (startDate) {
      soldDate = { ...soldDate, [Op.gte]: dayjs.utc(startDate).toDate() };
    }
    if (endDate) {
      soldDate = { ...soldDate, [Op.lte]: dayjs.utc(endDate).toDate() };
    }
    where = { ...where, soldDate };
  }
  const items = await RawItemTP.findAll({
    where,
    include: [
      {
        model: RawLocation,
        include: [
          {
            model: Geo,
            where: {
              id: {
                [Op.ne]: null,
              },
            },
          },
        ],
      },
    ],
    limit,
    offset,
  });
  return items;
};

export const typeDef = gql`
  type Query {
    items(
      id: Int
      startDate: String
      endDate: String
      limit: Int
      offset: Int
    ): [RealPriceItem]
  }
  type RealPriceItem {
    CASE_T: String
    DISTRICT: String
    CASE_F: String
    LOCATION: String
    LANDA: String
    LANDA_Z: String
    SDATE: String
    SCNT: String
    SBUILD: String
    TBUILD: String
    BUITYPE: String
    PBUILD: String
    MBUILD: String
    FDATE: String
    FAREA: String
    BUILD_R: String
    BUILD_L: String
    BUILD_B: String
    BUILD_P: String
    RULE: String
    BUILD_C: String
    TPRICE: String
    UPRICE: String
    UPNOTE: String
    PARKTYPE: String
    PAREA: String
    PPRICE: String
    RMNOTE: String
  }
`;
