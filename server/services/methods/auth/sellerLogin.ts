import bcrypt from "bcrypt";
import { sendRedirect } from 'h3'

interface ISellerLogin {
    username: string,
    password: string,
    rememberMe: boolean,
    event: any
}

const adminLogin = async ({username, password, rememberMe, event} : ISellerLogin) => {

    const config = useRuntimeConfig();







    try {

          if (username.trim() !== config.sellerUsername.trim()) {

                return {
                    success: false,
                    message: "Some data wrong"

                }
            }

            // console.log( 'username correct');
    
            const validPassword = await bcrypt.compare(password.trim(), config.sellerPassword);



    
            if (!validPassword) {
                return {
                    success: false,
                    message: "Some data wrong"
                }
            }
    
            const maxAge = rememberMe ? 60 * 60 * 24 * 7 : 60 * 60;
    
            setCookie(event, "role", "seller", {
                // httpOnly: true,
                path: "/",
                maxAge: maxAge
            });


      
    
            return { success: true };


    } catch (err ) {
        console.log(`Something went wrong ${err}`);
    }
}


export default adminLogin;