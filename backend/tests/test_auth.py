from fastapi.testclient import TestClient
from sqlalchemy import select

from app.core.security import verify_password
from app.db.models import User, Wallet
from tests.conftest import TestingSessionLocal


API = '/api/v1'
PASSWORD = 'StrongPass123!'


def register(client: TestClient, email: str, role: str = 'customer') -> dict:
    response = client.post(
        f'{API}/auth/register',
        json={
            'full_name': 'Test User',
            'email': email,
            'password': PASSWORD,
            'role': role,
            'business_name': 'Test Shop' if role == 'merchant' else None,
        },
    )
    assert response.status_code == 201, response.text
    return response.json()


def login(client: TestClient, email: str, password: str = PASSWORD) -> dict:
    response = client.post(
        f'{API}/auth/login', json={'email': email, 'password': password}
    )
    assert response.status_code == 200, response.text
    return response.json()


def auth_header(token: str) -> dict[str, str]:
    return {'Authorization': f'Bearer {token}'}


def test_register_hashes_password_and_creates_wallet(client: TestClient) -> None:
    body = register(client, 'new.customer@example.com')

    assert body['role'] == 'customer'
    assert body['email'] == 'new.customer@example.com'
    assert 'password' not in body
    assert 'hashed_password' not in body

    with TestingSessionLocal() as db:
        user = db.scalar(select(User).where(User.email == body['email']))
        assert user is not None
        assert user.hashed_password != PASSWORD
        assert verify_password(PASSWORD, user.hashed_password)
        wallet = db.scalar(select(Wallet).where(Wallet.user_id == user.id))
        assert wallet is not None
        assert float(wallet.balance) == 1000.00
        assert float(wallet.offline_spending_limit) == 500.00


def test_register_merchant_role_and_business_name(client: TestClient) -> None:
    body = register(client, 'shop@example.com', role='merchant')
    assert body['role'] == 'merchant'
    assert body['business_name'] == 'Test Shop'

    with TestingSessionLocal() as db:
        user = db.scalar(select(User).where(User.email == body['email']))
        assert user is not None
        assert user.role.value == 'merchant'


def test_register_rejects_duplicate_email(client: TestClient) -> None:
    register(client, 'duplicate@example.com')
    response = client.post(
        f'{API}/auth/register',
        json={
            'full_name': 'Another User',
            'email': 'duplicate@example.com',
            'password': PASSWORD,
            'role': 'merchant',
        },
    )
    assert response.status_code == 409


def test_register_validation_errors(client: TestClient) -> None:
    base = {'full_name': 'Valid Name', 'email': 'valid@example.com',
            'password': PASSWORD, 'role': 'customer'}

    invalid_email = client.post(f'{API}/auth/register', json={**base, 'email': 'bad-email'})
    assert invalid_email.status_code == 422
    assert 'errors' in invalid_email.json()

    short_password = client.post(f'{API}/auth/register', json={**base, 'password': 'short'})
    assert short_password.status_code == 422

    invalid_role = client.post(f'{API}/auth/register', json={**base, 'role': 'admin'})
    assert invalid_role.status_code == 422


def test_login_and_current_user(client: TestClient) -> None:
    register(client, 'login@example.com')
    tokens = login(client, 'login@example.com')

    assert tokens['token_type'] == 'bearer'
    assert tokens['user']['email'] == 'login@example.com'

    me = client.get(f'{API}/auth/me', headers=auth_header(tokens['access_token']))
    assert me.status_code == 200
    assert me.json()['email'] == 'login@example.com'


def test_login_rejects_wrong_password(client: TestClient) -> None:
    register(client, 'wrongpass@example.com')
    response = client.post(
        f'{API}/auth/login',
        json={'email': 'wrongpass@example.com', 'password': 'NotTheRightOne1!'},
    )
    assert response.status_code == 401


def test_protected_route_requires_token(client: TestClient) -> None:
    assert client.get(f'{API}/auth/me').status_code == 401
    response = client.get(
        f'{API}/auth/me', headers={'Authorization': 'Bearer not-a-real-token'}
    )
    assert response.status_code == 401


def test_logout_revokes_session(client: TestClient) -> None:
    register(client, 'logout@example.com')
    tokens = login(client, 'logout@example.com')
    headers = auth_header(tokens['access_token'])

    logout = client.post(f'{API}/auth/logout', headers=headers)
    assert logout.status_code == 200
    assert client.get(f'{API}/auth/me', headers=headers).status_code == 401


def test_logout_only_revokes_current_session(client: TestClient) -> None:
    register(client, 'two.sessions@example.com')
    first = login(client, 'two.sessions@example.com')['access_token']
    second = login(client, 'two.sessions@example.com')['access_token']

    assert client.post(f'{API}/auth/logout', headers=auth_header(first)).status_code == 200
    assert client.get(f'{API}/auth/me', headers=auth_header(first)).status_code == 401
    assert client.get(f'{API}/auth/me', headers=auth_header(second)).status_code == 200


def test_seeded_demo_accounts_can_log_in(seeded_client: TestClient) -> None:
    customer = login(seeded_client, 'customer@grampay.demo', 'Demo@1234')
    merchant = login(seeded_client, 'merchant@grampay.demo', 'Demo@1234')

    assert customer['user']['role'] == 'customer'
    assert merchant['user']['role'] == 'merchant'
    assert customer['user']['full_name'] == 'Ananya Sharma'
    assert merchant['user']['business_name'] == 'Gram Kirana Store'
