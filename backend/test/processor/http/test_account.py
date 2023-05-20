import unittest
import unittest.mock as mock

from base import do, enums
import exceptions as exc  # noqa
import processor.http.account as account


class TestSearchAccount(unittest.IsolatedAsyncioTestCase):
    def setUp(self) -> None:
        self.search_account_db_ret_val = [do.Account(
            id=1, username='wsa', email='wsa@ntu.im',
            notification_preference=enums.NotificationPreference.email,
            is_google_login=False,
            line_token=None
        )]
        self.expect_output = {
            'data': account.SearchAccountOutput(
                accounts=[account.AccountInfo(id=1, username='wsa', email='wsa@ntu.im')]
            ),
            'error': None,
        }

    async def test_search_one_account(self):
        with mock.patch('persistence.database.account.search') as mock_func:
            mock_func.return_value = self.search_account_db_ret_val
            res = await account.search_account("Amber")
            assert res == self.expect_output


class TestAddAccount(unittest.IsolatedAsyncioTestCase):
    def setUp(self) -> None:
        self.input_data = account.AddAccountInput(
            username='test',
            password='test',
            email='test@gmail.com',
        )
        self.happy_path_expect_output = {
            'data': account.AddAccountOutput(id=4),
            'error': None,
        }
        self.username_exist_expect_output = {
            'data': None,
            'error': exc.UsernameExists.__name__,
        }
        self.normal_email_exist_expect_output = {
            'data': None,
            'error': exc.EmailExist.__name__,
        }
        self.normal_account = do.Account(
            id=1,
            username='username',
            email='email',
            is_google_login=False,
            notification_preference=enums.NotificationPreference.email,
        )
        self.google_email_exist_expect_output = {
            'data': None,
            'error': exc.EmailRegisteredByGoogle.__name__,
        }
        self.google_account = do.Account(
            id=1,
            username='username',
            email='email',
            is_google_login=True,
            notification_preference=enums.NotificationPreference.email,
        )
        self.illegal_input_data = account.AddAccountInput(
            username='test!@#$/^%',
            password='test',
            email='test@gmail.com',
        )
        self.illegal_char_expect_output = {
            'data': None,
            'error': exc.IllegalCharacter.__name__,
        }

    async def test_add_account_happy_path(self):
        @mock.patch('persistence.database.account.read_by_email', mock.MagicMock(side_effect=exc.NotFound))
        @mock.patch('persistence.database.account.add', mock.AsyncMock(return_value=4))
        @mock.patch('persistence.database.email_verification.add', mock.AsyncMock(return_value=None))
        @mock.patch('persistence.email.verification.send', mock.AsyncMock(return_value=None))
        async def test(input_data):
            return await account.add_account(data=input_data)

        res = await test(self.input_data)
        assert res == self.happy_path_expect_output

    async def test_add_account_username_exist(self):
        @mock.patch('persistence.database.account.read_by_email', mock.MagicMock(side_effect=exc.NotFound))
        @mock.patch('persistence.database.account.add', mock.AsyncMock(side_effect=exc.UniqueViolationError))
        async def test(input_data):
            return await account.add_account(data=input_data)

        res = await test(self.input_data)
        assert res == self.username_exist_expect_output

    async def test_add_account_normal_email_exist(self):
        @mock.patch('persistence.database.account.read_by_email', mock.AsyncMock(return_value=self.normal_account))
        async def test(input_data):
            return await account.add_account(data=input_data)

        res = await test(self.input_data)
        assert res == self.normal_email_exist_expect_output

    async def test_add_account_google_email_exist(self):
        @mock.patch('persistence.database.account.read_by_email', mock.AsyncMock(return_value=self.google_account))
        async def test(input_data):
            return await account.add_account(data=input_data)

        res = await test(self.input_data)
        assert res == self.google_email_exist_expect_output

    async def test_acc_account_illegal_input(self):
        res = await account.add_account(self.illegal_input_data)
        assert res == self.illegal_char_expect_output
