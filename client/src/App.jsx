import { useEffect, useMemo, useState } from 'react'
import './App.css'

const API = (import.meta.env.VITE_API_URL || '').replace(/\/$/, '')
const fallbackHotels = [
  ['Villa Aurora', 'Lake Como, Italy', 1850, 4.9, 'Saffron lobster risotto', 'https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&w=1200&q=85', 'Private dock, Infinity pool, Sommelier, Butler'],
  ['The Obsidian House', 'Kyoto, Japan', 1320, 4.8, 'A5 wagyu kaiseki', 'https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?auto=format&fit=crop&w=1200&q=85', 'Onsen, Tea ceremony, Garden suite, Private dining'],
  ['Amani Dunes', 'Nairobi, Kenya', 980, 4.9, 'Fire-roasted fillet & sukuma', 'https://images.unsplash.com/photo-1516426122078-c23e76319801?auto=format&fit=crop&w=1200&q=85', 'Game drives, Spa, Star bed, Private guide'],
  ['The Atlas Atelier', 'Marrakech, Morocco', 720, 4.7, 'Preserved lemon sea bass', 'https://images.unsplash.com/photo-1548013146-72479768bada?auto=format&fit=crop&w=1200&q=85', 'Rooftop pool, Hammam, Airport welcome, Library'],
  ['Solara Cliffs', 'Santorini, Greece', 1450, 4.9, 'Charcoal octopus with fava', 'https://images.unsplash.com/photo-1570077188670-e3a8d69ac5ff?auto=format&fit=crop&w=1200&q=85', 'Plunge pool, Yacht charter, Wine cellar, Sunset deck'],
  ['Château Étoile', 'Provence, France', 1160, 4.8, 'Truffle poulet de Bresse', 'https://images.unsplash.com/photo-1564501049412-61c2a3083791?auto=format&fit=crop&w=1200&q=85', 'Vineyard, Helipad, Cooking studio, Cellar'],
  ['The Meridian', 'Dubai, UAE', 1680, 4.8, 'Gold leaf pistachio mille-feuille', 'https://images.unsplash.com/photo-1564501049412-61c2a3083791?auto=format&fit=crop&w=1200&q=85', 'Sky pool, Private cinema, Concierge, Club lounge'],
  ['Nalu House', 'Bali, Indonesia', 890, 4.8, 'Coconut-smoked barramundi', 'https://images.unsplash.com/photo-1537996194471-e657df975ab4?auto=format&fit=crop&w=1200&q=85', 'Oceanfront yoga, Surf valet, Herb garden, Spa'],
  ['Frost & Fjord', 'Tromsø, Norway', 1090, 4.7, 'King crab with dill butter', 'https://images.unsplash.com/photo-1519681393784-d120267933ba?auto=format&fit=crop&w=1200&q=85', 'Aurora wake-up, Sauna, Fjord cruise, Fireplace'],
  ['Casa Luminosa', 'Tulum, Mexico', 760, 4.7, 'Cacao-rubbed local catch', 'https://images.unsplash.com/photo-1582610116397-edb318620f90?auto=format&fit=crop&w=1200&q=85', 'Cenote access, Beach club, Mezcal tasting, Wellness'],
  ['The Gilded Palm', 'Maldives', 2100, 5, 'Yellowfin tuna crudo', 'https://images.unsplash.com/photo-1514282401047-d79a71a590e8?auto=format&fit=crop&w=1200&q=85', 'Overwater spa, Diving, Private chef, Coral garden'],
  ['Cedar & Stone', 'Queenstown, New Zealand', 940, 4.8, 'Venison loin with cherries', 'https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?auto=format&fit=crop&w=1200&q=85', 'Ski valet, Hot tubs, Heli-hiking, Whisky room'],
].map(([name, location, price_per_night, rating, signature_meal, image_url, amenities], index) => ({ id: index + 1, name, location, price_per_night, rating, signature_meal, image_url, amenities: amenities.split(', '), description: 'An exceptionally private address designed around a sense of place.', available_rooms: 8 }))

