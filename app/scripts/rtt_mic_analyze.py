import pylink
import argparse
import sys
import time
import os
from struct import *
import matplotlib.pyplot as pyplot
import numpy as np
import sys
from threading import Thread
from datetime import datetime
import wave

logged_pcm_data = bytearray()
num_discard = 5


def read_from_rtt_log(jlink, num_samples):
    global logged_pcm_data
    try:
        while jlink.connected() and len(logged_pcm_data) < num_samples:
            data = jlink.rtt_read(2, 4096)
            if len(data) == 0:
                continue
            logged_pcm_data += bytearray(data)
            print("Got", len(data), "Total:", len(logged_pcm_data))
            if len(logged_pcm_data) >= num_samples - 5:
                break

    except Exception:
        print("IO read thread exception, exiting...")
        raise


def rtt_run_read(target_device, num_samples):
    jlink = pylink.JLink()
    print("Connecting to JLink...")
    jlink.open()
    print("Connecting to %s..." % target_device)
    jlink.set_tif(pylink.enums.JLinkInterfaces.SWD)
    jlink.connect(target_device)
    jlink.reset(0, False)
    jlink.rtt_start(None)
    time.sleep(2)
    print("Connected")

    while True:
        try:
            num_up = jlink.rtt_get_num_up_buffers()
            num_down = jlink.rtt_get_num_down_buffers()
            print("RTT started, %d up bufs, %d down bufs." % (num_up, num_down))
            break
        except pylink.errors.JLinkRTTException:
            time.sleep(0.1)

    print("up channels:")
    for buf_index in range(jlink.rtt_get_num_up_buffers()):
        buf = jlink.rtt_get_buf_descriptor(buf_index, True)
        print(
            "    %d: name = %r, size = %d bytes, flags = %d"
            % (buf.BufferIndex, buf.name, buf.SizeOfBuffer, buf.Flags)
        )

    print("down channels:")
    for buf_index in range(jlink.rtt_get_num_down_buffers()):
        buf = jlink.rtt_get_buf_descriptor(buf_index, False)
        print(
            "    %d: name = %r, size = %d bytes, flags = %d"
            % (buf.BufferIndex, buf.name, buf.SizeOfBuffer, buf.Flags)
        )

    try:
        work_thread = Thread(
            target=read_from_rtt_log, args=(jlink, num_samples + num_discard)
        )
        work_thread.daemon = True
        work_thread.start()
        work_thread.join()
        jlink.close()
        print("JLink disconnected, saving PCM file and converting to WAV...")

        now = datetime.now()
        date_time = now.strftime("%d_%m_%Y-%H-%M")

        with open("pcm_data_{}.raw".format(date_time), "wb") as f:
            f.write(logged_pcm_data)

        # There is some noise in the beginning of the recording, so we discard the first 500ms
        # Don't know why, probably some bug in the data transfer.
        create_wav(logged_pcm_data[16000:], "converted_pcm_{}.wav".format(date_time))

    except KeyboardInterrupt:
        print("ctrl-c detected, exiting...")
        jlink.close()
        pass


def create_wav(pcm_little_endian_data, name):
    # Configure the WAV file settings
    num_channels = 1
    sample_width = 2  # 16-bit audio
    frame_rate = 16000  # 16kHz
    num_frames = len(pcm_little_endian_data)
    compression_type = "NONE"
    compression_name = "NONE"

    with wave.open(name, "wb") as wavfile:
        wavfile.setparams(
            (num_channels, sample_width, 16000, 0, compression_type, compression_name)
        )
        wavfile.writeframes(pcm_little_endian_data)


if __name__ == "__main__":
    parser = argparse.ArgumentParser(description="Mic data collection.")
    parser.add_argument(
        "--target_cpu",
        default="nRF5340_XXAA",
        help="Device Name (see https://www.segger.com/supported-devices/jlink/)",
    )

    parser.add_argument(
        "--samples",
        type=int,
        default=156800,
        help="Number of samples to collect before running fusion. Need to match what's sent from ZSWatch",
    )

    args = parser.parse_args()

    sys.exit(rtt_run_read(args.target_cpu, args.samples))
