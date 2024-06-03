const axios = require("axios").default;

export const sendSms = (phone: string, sms: string) => {
    // const greenwebsms = new URLSearchParams();
    // greenwebsms.append("token", `${process.env.BD_BULK_SMS_TOKEN}`);
    // greenwebsms.append("to", phone);
    // greenwebsms.append("message", sms);
    // axios
    //     .post("http://api.greenweb.com.bd/api.php", greenwebsms)
    //     .then((response: any) => {
    //         console.log("send sms success", response.data);
    //     })
    //     .catch((error: any) => {
    //         console.error("send sms error", error);
    //     });
    return true;
};