const fallbackCars = [
  { id: 1, name: 'Phantom Serenity', vehicle_type: 'Rolls-Royce Phantom', price_per_day: 1250, seats: 4, security_detail: '2 Executive Protection Officers', image_url: 'https://images.unsplash.com/photo-1563720223185-11003d516935?auto=format&fit=crop&w=1000&q=85', description: 'Silent, hand-finished travel for discreet arrivals.' },
  { id: 2, name: 'Onyx Sentinel', vehicle_type: 'Mercedes-Maybach GLS', price_per_day: 980, seats: 6, security_detail: '2 Licensed Security Officers', image_url: 'https://images.unsplash.com/photo-1525609004556-c46c7d6cf023?auto=format&fit=crop&w=1000&q=85', description: 'Commanding comfort and discreet protection for your entourage.' },
  { id: 3, name: 'Velar Convoy', vehicle_type: 'Range Rover Autobiography', price_per_day: 860, seats: 5, security_detail: '1 Close Protection Officer', image_url: 'https://images.unsplash.com/photo-1519641471654-76ce0107ad1b?auto=format&fit=crop&w=1000&q=85', description: 'All-terrain refinement for estates, airports and private excursions.' },
]

const currency = new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 0 })
const dateToday = new Date().toISOString().split('T')[0]
const getStoredToken = () => localStorage.getItem('aurum-token') || localStorage.getItem('token') || ''

async function responseData(response) {
  try {
    const text = await response.text()
    return text ? JSON.parse(text) : {}
  } catch {
    return {}
  }
}

function requestError(response, payload, fallback) {
  if (payload.message) return payload.message
  if (response.status >= 500) return 'The reservation service is unavailable. Please confirm the Flask server is running and try again.'
  return fallback
}

