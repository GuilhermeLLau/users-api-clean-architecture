export const resetPasswordEmailTemplate = (input: {
  name: string;
  token: string;
}) => ({
  subject: "Redefinição de senha",
  text: `Olá ${input.name}. Seu código de redefinição é: ${input.token}`,
  html: `
    <div style="font-family: Arial">
      <p>Olá ${input.name},</p>
      <p>Seu código de redefinição é:</p>
      <h2 style="letter-spacing:2px">${input.token}</h2>
      <p>Ele expira em 15 minutos.</p>
    </div>
  `,
});
