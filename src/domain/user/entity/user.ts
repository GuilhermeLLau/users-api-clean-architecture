export type UserRole = "user" | "admin";

export const UserRole = {
  USER: "user" as UserRole,
  ADMIN: "admin" as UserRole,
} as const;

export type UserProps = {
  id: string;
  name: string;
  email: string;
  passwordHash: string;
  role: UserRole;
  createdAt: Date;
  updatedAt: Date;
};

export class User {
  private constructor(private props: UserProps) {}

  public static build(
    name: string,
    email: string,
    passwordHash: string,
    role: UserRole,
  ) {
    const now = new Date();
    return new User({
      id: crypto.randomUUID().toString(),
      name,
      email,
      passwordHash,
      role,
      createdAt: now,
      updatedAt: now,
    });
  }

  public static with(props: UserProps) {
    return new User(props);
  }

  public get id() {
    return this.props.id;
  }

  public get name() {
    return this.props.name;
  }

  public get email() {
    return this.props.email;
  }

  public get role() {
    return this.props.role;
  }

  public get createdAt() {
    return this.props.createdAt;
  }

  public get updatedAt() {
    return this.props.updatedAt;
  }

  public get passwordHash() {
    return this.props.passwordHash;
  }

  public isAdmin(): boolean {
    return this.props.role === UserRole.ADMIN;
  }

  public changeName(name: string) {
    this.props.name = name;
  }

  public changePasswordHash(passwordHash: string) {
    this.props.passwordHash = passwordHash;
  }

  public changeRole(role: UserRole) {
    this.props.role = role;
  }
}