function App() {
  const [hotels, setHotels] = useState(fallbackHotels)
  const [cars, setCars] = useState(fallbackCars)
  const [query, setQuery] = useState('')
  const [selectedHotel, setSelectedHotel] = useState(null)
  const [selectedCar, setSelectedCar] = useState(null)
  const [authMode, setAuthMode] = useState(null)
  const [user, setUser] = useState(() => JSON.parse(localStorage.getItem('aurum-user') || 'null'))
  const [token, setToken] = useState(getStoredToken)
  const [notice, setNotice] = useState('')
  const [adminOpen, setAdminOpen] = useState(false)

  const filteredHotels = useMemo(() => hotels.filter((hotel) => `${hotel.name} ${hotel.location}`.toLowerCase().includes(query.toLowerCase())), [hotels, query])

  useEffect(() => {
    Promise.all([fetch(`${API}/api/hotels`), fetch(`${API}/api/cars`)])
      .then(async ([hotelResponse, carResponse]) => {
        if (hotelResponse.ok) setHotels(await hotelResponse.json())
        if (carResponse.ok) setCars(await carResponse.json())
      })
      .catch(() => {})
  }, [])

  function showNotice(text) {
    setNotice(text)
    window.setTimeout(() => setNotice(''), 4200)
  }

  function saveSession(payload) {
    setUser(payload.user)
    setToken(payload.token)
    localStorage.setItem('aurum-user', JSON.stringify(payload.user))
    localStorage.setItem('aurum-token', payload.token)
    localStorage.setItem('token', payload.token)
  }

  function signOut() {
    setUser(null)
    setToken('')
    localStorage.removeItem('aurum-user')
    localStorage.removeItem('aurum-token')
    localStorage.removeItem('token')
    setAdminOpen(false)
    showNotice('You have been signed out.')
  }

  async function authenticate(event) {
    event.preventDefault()
      const form = new FormData(event.currentTarget)
      const body = Object.fromEntries(form)
    try {
      const response = await fetch(`${API}/api/auth/${authMode}`, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(body) })
      const payload = await responseData(response)
      if (!response.ok || !payload.token) throw new Error(requestError(response, payload, 'We could not create your account. Please try again.'))
      saveSession(payload)
      setAuthMode(null)
      showNotice(authMode === 'login' ? `Welcome back, ${payload.user.username}.` : 'Your private account is ready.')
    } catch (error) {
      showNotice(error.message || 'We could not complete that request.')
    }
  }

  async function makeBooking(event, type) {
    event.preventDefault()
    const sessionToken = getStoredToken() || token
    if (!sessionToken) {
      setAuthMode('login')
      showNotice('Please sign in to secure your reservation.')
      return
    }
    const formData = Object.fromEntries(new FormData(event.currentTarget))
    const url = type === 'hotel' ? `${API}/api/bookings` : `${API}/api/car-bookings`
    const body = type === 'hotel'
      ? { hotel_id: selectedHotel.id, check_in: formData.check_in, check_out: formData.check_out, guests: Number(formData.guests) }
      : { car_id: selectedCar.id, service_date: formData.service_date, days: Number(formData.days), pickup_location: formData.pickup_location }
    try {
      const response = await fetch(url, { method: 'POST', headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${sessionToken}` }, body: JSON.stringify(body) })
      const payload = await responseData(response)
      if (!response.ok) throw new Error(requestError(response, payload, 'Your booking could not be completed.'))
      setSelectedHotel(null)
      setSelectedCar(null)
      showNotice(payload.message)
    } catch (error) {
      showNotice(error.message || 'Your booking could not be completed.')
    }
  }

  async function addHotel(event) {
    event.preventDefault()
    const raw = Object.fromEntries(new FormData(event.currentTarget))
    const body = { ...raw, amenities: raw.amenities.split(',').map((item) => item.trim()).filter(Boolean), featured: raw.featured === 'on' }
    try {
      const response = await fetch(`${API}/api/admin/hotels`, { method: 'POST', headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` }, body: JSON.stringify(body) })
      const payload = await responseData(response)
      if (!response.ok) throw new Error(requestError(response, payload, 'Hotel could not be added.'))
      setHotels((current) => [payload, ...current])
      event.currentTarget.reset()
      showNotice(`${payload.name} is now live in the collection.`)
    } catch (error) { showNotice(error.message || 'Hotel could not be added.') }
  }

  async function removeHotel(hotel) {
    if (!window.confirm(`Remove ${hotel.name} from the collection?`)) return
    try {
      const response = await fetch(`${API}/api/admin/hotels/${hotel.id}`, { method: 'DELETE', headers: { Authorization: `Bearer ${token}` } })
      if (!response.ok) throw new Error('Unable to remove this hotel.')
      setHotels((current) => current.filter((item) => item.id !== hotel.id))
      showNotice(`${hotel.name} has been removed.`)
    } catch (error) { showNotice(error.message) }
  }

  return (
    <main>
      <header className="nav-shell">
        <a className="brand" href="#top"><span>A</span> AURUM <i>RESERVE</i></a>
        <nav><a href="#collection">Residences</a><a href="#service">Private transfer</a><a href="#story">The Aurum way</a></nav>
        <div className="nav-actions">
          {user?.role === 'admin' && <button className="nav-link" onClick={() => setAdminOpen(true)}>Admin studio</button>}
          {user ? <button className="account" onClick={signOut}>{user.username} <b>↗</b></button> : <button className="account" onClick={() => setAuthMode('login')}>Sign in <b>↗</b></button>}
        </div>
      </header>

      <section className="hero" id="top">
        <div className="hero-backdrop" />
        <div className="hero-copy"><p className="eyebrow">The art of exceptional stays</p><h1>Stay somewhere<br /><em>worth arriving at.</em></h1><p className="intro">A private collection of extraordinary hotels, each chosen for its soul, service and unforgettable table.</p><a className="gold-button" href="#collection">Explore the collection <span>↓</span></a></div>
        <div className="hero-card"><div className="hero-card-line"><span>01 — 12</span><span>CURATED ESCAPES</span></div><div><p>Where every detail holds a little more meaning.</p><span className="scroll-note">SCROLL TO DISCOVER <b>↓</b></span></div></div>
      </section>

      <section className="collection section" id="collection">
        <div className="section-head"><div><p className="eyebrow">A world, carefully chosen</p><h2>Our signature<br /><em>residences.</em></h2></div><p className="section-text">Twelve distinct places for the traveller who knows that luxury is never just about more — it is about better.</p></div>
        <div className="collection-tools"><p><b>{filteredHotels.length}</b> places to belong</p><label className="search"><span>⌕</span><input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Search by city or residence" /></label></div>
        <div className="hotel-grid">
          {filteredHotels.map((hotel, index) => <article className={`hotel-card card-${(index % 5) + 1}`} key={hotel.id} onClick={() => setSelectedHotel(hotel)}>
            <div className="hotel-image"><img src={hotel.image_url} alt={hotel.name} /><span className="rating">★ {hotel.rating}</span><button aria-label={`View ${hotel.name}`}>↗</button></div>
            <div className="hotel-meta"><div><p>{hotel.location}</p><h3>{hotel.name}</h3></div><strong>{currency.format(hotel.price_per_night)}<small> / night</small></strong></div>
          </article>)}
        </div>
      </section>

      <section className="food-section"><div className="food-image" /><div className="food-copy"><p className="eyebrow">A seat at the finest table</p><h2>The taste of<br /><em>the place.</em></h2><p>Every Aurum residence has a kitchen with a point of view. From ocean-caught crudo to fire-roasted game, our chef-led menus are part of the journey.</p><div className="dish"><span>✦</span><div><small>THIS SEASON'S FAVOURITE</small><b>Saffron lobster risotto</b><p>Villa Aurora · Lake Como</p></div></div></div></section>

      <section className="service section" id="service"><div className="section-head"><div><p className="eyebrow">Travel with quiet confidence</p><h2>Your arrival,<br /><em>protected.</em></h2></div><p className="section-text">Reserve a private chauffeur vehicle with a licensed executive protection detail, vetted to exacting international standards.</p></div><div className="car-grid">{cars.map((car) => <article className="car-card" key={car.id}><img src={car.image_url} alt={car.name} /><div className="car-content"><span className="security">◈ {car.security_detail}</span><h3>{car.name}</h3><p>{car.vehicle_type} · {car.seats} guests</p><div><strong>{currency.format(car.price_per_day)} <small>/ day</small></strong><button onClick={() => setSelectedCar(car)}>Reserve <span>↗</span></button></div></div></article>)}</div></section>

      <section className="statement" id="story"><p className="eyebrow">The Aurum way</p><blockquote>“Luxury lives in the<br /><em>moments no one else sees.”</em></blockquote><div className="statement-foot"><span>PERSONAL, NEVER PERFORMED</span><p>From the table you dine at to the car at the curb, every element is considered, then quietly taken care of.</p></div></section>

      <footer><a className="brand" href="#top"><span>A</span> AURUM <i>RESERVE</i></a><p>Private stays for a remarkable world.</p><div><a href="#collection">Residences</a><a href="#service">Transfers</a><button onClick={() => setAuthMode('register')}>Create account</button></div></footer>

      {selectedHotel && <HotelModal hotel={selectedHotel} close={() => setSelectedHotel(null)} onBook={makeBooking} />}
      {selectedCar && <CarModal car={selectedCar} close={() => setSelectedCar(null)} onBook={makeBooking} />}
      {authMode && <AuthModal mode={authMode} close={() => setAuthMode(null)} submit={authenticate} switchMode={() => setAuthMode(authMode === 'login' ? 'register' : 'login')} />}
      {adminOpen && <AdminModal hotels={hotels} close={() => setAdminOpen(false)} addHotel={addHotel} removeHotel={removeHotel} />}
      {notice && <div className="notice">✦ {notice}</div>}
    </main>
  )
}

