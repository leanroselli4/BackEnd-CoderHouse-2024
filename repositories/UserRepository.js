// repositories/UserRepository.js
import UserDAO from '../dao/UserDAO.js';
import UserDTO from '../dto/UserDTO.js';

class UserRepository {
  async getAllUsers() {
    const users = await UserDAO.findAll();
    return users.map(user => new UserDTO(user));
  }

  async getUserById(id) {
    const user = await UserDAO.findById(id);
    return user ? new UserDTO(user) : null;
  }

  async getUserByEmail(email) {
    const user = await UserDAO.findByEmail(email);
    return user ? new UserDTO(user) : null;
  }

  async createUser(data) {
    const user = await UserDAO.create(data);
    return new UserDTO(user);
  }

  async updateUser(id, data) {
    const user = await UserDAO.update(id, data);
    return new UserDTO(user);
  }

  async deleteUser(id) {
    return UserDAO.delete(id);
  }
}

export default new UserRepository();

