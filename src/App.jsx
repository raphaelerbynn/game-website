import Navbar        from './components/Navbar'
import Hero          from './components/Hero'
import GameTicker    from './components/GameTicker'
import About         from './components/About'
import Experience    from './components/Experience'
import StationStatus from './components/StationStatus'
import Pricing       from './components/Pricing'
import Tournament    from './components/Tournament'
import Testimonials  from './components/Testimonials'
import Gallery       from './components/Gallery'
import Contact       from './components/Contact'
import Footer        from './components/Footer'
import BookingModal  from './components/BookingModal'
import Toast         from './components/Toast'
import WhatsAppButton from './components/WhatsAppButton'

export default function App() {
  return (
    <div className="min-h-screen">
      <Navbar />
      <main>
        <Hero />
        <GameTicker />
        <About />
        <Experience />
        <StationStatus />
        <Pricing />
        <Tournament />
        <Testimonials />
        <Gallery />
        <Contact />
      </main>
      <Footer />

      {/* Floating / overlay elements */}
      <BookingModal />
      <Toast />
      <WhatsAppButton />
    </div>
  )
}
