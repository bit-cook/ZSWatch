#include "heart_rate_plot_ui.h"
#include <zephyr/kernel.h>
#include <zephyr/logging/log.h>
#include <zephyr/random/random.h>
#include "managers/zsw_app_manager.h"
#include "ble/ble_hrs_central.h"
#include "events/zsw_periodic_event.h"

LOG_MODULE_REGISTER(heart_rate_plot, LOG_LEVEL_DBG);

static void heart_rate_plot_start(lv_obj_t *root, lv_group_t *group);
static void heart_rate_plot_stop(void);
static void zbus_heart_rate_sample_data_callback(const struct zbus_channel *chan);

ZBUS_CHAN_DECLARE(periodic_event_1s_chan);
ZBUS_CHAN_DECLARE(periodic_event_1000ms_chan);
ZBUS_LISTENER_DEFINE(heart_rate_plot_periodic_event, zbus_heart_rate_sample_data_callback);

static application_t app = {
    .name = "Heart Rate Plot",
    .icon = NULL, // Add icon if available
    .start_func = heart_rate_plot_start,
    .stop_func = heart_rate_plot_stop
};

static void zbus_heart_rate_sample_data_callback(const struct zbus_channel *chan)
{
#ifdef CONFIG_BOARD_NATIVE_POSIX
    int new_sample = 60 + (sys_rand32_get() % 20); // Generate a random heart rate between 60 and 80
    heart_rate_plot_ui_add_sample(new_sample);
#else
    uint16_t heart_rate;
    ble_hrs_central_get_measurement(&heart_rate);
    heart_rate_plot_ui_add_sample(heart_rate);
#endif
}

static void heart_rate_plot_start(lv_obj_t *root, lv_group_t *group) {
    heart_rate_plot_ui_init(root);
    zsw_periodic_chan_add_obs(&periodic_event_1s_chan, &heart_rate_plot_periodic_event);
    LOG_INF("Heart Rate Plot application started.");
}

static void heart_rate_plot_stop(void) {
    zsw_periodic_chan_rm_obs(&periodic_event_1s_chan, &heart_rate_plot_periodic_event);
    heart_rate_plot_ui_remove();
    LOG_INF("Heart Rate Plot application stopped.");
}

static int heart_rate_plot_app_add(void) {
    zsw_app_manager_add_application(&app);
    return 0;
}

SYS_INIT(heart_rate_plot_app_add, APPLICATION, CONFIG_APPLICATION_INIT_PRIORITY);