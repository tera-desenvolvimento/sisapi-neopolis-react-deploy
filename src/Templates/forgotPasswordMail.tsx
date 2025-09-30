import * as React from "react";
import {
  Html,
  Head,
  Preview,
  Body,
  Container,
  Section,
  Text,
  Button,
  Img,
  Hr,
  Link,
  Font,
} from "@react-email/components";

interface PasswordResetEmailProps {
  name: string;
  docId: string;
  recoverUrl: string;
}

export const PasswordResetEmail: React.FC<PasswordResetEmailProps> = ({
  name,
  docId,
  recoverUrl,
}) => {
  return (
    <Html>
      <Head>
        {/* Import da fonte Plus Jakarta Sans */}
        <Font
          fontFamily="Plus Jakarta Sans"
          fallbackFontFamily="Arial"
          webFont={{
            url: "https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;700&display=swap",
            format: "woff2",
          }}
          fontWeight={400}
          fontStyle="normal"
        />
      </Head>

      <Preview>Redefinição de senha - SISAPI</Preview>
      <Body style={main}>
        <Container style={container}>
          {/* Header azul */}
          <Section style={header}>
            <Text style={logo}>
              <Img src={window.location.origin + "/mail-logo.png"} width={200} />
            </Text>
          </Section>

          {/* Conteúdo */}
          <Section style={content}>
            <Text style={title}>Redefinição de senha</Text>
            <Text style={docIdText}>CPF: {docId}</Text>

            <Text style={paragraph}>
              Olá {name},
              <br />
              Recebemos uma solicitação para redefinir a senha da sua conta. Se foi você quem fez esta solicitação, clique no botão abaixo para prosseguir.
            </Text>

            <Button style={button} href={recoverUrl}>
              Redefinir minha senha
            </Button>

            <Text style={paragraphSmall}>
              Caso tenha algum problema ao abrir o link, entre em contato através do nosso suporte clicando{" "}
              <Link href="#">aqui</Link>.
            </Text>

            <Text style={paragraphSmall}>
              Importante: Este email de redefinição é válido por 24 horas. <br />
              Se você não solicitou a redefinição de senha, pode ignorar este email com segurança.
            </Text>

            <Text style={paragraphSmall}>
              Atenção: Esta mensagem é enviada automaticamente pelo sistema, não é necessário respondê-la.
            </Text>

            <Hr style={divider} />

            <Text style={footer}>
              Você está recebendo esta mensagem porque está cadastrado em nosso sistema <b>SISAPI</b>.
            </Text>
          </Section>
        </Container>
      </Body>
    </Html>
  );
};

// 🎨 Estilos inline
const main = {
  backgroundColor: "#f9f9f9",
  fontFamily: "'Plus Jakarta Sans', Arial, Helvetica, sans-serif",
};

const container = {
  maxWidth: "600px",
  margin: "0 auto",
  backgroundColor: "#ffffff",
  borderRadius: "6px",
  overflow: "hidden",
};

const header = {
  backgroundColor: "#0050a0",
  padding: "16px 24px",
};

const logo = {
  color: "#fff",
  fontSize: "20px",
  fontWeight: "bold",
  margin: 0,
} as React.CSSProperties;

const subtitle = {
  fontWeight: "normal",
  fontSize: "12px",
};

const content = {
  padding: "24px",
};

const title = {
  fontSize: "20px",
  fontWeight: "bold",
  marginBottom: "8px",
};

const docIdText = {
  color: "#0050a0",
  fontWeight: "bold",
  marginBottom: "16px",
};

const paragraph = {
  fontSize: "14px",
  lineHeight: "20px",
  marginBottom: "20px",
};

const paragraphSmall = {
  fontSize: "12px",
  color: "#555",
  marginBottom: "12px",
};

const button = {
  backgroundColor: "#0050a0",
  color: "#fff",
  padding: "12px 20px",
  borderRadius: "4px",
  textDecoration: "none",
  fontWeight: "bold",
  display: "inline-block",
  marginBottom: "20px",
};

const divider = {
  borderColor: "#eee",
  margin: "20px 0",
};

const footer = {
  fontSize: "11px",
  color: "#777",
  textAlign: "center" as const,
};
