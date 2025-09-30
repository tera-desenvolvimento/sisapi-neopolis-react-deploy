import { renderEmail } from 'react-html-email';
import { ForgotPasswordMail } from './forgotPasswordMail';

export const RenderForgotPasswordEmail = ( name: string, docId: string, recoverUrl: string ) => {
    return renderEmail(<ForgotPasswordMail name={name} recoverUrl={recoverUrl} docId={docId} />)
}