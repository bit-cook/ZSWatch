FILE(GLOB 3d_rendering_sources *.c)
target_sources(app PRIVATE ${3d_rendering_sources})
FILE(GLOB 3d_rendering_sources *.cpp)
target_sources(app PRIVATE ${3d_rendering_sources})

FILE(GLOB 3d_rendering_sources ${PROJECT_SOURCE_DIR}/src/ext_drivers/tgx/src/*.cpp)
target_sources(app PRIVATE ${3d_rendering_sources})

zephyr_include_directories(${CMAKE_CURRENT_SOURCE_DIR})
zephyr_include_directories(${PROJECT_SOURCE_DIR}/src/ext_drivers/tgx/src)
#zephyr_sources(${PROJECT_SOURCE_DIR}/src/ext_drivers/fusion/Fusion/FusionOffset.c)
#zephyr_sources(${PROJECT_SOURCE_DIR}/src/ext_drivers/fusion/Fusion/FusionCompass.c)
#zephyr_sources(${PROJECT_SOURCE_DIR}/src/ext_drivers/fusion/Fusion/FusionAhrs.c)
