#ifndef HEART_RATE_PLOT_UI_H
#define HEART_RATE_PLOT_UI_H

#include <lvgl.h>

void heart_rate_plot_ui_init(lv_obj_t *root);
void heart_rate_plot_ui_remove(void);
void heart_rate_plot_ui_add_sample(int sample);

#endif // HEART_RATE_PLOT_UI_H