import { redirect } from "next/navigation";
import { auth } from "../../auth.config";

export default  async function ShopLayout({ children }: { 
    children: React.ReactNode 
}) {

    const session = await auth();
    


    if ( session?.user ) {
        redirect('/');
    }

    console.log({ session  })




    return(


            <div>
                { children }
            </div>
    )



}