import pytest
from unittest.mock import patch
from backend.app import app as flask_app, report_queue, process_report_queue

@pytest.fixture
def app():
    flask_app.config.update({
        "TESTING": True,
        # Other test configurations as needed
    })
    # Push an application context for the duration of the test
    with flask_app.app_context():
        yield flask_app

@pytest.fixture
def client(app):
    return app.test_client()

@patch('app.Measurements.query')
def test_multiple_report_requests(mock_query, client):
    # Configure the mock to simulate existing users
    mock_query.filter_by.return_value.first.return_value = True

    user_ids = [1, 2, 3]  # Simulate 3 different users requesting reports
    report_ids = []

    # Simulate each user requesting a report
    for user_id in user_ids:
        response = client.get(f'/api/reports/gen/{user_id}')
        assert response.status_code == 202
        report_ids.append(response.json['reportId'])

    # Check if all requests are queued
    # assert report_queue.qsize() == len(user_ids)

    # Process the report queue
    while not report_queue.empty():
        process_report_queue()

    # Check each report's status
    for report_id in report_ids:
        status_response = client.get(f'/api/reports/status/{report_id}')
        if status_response.status_code == 202:
        
            pass
        else:
            assert status_response.status_code == 200
            assert status_response.json['status'] == 'completed'

    # Ensure the queue is empty after processing
    assert report_queue.empty()