function HotelModal({ hotel, close, onBook }) {
  return <div className="overlay" onMouseDown={close}><section className="modal hotel-modal" onMouseDown={(event) => event.stopPropagation()}><button className="close" onClick={close}>×</button><img className="modal-photo" src={hotel.image_url} alt={hotel.name} /><div className="modal-body"><p className="eyebrow">{hotel.location}</p><h2>{hotel.name}</h2><p className="description">{hotel.description}</p><div className="detail-grid"><div><small>SIGNATURE PLATE</small><b>✦ {hotel.signature_meal}</b></div><div><small>AT YOUR DISPOSAL</small><p>{hotel.amenities.join(' · ')}</p></div></div><form className="booking-form" onSubmit={(event) => onBook(event, 'hotel')}><label>Arrival<input name="check_in" type="date" min={dateToday} required /></label><label>Departure<input name="check_out" type="date" min={dateToday} required /></label><label>Guests<select name="guests" defaultValue="2"><option>1</option><option>2</option><option>3</option><option>4</option></select></label><button className="gold-button">Reserve from {currency.format(hotel.price_per_night)} <span>↗</span></button></form></div></section></div>
}

function CarModal({ car, close, onBook }) {
  return <div className="overlay" onMouseDown={close}><section className="modal car-modal" onMouseDown={(event) => event.stopPropagation()}><button className="close" onClick={close}>×</button><img className="modal-photo" src={car.image_url} alt={car.name} /><div className="modal-body"><p className="eyebrow">{car.security_detail}</p><h2>{car.name}</h2><p className="description">{car.description}</p><form className="booking-form car-form" onSubmit={(event) => onBook(event, 'car')}><label>Service date<input name="service_date" type="date" min={dateToday} required /></label><label>Days<select name="days" defaultValue="1"><option>1</option><option>2</option><option>3</option><option>4</option><option>5</option></select></label><label className="wide">Pickup location<input name="pickup_location" placeholder="Hotel, airport or private address" required /></label><button className="gold-button">Reserve {currency.format(car.price_per_day)} / day <span>↗</span></button></form></div></section></div>
}

