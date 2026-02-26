export type WelcomeUserEmailInput = {
  name: string;
};

export const welcomeUserEmailTemplate = (input: WelcomeUserEmailInput) => {
  return {
    subject: "Bem-vindo(a)! 🎉",
    text: `Olá ${input.name}! Bem-vindo(a) ao app!`,
    html: `
      <div style="font-family: Arial, sans-serif; line-height: 1.4">
        <h2>Olá, ${input.name}! 🎉</h2>
        <p>Seu cadastro foi concluído com sucesso.</p>
        <p>Se precisar de algo, é só responder esse email.</p>
      </div>
    `,
  };
};
