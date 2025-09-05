#include <zephyr/init.h>
#include <zephyr/kernel.h>
#include <zephyr/logging/log.h>
#include <zephyr/drivers/sensor.h>

#include "ui_export/iaq_ui.h"
#include "managers/zsw_app_manager.h"
#include "sensors/zsw_environment_sensor.h"

LOG_MODULE_REGISTER(iaq_app, CONFIG_IAQ_APP_LOG_LEVEL);

static void iaq_app_start(lv_obj_t *root, lv_group_t *group);
static void iaq_app_stop(void);

static lv_timer_t *refresh_timer;
static application_t app = {
    .name = "IAQ",
    .icon = &move,
    .start_func = iaq_app_start,
    .stop_func = iaq_app_stop,
    .category = ZSW_APP_CATEGORY_SENSORS,
};

static void iaq_app_update(void)
{
    float iaq;

    if (zsw_environment_sensor_get_iaq(&iaq) == 0) {
        LOG_DBG("Update UI...");

        iaq_app_ui_home_set_iaq_cursor(iaq);
        iaq_app_ui_home_set_iaq_label(iaq);
        iaq_app_ui_home_set_iaq_status(iaq);
    }
}

static void on_timer_event(lv_timer_t *timer)
{
    iaq_app_update();
}

static void iaq_app_start(lv_obj_t *root, lv_group_t *group)
{
    LOG_DBG("Starting UI...");

    iaq_app_ui_show(root);

    iaq_app_update();

    refresh_timer = lv_timer_create(on_timer_event, 1 * 1000UL,  NULL);
}

static void iaq_app_stop(void)
{
    LOG_DBG("Closing UI...");

    lv_timer_del(refresh_timer);
    iaq_app_ui_remove();
}

static int iaq_app_add(void)
{
    zsw_app_manager_add_application(&app);

    return 0;
}

SYS_INIT(iaq_app_add, APPLICATION, CONFIG_APPLICATION_INIT_PRIORITY);