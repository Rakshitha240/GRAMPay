from decimal import Decimal

from fastapi.testclient import TestClient
from sqlalchemy import func, select

from app.db.models import Transaction, User
from app.db.seed import seed
from tests.conftest import TestingSessionLocal

API = '/api/v1'


def token_for(client: TestClient, email: str) -> str:
    response = client.post(
        f'{API}/auth/login', json={'email': email, 'password': 'Demo@1234'}
    )
    assert response.status_code == 200, response.text
    return response.json()['access_token']


def test_customer_dashboard_contains_wallet_and_transactions(seeded_client: TestClient) -> None:
    token = token_for(seeded_client, 'customer@grampay.demo')
    response = seeded_client.get(
        f'{API}/dashboard/customer', headers={'Authorization': f'Bearer {token}'}
    )

    assert response.status_code == 200, response.text
    body = response.json()
    assert body['user']['role'] == 'customer'
    assert Decimal(body['wallet']['balance']) == Decimal('2500.00')
    assert Decimal(body['wallet']['offline_spending_limit']) == Decimal('500.00')
    assert len(body['recent_transactions']) == 4
    directions = {item['direction'] for item in body['recent_transactions']}
    assert directions == {'in', 'out'}


def test_merchant_dashboard_contains_sales_overview(seeded_client: TestClient) -> None:
    token = token_for(seeded_client, 'merchant@grampay.demo')
    response = seeded_client.get(
        f'{API}/dashboard/merchant', headers={'Authorization': f'Bearer {token}'}
    )

    assert response.status_code == 200, response.text
    body = response.json()
    assert body['user']['role'] == 'merchant'
    assert Decimal(body['sales_overview']['total_received']) == Decimal('330.00')
    assert body['sales_overview']['completed_count'] == 2
    assert body['sales_overview']['pending_count'] == 1
    assert len(body['recent_transactions']) == 4


def test_role_based_dashboard_access(seeded_client: TestClient) -> None:
    customer_token = token_for(seeded_client, 'customer@grampay.demo')
    merchant_token = token_for(seeded_client, 'merchant@grampay.demo')

    customer_to_merchant = seeded_client.get(
        f'{API}/dashboard/merchant', headers={'Authorization': f'Bearer {customer_token}'}
    )
    merchant_to_customer = seeded_client.get(
        f'{API}/dashboard/customer', headers={'Authorization': f'Bearer {merchant_token}'}
    )

    assert customer_to_merchant.status_code == 403
    assert merchant_to_customer.status_code == 403


def test_wallet_and_transaction_endpoints(seeded_client: TestClient) -> None:
    token = token_for(seeded_client, 'customer@grampay.demo')
    headers = {'Authorization': f'Bearer {token}'}

    wallet = seeded_client.get(f'{API}/wallet/me', headers=headers)
    assert wallet.status_code == 200
    assert Decimal(wallet.json()['balance']) == Decimal('2500.00')

    transactions = seeded_client.get(f'{API}/transactions/me?limit=2', headers=headers)
    assert transactions.status_code == 200
    assert len(transactions.json()) == 2

    invalid_limit = seeded_client.get(f'{API}/transactions/me?limit=0', headers=headers)
    assert invalid_limit.status_code == 422


def test_database_health_check(client: TestClient) -> None:
    assert client.get(f'{API}/health').json()['status'] == 'ok'
    response = client.get(f'{API}/health/db')
    assert response.status_code == 200
    assert response.json()['database'] == 'reachable'


def test_seed_is_idempotent(client: TestClient) -> None:
    with TestingSessionLocal() as db:
        seed(db)
        seed(db)
        assert db.scalar(select(func.count()).select_from(User)) == 2
        assert db.scalar(select(func.count()).select_from(Transaction)) == 4
