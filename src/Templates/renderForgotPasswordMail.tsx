import { renderEmail } from 'react-html-email';
import { PasswordResetEmail } from './forgotPasswordMail';

export const RenderForgotPasswordEmail = ( name: string, docId: string, recoverUrl: string ) => {
    return renderEmail(<PasswordResetEmail name={name} recoverUrl={recoverUrl} docId={docId} />)
}