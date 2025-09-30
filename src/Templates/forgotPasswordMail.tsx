import React from "react";
import {
  Email,
  Item,
  Span,
  A,
  Box,
  Image,
} from "react-html-email";

interface ForgotPasswordMailProps {
  name: string;
  docId: string;
  recoverUrl: string;
}

export const ForgotPasswordMail: React.FC<ForgotPasswordMailProps> = ({
  name,
  docId,
  recoverUrl,
}) => {
  return (
    <Email
      title="Redefinição de senha - SISAPI"
      headCSS={`
        @import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:ital,wght@0,200..800;1,200..800&family=Poppins:ital,wght@0,100;0,200;0,300;0,400;0,500;0,600;0,700;0,800;0,900;1,100;1,200;1,300;1,400;1,500;1,600;1,700;1,800;1,900&display=swap');
        body { font-family: 'Poppins', sans-serif; background-color: #f9f9f9; }
      `}
    >
      {/* Header azul */}
      <Box style={styles.header}> 
        <Span style={styles.logo}>
          <Image src={ window.location.origin + "/mail-logo.png" } width={400}/>
        </Span>
      </Box>

      {/* Conteúdo */}
      <Box style={styles.container}>
        <Item>
          <Span style={styles.title}>Redefinição de senha</Span>
        </Item>
        <Item>
          <Span style={styles.docId}>CPF: {docId}</Span>
        </Item>

        <Item>
          <Span style={styles.text}>
            Olá {name},<br />
            Recebemos uma solicitação para redefinir a senha da sua conta. Se foi
            você quem fez esta solicitação, clique no botão abaixo para
            prosseguir.
          </Span>
        </Item>

        <Item align="center">
          <A href={recoverUrl} style={styles.button}>
            Redefinir minha senha
          </A>
        </Item>

        <Item>
          <Span style={styles.textSmall}>
            Caso tenha algum problema ao abrir o link, entre em contato através
            do nosso suporte clicando{" "}
            <A href="https://seusite.com/suporte">aqui</A>.
          </Span>
        </Item>

        <Item>
          <Span style={styles.textSmall}>
            Importante: Este email de redefinição é válido por 24 horas. <br />
            Se você não solicitou a redefinição de senha, pode ignorar este email
            com segurança.
          </Span>
        </Item>

        <Item>
          <Span style={styles.textSmall}>
            Atenção: Esta mensagem é enviada automaticamente pelo sistema, não é
            necessário respondê-la.
          </Span>
        </Item>

        <Item>
          <Span style={styles.footer}>
            Você está recebendo esta mensagem porque está cadastrado em nosso
            sistema <b>SISAPI</b>.
          </Span>
        </Item>
      </Box>
    </Email>
  );
};

// 🎨 Estilos inline
const styles = {
  header: {
    backgroundColor: "#0050a0",
    padding: "16px 24px",
    bordeRadius: "8px 8px 0 0"
  },
  logo: {
    color: "#fff",
    fontSize: "20px",
    fontWeight: "bold",
    fontFamily: "'Poppins', sans-serif",
  },
  subtitle: {
    fontWeight: "normal",
    fontSize: "12px",
  },
  container: {
    backgroundColor: "#ffffff",
    padding: "24px",
  },
  title: {
    fontSize: "20px",
    fontWeight: "bold",
    marginBottom: "8px",
    display: "block",
    color: "#0050a0",
    fontFamily: "'Poppins', sans-serif",
  },
  docId: {
    color: "#0050a0",
    fontWeight: "bold",
    marginBottom: "16px",
    display: "block",
    fontFamily: "'Poppins', sans-serif",
  },
  text: {
    fontSize: "14px",
    lineHeight: "20px",
    marginBottom: "20px",
    display: "block",
    fontFamily: "'Poppins', sans-serif",
  },
  textSmall: {
    fontSize: "12px",
    color: "#555",
    marginBottom: "12px",
    display: "block",
    fontFamily: "'Poppins', sans-serif",
  },
  button: {
    backgroundColor: "#0050a0",
    color: "#fff",
    padding: "12px 20px",
    borderRadius: "4px",
    textDecoration: "none",
    fontWeight: "bold",
    display: "inline-block",
    margin: "20px 0",
    fontFamily: "'Poppins', sans-serif",
  },
  footer: {
    fontSize: "11px",
    color: "#777",
    textAlign: "center" as const,
    marginTop: "20px",
    display: "block",
    fontFamily: "'Poppins', sans-serif",
  },
};
