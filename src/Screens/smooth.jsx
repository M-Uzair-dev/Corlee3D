
import React, { useEffect } from 'react'
import Lenis from "lenis";
import { Outlet } from 'react-router-dom';
const Smooth = () => {
    useEffect(() => {
        const lenis = new Lenis({
          lerp: 0.05,
        });
        let raf = (time) => {
          lenis.raf(time);
          requestAnimationFrame(raf);
        };
        requestAnimationFrame(raf);
      }, []);
  return (
    <div>
        <Outlet />
    </div>
  )
}

export default Smooth