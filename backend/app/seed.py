from .extensions import bcrypt, db
from .models import CarService, Hotel, User


HOTELS = [
    ("Villa Aurora", "Lake Como, Italy", "A marble-clad lakeside estate with a private Riva landing.", 1850, 7, "https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&w=1200&q=85", 4.9, "Private dock,Infinity pool,Sommelier,Butler", "Saffron lobster risotto", True),
    ("The Obsidian House", "Kyoto, Japan", "A quiet modern ryokan where black timber meets a moonlit garden.", 1320, 9, "https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?auto=format&fit=crop&w=1200&q=85", 4.8, "Onsen,Tea ceremony,Garden suite,Private dining", "A5 wagyu kaiseki", True),
    ("Amani Dunes", "Nairobi, Kenya", "A sculptural safari lodge in the wild, designed for unhurried golden hours.", 980, 12, "https://images.unsplash.com/photo-1516426122078-c23e76319801?auto=format&fit=crop&w=1200&q=85", 4.9, "Game drives,Spa,Star bed,Private guide", "Fire-roasted fillet & sukuma", True),
    ("The Atlas Atelier", "Marrakech, Morocco", "An art-filled riad of tiled courtyards, terraces and candlelit salons.", 720, 11, "https://images.unsplash.com/photo-1548013146-72479768bada?auto=format&fit=crop&w=1200&q=85", 4.7, "Rooftop pool,Hammam,Airport welcome,Library", "Preserved lemon sea bass", False),
    ("Solara Cliffs", "Santorini, Greece", "White-stone suites floating above the caldera with a front-row sunset view.", 1450, 6, "https://images.unsplash.com/photo-1570077188670-e3a8d69ac5ff?auto=format&fit=crop&w=1200&q=85", 4.9, "Plunge pool,Yacht charter,Wine cellar,Sunset deck", "Charcoal octopus with fava", False),
    ("Château Étoile", "Provence, France", "A restored 18th-century château surrounded by lavender and old vines.", 1160, 14, "https://images.unsplash.com/photo-1564501049412-61c2a3083791?auto=format&fit=crop&w=1200&q=85", 4.8, "Vineyard,Helipad,Cooking studio,Cellar", "Truffle poulet de Bresse", False),
    ("The Meridian", "Dubai, UAE", "Skyline residence with uninterrupted desert-to-sea panoramas.", 1680, 18, "https://images.unsplash.com/photo-1564501049412-61c2a3083791?auto=format&fit=crop&w=1200&q=85", 4.8, "Sky pool,Private cinema,Concierge,Club lounge", "Gold leaf pistachio mille-feuille", False),
    ("Nalu House", "Bali, Indonesia", "A lush hideaway where hand-carved stone gives way to the Indian Ocean.", 890, 10, "https://images.unsplash.com/photo-1537996194471-e657df975ab4?auto=format&fit=crop&w=1200&q=85", 4.8, "Oceanfront yoga,Surf valet,Herb garden,Spa", "Coconut-smoked barramundi", False),
    ("Frost & Fjord", "Tromsø, Norway", "Glass-fronted cabins set beneath the northern lights and arctic calm.", 1090, 8, "https://images.unsplash.com/photo-1519681393784-d120267933ba?auto=format&fit=crop&w=1200&q=85", 4.7, "Aurora wake-up,Sauna,Fjord cruise,Fireplace", "King crab with dill butter", False),
    ("Casa Luminosa", "Tulum, Mexico", "Jungle architecture, soft limestone and the rhythm of the Caribbean.", 760, 13, "https://images.unsplash.com/photo-1582610116397-edb318620f90?auto=format&fit=crop&w=1200&q=85", 4.7, "Cenote access,Beach club,Mezcal tasting,Wellness", "Cacao-rubbed local catch", False),
    ("The Gilded Palm", "Maldives", "An overwater sanctuary tailored to bare feet and brilliant blue water.", 2100, 5, "https://images.unsplash.com/photo-1514282401047-d79a71a590e8?auto=format&fit=crop&w=1200&q=85", 5.0, "Overwater spa,Diving,Private chef,Coral garden", "Yellowfin tuna crudo", False),
    ("Cedar & Stone", "Queenstown, New Zealand", "A high-country lodge that pairs alpine adventure with exacting comfort.", 940, 15, "https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?auto=format&fit=crop&w=1200&q=85", 4.8, "Ski valet,Hot tubs,Heli-hiking,Whisky room", "Venison loin with cherries", False),
]

CARS = [
    ("Phantom Serenity", "Rolls-Royce Phantom", 1250, 4, "2 Executive Protection Officers", "https://images.unsplash.com/photo-1563720223185-11003d516935?auto=format&fit=crop&w=1000&q=85", "Silent, hand-finished travel for discreet arrivals."),
    ("Onyx Sentinel", "Mercedes-Maybach GLS", 980, 6, "2 Armed Security Officers", "https://images.unsplash.com/photo-1525609004556-c46c7d6cf023?auto=format&fit=crop&w=1000&q=85", "Commanding comfort, advanced protection and room for your entourage."),
    ("Velar Convoy", "Range Rover Autobiography", 860, 5, "1 Close Protection Officer", "https://images.unsplash.com/photo-1519641471654-76ce0107ad1b?auto=format&fit=crop&w=1000&q=85", "All-terrain refinement for estates, airports and private excursions."),
]


def seed_database():
    db.create_all()
    if not User.query.filter_by(email="admin@aurumreserve.com").first():
        db.session.add(User(username="aurumadmin", email="admin@aurumreserve.com", role="admin", password_hash=bcrypt.generate_password_hash("AurumAdmin2026!").decode("utf-8")))
    if not Hotel.query.first():
        for hotel in HOTELS:
            db.session.add(Hotel(name=hotel[0], location=hotel[1], description=hotel[2], price_per_night=hotel[3], available_rooms=hotel[4], image_url=hotel[5], rating=hotel[6], amenities=hotel[7], signature_meal=hotel[8], featured=hotel[9]))
    if not CarService.query.first():
        for car in CARS:
            db.session.add(CarService(name=car[0], vehicle_type=car[1], price_per_day=car[2], seats=car[3], security_detail=car[4], image_url=car[5], description=car[6]))
    db.session.commit()
