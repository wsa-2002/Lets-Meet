import requests

from linebot import WebhookParser, LineBotApi, WebhookHandler
from linebot.models import TextSendMessage

from config import LineConfig, line_config
import exceptions as exc  # noqa
from security import decode_jwt_without_verification


class LineHandler:
    token_endpoint = 'https://api.line.me/oauth2/v2.1/token'
    verify_endpoint = 'https://api.line.me/oauth2/v2.1/verify'
    userinfo_endpoint = 'https://api.line.me/oauth2/v2.1/userinfo'

    def __init__(self, config: LineConfig):
        self.line_bot_api = LineBotApi(config.message_access_token)
        self.parser = WebhookParser(config.message_secret)
        self.handler = WebhookHandler(config.message_secret)
        self.redirect_uri = config.login_redirect_uri
        self.login_client_id = config.login_client_id
        self.login_secret = config.login_secret

    async def push_message(self, raw_message: str, user_id: str):
        messages = TextSendMessage(text=raw_message)
        self.line_bot_api.push_message(to=user_id, messages=messages)

    def _compose_payload(self, code: str) -> dict:
        return {
            'grant_type': 'authorization_code',
            'code': code,
            'redirect_uri': self.redirect_uri,
            'client_id': self.login_client_id,
            'client_secret': self.login_secret,
        }

    async def get_user_id(self, payload: dict):
        res = requests.post(self.token_endpoint, data=payload)
        if res.status_code == 200:
            id_token = res.json().get('id_token')
            decoded_token = decode_jwt_without_verification(id_token)
            return decoded_token.get('sub')
        else:
            raise exc.LoginFailed

    async def login(self, code: str) -> str:
        """
        @param code: code send from LINE login api server
        @return: user_id: str, user's identifier in LINE
        """
        payload = self._compose_payload(code)
        user_id = await self.get_user_id(payload=payload)
        return user_id

    def compose_redirect_uri(self, state: str):
        return (f"https://access.line.me/oauth2/v2.1/authorize?response_type=code&client_id={self.login_client_id}"
                f"&redirect_uri={self.redirect_uri}&state={state}&scope=profile%20openid%20email")


line_handler = LineHandler(config=line_config)
