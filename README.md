# S3-Lambda-SES
Test project for S3+Lambda+SES

---

## Environment

* environment check
    ```
    $ cdk --version
    2.15.0 (build bf32cb1)
    ```
* Project initialization
    ```    
    $ cdk init --language=typescript
    ```
* Adding esbuild for transpile typescript code (Lambda function)
    ```
    $ cd src
    $ npm install --save-dev esbuild
    ```
    * If you do not install esbuild, docker is needed to cdk deploy(/diff/synth)

---

## SES設定

SESで事前にIdentityを作成する必要がある。
また、サンドボックス解除申請しない限りは、送信元だけでなく送信先のメールアドレスもSESに登録する必要がある。

* https://aws.amazon.com/jp/premiumsupport/knowledge-center/ses-554-400-message-rejected-error/

---

## 課題

Lambdaは多重呼び出しの可能性があるため、メールを多重送信しない仕組みが必要。

---

## 参考

* [Amazon SES と Lambda を組み合わせて E メールを送る方法](https://mseeeen.msen.jp/amazon-ses-send-email-using-lambda/)
* [CDKを使って既存S3バケットのPUTイベントをトリガーにLambda関数を実行しようとしたらハマった話](https://dev.classmethod.jp/articles/cdk-s3notification-kick-lambda/)

---