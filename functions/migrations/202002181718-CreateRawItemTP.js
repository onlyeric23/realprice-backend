'use strict';

const TABLE = 'raw_item_tp';

module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.createTable(TABLE, {
      id: {
        type: Sequelize.STRING,
        allowNull: false,
        primaryKey: true,
        autoIncrement: false,
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
      lat: {
        type: Sequelize.DECIMAL,
      },
      lng: {
        type: Sequelize.DECIMAL,
      },
      formatted_address: {
        type: Sequelize.STRING,
      },
      geocodedAt: {
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
  },

  down: (queryInterface, Sequelize) => {
    return queryInterface.dropTable(TABLE);
  },
};
