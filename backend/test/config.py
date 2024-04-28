class Config:
    SQLALCHEMY_TRACK_MODIFICATIONS = False
    TESTING = True

class TestConfig(Config):
    SQLALCHEMY_DATABASE_URI = 'sqlite:///:memory:'  # memory database
