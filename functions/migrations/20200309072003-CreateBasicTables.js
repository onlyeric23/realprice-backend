'use strict';

const TABLE_RAW_ITEM_TP = 'RawItemTP';
const TABLE_RAW_LOCATION = 'RawLocation';
const TABLE_LOCATION_ASSOCIATION = 'LocationAssociation';
const TABLE_GEO = 'Geo';

const createRawItemTP = (queryInterface, Sequelize) => {
  return queryInterface.createTable(TABLE_RAW_ITEM_TP, {
    id: {
      type: Sequelize.INTEGER,
      allowNull: false,
      primaryKey: true,
      autoIncrement: true,
    },
    createdAt: {
      type: Sequelize.DATE,
      defaultValue: Sequelize.literal('CURRENT_TIMESTAMP'),
    },
    updatedAt: {
      type: Sequelize.DATE,
      defaultValue: Sequelize.literal('CURRENT_TIMESTAMP'),
      onUpdate: Sequelize.literal('CURRENT_TIMESTAMP'),
    },
    deletedAt: {
      type: Sequelize.DATE,
    },
    hash: {
      type: Sequelize.STRING,
      allowNull: false,
      unique: true,
    },
    soldDate: {
      type: Sequelize.DATE,
    },
    BUILD_B: {
      type: Sequelize.STRING,
    },
    BUILD_C: {
      type: Sequelize.STRING,
    },
    BUILD_L: {
      type: Sequelize.STRING,
    },
    BUILD_P: {
      type: Sequelize.STRING,
    },
    BUILD_R: {
      type: Sequelize.STRING,
    },
    BUITYPE: {
      type: Sequelize.STRING,
    },
    CASE_F: {
      type: Sequelize.STRING,
    },
    CASE_T: {
      type: Sequelize.STRING,
    },
    DISTRICT: {
      type: Sequelize.STRING,
    },
    FAREA: {
      type: Sequelize.STRING,
    },
    FDATE: {
      type: Sequelize.STRING,
    },
    RULE: {
      type: Sequelize.STRING,
    },
    LOCATION: {
      type: Sequelize.STRING,
    },
    LANDA: {
      type: Sequelize.STRING,
    },
    LANDA_Z: {
      type: Sequelize.STRING,
    },
    SDATE: {
      type: Sequelize.STRING,
    },
    SCNT: {
      type: Sequelize.STRING,
    },
    SBUILD: {
      type: Sequelize.STRING,
    },
    TBUILD: {
      type: Sequelize.STRING,
    },
    PBUILD: {
      type: Sequelize.STRING,
    },
    MBUILD: {
      type: Sequelize.STRING,
    },
    TPRICE: {
      type: Sequelize.STRING,
    },
    UPRICE: {
      type: Sequelize.STRING,
    },
    UPNOTE: {
      type: Sequelize.STRING,
    },
    PARKTYPE: {
      type: Sequelize.STRING,
    },
    PAREA: {
      type: Sequelize.STRING,
    },
    PPRICE: {
      type: Sequelize.STRING,
    },
    RMNOTE: {
      type: Sequelize.STRING,
    },
  });
};

const createRawLocation = (queryInterface, Sequelize) => {
  return queryInterface.createTable(TABLE_RAW_LOCATION, {
    id: {
      type: Sequelize.INTEGER,
      allowNull: false,
      primaryKey: true,
      autoIncrement: true,
    },
    createdAt: {
      type: Sequelize.DATE,
      defaultValue: Sequelize.literal('CURRENT_TIMESTAMP'),
    },
    updatedAt: {
      type: Sequelize.DATE,
      defaultValue: Sequelize.literal('CURRENT_TIMESTAMP'),
      onUpdate: Sequelize.literal('CURRENT_TIMESTAMP'),
    },
    deletedAt: {
      type: Sequelize.DATE,
    },
    geocodedAt: {
      type: Sequelize.DATE,
    },
    location: {
      type: Sequelize.STRING,
      unique: true,
      allowNull: false,
    },
    geoId: {
      type: Sequelize.INTEGER,
      references: {
        model: 'Geo',
        key: 'id',
      },
      onUpdate: 'cascade',
      onDelete: 'cascade',
    },
  });
};

const createLocationAssociation = (queryInterface, Sequelize) => {
  return queryInterface.createTable(TABLE_LOCATION_ASSOCIATION, {
    id: {
      type: Sequelize.INTEGER,
      allowNull: false,
      primaryKey: true,
      autoIncrement: true,
    },
    createdAt: {
      type: Sequelize.DATE,
      defaultValue: Sequelize.literal('CURRENT_TIMESTAMP'),
    },
    updatedAt: {
      type: Sequelize.DATE,
      defaultValue: Sequelize.literal('CURRENT_TIMESTAMP'),
      onUpdate: Sequelize.literal('CURRENT_TIMESTAMP'),
    },
    deletedAt: {
      type: Sequelize.DATE,
    },
    locationId: {
      type: Sequelize.INTEGER,
      references: {
        model: 'RawLocation',
        key: 'id',
      },
      onUpdate: 'cascade',
      onDelete: 'cascade',
    },
    rawItemTPId: {
      type: Sequelize.INTEGER,
      references: {
        model: 'RawItemTP',
        key: 'id',
      },
      onUpdate: 'cascade',
      onDelete: 'cascade',
    },
  });
};

const createGeo = (queryInterface, Sequelize) => {
  return queryInterface.createTable(TABLE_GEO, {
    id: {
      type: Sequelize.INTEGER,
      allowNull: false,
      primaryKey: true,
      autoIncrement: true,
    },
    formattedAddress: {
      type: Sequelize.STRING,
      unique: true,
    },
    latitude: Sequelize.DataTypes.DECIMAL(9, 6),
    longitude: Sequelize.DataTypes.DECIMAL(9, 6),
    createdAt: {
      type: Sequelize.DATE,
      defaultValue: Sequelize.literal('CURRENT_TIMESTAMP'),
    },
    updatedAt: {
      type: Sequelize.DATE,
      defaultValue: Sequelize.literal('CURRENT_TIMESTAMP'),
      onUpdate: Sequelize.literal('CURRENT_TIMESTAMP'),
    },
    deletedAt: {
      type: Sequelize.DATE,
    },
  });
};

const dropRawItemTP = queryInterface =>
  queryInterface.dropTable(TABLE_RAW_ITEM_TP);
const dropRawLocation = queryInterface =>
  queryInterface.dropTable(TABLE_RAW_LOCATION);
const dropLocationAssociation = queryInterface =>
  queryInterface.dropTable(TABLE_LOCATION_ASSOCIATION);
const dropGeo = queryInterface => queryInterface.dropTable(TABLE_GEO);

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await createRawItemTP(queryInterface, Sequelize);
    await createGeo(queryInterface, Sequelize);
    await createRawLocation(queryInterface, Sequelize);
    await createLocationAssociation(queryInterface, Sequelize);
  },
  down: async queryInterface => {
    await dropLocationAssociation(queryInterface);
    await dropRawLocation(queryInterface);
    await dropGeo(queryInterface);
    await dropRawItemTP(queryInterface);
  },
};
