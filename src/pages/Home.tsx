import { Hero } from '../components/sections/Hero'
import { WorkShowcase } from '../components/sections/WorkShowcase'
import { PitchSection } from '../components/sections/PitchSection'
import { About } from '../components/sections/About'
import { Contact } from '../components/sections/Contact'
import { SHOW_PITCHES } from '../content/flags'

export default function Home() {
  return (
    <>
      <Hero />
      <WorkShowcase />
      {SHOW_PITCHES && <PitchSection />}
      <About />
      <Contact />
    </>
  )
}
