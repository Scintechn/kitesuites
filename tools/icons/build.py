#!/usr/bin/env python3
"""Regenerate app/favicon.ico and app/apple-icon.png from the icon SVGs.

Sources of truth:
  app/icon.svg              the mark, served as-is to modern browsers
  tools/icons/favicon-16.svg  the same mark redrawn for the 16px .ico entry

macOS only: it rasterises with QuickLook (`qlmanage`) and resamples with
`sips`, so there is no dependency to install. QuickLook ignores `rx` on a
`<rect>`, so the corners are stripped before rasterising and the rounding is
re-applied here as an antialiased alpha mask.

    python3 tools/icons/build.py
"""

import os
import re
import shutil
import struct
import subprocess
import sys
import tempfile
import zlib

ROOT = os.path.dirname(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))
ICON = os.path.join(ROOT, "app", "icon.svg")
ICON16 = os.path.join(ROOT, "tools", "icons", "favicon-16.svg")
MASTER = 512  # rasterise once at this size, then downsample


# --- PNG -------------------------------------------------------------------


def read_png(path):
    """Decode an 8-bit PNG to (w, h, RGBA bytearray)."""
    data = open(path, "rb").read()
    assert data[:8] == b"\x89PNG\r\n\x1a\n", path
    pos, idat, plte, trns = 8, b"", None, None
    while pos < len(data):
        (ln,) = struct.unpack(">I", data[pos : pos + 4])
        typ, body = data[pos + 4 : pos + 8], data[pos + 8 : pos + 8 + ln]
        if typ == b"IHDR":
            w, h, depth, color, _, _, interlace = struct.unpack(">IIBBBBB", body)
        elif typ == b"IDAT":
            idat += body
        elif typ == b"PLTE":
            plte = body
        elif typ == b"tRNS":
            trns = body
        pos += 12 + ln
    assert depth == 8 and interlace == 0, f"unsupported PNG: {path}"

    channels = {0: 1, 2: 3, 3: 1, 4: 2, 6: 4}[color]
    raw = zlib.decompress(idat)
    stride = w * channels
    rows = bytearray(h * stride)
    prev = bytearray(stride)
    p = 0
    for y in range(h):
        ft = raw[p]
        p += 1
        line = bytearray(raw[p : p + stride])
        p += stride
        if ft == 1:
            for i in range(channels, stride):
                line[i] = (line[i] + line[i - channels]) & 0xFF
        elif ft == 2:
            for i in range(stride):
                line[i] = (line[i] + prev[i]) & 0xFF
        elif ft == 3:
            for i in range(stride):
                a = line[i - channels] if i >= channels else 0
                line[i] = (line[i] + ((a + prev[i]) >> 1)) & 0xFF
        elif ft == 4:
            for i in range(stride):
                a = line[i - channels] if i >= channels else 0
                b = prev[i]
                c = prev[i - channels] if i >= channels else 0
                pa, pb, pc = abs(b - c), abs(a - c), abs(a + b - 2 * c)
                pr = a if (pa <= pb and pa <= pc) else (b if pb <= pc else c)
                line[i] = (line[i] + pr) & 0xFF
        rows[y * stride : (y + 1) * stride] = line
        prev = line

    rgba = bytearray(w * h * 4)
    for i in range(w * h):
        px = rows[i * channels : (i + 1) * channels]
        if color == 6:
            rgba[i * 4 : i * 4 + 4] = px
        elif color == 2:
            rgba[i * 4 : i * 4 + 4] = bytes(px) + b"\xff"
        elif color == 0:
            rgba[i * 4 : i * 4 + 4] = bytes([px[0]] * 3) + b"\xff"
        elif color == 4:
            rgba[i * 4 : i * 4 + 4] = bytes([px[0]] * 3) + bytes([px[1]])
        else:
            a = trns[px[0]] if trns and px[0] < len(trns) else 255
            rgba[i * 4 : i * 4 + 4] = plte[px[0] * 3 : px[0] * 3 + 3] + bytes([a])
    return w, h, rgba


def write_png(path, w, h, rgba):
    raw = b"".join(b"\x00" + bytes(rgba[y * w * 4 : (y + 1) * w * 4]) for y in range(h))

    def chunk(tag, body):
        return (
            struct.pack(">I", len(body))
            + tag
            + body
            + struct.pack(">I", zlib.crc32(tag + body))
        )

    with open(path, "wb") as fh:
        fh.write(b"\x89PNG\r\n\x1a\n")
        fh.write(chunk(b"IHDR", struct.pack(">IIBBBBB", w, h, 8, 6, 0, 0, 0)))
        fh.write(chunk(b"IDAT", zlib.compress(raw, 9)))
        fh.write(chunk(b"IEND", b""))


