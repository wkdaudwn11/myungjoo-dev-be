#!/bin/bash
set -e

TEXT="$1"
COMMIT="$2"
MESSAGE="$3"
ACTIONS_URL="$4"
SITE_URL="$5"

if [[ -z "$TEXT" || -z "$COMMIT" || -z "$MESSAGE" || -z "$ACTIONS_URL" ]]; then
  echo "필수 인자가 누락되었습니다. (TEXT, COMMIT, MESSAGE, ACTIONS_URL)"
  exit 1
fi

if [ -n "$SITE_URL" ]; then
  SITE_BUTTON=$(jq -n --arg siteUrl "$SITE_URL" '
    {
      "type": "button",
      "text": { "type": "plain_text", "text": "사이트 보기" },
      "url": ("https://" + $siteUrl),
      "style": "primary"
    }
  ')
fi

GITHUB_BUTTON=$(jq -n --arg actionsUrl "$ACTIONS_URL" '
  {
    "type": "button",
    "text": { "type": "plain_text", "text": "Github Actions 보기" },
    "url": $actionsUrl,
    "style": "primary"
  }
')

if [ -n "$SITE_BUTTON" ]; then
  ACTIONS=$(jq -n --argjson siteButton "$SITE_BUTTON" --argjson githubButton "$GITHUB_BUTTON" '
    [$siteButton, $githubButton]
  ')
else
  ACTIONS=$(jq -n --argjson githubButton "$GITHUB_BUTTON" '
    [$githubButton]
  ')
fi

PAYLOAD=$(jq -n \
  --arg text "$TEXT" \
  --arg commit "$COMMIT" \
  --arg message "$MESSAGE" \
  --argjson actions "$ACTIONS" '
{
  channel: env.SLACK_CHANNEL_NAME,
  blocks: [
    {
      type: "section",
      text: { type: "mrkdwn", text: $text }
    },
    {
      type: "section",
      fields: [
        { type: "mrkdwn", text: "*Commit Hash:*\n\($commit)" },
        { type: "mrkdwn", text: "*Commit Message:*\n\($message)" }
      ]
    },
    {
      type: "actions",
      elements: $actions
    }
  ]
}')

response=$(curl -s -o /dev/null -w "%{http_code}" -X POST "$SLACK_API_URL" \
  -H "Authorization: Bearer $SLACK_BOT_USER_OAUTH_TOKEN" \
  -H "Content-type: application/json" \
  -d "$PAYLOAD")

if [ "$response" != "200" ]; then
  echo "Slack 메시지 전송 실패. HTTP 상태 코드: $response"
  exit 1
fi

echo "Slack 메시지 전송 성공."
