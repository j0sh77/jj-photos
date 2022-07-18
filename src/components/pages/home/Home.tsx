import * as React from "react"
import { useRef } from "react"
import { useEffect, useState } from "react"
import { useWindowSize } from "../../../hooks/use-window-size"
import { Icon } from "../../elements/icon"
import { SEO } from "../../elements/seo"
import * as styles from "./Home.module.css"

type HomeImage = {
  src: string,
  aspectRatio: number,
  colors: {
    vibrant: string,
    darkVibrant: string,
    lightVibrant: string,
    muted: string,
    darkMuted: string,
    lightMuted: string,
  }
  started?: number,
  className?: string,
}

interface HomeProps {
  images: HomeImage[],
}

const ORIENTATION_RATIO_MIN = 4 / 3

const imageIsAllowedOnWindowRatio = (image: HomeImage) => {
  const windowAspectRatio = window.innerWidth / window.innerHeight

  // close to square, so allow all
  if (windowAspectRatio <= ORIENTATION_RATIO_MIN && windowAspectRatio >= 1 / ORIENTATION_RATIO_MIN) {
    return true
  }

  // window is landscape and image is landscape
  if (windowAspectRatio > ORIENTATION_RATIO_MIN && image.aspectRatio > ORIENTATION_RATIO_MIN) {
    return true
  }

  // window is portrait and image is portrait
  if (windowAspectRatio < 1 / ORIENTATION_RATIO_MIN && image.aspectRatio < 1 / ORIENTATION_RATIO_MIN) {
    return true
  }

  // boo... not allowed. get outta here.
  return false
}

const getRandomImage = (images: HomeImage[], currentImage: HomeImage = null) => {

  let random = images[Math.floor(Math.random() * images.length)]

  while (!imageIsAllowedOnWindowRatio(random) || (currentImage && random.src === currentImage.src)) {
    random = images[Math.floor(Math.random() * images.length)]
  }

  return {
    started: Date.now(),
    ...random,
  }
}

const ROTATE_INTERVAL = 3000
const TRANSITION_INTERVAL = 1500

export const Home = ({ images }: HomeProps) => {
  // initialize background state
  const [backgrounds, setBackgrounds] = useState([
    getRandomImage(images), 
    getRandomImage(images),
  ])
  const backgroundsRef = useRef([])
  backgroundsRef.current = backgrounds

  // kick off animation
  useEffect(() => {
    const handleAnimations = (fadeOutLastImage = true) => {
      const fadedBackgrounds = [...backgroundsRef.current]
      fadedBackgrounds[fadedBackgrounds.length - 2].className = styles.zoom

      if (fadeOutLastImage) {
        fadedBackgrounds[fadedBackgrounds.length - 1].className = [styles.zoom, styles.fadeOut].join(' ')
      } else {
        fadedBackgrounds[fadedBackgrounds.length - 1].className = styles.zoom
      }
      setBackgrounds(fadedBackgrounds)
    }

    // remove one image and add a new one every ROTATE_INTERVAL
    const handleImageLayers = () => {
      const backgroundsMinusOne = backgroundsRef.current.slice(0, backgroundsRef.current.length - 1)
      const newBackgrounds = [
        getRandomImage(
          images,
          backgroundsMinusOne[backgroundsMinusOne.length - 1]
        ), 
        ...backgroundsMinusOne
      ]

      // set the last image to fadeOut every TRANSITION_INTERVAL
      setTimeout(handleAnimations, TRANSITION_INTERVAL)
      setTimeout(handleImageLayers, ROTATE_INTERVAL)
      setBackgrounds(newBackgrounds)
    }

    // TODO there's something weird here... images flicker on first load sometimes
    setTimeout(() => {
      handleAnimations(false)
      setTimeout(() => {
        handleAnimations()
        setTimeout(handleImageLayers, ROTATE_INTERVAL)
      }, TRANSITION_INTERVAL)
    }, 10)
  }, [])

  // order background divs
  const backgroundsDisplay = backgrounds.map(background => (
    <div 
      key={`${background.src}-${background.started}`} 
      className={`${styles.backgroundImage} ${background.className || ''}`} 
      style={{backgroundImage: `url(${background.src})`}} 
    />
  ))

  const currentBackground = backgrounds[backgrounds.length - 2]

  return <div className={styles.home}>
    <SEO />
    <div className={styles.background}>
      {backgroundsDisplay}
    </div>
    <div className={styles.content}>
      <Icon accent={currentBackground.colors.lightVibrant} className={styles.icon} />
    </div>
  </div>
}
