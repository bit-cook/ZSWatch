# Heart Rate Plot Application
zephyr_include_directories(.)

target_sources(app PRIVATE
  ${CMAKE_CURRENT_SOURCE_DIR}/heart_rate_plot_app.c
)

# Add the UI source file to the build
target_sources(app PRIVATE
  ${CMAKE_CURRENT_SOURCE_DIR}/heart_rate_plot_ui.c
)