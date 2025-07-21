require('dotenv').config();

module.exports = {
  development: {
    username: 'user',
    password: 'password',
    database: 'boardgames',
    host: 'db',
    dialect: 'postgres',
    logging: false
  },
  test: {
    username: 'user',
    password: 'password',
    database: 'boardgames_test',
    host: 'db',
    dialect: 'postgres',
    logging: false
  },
  production: {
    use_env_variable: 'DATABASE_URL',
    dialect: 'postgres',
    logging: false
  }
}; 