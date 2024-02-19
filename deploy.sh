#!/usr/bin/env sh

# abort on errors
set -e

# build
npm run build

# navigate into the build output directory
cd dist

# place .nojekyll to bypass Jekyll processing
echo > .nojekyll

# if you are deploying to a custom domain
# echo 'www.example.com' > CNAME

git init
git checkout -B main
git add -A
git commit -m 'deploy'

# ======= 下面兩種方式差異在部署的分支,擇一即可：

# === 部署至主線 main 上,開啟下面第兩個#
# if you are deploying to https://<USERNAME>.github.io
# git push -f git@github.com:<USERNAME>/<USERNAME>.github.io.git main

# === 部署到 gh-pages,開啟下面第兩個#(不熟悉可選此！)
# if you are deploying to https://<USERNAME>.github.io/<REPO>
git push -f git@github.com:sp1daTomm/SelectWave.git main:gh-pages

cd -