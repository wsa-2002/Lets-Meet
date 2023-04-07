from datetime import datetime

from starlette_context import context

from security import AuthedAccount
from base import mcs
import exceptions as exc  # noqa


class Request(metaclass=mcs.Singleton):
    _context = context

    @property
    def account(self) -> AuthedAccount:
        if account := self._context.get('account'):
            return account
        raise exc.NoPermission


    @property
    def time(self) -> datetime:
        return self._context.get('time')


request = Request()
