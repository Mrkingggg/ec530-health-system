import pytest
from unittest.mock import call
from unittest.mock import patch
from app import app as flask_app, notification_queue, process_notify_queue

@pytest.fixture
def app():
    flask_app.config.update({
        "TESTING": True,
    })
    return flask_app

@pytest.fixture
def client(app):
    return app.test_client()


@patch('app.print')  # Mocking the print statement in process_notify_queue
def test_process_multiple_notifications(mock_print, app):
    with app.app_context():
        # Enqueue multiple notifications
        notifications = [
            {'userId': 1, 'msg': 'Test Notification 1'},
            {'userId': 2, 'msg': 'Test Notification 2'},
            {'userId': 3, 'msg': 'Test Notification 3'},
        ]
        for noti in notifications:
            notification_queue.put(noti)

        assert notification_queue.qsize() == len(notifications)

        # Process each notification in the queue
        for noti in notifications:
            process_notify_queue()
        
        # Verify all notifications were processed as expected
        expected_calls = [call(f"Send notification to user: {noti['userId']}: {noti['msg']}") for noti in notifications]
        mock_print.assert_has_calls(expected_calls, any_order=True)

        assert notification_queue.empty()
