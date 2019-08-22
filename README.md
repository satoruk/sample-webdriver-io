# Sample Webdriver IO

- Webdriver IO
- Typescript
- Test runner
  - Jasmine
  - Jest

```sh
# run to test with WDIO test runner(Jasmine)
yarn test:wdio
```

## Quick Attempt with docker

手軽に試したい場合は以下の様にDockerでコンテナを立ち上げて、テストレポートを見れる様にします

```sh
docker run --rm -p 8080:8080 -it satoruk/node:10.16.3-buster-allure bash

git clone https://github.com/satoruLk/sample-webdriver-io.git
cd sample-webdriver-io/
yarn install
yarn test:wdio:report
ls -al dest
yarn serve
```

あとはコンテナ内でhttp-serverが起動するのでローカル(ホスト)のブラウザで参照できます.

- http://localhost:8080/
