/** @jsx jsx */
import { Suspense } from "react"
import { jsx } from "theme-ui"
import HeroCanvas from "./canvas"
import { Canvas } from "react-three-fiber"
import { ParallaxLayer } from "@react-spring/parallax"

const Hero = ({ offset, factor = 1 }: { offset: number; factor?: number }) => (
  <div>
    <ParallaxLayer
      sx={{
        position: `absolute`,
        width: `full`,
        height: `full`,
      }}
      speed={1}
      offset={offset}
      factor={factor}
    >
      {/* TODO make this loading better */}
      <Suspense fallback={<div>Loading... </div>}>
        <Canvas>
          <HeroCanvas />
        </Canvas>
      </Suspense>
    </ParallaxLayer>
  </div>
)

export default Hero