import { User } from "../../../../domain/user/entity/user";
import { UserGateway } from "../../../../domain/user/gateway/user.gateway";
import { PrismaClient } from "../../../../generated/prisma/client";
import { UpdateUserDTO } from "../../../../domain/user/dto/update-user.dto";

export class UserRepositoryPrisma implements UserGateway {
  private constructor(private readonly prisma: PrismaClient) {}

  public static build(prisma: PrismaClient) {
    return new UserRepositoryPrisma(prisma);
  }

  public async create(user: User): Promise<void> {
    const data = {
      id: user.id,
      name: user.name,
      email: user.email,
      password: user.password,
      role: user.role,
      createdAt: user.createdAt,
      updatedAt: user.updatedAt,
    };

    await this.prisma.user.create({ data });
  }
  public async list(): Promise<User[]> {
    const usersFound = await this.prisma.user.findMany();

    const usersList = usersFound.map((u) => {
      const users = User.with({
        id: u.id,
        name: u.name,
        email: u.email,
        password: u.password,
        role: u.role,
        createdAt: u.createdAt,
        updatedAt: u.updatedAt,
      });
      return users;
    });

    return usersList;
  }

  public async update(id: string, updateUserDTO: UpdateUserDTO): Promise<User> {
    const now = new Date();

    const data = {
      name: updateUserDTO.name,
      updatedAt: now,
    };

    const updated = await this.prisma.user.update({
      where: { id },
      data,
    });

    const output = User.with({
      id: updated.id,
      name: updated.name,
      email: updated.email,
      password: updated.password,
      role: updated.role,
      createdAt: updated.createdAt,
      updatedAt: updated.updatedAt,
    });

    return output;
  }

  public async delete(id: string): Promise<void> {
    const deletedUser = await this.prisma.user.delete({ where: { id } });
  }

  public async findById(id: string): Promise<User> {
    const user = await this.prisma.user.findUnique({ where: { id } });
    if (!user) throw new Error("Invalid id");

    const output = User.with({
      id,
      name: user.name,
      email: user.email,
      password: user.password,
      role: user.role,
      createdAt: user.createdAt,
      updatedAt: user.updatedAt,
    });

    return output;
  }
  public async findByEmail(email: string): Promise<User> {
    const user = await this.prisma.user.findUnique({ where: { email } });
    if (!user) throw new Error("Invalid email");

    const output = User.with({
      id: user.id,
      name: user.name,
      email,
      password: user.password,
      role: user.role,
      createdAt: user.createdAt,
      updatedAt: user.updatedAt,
    });

    return output;
  }
}
