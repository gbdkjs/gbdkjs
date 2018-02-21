#ifndef GBDKJS_H
#define GBDKJS_H

#include <gb/gb.h>

#ifdef __EMSCRIPTEN__ 
  typedef void (*em_callback_func)(void);
  extern void emscripten_set_main_loop(em_callback_func func, int fps, int simulate_infinite_loop);    
  extern void emscripten_update_registers (UBYTE scx_reg, UBYTE scy_reg, UBYTE wx_reg, UBYTE wy_reg, UBYTE lyc_reg, UBYTE lcdc_reg, UBYTE bgp_reg, UBYTE obp0_reg, UBYTE obp1_reg);
  #define LOG(args...) printf(args)
#else
  #define LOG(fmt, args...) 
#endif

#endif
