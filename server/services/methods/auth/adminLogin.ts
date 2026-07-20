import bcrypt from "bcrypt";

interface ISellerLogin {
    username: string,
    password: string,
    rememberMe: boolean,
    event: any
}

const adminLogin = async ({username, password, rememberMe, event} : ISellerLogin) => {

    const config = useRuntimeConfig();




    try {

          if (username.trim() !== config.adminUserName.trim()) {

                return {
                    success: false,
                    message: "Some data wrong"

                }
            }
    
            const validPassword = await bcrypt.compare(password.trim(), config.adminPassword);

    
            if (!validPassword) {
                return {
                    success: false,
                    message: "Some data wrong"
                }
            }
    
            const maxAge = rememberMe ? 60 * 60 * 24 * 7 : 60 * 60;
    
            setCookie(event, "role", "admin", {
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