# --- rasterising -----------------------------------------------------------


def rasterise(svg_path, tmpdir):
    """Render an SVG to a MASTER-square PNG, with any corner rounding removed."""
    source = open(svg_path).read()
    squared = re.sub(r'\s+rx="[\d.]+"', "", source, count=1)
    squared = re.sub(
        r'width="\d+" height="\d+"', f'width="{MASTER}" height="{MASTER}"', squared, count=1
    )
    flat = os.path.join(tmpdir, os.path.basename(svg_path))
    open(flat, "w").write(squared)
    subprocess.run(
        ["qlmanage", "-t", "-s", str(MASTER), "-o", tmpdir, flat],
        check=True,
        capture_output=True,
    )
    out = flat + ".png"
    if not os.path.exists(out):
        sys.exit(f"qlmanage produced no output for {svg_path}")
    return out


def resample(master_png, size, tmpdir, tag):
    path = os.path.join(tmpdir, f"{tag}-{size}.png")
    shutil.copy(master_png, path)
    subprocess.run(["sips", "-Z", str(size), path], check=True, capture_output=True)
    w, h, rgba = read_png(path)
    assert (w, h) == (size, size), f"sips gave {w}x{h}, wanted {size}"
    return rgba


def round_corners(size, rgba, radius):
    """Multiply in an antialiased rounded-rect mask (4x4 supersampled)."""
    half = size / 2
    inner = half - radius

    def covered(px, py):
        qx, qy = abs(px - half) - inner, abs(py - half) - inner
        mx, my = max(qx, 0.0), max(qy, 0.0)
        return (mx * mx + my * my) ** 0.5 + min(max(qx, qy), 0.0) - radius <= 0

    for y in range(size):
        for x in range(size):
            hits = sum(
                covered(x + (sx + 0.5) / 4, y + (sy + 0.5) / 4)
                for sy in range(4)
                for sx in range(4)
            )
            if hits < 16:
                i = (y * size + x) * 4 + 3
                rgba[i] = rgba[i] * hits // 16
    return rgba


# --- ICO -------------------------------------------------------------------


def ico(entries):
    """Pack [(size, rgba)] into a classic 32-bit BMP .ico (widest support)."""
    blobs = []
    for size, rgba in entries:
        header = struct.pack(
            "<IiiHHIIiiII", 40, size, size * 2, 1, 32, 0, size * size * 4, 0, 0, 0, 0
        )
        pixels = bytearray()
        for y in range(size - 1, -1, -1):  # DIBs are bottom-up
            for x in range(size):
                r, g, b, a = rgba[(y * size + x) * 4 : (y * size + x) * 4 + 4]
                pixels += bytes((b, g, r, a))
        mask_stride = ((size + 31) // 32) * 4  # 1bpp AND mask, unused but required
        blobs.append((size, header + bytes(pixels) + b"\x00" * (mask_stride * size)))

    out = struct.pack("<HHH", 0, 1, len(blobs))
    offset = 6 + 16 * len(blobs)
    for size, blob in blobs:
        out += struct.pack(
            "<BBBBHHII", size & 0xFF, size & 0xFF, 0, 0, 1, 32, len(blob), offset
        )
        offset += len(blob)
    return out + b"".join(blob for _, blob in blobs)


# --- build -----------------------------------------------------------------


def main():
    for tool in ("qlmanage", "sips"):
        if shutil.which(tool) is None:
            sys.exit(f"{tool} not found — this script needs macOS")

    with tempfile.TemporaryDirectory() as tmp:
        main_master = rasterise(ICON, tmp)
        small_master = rasterise(ICON16, tmp)

        # .ico: 16px from the redrawn mark, 32/48 from the main one.
        entries = [(16, round_corners(16, resample(small_master, 16, tmp, "s"), 16 * 8 / 64))]
        for size in (32, 48):
            entries.append(
                (size, round_corners(size, resample(main_master, size, tmp, "m"), size * 12 / 64))
            )
        ico_path = os.path.join(ROOT, "app", "favicon.ico")
        open(ico_path, "wb").write(ico(entries))
        print(f"wrote {os.path.relpath(ico_path, ROOT)} (16, 32, 48)")

        # apple-icon: iOS applies its own squircle mask, so leave it full-bleed.
        apple = resample(main_master, 180, tmp, "a")
        apple_path = os.path.join(ROOT, "app", "apple-icon.png")
        write_png(apple_path, 180, 180, apple)
        print(f"wrote {os.path.relpath(apple_path, ROOT)} (180)")


if __name__ == "__main__":
    main()
