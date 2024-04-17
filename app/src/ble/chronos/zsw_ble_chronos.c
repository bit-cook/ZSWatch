#include <zephyr/bluetooth/bluetooth.h>
#include <zephyr/bluetooth/hci.h>
#include <zephyr/logging/log.h>
#include <zephyr/kernel.h>
#include <zephyr/zbus/zbus.h>
#include <string.h>
#include <ctype.h>
#include <stdlib.h>
#include <errno.h>
#include <math.h>

#include "ui/zsw_ui.h"
#include "ble/ble_comm.h"
#include "ble/ble_transport.h"
#include "events/ble_event.h"
#include "events/music_event.h"
#include "zsw_ble_chronos.h"

LOG_MODULE_REGISTER(ble_chronos, CONFIG_ZSW_BLE_LOG_LEVEL);

static int parse_data(char *data, int len);
static void parse_time(char *data);
static void parse_time_zone(char *offset);
static void music_control_event_callback(const struct zbus_channel *chan);

ZBUS_CHAN_DECLARE(ble_comm_data_chan);
ZBUS_LISTENER_DEFINE(android_music_control_lis_chronos, music_control_event_callback);

static void send_ble_data_event(ble_comm_cb_data_t *data)
{
    struct ble_data_event evt;
    memcpy(&evt.data, data, sizeof(ble_comm_cb_data_t));

    zbus_chan_pub(&ble_comm_data_chan, &evt, K_MSEC(250));
}

static void music_control_event_callback(const struct zbus_channel *chan)
{
    const struct music_event *event = zbus_chan_const_msg(chan);

    uint8_t buf[50];
    int msg_len = 0;

    if (msg_len > 0) {
        ble_comm_send(buf, msg_len);
    }
}

void parse_time(char *start_time)
{
    ble_comm_cb_data_t cb;
    memset(&cb, 0, sizeof(cb));

    
    cb.type = BLE_COMM_DATA_TYPE_SET_TIME;
    send_ble_data_event(&cb);
}

void parse_time_zone(char *offset)
{
    ble_comm_cb_data_t cb;
    memset(&cb, 0, sizeof(cb));

    cb.type = BLE_COMM_DATA_TYPE_SET_TIME;

    send_ble_data_event(&cb);
}

static int parse_notify(char *data, int len)
{
    ble_comm_cb_data_t cb;
    memset(&cb, 0, sizeof(cb));

    cb.type = BLE_COMM_DATA_TYPE_NOTIFY;

    send_ble_data_event(&cb);

    return 0;
}

static int parse_notify_delete(char *data, int len)
{
    ble_comm_cb_data_t cb;
    memset(&cb, 0, sizeof(cb));

    cb.type = BLE_COMM_DATA_TYPE_NOTIFY_REMOVE;

    send_ble_data_event(&cb);

    return 0;
}

static int parse_weather(char *data, int len)
{
    ble_comm_cb_data_t cb;
    memset(&cb, 0, sizeof(cb));

    cb.type = BLE_COMM_DATA_TYPE_WEATHER;

    send_ble_data_event(&cb);

    return 0;
}

static int parse_musicinfo(char *data, int len)
{
    char *temp_value;
    int temp_len;
    ble_comm_cb_data_t cb;
    memset(&cb, 0, sizeof(cb));

    cb.type = BLE_COMM_DATA_TYPE_MUSIC_INFO;

    send_ble_data_event(&cb);

    return 0;
}

static int parse_musicstate(char *data, int len)
{
    char *temp_value;
    int temp_len;
    ble_comm_cb_data_t cb;
    memset(&cb, 0, sizeof(cb));

    cb.type = BLE_COMM_DATA_TYPE_MUSIC_STATE;

    send_ble_data_event(&cb);

    return 0;
}

int parse_data(char *data, int len)
{
    return 0;
}

void zsw_ble_chronos_input(const uint8_t *const data, uint16_t len)
{
    LOG_HEXDUMP_DBG(data, len, "RX");
    parse_data((char *)data, len);
}