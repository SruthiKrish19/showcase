import { ContactForm, type Interest } from '../ContactForm'
import { Reveal } from '../ui/Reveal'
import { SectionHeading } from '../ui/SectionHeading'
import { SHOW_PITCHES } from '../../content/flags'
import { pitches } from '../../content/pitches'

// Hidden pitches stay out of the options too.
const INTERESTS: Interest[] = [
  { key: 'A project', note: 'A website, 3D experience or AI tool for your business' },
  ...(SHOW_PITCHES ? pitches.map((p) => ({ key: p.title, note: 'Use it, partner with us or invest' })) : []),
  { key: 'Something else', note: 'Questions, ideas or anything we can help with' },
]

export function Contact() {
  return (
    <section id="contact" className="relative mx-auto max-w-6xl scroll-mt-24 px-5 pt-16 pb-16 sm:px-6 md:pt-32 md:pb-28">
      <div className="grid gap-8 md:grid-cols-[1fr_1.2fr] md:gap-16">
        <SectionHeading index="04 / CONTACT" title="Get in touch." highlight={['touch.']} tight>
          Have a project in mind{SHOW_PITCHES ? `, or interested in ${pitches.map((p) => p.title).join(' or ')}` : ''}?
          Tell us a little about it and we'll get back to you.
        </SectionHeading>

        <Reveal delay={0.1}>
          <ContactForm
            accent="violet"
            subject="Website enquiry"
            interests={INTERESTS}
            interestsLabel="What's it about?"
            companyLabel="Company"
            notesLabel="Tell us about it"
            notesPlaceholder="What you're working on, what you'd like from us, and any timelines."
          />
        </Reveal>
      </div>
    </section>
  )
}
