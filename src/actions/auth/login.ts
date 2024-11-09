'use server';
 
import { signIn } from '@/auth.config';
import { AuthError } from 'next-auth';
import { redirect } from 'next/dist/server/api-utils';
 
// ...
 
export async function authenticate(
  prevState: string | undefined,
  formData: FormData,
) {
  try {


    await signIn('credentials', {
        ...Object.fromEntries(formData.entries()),
        redirect:false
    });

    return 'Success'
    


  } catch (error) {
    console.log(error);
   


    return 'CredentialsSignin';
    // throw error;
  }
}



export const login = async(email:string, password:string) => {

  try {

    await signIn('credentials',{email, password})

    return {ok: true};
    
  }catch (error) {
    console.log(error);
    
    return {
      ok: false,
      message: 'no se puedo iniciar session',
    }
  }

}