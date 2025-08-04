import time
import logging
import utils
import yaml

log = logging.getLogger()

def test_boot(device_config):
    search_string = "Enter inactive"
    log.info("Booting...")
    log.info("Check for \'{}\' string".format(search_string))
    assert utils.read_serial(device_config["serial"], timeout_ms=60000).find(search_string) != -1
