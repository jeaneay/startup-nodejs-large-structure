module.exports = {
  up: (queryInterface, Sequelize) => {
    const currentTime = new Date(new Date().toUTCString()).toISOString();
    return queryInterface.bulkInsert('Users', [{
      firstName: 'admin',
      lastName: 'admin',
      email: 'admin@admin.com',
      password: '$2a$10$o3D54mY2MTs.St49XG0i6uPJkSGhjVcjCQDmkZdt344yDorNHFeNm',
      isEmailVerified: true,
      lastLogin: currentTime,
      createdAt: currentTime,
      updatedAt:currentTime,
    }]);
  },
  down: (queryInterface, Sequelize) => {
    return queryInterface.bulkDelete('Users', {email: 'admin@admin.com'}, {});
  }
};