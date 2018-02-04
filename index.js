(function(define) {
  define("GBDKJS", function(require, exports) {
    const SCREEN_WIDTH = 160;
    const SCREEN_HEIGHT = 144;
    const BUFFER_WIDTH = 256;
    const BUFFER_HEIGHT = 256;

    const J_LEFT = 0x02;
    const J_RIGHT = 0x01;
    const J_UP = 0x04;
    const J_DOWN = 0x08;
    const J_START = 0x80;
    const J_SELECT = 0x40;
    const J_A = 0x10;
    const J_B = 0x20;

    const JS_KEY_UP = 38;
    const JS_KEY_LEFT = 37;
    const JS_KEY_RIGHT = 39;
    const JS_KEY_DOWN = 40;
    const JS_KEY_ENTER = 13;
    const JS_KEY_ALT = 18;
    const JS_KEY_CTRL = 17;
    const JS_KEY_SHIFT = 16;

    const MINWNDPOSX = 0x07;
    const MINWNDPOSY = 0x00;
    const MAXWNDPOSX = 0xa6;
    const MAXWNDPOSY = 0x8f;

    const S_FLIPX = 0x20;
    const S_FLIPY = 0x40;

    const TILE_SIZE = 8;
    const DATA_SIZE = 256;
    const BUFFER_SIZE = 1024;
    const MAX_SPRITES = 40;

    const COLORS = [
      {
        r: 224,
        g: 248,
        b: 208,
        a: 255
      },
      {
        r: 136,
        g: 192,
        b: 112,
        a: 255
      },
      {
        r: 48,
        g: 104,
        b: 80,
        a: 255
      },
      {
        r: 8,
        g: 24,
        b: 32,
        a: 255
      },
      {
        r: 0,
        g: 0,
        b: 0,
        a: 0
      }
    ];

    function uint(a) {
      return (a + 256) & 255;
    }

    var GBDK = function() {
      // Registers -------------------------------------------------------------

      var LYC_REG = 0;
      Object.defineProperty(this, "LYC_REG", {
        get: function() {
          return LYC_REG;
        },
        set: function(value) {
          LYC_REG = (256 + value) % 256;
        }
      });

      var SCX_REG = 0;
      Object.defineProperty(this, "SCX_REG", {
        get: function() {
          return SCX_REG;
        },
        set: function(value) {
          SCX_REG = (256 + value) % 256;
        }
      });

      var SCY_REG = 0;
      Object.defineProperty(this, "SCY_REG", {
        get: function() {
          return SCY_REG;
        },
        set: function(value) {
          SCY_REG = (256 + value) % 256;
        }
      });

      var WX_REG = 0;
      Object.defineProperty(this, "WX_REG", {
        get: function() {
          return WX_REG;
        },
        set: function(value) {
          WX_REG = (256 + value) % 256;
        }
      });

      var WY_REG = 0;
      Object.defineProperty(this, "WY_REG", {
        get: function() {
          return WY_REG;
        },
        set: function(value) {
          WY_REG = (256 + value) % 256;
        }
      });

      Object.defineProperty(this, "SPRITES_8x16", {
        get: function() {
          // console.log("SET SPRITES_8x16");
          return;
        }
      });

      Object.defineProperty(this, "SHOW_SPRITES", {
        get: function() {
          // console.log("SET SHOW_SPRITES");
          return;
        }
      });

      Object.defineProperty(this, "HIDE_SPRITES", {
        get: function() {
          // console.log("SET HIDE_SPRITES");
          return;
        }
      });

      Object.defineProperty(this, "BGP_REG", {
        set: function(value) {
          bkg_palette = [
            colors[value & 3],
            colors[(value >> 2) & 3],
            colors[(value >> 4) & 3],
            colors[value >> 6]
          ];
          bkg_data_dirty = true;
        }
      });

      Object.defineProperty(this, "OBP0_REG", {
        set: function(value) {
          obp0_palette = [
            colors[4],
            colors[(value >> 2) & 3],
            colors[(value >> 4) & 3],
            colors[value >> 6]
          ];
          for (var i = 0; i < MAX_SPRITES * 16; i++) {
            draw_tile_data(
              sprite_data_ctx,
              ((i / 2) | 0) % 16,
              2 * ((i / 32) | 0) + i % 2,
              i,
              sprite_data,
              obp0_palette
            );
          }
        }
      });

      Object.defineProperty(this, "OBP1_REG", {
        set: function(value) {
          obp1_palette = [
            colors[value & 3],
            colors[(value >> 2) & 3],
            colors[(value >> 4) & 3],
            colors[value >> 6]
          ];
          obp1_palette;
        }
      });

      // Init Canvases ---------------------------------------------------------

      var canvas = document.createElement("canvas");
      var ctx = canvas.getContext("2d");
      canvas.width = SCREEN_WIDTH;
      canvas.height = SCREEN_HEIGHT;

      var buffer_canvas = document.createElement("canvas");
      var buffer_ctx = buffer_canvas.getContext("2d");
      buffer_canvas.width = BUFFER_WIDTH;
      buffer_canvas.height = BUFFER_HEIGHT;

      var window_canvas = document.createElement("canvas");
      var window_ctx = window_canvas.getContext("2d");
      window_canvas.width = BUFFER_WIDTH;
      window_canvas.height = BUFFER_HEIGHT;

      var bkg_data_canvas = document.createElement("canvas");
      var bkg_data_ctx = bkg_data_canvas.getContext("2d");
      bkg_data_canvas.width = TILE_SIZE * 16;
      bkg_data_canvas.height = TILE_SIZE * 16;

      var sprite_data_canvas = document.createElement("canvas");
      var sprite_data_ctx = sprite_data_canvas.getContext("2d");
      sprite_data_canvas.width = TILE_SIZE * 16;
      sprite_data_canvas.height = TILE_SIZE * 12;

      // Init palettes
      var colors = [].concat(COLORS);
      var bkg_palette = colors;
      var obp0_palette = [colors[4], colors[0], colors[1], colors[3]];
      var obp1_palette = [colors[0], colors[1], colors[3], colors[3]];

      var joypad = 0;

      var lcd_fn = null;
      var bank = 0;

      var bkg_data_dirty = true;
      var bkg_tiles_dirty = {
        x1: 0,
        y1: 0,
        x2: 0,
        y2: 0
      };
      var win_tiles_dirty = {
        x1: 0,
        y1: 0,
        x2: 0,
        y2: 0
      };

      var bkg_data = new Uint8Array(DATA_SIZE * 16);
      var bkg_tiles = new Uint8Array(BUFFER_SIZE);
      var win_tiles = new Uint8Array(BUFFER_SIZE);
      var sprite_data = new Uint8Array(DATA_SIZE * 16);
      var tile_image_data = ctx.createImageData(TILE_SIZE, TILE_SIZE);
      var tile_image_data_data = tile_image_data.data;

      var sorted_sprites = new Uint8Array(MAX_SPRITES);
      var sprite_tiles = new Uint8Array(MAX_SPRITES);
      var sprite_x = new Uint8Array(MAX_SPRITES);
      var sprite_y = new Uint8Array(MAX_SPRITES);
      var sprite_props = new Uint8Array(MAX_SPRITES);
      for (var i = 0; i < MAX_SPRITES; i++) {
        sorted_sprites[i] = i;
      }

      // Input listeners -------------------------------------------------------

      window.onkeydown = function(e) {
        if (e.keyCode === JS_KEY_LEFT) {
          joypad |= J_LEFT;
        } else if (e.keyCode === JS_KEY_RIGHT) {
          joypad |= J_RIGHT;
        } else if (e.keyCode === JS_KEY_UP) {
          joypad |= J_UP;
        } else if (e.keyCode === JS_KEY_DOWN) {
          joypad |= J_DOWN;
        } else if (e.keyCode === JS_KEY_ENTER) {
          joypad |= J_START;
        } else if (e.keyCode === JS_KEY_ALT) {
          joypad |= J_A;
        } else if (e.keyCode === JS_KEY_CTRL) {
          joypad |= J_B;
        } else if (e.keyCode === JS_KEY_SHIFT) {
          joypad |= J_SELECT;
        } else {
          return;
        }
        e.preventDefault();
      };

      window.onkeyup = function(e) {
        if (e.keyCode === JS_KEY_LEFT) {
          joypad &= ~J_LEFT;
        } else if (e.keyCode === JS_KEY_RIGHT) {
          joypad &= ~J_RIGHT;
        } else if (e.keyCode === JS_KEY_UP) {
          joypad &= ~J_UP;
        } else if (e.keyCode === JS_KEY_DOWN) {
          joypad &= ~J_DOWN;
        } else if (e.keyCode === JS_KEY_ENTER) {
          joypad &= ~J_START;
        } else if (e.keyCode === JS_KEY_ALT) {
          joypad &= ~J_A;
        } else if (e.keyCode === JS_KEY_CTRL) {
          joypad &= ~J_B;
        } else if (e.keyCode === JS_KEY_SHIFT) {
          joypad &= ~J_SELECT;
        } else {
          return;
        }
        e.preventDefault();
      };

      // Private render methods ------------------------------------------------

      function draw_tile_data(ctx, x, y, tile, data, palette) {
        var t = tile;
        for (var i = 0; i < 16; i += 2) {
          for (var j = 0; j < 8; j++) {
            var mask = Math.pow(2, j);
            var index =
              (data[16 * t + i] & mask ? 1 : 0) +
              (data[16 * t + i + 1] & mask ? 2 : 0);
            var pixelIndex = 4 * (7 - j + 8 * (i / 2));
            tile_image_data_data[pixelIndex] = palette[index].r;
            tile_image_data_data[pixelIndex + 1] = palette[index].g;
            tile_image_data_data[pixelIndex + 2] = palette[index].b;
            tile_image_data_data[pixelIndex + 3] = palette[index].a;
          }
        }

        ctx.putImageData(tile_image_data, x * TILE_SIZE, y * TILE_SIZE);
      }

      function draw_tile_canvas(ctx, x, y, tile, canvas) {
        var ty = ((tile / 16) | 0) * TILE_SIZE;
        var tx = tile % 16 * TILE_SIZE;
        ctx.drawImage(
          canvas,
          tx,
          ty,
          TILE_SIZE,
          TILE_SIZE,
          x * TILE_SIZE,
          y * TILE_SIZE,
          TILE_SIZE,
          TILE_SIZE
        );
      }

      function redraw_bkg_tiles() {
        // Draw BG Data Memory
        bkg_data_canvas.width = bkg_data_canvas.width;
        for (var i = 0; i < DATA_SIZE; i++) {
          draw_tile_data(
            bkg_data_ctx,
            i % 16,
            (i / 16) | 0,
            i,
            bkg_data,
            bkg_palette
          );
        }
      }

      const redraw_buffer_canvas = function(force) {
        var i;
        if (force) {
          for (i = 0; i < BUFFER_SIZE; i++) {
            draw_tile_canvas(
              buffer_ctx,
              i % 32,
              (i / 32) | 0,
              bkg_tiles[i],
              bkg_data_canvas
            );
          }
        } else {
          for (i = 0; i < BUFFER_SIZE; i++) {
            var x = i % 32;
            var y = (i / 32) | 0;
            if (
              x < bkg_tiles_dirty.x1 ||
              y < bkg_tiles_dirty.y1 ||
              x > bkg_tiles_dirty.x2 ||
              y > bkg_tiles_dirty.y2
            ) {
              continue;
            }
            draw_tile_canvas(buffer_ctx, x, y, bkg_tiles[i], bkg_data_canvas);
          }
        }
      };

      const redraw_window_canvas = function(force) {
        var i;
        if (force) {
          for (i = 0; i < BUFFER_SIZE; i++) {
            draw_tile_canvas(
              window_ctx,
              i % 32,
              (i / 32) | 0,
              win_tiles[i],
              bkg_data_canvas
            );
          }
        } else {
          for (i = 0; i < BUFFER_SIZE; i++) {
            var x = i % 32;
            var y = (i / 32) | 0;
            if (
              x < win_tiles_dirty.x1 ||
              y < win_tiles_dirty.y1 ||
              x > win_tiles_dirty.x2 ||
              y > win_tiles_dirty.y2
            ) {
              continue;
            }
            draw_tile_canvas(window_ctx, x, y, win_tiles[i], bkg_data_canvas);
          }
        }
      };

      function render() {
        if (bkg_data_dirty) {
          redraw_bkg_tiles();
        }

        redraw_buffer_canvas(bkg_data_dirty);
        redraw_window_canvas(bkg_data_dirty);

        if (bkg_data_dirty) {
          bkg_data_dirty = false;
        }

        reset_dirty_tiles();

        for (var ly = 0; ly < 144; ly++) {
          if ((ly === LYC_REG || LYC_REG === 255) && lcd_fn) {
            Module.dynCall_v(lcd_fn);
          }
          for (var xi = -1; xi < 2; xi++) {
            ctx.drawImage(
              buffer_canvas,
              0,
              (SCY_REG + ly) % 256,
              BUFFER_WIDTH,
              1,
              -(xi * BUFFER_WIDTH) - SCX_REG,
              ly,
              BUFFER_WIDTH,
              1
            );
          }
        }

        // Draw window
        ctx.drawImage(
          window_canvas,
          0,
          0,
          BUFFER_WIDTH,
          BUFFER_HEIGHT,
          WX_REG - 7,
          WY_REG + 1,
          BUFFER_WIDTH,
          BUFFER_HEIGHT
        );
        for (var si = 0; si < MAX_SPRITES; si++) {
          var i = sorted_sprites[si];

          var t = sprite_tiles[i];
          ctx.save();
          ctx.translate(sprite_x[i] - 4, sprite_y[i] - 16);
          if (sprite_props[i] & S_FLIPX) {
            ctx.scale(-1, 1);
          }
          ctx.translate(-4, 0);

          ctx.drawImage(
            sprite_data_canvas,
            ((t / 2) | 0) % 16 * 8,
            ((t / 32) | 0) * 16,
            8,
            16,
            0,
            0,
            8,
            16
          );
          ctx.restore();
        }
      }

      function reset_dirty_tiles() {
        bkg_tiles_dirty.x1 = 999;
        bkg_tiles_dirty.x2 = -1;
        bkg_tiles_dirty.y1 = 999;
        bkg_tiles_dirty.y2 = -1;
        win_tiles_dirty.x1 = 999;
        win_tiles_dirty.x2 = -1;
        win_tiles_dirty.y1 = 999;
        win_tiles_dirty.y2 = -1;
      }

      // Public Methods --------------------------------------------------------

      this.get_canvas = function() {
        return canvas;
      };

      this.get_buffer_canvas = function() {
        return buffer_canvas;
      };

      this.get_window_canvas = function() {
        return window_canvas;
      };

      this.get_bkg_data_canvas = function() {
        return bkg_data_canvas;
      };

      this.get_sprite_data_canvas = function() {
        return sprite_data_canvas;
      };

      this.set_colors = function(newColors) {
        colors = [].concat(newColors);
      };

      this.assert_bank = function(testBank) {
        return testBank === 0 || testBank === bank;
      };

      // GBDK API --------------------------------------------------------------

      this.SWITCH_ROM_MBC5 = function(newBank) {
        bank = newBank;
      };

      this.wait_vbl_done = function() {
        ctx.fillRect(0, 0, 10, 10);
        render();
      };

      this.joypad = function() {
        return joypad;
      };

      this.set_bkg_data = function(first_tile, nb_tiles, data) {
        for (var i = 0; i < nb_tiles * 16; i++) {
          bkg_data[i + first_tile * 16] = data[i];
        }
        bkg_data_dirty = true;
      };

      this.set_bkg_tiles = function(x, y, w, h, tiles) {
        for (var yi = 0; yi < h; yi++) {
          for (var xi = 0; xi < w; xi++) {
            bkg_tiles[x + xi + (y + yi) * 32] = tiles[xi + yi * w];
          }
        }
        bkg_tiles_dirty.x1 = Math.min(bkg_tiles_dirty.x1, x);
        bkg_tiles_dirty.y1 = Math.min(bkg_tiles_dirty.y1, y);
        bkg_tiles_dirty.x2 = Math.max(bkg_tiles_dirty.x2, x + w);
        bkg_tiles_dirty.y2 = Math.max(bkg_tiles_dirty.y2, y + h);
      };

      this.set_win_tiles = function(x, y, w, h, tiles) {
        for (var yi = 0; yi < h; yi++) {
          for (var xi = 0; xi < w; xi++) {
            win_tiles[x + xi + (y + yi) * 32] = tiles[xi + yi * w];
          }
        }
        win_tiles_dirty.x1 = Math.min(win_tiles_dirty.x1, x);
        win_tiles_dirty.y1 = Math.min(win_tiles_dirty.y1, y);
        win_tiles_dirty.x2 = Math.max(win_tiles_dirty.x2, x + w);
        win_tiles_dirty.y2 = Math.max(win_tiles_dirty.y2, y + h);
      };

      this.set_sprite_data = function(first_tile, nb_tiles, data) {
        var i;
        for (i = 0; i < nb_tiles * 16; i++) {
          sprite_data[i + first_tile * 16] = data[i];
        }
        for (i = 0; i < nb_tiles * 16; i++) {
          draw_tile_data(
            sprite_data_ctx,
            ((i / 2) | 0) % 16,
            2 * ((i / 32) | 0) + i % 2,
            i,
            sprite_data,
            obp0_palette
          );
        }
      };

      this.set_sprite_prop = function(nb, prop) {
        var i = nb * 16;
        sprite_props[nb] = prop;
        draw_tile_data(
          sprite_data_ctx,
          ((i / 2) | 0) % 16,
          2 * ((i / 32) | 0) + i % 2,
          i,
          sprite_data,
          obp0_palette
        );
      };

      this.move_sprite = function(nb, x, y) {
        sprite_x[nb] = x;
        sprite_y[nb] = y;
      };

      this.set_sprite_tile = function(nb, tile) {
        sprite_tiles[nb] = tile;
      };

      this.add_LCD = function(int_handler) {
        LYC_REG = 0;
        lcd_fn = int_handler;
      };

      this.remove_LCD = function() {
        lcd_fn = null;
      };

      this.disable_interrupts = function() {};

      this.enable_interrupts = function() {};
    };

    exports.J_LEFT = J_LEFT;
    exports.J_RIGHT = J_RIGHT;
    exports.J_UP = J_UP;
    exports.J_DOWN = J_DOWN;
    exports.J_START = J_START;
    exports.J_SELECT = J_SELECT;
    exports.J_A = J_A;
    exports.J_B = J_B;
    exports.MINWNDPOSX = MINWNDPOSX;
    exports.MINWNDPOSY = MINWNDPOSY;
    exports.MAXWNDPOSX = MAXWNDPOSX;
    exports.MAXWNDPOSY = MAXWNDPOSY;
    exports.S_FLIPX = S_FLIPX;
    exports.S_FLIPY = S_FLIPY;

    exports.GBDK = GBDK;
    exports.uint = uint;
  });
})(
  typeof define === "function" && define.amd
    ? define
    : function(id, factory) {
        if (typeof exports !== "undefined") {
          //commonjs
          factory(require, exports);
        } else {
          factory(function(value) {
            return window[value];
          }, (window[id] = {}));
        }
      }
);
