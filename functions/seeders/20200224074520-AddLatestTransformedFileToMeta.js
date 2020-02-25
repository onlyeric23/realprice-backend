'use strict';

const TABLE = 'meta';

module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.bulkInsert('meta', [
      {
        name: 'LatestTransformedFile',
        value: null,
      },
    ]);
  },
  down: (queryInterface, Sequelize) => {
    return queryInterface.bulkDelete('meta', {
      name: 'LatestTransformedFile',
    });
  },
};
