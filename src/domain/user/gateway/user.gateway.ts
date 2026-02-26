import { UpdateUserDTO } from "../dto/update-user.dto";
import { User } from "../entity/user";

export interface UserGateway {
  create(user: User): Promise<void>;
  list(): Promise<User[]>;
  update(id: string, updateUserDTO: UpdateUserDTO): Promise<User>;
  delete(id: string): Promise<void>;
  findById(id: string): Promise<User>;
  findByEmail(email: string): Promise<User>;
  updatePassword(id: string, passwordHash: string): Promise<void>;
}
