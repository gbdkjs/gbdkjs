mergeInto(LibraryManager.library, {
  set_interrupts: function(a) {
    a;
    // console.log("set_interrupts", a);/
    // @todo
  },

  disable_interrupts: function() {
    // console.log("disable_interrupts");
    // @todo
  },

  enable_interrupts: function() {
    // console.log("enable_interrupts");
    // @todo
  },

  display_off: function() {
    // console.log("display_off");
    // @todo
  },

  add_LCD: function(fn) {
    g.add_LCD(fn);
  },

  remove_LCD: function() {
    g.remove_LCD();
  },

  wait_vbl_done: function() {
    g.wait_vbl_done();
  },

  joypad: function() {
    return g.joypad();
  },

  set_sprite_prop: function(nb, prop) {
    g.set_sprite_prop(uint(nb), uint(prop));
  },

  move_sprite: function(nb, x, y) {
    g.move_sprite(uint(nb), uint(x), uint(y));
  },

  set_bkg_data: function(first_tile, nb_tiles, data) {
    var size = uint(nb_tiles) * 16;
    var arr = [];
    for (var i = 0; i < size; i++) {
      arr[i] = (getValue(data + i, "i8") + 256) & 255;
    }
    g.set_bkg_data(uint(first_tile), uint(nb_tiles), arr);
  },

  set_bkg_tiles: function(x, y, w, h, tiles) {
    var size = uint(w) * uint(h);
    var arr = [];
    for (var i = 0; i < size; i++) {
      arr[i] = uint(getValue(tiles + i, "i8"));
    }
    g.set_bkg_tiles(uint(x), uint(y), uint(w), uint(h), arr);
  },

  set_win_data: function(first_tile, nb_tiles, data) {
    var size = uint(nb_tiles) * 16;
    var arr = [];
    for (var i = 0; i < size; i++) {
      arr[i] = (getValue(data + i, "i8") + 256) & 255;
    }
    g.set_win_data(uint(first_tile), uint(nb_tiles), arr);
  },

  set_win_tiles: function(x, y, w, h, tiles) {
    var size = uint(w) * uint(h);
    var arr = [];
    for (var i = 0; i < size; i++) {
      arr[i] = uint(getValue(tiles + i, "i8"));
    }
    g.set_win_tiles(uint(x), uint(y), uint(w), uint(h), arr);
  },

  set_sprite_data: function(first_tile, nb_tiles, data) {
    var size = uint(nb_tiles) * 16;
    var arr = [];
    for (var i = 0; i < size; i++) {
      arr[i] = uint(getValue(data + i, "i8"));
    }
    g.set_sprite_data(uint(first_tile), uint(nb_tiles), arr);
  },

  set_sprite_tile: function(nb, tile) {
    g.set_sprite_tile(uint(nb), uint(tile));
  },

  emscripten_update_registers: function(
    SCX_REG,
    SCY_REG,
    WX_REG,
    WY_REG,
    LYC_REG,
    LCDC_REG,
    BGP_REG,
    OBP0_REG,
    OBP1_REG
  ) {
    if (SCX_REG !== g.SCX_REG) {
      g.SCX_REG = uint(SCX_REG);
    }
    if (SCY_REG !== g.SCY_REG) {
      g.SCY_REG = uint(SCY_REG);
    }
    if (WX_REG !== g.WX_REG) {
      g.WX_REG = uint(WX_REG);
    }
    if (WY_REG !== g.WY_REG) {
      g.WY_REG = uint(WY_REG);
    }
    if (LYC_REG !== g.LYC_REG) {
      g.LYC_REG = uint(LYC_REG);
    }
    if (LCDC_REG !== g.LCDC_REG) {
      g.LCDC_REG = uint(LCDC_REG);
    }
    if (BGP_REG !== g.BGP_REG) {
      g.BGP_REG = uint(BGP_REG);
    }
    if (OBP0_REG !== g.OBP0_REG) {
      g.OBP0_REG = uint(OBP0_REG);
    }
    if (OBP1_REG !== g.OBP1_REG) {
      g.OBP1_REG = uint(OBP1_REG);
    }
  }
});
