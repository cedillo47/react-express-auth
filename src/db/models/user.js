const knex = require('../knex');
const { hashPassword, isValidPassword } = require('../../utils/auth-utils');

class User {
  #passwordHash = null; // a private property

  // Why have a constructor here? We need a way to take the raw data returned from
  // the database and hide the passwordHash before sending it back to the controller
  constructor({ user_id, username, password_hash }) {
    this.id = user_id;
    this.username = username;
    this.#passwordHash = password_hash;
  }

  static async list() {
    const query = 'SELECT * FROM users';
    console.log("hello? form the back end")
    const { rows } = await knex.raw(query);
    return rows.map((user) => new User(user)); // use the constructor to hide each user's passwordHash
  }

  static async find(id) {
    console.log(typeof(id))
    const query = 'SELECT * FROM users WHERE user_id = ?';
    const args = [id];
    const { rows } = await knex.raw(query, args);
    const user = rows[0];
    return user ? new User(user) : null;
  }

  static async findByUsername(username) {
    const query = 'SELECT * FROM users WHERE username = ?';
    const args = [username];
    const { rows } = await knex.raw(query, args);
    const user = rows[0];
    return user ? new User(user) : null;
  }

  static async create(username, password) {
    const passwordHash = await hashPassword(password);

    const query = `INSERT INTO users (username, password_hash)
      VALUES (?, ?) RETURNING *`;
    const args = [username, passwordHash];
    const { rows } = await knex.raw(query, args);
    const user = rows[0];
    return new User(user);
  }

  static async deleteAll() {
    return knex.raw('TRUNCATE users;');
  }

  update = async (username) => { // dynamic queries are easier if you add more properties
    const rows = await knex('users')
      .where({user_id: this.id })
      .update({ username })
      .returning('*');

    const updatedUser = rows[0];
    return updatedUser ? new User(updatedUser) : null;
  };

  isValidPassword = async (password) => (
    isValidPassword(password, this.#passwordHash)
  );
}

module.exports = User;
