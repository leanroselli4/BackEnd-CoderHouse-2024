// dao/UserDAO.js
import User from '../models/User.js';

class UserDAO {
  async findAll() {
    return User.find();
  }

  async findById(id) {
    return User.findById(id);
  }

  async findByEmail(email) {
    return User.findOne({ email });
  }

  async create(data) {
    return User.create(data);
  }

  async update(id, data) {
    return User.findByIdAndUpdate(id, data, { new: true });
  }

  async delete(id) {
    return User.findByIdAndDelete(id);
  }
}

export default new UserDAO();
