



async function getShopifyProducts() {

   

    try{

        const shopifyStoreDomain = process.env.SHOPIFY_STORE_DOMAIN;
        const shopifyApiSecret = process.env.SHOPIFY_API_SECRET;
        const shopifyAccessToken = process.env.SHOPIFY_ACCESS_TOKEN as string;

        // return {
        //     status: "success",
        //     domain: shopifyStoreDomain,
        //     secret: shopifyApiSecret,
        //     token: shopifyAccessToken
        // }

        const response = await $fetch(`https://${shopifyStoreDomain}/admin/api/2025-07/products.json`, {
            headers: {
                "X-Shopify-Access-Token": shopifyAccessToken,
                "Content-Type": "application/json",
            },
        }) as any;

        // if (!response.products) {
        //     return {
        //         success: false,
        //         message: "No products found",
        //     };
        // }

        return {
            success: true,
            products: response
            // products: response.products.map((p: any) => ({
            //     id: p.id,
            //     title: p.title,
            //     variants: p.variants.map((v: any) => ({
            //     id: v.id,
            //     title: v.title,
            //     price: v.price,
            //     })),
            // })),
        };

    } catch (err) {

        console.log(`Error getting products: ${err}`)
        return {
            statusCode: 500,
            message: "Error getting products",
            error: err
        }

    }

}



export default getShopifyProducts