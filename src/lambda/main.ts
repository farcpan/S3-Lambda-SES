import * as aws from 'aws-sdk';

export const handler = async (event: any, context: any) => {
    console.log(event);

    const ses = new aws.SES({ region: "ap-northeast-1" });
    const params: aws.SES.SendEmailRequest = {
        Destination: {
            ToAddresses: ["送信先メールアドレス"],
        },
        Message: {
            Subject: { Data: "[Test Email] Hello World from AWS!" },
            Body: {
                Text: { Data: "Hello World from AWS!" },
            },
        },
        Source: "送信元メールアドレス",
    }

    return ses.sendEmail(params).promise();
}
