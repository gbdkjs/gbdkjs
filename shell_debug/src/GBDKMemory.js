import React, { useRef, useState, useEffect } from 'react'

// normally I like to kepp all my styles inline, but this has some global style:
import './GBDKMemory.css'

// TODO: add memory function to gbdk
// This is mock for that
// each line is a array-item from hex-viewer, but later it could be some other format
const getMemory = (start) => [...new Array(16)].map((v, i) => {
  const mem = [...new Array(16)].map(() => Math.random() * 255)
  const data = mem.map(n => hex(n | 0, 2))
  const translated = mem.map(n => n < 0x7E && n > 20 ? String.fromCharCode(n) : '.')
  return `${hex(start + (i * 16))} ${data.join(' ')}  ${translated.join(' ')}`
})

// show nice hex of a number
const hex = (number, places = 4) => Number(number).toString(16).toUpperCase().padStart(places, '0')

// round to nearest
const round = (num, grainularity = 16) => Math.round(num / grainularity) * grainularity

// fake-scrolling (to conserver rendering) window that tracks memory
export default ({ gbdk, position = 0 }) => {
  const [ pos, setPos ] = useState(position)
  const [ mem, setMem ] = useState([])
  const go = useRef()
  const jump = useRef()
  const scroller = useRef()

  // TODO: this is just mock, it should be in gbdk
  useEffect(() => {
    setMem(getMemory(round(pos)))
    scroller.current.scrollTo(0, (pos * 12) + 5)
  }, [pos])

  const onGo = () => {
    setPos(parseInt(go.current.value, 16))
    scroller.current.scrollTo(0, (pos * 12) + 5)
  }

  const onJump = () => {
    go.current.value = hex(jump.current.value)
    onGo()
  }

  const onScroll = e => setPos((e.target.scrollTop / 12) | 0)

  return (
    <div style={{ width: 580, height: 220, padding: 5 }}>
      <div style={{ display: 'flex', paddingBottom: 5 }}>
        <div style={{ flex: 1 }}>
          <select ref={jump} onChange={onJump}>
            <option value='0'>0x0000 - ROM</option>
            <option value='16384'>0x4000 - ROM</option>
            <option value='32768'>0x8000 - VRAM</option>
            <option value='32768'>0x8000 - VRAM</option>
            <option value='40960'>0xA000 - SRAM</option>
            <option value='49152'>0xC000 - RAM</option>
            <option value='53248'>0xD000 - WRAM</option>
            <option value='65280'>0xFF00 - I/O</option>
            <option value='65408'>0xFF80 - RAM</option>
          </select>
        </div>
        <div>
          <input type='text' ref={go} placeholder='A000' />
          <button onClick={onGo}>GO</button>
        </div>
      </div>
      <div onScroll={onScroll} ref={scroller} style={{ overflow: 'scroll', height: 200 }}>
        <div style={{ height: 65295 * 12, position: 'relative' }}>
          <div style={{ position: 'absolute', top: pos * 12 }}>
            {mem.map((m, i) => (
              <pre style={{ fontSize: 11, lineHeight: 0 }} key={i}>{m}</pre>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
