export type PasswordResetTokenProps = {
  id: string;
  tokenHash: string;
  userId: string;
  createdAt: Date;
  expiresAt: Date;
  used: boolean;
  usedAt?: Date | null;
};

export class PasswordResetToken {
  private constructor(private props: PasswordResetTokenProps) {}

  public static build(tokenHash: string, userId: string) {
    const now = new Date();
    const expires = new Date(now.getTime() + 5 * 60 * 1000);
    return new PasswordResetToken({
      id: crypto.randomUUID().toString(),
      tokenHash,
      userId,
      createdAt: now,
      expiresAt: expires,
      used: false,
      usedAt: null,
    });
  }

  public static with(props: PasswordResetTokenProps) {
    return new PasswordResetToken(props);
  }

  public get id(): string {
    return this.props.id;
  }

  public get tokenHash(): string {
    return this.props.tokenHash;
  }

  public get userId(): string {
    return this.props.userId;
  }

  public get createdAt(): Date {
    return this.props.createdAt;
  }

  public get expiresAt(): Date {
    return this.props.expiresAt;
  }

  public get used(): boolean {
    return this.props.used;
  }

  public get usedAt(): Date | null | undefined {
    return this.props.usedAt;
  }

  public isExpired(now = new Date()) {
    return now > this.props.expiresAt;
  }

  public revokeTokenHash() {
    this.props.used = true;
    this.props.usedAt = new Date();
  }
}
