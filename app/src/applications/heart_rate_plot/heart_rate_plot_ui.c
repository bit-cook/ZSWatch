#include "heart_rate_plot_ui.h"
#include <lvgl.h>
#include <zephyr/logging/log.h>

LOG_MODULE_REGISTER(heart_rate_plot_ui, LOG_LEVEL_DBG);

static lv_obj_t *chart;
static lv_chart_series_t *ser;
static lv_obj_t *y_axis_label;
static lv_obj_t *last_sample_label;

void heart_rate_plot_ui_init(lv_obj_t *root) {
    chart = lv_chart_create(root);
    lv_obj_set_size(chart, 175, 150);
    lv_obj_align(chart, LV_ALIGN_CENTER, 0, 0);

    ser = lv_chart_add_series(chart, lv_palette_main(LV_PALETTE_RED), LV_CHART_AXIS_PRIMARY_Y);

    // Enable Y-axis ticks and labels
    lv_chart_set_axis_tick(chart, LV_CHART_AXIS_PRIMARY_Y, 10, 5, 5, 2, true, 50);

    // Set the Y-axis range from 50 to 120
    lv_chart_set_range(chart, LV_CHART_AXIS_PRIMARY_Y, 50, 120);

    // Increase the chart's point count to hold more history
    lv_chart_set_point_count(chart, 30); // 3x the current history

    // Set the chart type to line without dots
    lv_chart_set_type(chart, LV_CHART_TYPE_LINE);
    lv_obj_set_style_size(chart, 0, LV_PART_INDICATOR);

    // Add placeholder data
    for (int i = 0; i < 10; i++) {
        lv_chart_set_next_value(chart, ser, 60 + i % 5); // Placeholder heart rate values
    }

    // Add last sample label
    last_sample_label = lv_label_create(root);
    lv_label_set_text(last_sample_label, "Last: 60 BPM");
    lv_obj_align_to(last_sample_label, chart, LV_ALIGN_OUT_BOTTOM_MID, 0, 10);

    LOG_INF("Heart rate plot UI initialized.");
}

void heart_rate_plot_ui_remove(void) {
    if (chart) {
        lv_obj_del(chart);
        chart = NULL;
    }
    LOG_INF("Heart rate plot UI removed.");
}

void heart_rate_plot_ui_add_sample(int sample) {
    if (ser && chart) {
        lv_chart_set_next_value(chart, ser, sample);
        lv_label_set_text_fmt(last_sample_label, "Last: %d BPM", sample);
    }
}