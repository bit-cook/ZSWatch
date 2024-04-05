#include "zsw_demo_helper.h"
#include "events/ble_event.h"
#include "events/accel_event.h"
#include "ble/ble_comm.h"
#include "zephyr/zbus/zbus.h"
#include "managers/zsw_notification_manager.h"

ZBUS_CHAN_DECLARE(ble_comm_data_chan);
ZBUS_CHAN_DECLARE(accel_data_chan);

static void demo_work_handler(struct k_work *work);

K_WORK_DELAYABLE_DEFINE(demo_work, demo_work_handler);

int step_counter = 50;

static void demo_work_handler(struct k_work *work)
{
    zsw_imu_evt_t evt;

    evt.type = ZSW_IMU_EVT_TYPE_STEP;
    evt.data.step.count = step_counter++;

    zbus_chan_pub(&accel_data_chan, &evt, K_MSEC(250));

    k_work_reschedule(&demo_work, K_SECONDS(2));
}

void zsw_demo_helper_run(void)
{
    zsw_not_mngr_notification_t notification1 = {
        .id = 1,
        .title = "Interested?",
        .body = "Recruiter blah blah",
        .src = NOTIFICATION_SRC_LINKEDIN
    };

    zsw_notification_manager_add(&notification1);

    zsw_not_mngr_notification_t notification2 = {
        .id = 2,
        .title = "mail@jakobkrantz.se",
        .body = "Such a nice email!",
        .src = NOTIFICATION_SRC_GMAIL
    };

    zsw_notification_manager_add(&notification2);

    zsw_not_mngr_notification_t notification3 = {
        .id = 3,
        .title = "Meeting",
        .body = "Don't forget about the meeting tomorrow.",
        .src = NOTIFICATION_SRC_CALENDAR
    };

    zsw_notification_manager_add(&notification3);

    zsw_not_mngr_notification_t notification4 = {
        .id = 4,
        .title = "Sofia",
        .body = "When are you home for dinner?",
        .src = NOTIFICATION_SRC_FB_MESSENGER
    };

    zsw_notification_manager_add(&notification4);

    zsw_not_mngr_notification_t notification5 = {
        .id = 5,
        .title = "New video",
        .body = "Check out this new video.",
        .src = NOTIFICATION_SRC_YOUTUBE
    };

    zsw_notification_manager_add(&notification5);

    zsw_not_mngr_notification_t notification6 = {
        .id = 6,
        .title = "Must watch",
        .body = "Funny cat video!",
        .src = NOTIFICATION_SRC_REDDIT
    };

    zsw_notification_manager_add(&notification6);

    struct ble_data_event evt;

    evt.data.type = BLE_COMM_DATA_TYPE_WEATHER;
    evt.data.data.weather.humidity = 67;
    evt.data.data.weather.weather_code = 801;
    evt.data.data.weather.temperature_c = 12;
    strcpy(evt.data.data.weather.report_text, "Cloudy");

    zbus_chan_pub(&ble_comm_data_chan, &evt, K_MSEC(250));

    k_work_schedule(&demo_work, K_SECONDS(1));
}