function AuthModal({ mode, close, submit, switchMode }) {
  const registering = mode === 'register'
  return <div className="overlay" onMouseDown={close}><section className="modal auth-modal" onMouseDown={(event) => event.stopPropagation()}><button className="close" onClick={close}>×</button><p className="eyebrow">Private access</p><h2>{registering ? 'Begin your story.' : 'Welcome back.'}</h2><p className="description">{registering ? 'Create your Aurum Reserve account to make and manage reservations.' : 'Sign in to continue with your reservation.'}</p><form className="auth-form" onSubmit={submit}>{registering && <label>Full name<input name="username" minLength="3" required /></label>}<label>Email<input type="email" name="email" required /></label><label>Password<input type="password" name="password" minLength="6" required /></label><button className="gold-button">{registering ? 'Create account' : 'Sign in'} <span>↗</span></button></form><p className="form-switch">{registering ? 'Already a member?' : 'New to Aurum?'} <button onClick={switchMode}>{registering ? 'Sign in' : 'Create an account'}</button></p></section></div>
}

function AdminModal({ hotels, close, addHotel, removeHotel }) {
  return <div className="overlay" onMouseDown={close}><section className="modal admin-modal" onMouseDown={(event) => event.stopPropagation()}><button className="close" onClick={close}>×</button><p className="eyebrow">Aurum administration</p><h2>Collection studio.</h2><div className="admin-layout"><form className="admin-form" onSubmit={addHotel}><h3>Add a residence</h3><input name="name" placeholder="Hotel name" required /><input name="location" placeholder="Location" required /><input name="price_per_night" type="number" min="1" placeholder="Price per night (USD)" required /><input name="available_rooms" type="number" min="0" placeholder="Available rooms" required /><input name="rating" type="number" min="1" max="5" step="0.1" placeholder="Rating (e.g. 4.9)" required /><input name="image_url" type="url" placeholder="Image URL" required /><input name="signature_meal" placeholder="Signature meal" required /><input name="amenities" placeholder="Amenities, comma separated" required /><textarea name="description" placeholder="Residence description" required /><label className="check"><input name="featured" type="checkbox" /> Featured residence</label><button className="gold-button">Publish residence <span>↗</span></button></form><div className="admin-list"><h3>Live collection <span>{hotels.length}</span></h3>{hotels.map((hotel) => <div key={hotel.id}><img src={hotel.image_url} alt="" /><p><b>{hotel.name}</b><small>{hotel.location} · {currency.format(hotel.price_per_night)}</small></p><button onClick={() => removeHotel(hotel)}>Remove</button></div>)}</div></div></section></div>
}

export default App
