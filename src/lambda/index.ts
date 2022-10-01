import * as aws from "aws-sdk";

export const handler = async (event: any, context: any) => {
    console.log(event);

    // SES
    const ses = new aws.SES({ region: "ap-northeast-1" });
    const params: aws.SES.SendEmailRequest = {
        Destination: {
            ToAddresses: ["writebook861.2020@gmail.com"],
        },
        Message: {
            Subject: { Data: "Hello World from AWS" },
            Body: {
                Text: { Data: "Hello World from AWS!" },
            },
        },
        Source: "miyazaki.carp@gmail.com",
    }
    return ses.sendEmail(params).promise();
}
