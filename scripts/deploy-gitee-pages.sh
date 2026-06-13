#!/usr/bin/env bash
set -euo pipefail

GITEE_USER="${GITEE_USER:-xqnode}"
GITEE_REPO="${GITEE_REPO:-xqnode/CultGame}"
PAGES_BRANCH="${PAGES_BRANCH:-gh-pages}"

if [ -z "${GITEE_TOKEN:-}" ]; then
  echo "错误: 请在 Gitee Go 流水线变量中配置私密变量 GITEE_TOKEN"
  exit 1
fi

echo "==> 安装依赖并构建（Gitee Pages）"
export GITEE_PAGES=true
npm config set registry https://registry.npmmirror.com
npm ci
npm run build

echo "==> 推送构建产物到 ${PAGES_BRANCH} 分支"
cd dist
git init -q
git config user.email "xqnode@163.com"
git config user.name "GiteeGo Pipeline"
git checkout -b "${PAGES_BRANCH}"
git add -A
git commit -m "deploy: Gitee Pages $(date -u +%Y-%m-%dT%H:%M:%SZ)"

git push -f "https://${GITEE_USER}:${GITEE_TOKEN}@gitee.com/${GITEE_REPO}.git" HEAD:"${PAGES_BRANCH}"

echo "==> 触发 Gitee Pages 更新"
HTTP_CODE=$(curl -s -o /tmp/pages-build.json -w "%{http_code}" -X POST \
  "https://gitee.com/api/v5/repos/${GITEE_REPO}/pages/builds?access_token=${GITEE_TOKEN}")

echo "Pages API 响应码: ${HTTP_CODE}"
cat /tmp/pages-build.json || true

if [ "${HTTP_CODE}" -ge 400 ]; then
  echo "警告: Pages 更新请求失败。若首次部署，请先在仓库「服务 → Gitee Pages」手动启动并选择 gh-pages 分支。"
  exit 1
fi

echo "==> 部署完成"
