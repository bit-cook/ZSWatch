import pytest
import utils
import logging
import yaml
import serial
import time

logging.basicConfig(level=logging.INFO)


@pytest.fixture(scope="session")
def device_config(request):
    board = request.config.getoption("--board")
    with open("devices.yaml") as f:
        config = yaml.safe_load(f)
    device = config["devices"][board]

    # Open Serial connection
    serial_device = serial.Serial(device["serial_port"], baudrate=115200, timeout=5)

    # Return device config including serial handle
    yield {
        "board": str(board),
        "jlink_serial": device["jlink_serial"],
        "serial": serial_device
    }

    serial_device.close()


def pytest_addoption(parser):
    parser.addoption("--board", action="store", help="Board name from devices.yaml")

# Flash once before all tests
@pytest.fixture(scope="session", autouse=True)
def flash_device(device_config):
    print(f"\n Recovering device: {device_config['board']}")
    utils.recover(device_config)
    print(f"\n Flashing device: {device_config['board']}")
    utils.flash(device_config)
    time.sleep(1)

# Reset before each test
@pytest.fixture(autouse=True)
def reset_device(device_config):
    print(f"\n Resetting device: {device_config['board']}")
    utils.reset(device_config)
    time.sleep(1)