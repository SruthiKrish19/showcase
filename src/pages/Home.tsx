import { Hero } from '../components/sections/Hero'
import { WorkShowcase } from '../components/sections/WorkShowcase'
import { PitchSection } from '../components/sections/PitchSection'
import { About } from '../components/sections/About'

export default function Home() {
  return (
    <>
      <Hero />
      <WorkShowcase />
      <PitchSection />
      <About />
    </>
  )
}
