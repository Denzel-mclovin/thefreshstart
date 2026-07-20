export const useCheckoutUrl = () => {

  const baseUrl =
    "https://shop.thepillarsofwisdom.com/checkouts/cn/hWN9ob87gSjCvMHAS4VBSaET/en-mx?_r=AQABy8F_mjJv5yQXL0ADON3R-BhHcme7Ukoxi9EKa-wvVvI&auto_redirect=false&edge_redirect=true&skip_shop_pay=true"

  const utmCookie = useCookie<any>("utm_data")

  const buildUrl = () => {

    const start = localStorage.getItem("landing_time")

    const timeOnPage = start
      ? Math.floor((Date.now() - Number(start)) / 1000)
      : 0

    const source = utmCookie.value?.utm_source || "social"
    const post = utmCookie.value?.utm_content || "post"

    const params = new URLSearchParams({
      utm_source: source,
      utm_medium: "social",
      utm_campaign: "post",
      utm_content: `${post}_${timeOnPage}s`
    })

    return `${baseUrl}&${params.toString()}`
  }

  return {
    buildUrl
  }
}