/*
 * This file is part of ZSWatch project <https://github.com/jakkra/ZSWatch/>.
 * Copyright (c) 2024 Jakob Krantz.
 *
 * This program is free software: you can redistribute it and/or modify
 * it under the terms of the GNU General Public License as published by
 * the Free Software Foundation, version 3.
 *
 * This program is distributed in the hope that it will be useful, but
 * WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE. See the GNU
 * General Public License for more details.
 *
 * You should have received a copy of the GNU General Public License
 * along with this program. If not, see <http://www.gnu.org/licenses/>.
 */
#if CONFIG_ZSWATCH_PCB_REV >= 5

#include <string.h>
#include <zephyr/kernel.h>
#include <zephyr/sys/printk.h>

#include <zephyr/drivers/gpio.h>

#include <zephyr/audio/dmic.h>
#include <SEGGER_RTT.h>

#define AUDIO_FREQ      16000
#define CHAN_SIZE       16
#define PCM_BLK_SIZE_MS     ((AUDIO_FREQ/1000) * sizeof(int16_t))

#define NUM_MS      5000

K_MEM_SLAB_DEFINE(rx_mem_slab, PCM_BLK_SIZE_MS, NUM_MS, 1);

struct pcm_stream_cfg mic_streams = {
    .pcm_rate = AUDIO_FREQ,
    .pcm_width = CHAN_SIZE,
    .block_size = PCM_BLK_SIZE_MS,
    .mem_slab = &rx_mem_slab,
};

struct dmic_cfg cfg = {
    .io = {
        .min_pdm_clk_freq = 1000000,
        .max_pdm_clk_freq = 4800000,
        .min_pdm_clk_dc   = 40,
        .max_pdm_clk_dc   = 60,
    },
    .streams = &mic_streams,
    .channel = {
        .req_num_chan = 1,
        .req_num_streams = 1
    },
};

void *rx_block[NUM_MS];
size_t rx_size = PCM_BLK_SIZE_MS;

static uint8_t *data_buf;
static uint8_t *up_buffer;

#define DATA_BUFFER_SIZE PCM_BLK_SIZE_MS

static void init_segger_rtt(void)
{
    data_buf = k_malloc(DATA_BUFFER_SIZE);
    up_buffer = k_malloc(DATA_BUFFER_SIZE);

    __ASSERT(data_buf && up_buffer, "Failed to allocate buffers for RTT file tarnsfer");

    SEGGER_RTT_ConfigUpBuffer(CONFIG_RTT_TRANSFER_CHANNEL, "ZSW_MIC",
                              up_buffer, DATA_BUFFER_SIZE,
                              SEGGER_RTT_MODE_BLOCK_IF_FIFO_FULL);
}

static int mic_init(void)
{
    int i;
    int ret;
    uint32_t ms;

    static const struct gpio_dt_spec enable_gpio = GPIO_DT_SPEC_GET_OR(DT_NODELABEL(mic_pwr), enable_gpios, {});

    if (!device_is_ready(enable_gpio.port)) {
        printk("Mic enable/disable not supported");
        return -ENODEV;
    }

    ret = gpio_pin_configure_dt(&enable_gpio, GPIO_OUTPUT_LOW);
    if (ret != 0) {
        printk("Failed init vibration motor enable pin\n");
    }

    gpio_pin_set_dt(&enable_gpio, 1);

    printk("ZSWatch Mic PDM test!!\n");
    uint64_t start = k_uptime_get();

    init_segger_rtt();

    const struct device *const mic_dev = DEVICE_DT_GET(DT_NODELABEL(dmic_dev));

    if (!device_is_ready(mic_dev)) {
        printk("Device %s is not ready\n", mic_dev->name);
        return 0;
    }

    cfg.channel.req_chan_map_lo =
        dmic_build_channel_map(0, 0, PDM_CHAN_LEFT);

    ret = dmic_configure(mic_dev, &cfg);
    if (ret < 0) {
        printk("microphone configuration error\n");
        return 0;
    }

    printk("microphone START: PCM_BLK_SIZE_MS: %d\n", PCM_BLK_SIZE_MS);
    ret = dmic_trigger(mic_dev, DMIC_TRIGGER_START);
    if (ret < 0) {
        printk("microphone start trigger error\n");
        return 0;
    }
    int total = 0;

    /* Acquire microphone audio */
    // Need to skip like 100ms of samples otherwise getting out of memory for some reason...
    for (ms = 0U; ms < NUM_MS - 100; ms++) {
        ret = dmic_read(mic_dev, 0, &rx_block[ms], &rx_size, 2000);
        if (ret < 0) {
            printk("microphone audio read error\n");
            return 0;
        } else {
            total += rx_size;
        }
    }
    printk("microphone STOP rec: %d. Took: %lld\n", total, k_uptime_delta(&start));
    ret = dmic_trigger(mic_dev, DMIC_TRIGGER_STOP);
    if (ret < 0) {
        printk("microphone stop trigger error\n");
        return 0;
    }

    unsigned char pcm_l, pcm_h;
    int j;
    for (i = 0; i < NUM_MS - 100; i++) {
        uint16_t *pcm_out = rx_block[i];

        for (j = 0; j < rx_size / 2; j++) {
            pcm_h = (char)(pcm_out[j] & 0xFF);
            pcm_l = (char)((pcm_out[j] >> 8) & 0xFF);
            SEGGER_RTT_Write(CONFIG_RTT_TRANSFER_CHANNEL, &pcm_l, 1);
            SEGGER_RTT_Write(CONFIG_RTT_TRANSFER_CHANNEL, &pcm_h, 1);
        }
    }

    gpio_pin_set_dt(&enable_gpio, 0);

    return 0;
}

SYS_INIT(mic_init, APPLICATION, 20);

#endif