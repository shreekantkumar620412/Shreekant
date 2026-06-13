import { useState, useEffect, useRef } from "react";

// ============ MOCK DATA ============
const ADMIN_USER = { email: "admin@photo.com", password: "admin123", role: "admin", name: "Raj Photography" };
const SAMPLE_PHOTOS = [
  { id: 1, title: "Golden Hour", category: "landscape", price: 1500, img: "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=600&q=80", likes: 128 },
  { id: 2, title: "Urban Life", category: "street", price: 1200, img: "https://images.unsplash.com/photo-1477959858617-67f85cf4f1df?w=600&q=80", likes: 95 },
  { id: 3, title: "Portrait Story", category: "portrait", price: 2000, img: "https://images.unsplash.com/photo-1531746020798-e6953c6e8e04?w=600&q=80", likes: 210 },
  { id: 4, title: "Ocean Dreams", category: "landscape", price: 1800, img: "https://images.unsplash.com/photo-1505118380757-91f5f5632de0?w=600&q=80", likes: 176 },
  { id: 5, title: "City Nights", category: "street", price: 1300, img: "https://images.unsplash.com/photo-1519501025264-65ba15a82390?w=600&q=80", likes: 142 },
  { id: 6, title: "Nature's Eye", category: "nature", price: 1600, img: "https://images.unsplash.com/photo-1441974231531-c6227db76b6e?w=600&q=80", likes: 189 },
  { id: 7, title: "Wedding Bliss", category: "wedding", price: 3500, img: "https://images.unsplash.com/photo-1519741497674-611481863552?w=600&q=80", likes: 305 },
  { id: 8, title: "Wild Safari", category: "nature", price: 2200, img: "https://images.unsplash.com/photo-1504173010664-32509107bde1?w=600&q=80", likes: 248 },
  { id: 9, title: "Monsoon Magic", category: "landscape", price: 1700, img: "https://images.unsplash.com/photo-1429087969512-1e85aab2683d?w=600&q=80", likes: 163 },
];

const PACKAGES = [
  { id: 1, name: "Basic", price: 4999, desc: "1 hour shoot, 20 edited photos, 1 location", color: "#4A90D9" },
  { id: 2, name: "Standard", price: 9999, desc: "3 hour shoot, 60 edited photos, 2 locations + album", color: "#7B5EA7" },
  { id: 3, name: "Premium", price: 19999, desc: "Full day shoot, 150+ photos, unlimited locations + video reel", color: "#E8A838" },
];

// ============ STYLES ============
const styles = `
  @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,400;0,700;1,400&family=Inter:wght@300;400;500;600&display=swap');
  
  * { margin: 0; padding: 0; box-sizing: border-box; }
  
  :root {
    --dark: #0D0D0D;
    --dark2: #1A1A1A;
    --dark3: #242424;
    --gold: #C9A84C;
    --gold2: #E8C96A;
    --light: #F5F0E8;
    --text: #D4CFC6;
    --muted: #888;
    --red: #E05252;
  }

  body { background: var(--dark); color: var(--text); font-family: 'Inter', sans-serif; }
  
  .app { min-height: 100vh; }

  /* NAV */
  .nav {
    position: fixed; top: 0; left: 0; right: 0; z-index: 1000;
    background: rgba(13,13,13,0.95); backdrop-filter: blur(20px);
    border-bottom: 1px solid rgba(201,168,76,0.2);
    display: flex; align-items: center; justify-content: space-between;
    padding: 0 2rem; height: 64px;
  }
  .nav-logo { font-family: 'Playfair Display', serif; font-size: 1.4rem; color: var(--gold); cursor: pointer; }
  .nav-links { display: flex; gap: 0.5rem; align-items: center; }
  .nav-btn {
    background: none; border: none; color: var(--text); cursor: pointer;
    padding: 0.4rem 0.9rem; border-radius: 6px; font-size: 0.85rem; font-family: 'Inter', sans-serif;
    transition: all 0.2s;
  }
  .nav-btn:hover { color: var(--gold); background: rgba(201,168,76,0.08); }
  .nav-btn.active { color: var(--gold); }
  .btn-gold {
    background: var(--gold); color: var(--dark); border: none; cursor: pointer;
    padding: 0.5rem 1.2rem; border-radius: 6px; font-weight: 600;
    font-size: 0.85rem; font-family: 'Inter', sans-serif; transition: all 0.2s;
  }
  .btn-gold:hover { background: var(--gold2); transform: translateY(-1px); }
  .btn-outline {
    background: none; border: 1px solid var(--gold); color: var(--gold); cursor: pointer;
    padding: 0.5rem 1.2rem; border-radius: 6px; font-size: 0.85rem;
    font-family: 'Inter', sans-serif; transition: all 0.2s;
  }
  .btn-outline:hover { background: rgba(201,168,76,0.1); }
  .badge {
    background: var(--red); color: white; border-radius: 50%;
    width: 18px; height: 18px; font-size: 0.65rem; display: inline-flex;
    align-items: center; justify-content: center; margin-left: 4px;
  }

  /* HERO */
  .hero {
    min-height: 100vh; display: flex; align-items: center; justify-content: center;
    text-align: center; padding: 2rem;
    background: linear-gradient(135deg, #0D0D0D 0%, #1a1209 50%, #0D0D0D 100%);
    position: relative; overflow: hidden;
  }
  .hero::before {
    content: ''; position: absolute; inset: 0;
    background: radial-gradient(ellipse at 50% 50%, rgba(201,168,76,0.08) 0%, transparent 70%);
  }
  .hero-content { position: relative; z-index: 1; max-width: 700px; }
  .hero-eyebrow { color: var(--gold); font-size: 0.8rem; letter-spacing: 0.3em; text-transform: uppercase; margin-bottom: 1.5rem; }
  .hero-title { font-family: 'Playfair Display', serif; font-size: clamp(2.5rem, 7vw, 5rem); line-height: 1.1; color: var(--light); margin-bottom: 1rem; }
  .hero-title em { color: var(--gold); font-style: italic; }
  .hero-sub { color: var(--muted); font-size: 1rem; line-height: 1.7; margin-bottom: 2.5rem; font-weight: 300; }
  .hero-btns { display: flex; gap: 1rem; justify-content: center; flex-wrap: wrap; }

  /* SECTION */
  .section { padding: 5rem 2rem; max-width: 1200px; margin: 0 auto; }
  .section-title {
    font-family: 'Playfair Display', serif; font-size: clamp(1.8rem, 4vw, 2.8rem);
    color: var(--light); margin-bottom: 0.5rem;
  }
  .section-sub { color: var(--muted); margin-bottom: 3rem; font-weight: 300; }
  .gold-line { width: 50px; height: 2px; background: var(--gold); margin: 0.8rem 0 2rem; }

  /* GALLERY */
  .gallery-filters { display: flex; gap: 0.5rem; flex-wrap: wrap; margin-bottom: 2rem; }
  .filter-btn {
    background: none; border: 1px solid rgba(201,168,76,0.2); color: var(--muted);
    padding: 0.4rem 1rem; border-radius: 20px; cursor: pointer; font-size: 0.82rem;
    font-family: 'Inter', sans-serif; transition: all 0.2s;
  }
  .filter-btn.active { border-color: var(--gold); color: var(--gold); background: rgba(201,168,76,0.08); }
  .filter-btn:hover { border-color: var(--gold); color: var(--gold); }

  .gallery-grid {
    display: grid; grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
    gap: 1.2rem;
  }
  .photo-card {
    border-radius: 10px; overflow: hidden; position: relative; cursor: pointer;
    background: var(--dark2);
    transition: transform 0.3s, box-shadow 0.3s;
  }
  .photo-card:hover { transform: translateY(-6px); box-shadow: 0 20px 50px rgba(0,0,0,0.6); }
  .photo-card img { width: 100%; height: 220px; object-fit: cover; display: block; }
  .photo-info { padding: 1rem; }
  .photo-title { color: var(--light); font-weight: 500; font-size: 0.95rem; margin-bottom: 0.4rem; }
  .photo-meta { display: flex; justify-content: space-between; align-items: center; }
  .photo-price { color: var(--gold); font-weight: 600; font-size: 0.9rem; }
  .photo-likes { color: var(--muted); font-size: 0.8rem; }
  .photo-overlay {
    position: absolute; inset: 0; background: rgba(0,0,0,0.7);
    display: flex; align-items: center; justify-content: center; gap: 0.7rem;
    opacity: 0; transition: opacity 0.3s;
  }
  .photo-card:hover .photo-overlay { opacity: 1; }

  /* PACKAGES */
  .packages-grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(260px, 1fr)); gap: 1.5rem; }
  .pkg-card {
    background: var(--dark2); border: 1px solid rgba(255,255,255,0.05);
    border-radius: 14px; padding: 2rem; position: relative; overflow: hidden;
    transition: transform 0.3s, border-color 0.3s;
  }
  .pkg-card:hover { transform: translateY(-4px); border-color: rgba(201,168,76,0.3); }
  .pkg-accent { position: absolute; top: 0; left: 0; right: 0; height: 4px; }
  .pkg-name { font-family: 'Playfair Display', serif; font-size: 1.5rem; color: var(--light); margin: 1rem 0 0.3rem; }
  .pkg-price { font-size: 2.2rem; font-weight: 700; color: var(--gold); margin-bottom: 0.5rem; }
  .pkg-price span { font-size: 0.9rem; font-weight: 400; color: var(--muted); }
  .pkg-desc { color: var(--muted); font-size: 0.88rem; line-height: 1.6; margin-bottom: 1.5rem; }

  /* MODAL */
  .modal-overlay {
    position: fixed; inset: 0; background: rgba(0,0,0,0.85);
    display: flex; align-items: center; justify-content: center;
    z-index: 2000; padding: 1rem; backdrop-filter: blur(5px);
  }
  .modal {
    background: var(--dark2); border: 1px solid rgba(201,168,76,0.15);
    border-radius: 16px; padding: 2rem; width: 100%; max-width: 440px;
    position: relative; max-height: 90vh; overflow-y: auto;
  }
  .modal-title { font-family: 'Playfair Display', serif; font-size: 1.6rem; color: var(--light); margin-bottom: 0.3rem; }
  .modal-sub { color: var(--muted); font-size: 0.85rem; margin-bottom: 1.8rem; }
  .modal-close {
    position: absolute; top: 1rem; right: 1rem;
    background: none; border: none; color: var(--muted); cursor: pointer;
    font-size: 1.5rem; line-height: 1;
  }
  .form-group { margin-bottom: 1.1rem; }
  .form-label { display: block; color: var(--muted); font-size: 0.8rem; margin-bottom: 0.4rem; letter-spacing: 0.05em; text-transform: uppercase; }
  .form-input {
    width: 100%; background: var(--dark3); border: 1px solid rgba(255,255,255,0.08);
    color: var(--light); padding: 0.7rem 0.9rem; border-radius: 8px;
    font-size: 0.9rem; font-family: 'Inter', sans-serif; outline: none;
    transition: border-color 0.2s;
  }
  .form-input:focus { border-color: var(--gold); }
  .form-input::placeholder { color: #555; }
  .form-link { color: var(--gold); cursor: pointer; font-size: 0.85rem; }
  .form-link:hover { text-decoration: underline; }
  .error-msg { color: var(--red); font-size: 0.82rem; margin-top: 0.3rem; }
  .success-msg { color: #5EC97A; font-size: 0.82rem; margin-top: 0.3rem; text-align: center; }
  .divider { text-align: center; color: var(--muted); font-size: 0.8rem; margin: 1rem 0; position: relative; }
  .divider::before, .divider::after {
    content: ''; position: absolute; top: 50%; width: 40%; height: 1px;
    background: rgba(255,255,255,0.08);
  }
  .divider::before { left: 0; } .divider::after { right: 0; }

  /* PAYMENT */
  .payment-methods { display: flex; gap: 0.8rem; margin-bottom: 1.5rem; flex-wrap: wrap; }
  .pay-method {
    flex: 1; min-width: 80px; background: var(--dark3);
    border: 2px solid transparent; border-radius: 10px; padding: 0.8rem;
    cursor: pointer; text-align: center; transition: all 0.2s;
  }
  .pay-method.selected { border-color: var(--gold); background: rgba(201,168,76,0.08); }
  .pay-icon { font-size: 1.5rem; display: block; margin-bottom: 0.3rem; }
  .pay-label { font-size: 0.75rem; color: var(--muted); }
  .card-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 1rem; }

  /* LIVE CHAT */
  .chat-bubble {
    position: fixed; bottom: 2rem; right: 2rem; z-index: 1500;
    width: 56px; height: 56px; border-radius: 50%;
    background: var(--gold); border: none; cursor: pointer;
    font-size: 1.5rem; box-shadow: 0 8px 25px rgba(201,168,76,0.4);
    display: flex; align-items: center; justify-content: center;
    transition: transform 0.2s;
  }
  .chat-bubble:hover { transform: scale(1.1); }
  .chat-window {
    position: fixed; bottom: 5.5rem; right: 2rem; z-index: 1500;
    width: 320px; background: var(--dark2);
    border: 1px solid rgba(201,168,76,0.2); border-radius: 16px;
    overflow: hidden; box-shadow: 0 20px 60px rgba(0,0,0,0.6);
    display: flex; flex-direction: column; height: 420px;
  }
  .chat-header {
    background: linear-gradient(135deg, #1a1209, #242415);
    border-bottom: 1px solid rgba(201,168,76,0.15);
    padding: 1rem; display: flex; align-items: center; gap: 0.8rem;
  }
  .chat-avatar { width: 36px; height: 36px; border-radius: 50%; background: var(--gold); display: flex; align-items: center; justify-content: center; color: var(--dark); font-weight: 700; font-size: 0.85rem; }
  .chat-name { color: var(--light); font-weight: 600; font-size: 0.9rem; }
  .chat-status { color: #5EC97A; font-size: 0.75rem; }
  .chat-messages { flex: 1; overflow-y: auto; padding: 1rem; display: flex; flex-direction: column; gap: 0.8rem; }
  .msg { max-width: 80%; }
  .msg-bubble { padding: 0.6rem 0.9rem; border-radius: 12px; font-size: 0.85rem; line-height: 1.5; }
  .msg.bot { align-self: flex-start; }
  .msg.bot .msg-bubble { background: var(--dark3); color: var(--text); border-radius: 2px 12px 12px 12px; }
  .msg.user { align-self: flex-end; }
  .msg.user .msg-bubble { background: var(--gold); color: var(--dark); border-radius: 12px 12px 2px 12px; }
  .chat-input-row { padding: 0.8rem; border-top: 1px solid rgba(255,255,255,0.06); display: flex; gap: 0.5rem; }
  .chat-inp {
    flex: 1; background: var(--dark3); border: 1px solid rgba(255,255,255,0.08);
    color: var(--light); padding: 0.5rem 0.8rem; border-radius: 8px;
    font-size: 0.85rem; font-family: 'Inter', sans-serif; outline: none;
  }
  .chat-send { background: var(--gold); border: none; color: var(--dark); border-radius: 8px; padding: 0.5rem 0.8rem; cursor: pointer; font-size: 1rem; }

  /* ADMIN PANEL */
  .admin-wrap { padding-top: 64px; min-height: 100vh; display: flex; }
  .sidebar {
    width: 220px; background: var(--dark2); border-right: 1px solid rgba(255,255,255,0.05);
    position: fixed; top: 64px; bottom: 0; overflow-y: auto; padding: 1.5rem 0;
  }
  .sidebar-item {
    display: flex; align-items: center; gap: 0.7rem; padding: 0.7rem 1.5rem;
    cursor: pointer; color: var(--muted); font-size: 0.88rem; transition: all 0.2s;
    border-left: 2px solid transparent;
  }
  .sidebar-item:hover, .sidebar-item.active { color: var(--gold); border-left-color: var(--gold); background: rgba(201,168,76,0.05); }
  .admin-content { margin-left: 220px; padding: 2rem; width: 100%; }
  .admin-title { font-family: 'Playfair Display', serif; font-size: 1.8rem; color: var(--light); margin-bottom: 0.3rem; }
  .stats-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(180px, 1fr)); gap: 1rem; margin-bottom: 2rem; }
  .stat-card { background: var(--dark2); border: 1px solid rgba(255,255,255,0.05); border-radius: 12px; padding: 1.3rem; }
  .stat-value { font-size: 2rem; font-weight: 700; color: var(--gold); }
  .stat-label { color: var(--muted); font-size: 0.8rem; margin-top: 0.2rem; }
  .table-wrap { background: var(--dark2); border-radius: 12px; overflow: hidden; border: 1px solid rgba(255,255,255,0.05); }
  table { width: 100%; border-collapse: collapse; }
  th { background: var(--dark3); color: var(--muted); font-size: 0.78rem; text-transform: uppercase; letter-spacing: 0.08em; padding: 0.9rem 1.2rem; text-align: left; }
  td { padding: 0.9rem 1.2rem; border-top: 1px solid rgba(255,255,255,0.04); color: var(--text); font-size: 0.88rem; }
  .chip { display: inline-block; padding: 0.2rem 0.7rem; border-radius: 20px; font-size: 0.75rem; font-weight: 500; }
  .chip-green { background: rgba(94,201,122,0.15); color: #5EC97A; }
  .chip-gold { background: rgba(201,168,76,0.15); color: var(--gold); }
  .chip-red { background: rgba(224,82,82,0.15); color: var(--red); }

  /* ABOUT */
  .about-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 4rem; align-items: center; }
  .about-img { border-radius: 14px; overflow: hidden; position: relative; }
  .about-img img { width: 100%; height: 450px; object-fit: cover; display: block; filter: grayscale(20%); }
  .about-img::after { content: ''; position: absolute; inset: 0; border: 2px solid rgba(201,168,76,0.3); border-radius: 14px; }
  .about-text h3 { font-family: 'Playfair Display', serif; font-size: 1.2rem; color: var(--gold); margin-bottom: 0.5rem; }
  .about-text p { color: var(--muted); line-height: 1.8; font-weight: 300; margin-bottom: 1.5rem; }

  /* PRIVACY */
  .privacy-wrap { max-width: 760px; margin: 0 auto; padding: 6rem 2rem 4rem; }
  .privacy-wrap h1 { font-family: 'Playfair Display', serif; color: var(--light); margin-bottom: 0.5rem; font-size: 2.2rem; }
  .privacy-wrap h2 { color: var(--gold); font-size: 1.1rem; margin: 2rem 0 0.7rem; font-family: 'Playfair Display', serif; }
  .privacy-wrap p, .privacy-wrap li { color: var(--muted); line-height: 1.8; font-size: 0.9rem; margin-bottom: 0.5rem; }
  .privacy-wrap ul { padding-left: 1.5rem; }

  /* FOOTER */
  .footer { border-top: 1px solid rgba(255,255,255,0.06); padding: 3rem 2rem; text-align: center; }
  .footer-logo { font-family: 'Playfair Display', serif; font-size: 1.5rem; color: var(--gold); margin-bottom: 1rem; }
  .footer-links { display: flex; gap: 1.5rem; justify-content: center; flex-wrap: wrap; margin-bottom: 1.5rem; }
  .footer-link { color: var(--muted); font-size: 0.85rem; cursor: pointer; transition: color 0.2s; }
  .footer-link:hover { color: var(--gold); }
  .footer-copy { color: #444; font-size: 0.78rem; }

  /* TOAST */
  .toast {
    position: fixed; bottom: 2rem; left: 50%; transform: translateX(-50%);
    background: var(--dark2); border: 1px solid rgba(201,168,76,0.3);
    color: var(--light); padding: 0.8rem 1.5rem; border-radius: 8px;
    font-size: 0.88rem; z-index: 9999; animation: fadeUp 0.3s ease;
    box-shadow: 0 10px 30px rgba(0,0,0,0.5);
  }
  @keyframes fadeUp { from { opacity:0; transform: translate(-50%,10px); } to { opacity:1; transform: translate(-50%,0); } }

  @media (max-width: 768px) {
    .nav-links .nav-btn:not(:last-child):not(:nth-last-child(2)) { display: none; }
    .about-grid { grid-template-columns: 1fr; }
    .sidebar { display: none; }
    .admin-content { margin-left: 0; }
    .card-grid { grid-template-columns: 1fr; }
  }
`;

const BOT_RESPONSES = [
  "Namaste! 🙏 Main Raj Photography ka assistant hoon. Kaise help kar sakta hoon?",
  "Hamare packages ₹4,999 se shuru hote hain. Kaunsa event hai aapka?",
  "Booking ke liye 'Book Now' button pe click karein ya WhatsApp karein.",
  "Haan, hum wedding, portrait, events, aur commercial shoots karte hain!",
  "Editing turnaround 5-7 working days hai. Urgent delivery bhi available hai.",
  "Aap gallery mein photos dekh sakte hain aur individual prints bhi order kar sakte hain.",
];

export default function App() {
  const [page, setPage] = useState("home");
  const [modal, setModal] = useState(null); // 'login' | 'register' | 'payment' | 'photo'
  const [user, setUser] = useState(null);
  const [chatOpen, setChatOpen] = useState(false);
  const [chatMessages, setChatMessages] = useState([{ type: "bot", text: BOT_RESPONSES[0] }]);
  const [chatInput, setChatInput] = useState("");
  const [galleryFilter, setGalleryFilter] = useState("all");
  const [selectedPhoto, setSelectedPhoto] = useState(null);
  const [selectedPkg, setSelectedPkg] = useState(null);
  const [toast, setToast] = useState(null);
  const [adminTab, setAdminTab] = useState("dashboard");
  const [regUsers, setRegUsers] = useState([
    { id: 1, name: "Priya Sharma", email: "priya@gmail.com", joined: "10 Jun 2026", status: "active" },
    { id: 2, name: "Rahul Verma", email: "rahul@gmail.com", joined: "8 Jun 2026", status: "active" },
  ]);

  // Login form
  const [loginData, setLoginData] = useState({ email: "", password: "" });
  const [loginErr, setLoginErr] = useState("");
  // Register form
  const [regData, setRegData] = useState({ name: "", email: "", password: "", confirm: "" });
  const [regErr, setRegErr] = useState("");
  // Payment
  const [payMethod, setPayMethod] = useState("card");
  const [payData, setPayData] = useState({ card: "", expiry: "", cvv: "", name: "", upi: "" });
  const [payStep, setPayStep] = useState(1);

  const chatEndRef = useRef(null);

  useEffect(() => {
    if (chatOpen) chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [chatMessages, chatOpen]);

  const showToast = (msg) => {
    setToast(msg);
    setTimeout(() => setToast(null), 3000);
  };

  const handleLogin = () => {
    if (!loginData.email || !loginData.password) return setLoginErr("Sabhi fields bharen.");
    if (loginData.email === ADMIN_USER.email && loginData.password === ADMIN_USER.password) {
      setUser({ ...ADMIN_USER });
      setModal(null);
      setLoginErr("");
      showToast("✅ Admin ke roop mein login hua!");
    } else {
      // Check registered users (mock)
      setLoginErr("Email ya password galat hai.");
    }
  };

  const handleRegister = () => {
    if (!regData.name || !regData.email || !regData.password) return setRegErr("Sabhi fields bharen.");
    if (regData.password !== regData.confirm) return setRegErr("Passwords match nahi karte.");
    if (regData.password.length < 6) return setRegErr("Password kam se kam 6 characters ka hona chahiye.");
    setRegUsers(prev => [...prev, { id: Date.now(), name: regData.name, email: regData.email, joined: "Aaj", status: "active" }]);
    setRegErr("");
    showToast("✅ Registration successful! Ab login karein.");
    setModal("login");
  };

  const handlePayment = () => {
    if (payStep === 1) { setPayStep(2); return; }
    setModal(null);
    setPayStep(1);
    showToast("✅ Payment successful! Booking confirmed 🎉");
  };

  const sendChat = () => {
    if (!chatInput.trim()) return;
    const userMsg = chatInput;
    setChatInput("");
    setChatMessages(prev => [...prev, { type: "user", text: userMsg }]);
    setTimeout(() => {
      const r = BOT_RESPONSES[Math.floor(Math.random() * BOT_RESPONSES.length)];
      setChatMessages(prev => [...prev, { type: "bot", text: r }]);
    }, 800);
  };

  const filteredPhotos = galleryFilter === "all" ? SAMPLE_PHOTOS : SAMPLE_PHOTOS.filter(p => p.category === galleryFilter);

  const renderPage = () => {
    if (page === "privacy") return renderPrivacy();
    if (page === "admin" && user?.role === "admin") return renderAdmin();
    if (page === "admin") { showToast("⚠️ Sirf admin access kar sakta hai."); setPage("home"); }
    return renderMain();
  };

  const renderMain = () => (
    <div style={{ paddingTop: page === "home" ? 0 : 64 }}>
      {/* HERO */}
      <div className="hero">
        <div className="hero-content">
          <div className="hero-eyebrow">✦ Professional Photography ✦</div>
          <h1 className="hero-title">Moments ko <em>Immortal</em> banao</h1>
          <p className="hero-sub">Wedding se leke commercial shoots tak — har pal ko art mein badalne ka hunar rakhte hain hum.</p>
          <div className="hero-btns">
            <button className="btn-gold" onClick={() => setPage("gallery")}>Gallery Dekhein</button>
            <button className="btn-outline" onClick={() => { setSelectedPkg(PACKAGES[1]); setModal("payment"); }}>Book Now</button>
          </div>
        </div>
      </div>

      {/* GALLERY PREVIEW */}
      <div className="section">
        <div className="section-title">Featured Work</div>
        <div className="gold-line" />
        <div className="gallery-grid">
          {SAMPLE_PHOTOS.slice(0, 6).map(photo => (
            <div key={photo.id} className="photo-card" onClick={() => { setSelectedPhoto(photo); setModal("photo"); }}>
              <img src={photo.img} alt={photo.title} />
              <div className="photo-overlay">
                <button className="btn-gold" style={{ fontSize: "0.8rem", padding: "0.4rem 0.9rem" }}>View</button>
                <button className="btn-outline" style={{ fontSize: "0.8rem", padding: "0.4rem 0.9rem" }}
                  onClick={e => { e.stopPropagation(); setSelectedPhoto(photo); setModal("payment"); }}>Buy</button>
              </div>
              <div className="photo-info">
                <div className="photo-title">{photo.title}</div>
                <div className="photo-meta">
                  <span className="photo-price">₹{photo.price.toLocaleString()}</span>
                  <span className="photo-likes">❤️ {photo.likes}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
        <div style={{ textAlign: "center", marginTop: "2rem" }}>
          <button className="btn-outline" onClick={() => setPage("gallery")}>Poori Gallery Dekhein →</button>
        </div>
      </div>

      {/* PACKAGES */}
      <div style={{ background: "var(--dark2)", padding: "1px 0" }}>
        <div className="section">
          <div className="section-title">Photography Packages</div>
          <div className="gold-line" />
          <div className="packages-grid">
            {PACKAGES.map(pkg => (
              <div key={pkg.id} className="pkg-card">
                <div className="pkg-accent" style={{ background: pkg.color }} />
                <div className="pkg-name">{pkg.name}</div>
                <div className="pkg-price">₹{pkg.price.toLocaleString()} <span>/ session</span></div>
                <div className="pkg-desc">{pkg.desc}</div>
                <button className="btn-gold" style={{ width: "100%" }}
                  onClick={() => { setSelectedPkg(pkg); setModal("payment"); }}>
                  Book This Package
                </button>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ABOUT */}
      <div className="section">
        <div className="about-grid">
          <div className="about-img">
            <img src="https://images.unsplash.com/photo-1542038784456-1ea8e935640e?w=700&q=80" alt="Photographer" />
          </div>
          <div className="about-text">
            <div className="section-title">Hamare Baare Mein</div>
            <div className="gold-line" />
            <h3>Raj Photography Studio</h3>
            <p>Hum 10+ saalon se photography ki duniya mein hain. Humare liye har photo ek kahani hai — ek emotion, ek pal jo hamesha ke liye preserve ho jaata hai.</p>
            <p>Wedding, corporate events, fashion, aur travel — hum har genre mein expert hain. Humari team 5 professional photographers aur 3 editors se milkar bani hai.</p>
            <div style={{ display: "flex", gap: "2rem", marginBottom: "1.5rem" }}>
              {[["500+", "Clients"], ["1200+", "Events"], ["10+", "Awards"]].map(([n, l]) => (
                <div key={l}>
                  <div style={{ color: "var(--gold)", fontSize: "1.8rem", fontWeight: 700 }}>{n}</div>
                  <div style={{ color: "var(--muted)", fontSize: "0.8rem" }}>{l}</div>
                </div>
              ))}
            </div>
            <button className="btn-gold" onClick={() => { setSelectedPkg(PACKAGES[0]); setModal("payment"); }}>Aaj Hi Book Karein</button>
          </div>
        </div>
      </div>

      {/* FOOTER */}
      <footer className="footer">
        <div className="footer-logo">📸 Raj Photography</div>
        <div className="footer-links">
          {["Home", "Gallery", "Packages", "About", "Privacy Policy"].map(l => (
            <span key={l} className="footer-link" onClick={() => {
              if (l === "Gallery") setPage("gallery");
              else if (l === "Privacy Policy") setPage("privacy");
              else setPage("home");
            }}>{l}</span>
          ))}
        </div>
        <div className="footer-copy">© 2026 Raj Photography. Sab haqooq surakshit hain.</div>
      </footer>
    </div>
  );

  const renderGallery = () => (
    <div style={{ paddingTop: 64 }}>
      <div className="section">
        <div className="section-title">Photography Gallery</div>
        <div className="section-sub">Har pal ek masterpiece hai</div>
        <div className="gallery-filters">
          {["all", "landscape", "portrait", "street", "nature", "wedding"].map(cat => (
            <button key={cat} className={`filter-btn ${galleryFilter === cat ? "active" : ""}`}
              onClick={() => setGalleryFilter(cat)}>
              {cat.charAt(0).toUpperCase() + cat.slice(1)}
            </button>
          ))}
        </div>
        <div className="gallery-grid">
          {filteredPhotos.map(photo => (
            <div key={photo.id} className="photo-card" onClick={() => { setSelectedPhoto(photo); setModal("photo"); }}>
              <img src={photo.img} alt={photo.title} />
              <div className="photo-overlay">
                <button className="btn-gold" style={{ fontSize: "0.8rem", padding: "0.4rem 0.9rem" }}>View</button>
                <button className="btn-outline" style={{ fontSize: "0.8rem", padding: "0.4rem 0.9rem" }}
                  onClick={e => { e.stopPropagation(); setSelectedPhoto(photo); setModal("payment"); }}>Buy Print</button>
              </div>
              <div className="photo-info">
                <div className="photo-title">{photo.title}</div>
                <div className="photo-meta">
                  <span className="photo-price">₹{photo.price.toLocaleString()}</span>
                  <span className="photo-likes">❤️ {photo.likes}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );

  const renderAdmin = () => (
    <div className="admin-wrap">
      <div className="sidebar">
        {[
          ["📊", "dashboard", "Dashboard"],
          ["🖼️", "gallery", "Gallery"],
          ["👥", "users", "Users"],
          ["💰", "orders", "Orders"],
          ["⚙️", "settings", "Settings"],
        ].map(([icon, tab, label]) => (
          <div key={tab} className={`sidebar-item ${adminTab === tab ? "active" : ""}`} onClick={() => setAdminTab(tab)}>
            <span>{icon}</span> {label}
          </div>
        ))}
        <div style={{ marginTop: "auto", padding: "1rem 1.5rem" }}>
          <button className="btn-outline" style={{ width: "100%", fontSize: "0.82rem" }}
            onClick={() => { setUser(null); setPage("home"); showToast("Logged out!"); }}>
            Logout
          </button>
        </div>
      </div>
      <div className="admin-content">
        <div className="admin-title">
          {adminTab === "dashboard" && "Dashboard"}
          {adminTab === "gallery" && "Gallery Management"}
          {adminTab === "users" && "Registered Users"}
          {adminTab === "orders" && "Orders & Payments"}
          {adminTab === "settings" && "Settings"}
        </div>
        <div style={{ color: "var(--muted)", fontSize: "0.82rem", marginBottom: "1.5rem" }}>
          Welcome back, <span style={{ color: "var(--gold)" }}>{user?.name}</span> 👑
        </div>

        {adminTab === "dashboard" && (
          <>
            <div className="stats-grid">
              {[["₹1,24,500", "Total Revenue"], ["47", "Total Bookings"], [regUsers.length, "Registered Users"], ["9", "Photos Uploaded"]].map(([v, l]) => (
                <div key={l} className="stat-card">
                  <div className="stat-value">{v}</div>
                  <div className="stat-label">{l}</div>
                </div>
              ))}
            </div>
            <div className="section-title" style={{ fontSize: "1.2rem", marginBottom: "1rem" }}>Recent Orders</div>
            <div className="table-wrap">
              <table>
                <thead><tr><th>Client</th><th>Package</th><th>Amount</th><th>Status</th></tr></thead>
                <tbody>
                  {[["Priya S.", "Premium", "₹19,999", "confirmed"], ["Rahul V.", "Standard", "₹9,999", "pending"], ["Anita K.", "Basic", "₹4,999", "confirmed"]].map(([n, p, a, s]) => (
                    <tr key={n}><td>{n}</td><td>{p}</td><td style={{ color: "var(--gold)" }}>{a}</td>
                      <td><span className={`chip ${s === "confirmed" ? "chip-green" : "chip-gold"}`}>{s}</span></td></tr>
                  ))}
                </tbody>
              </table>
            </div>
          </>
        )}

        {adminTab === "users" && (
          <div className="table-wrap">
            <table>
              <thead><tr><th>#</th><th>Name</th><th>Email</th><th>Joined</th><th>Status</th></tr></thead>
              <tbody>
                {regUsers.map((u, i) => (
                  <tr key={u.id}>
                    <td style={{ color: "var(--muted)" }}>{i + 1}</td>
                    <td>{u.name}</td><td style={{ color: "var(--muted)" }}>{u.email}</td>
                    <td style={{ color: "var(--muted)" }}>{u.joined}</td>
                    <td><span className="chip chip-green">{u.status}</span></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {adminTab === "gallery" && (
          <>
            <div style={{ marginBottom: "1.5rem" }}>
              <button className="btn-gold" onClick={() => showToast("📸 Photo upload feature coming soon!")}>+ Add Photo</button>
            </div>
            <div className="gallery-grid">
              {SAMPLE_PHOTOS.map(p => (
                <div key={p.id} className="photo-card">
                  <img src={p.img} alt={p.title} style={{ height: 160 }} />
                  <div className="photo-info">
                    <div className="photo-title">{p.title}</div>
                    <div className="photo-meta">
                      <span className="photo-price">₹{p.price.toLocaleString()}</span>
                      <button style={{ background: "none", border: "none", color: "var(--red)", cursor: "pointer", fontSize: "0.8rem" }}
                        onClick={() => showToast("🗑️ Photo deleted (demo)")}>Delete</button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </>
        )}

        {adminTab === "orders" && (
          <div className="table-wrap">
            <table>
              <thead><tr><th>Order ID</th><th>Client</th><th>Item</th><th>Amount</th><th>Method</th><th>Status</th></tr></thead>
              <tbody>
                {[
                  ["#1001", "Priya S.", "Premium Package", "₹19,999", "UPI", "confirmed"],
                  ["#1002", "Rahul V.", "Golden Hour Print", "₹1,500", "Card", "completed"],
                  ["#1003", "Anita K.", "Standard Package", "₹9,999", "NetBanking", "pending"],
                ].map(([id, c, item, amt, method, s]) => (
                  <tr key={id}>
                    <td style={{ color: "var(--gold)" }}>{id}</td><td>{c}</td><td>{item}</td>
                    <td style={{ color: "var(--gold)" }}>{amt}</td><td style={{ color: "var(--muted)" }}>{method}</td>
                    <td><span className={`chip ${s === "confirmed" || s === "completed" ? "chip-green" : "chip-gold"}`}>{s}</span></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {adminTab === "settings" && (
          <div style={{ maxWidth: 500 }}>
            <div className="form-group">
              <label className="form-label">Studio Name</label>
              <input className="form-input" defaultValue="Raj Photography" />
            </div>
            <div className="form-group">
              <label className="form-label">Contact Email</label>
              <input className="form-input" defaultValue="admin@photo.com" />
            </div>
            <div className="form-group">
              <label className="form-label">Phone</label>
              <input className="form-input" defaultValue="+91 98765 43210" />
            </div>
            <button className="btn-gold" onClick={() => showToast("✅ Settings saved!")}>Save Changes</button>
          </div>
        )}
      </div>
    </div>
  );

  const renderPrivacy = () => (
    <div className="privacy-wrap">
      <div style={{ marginBottom: "0.5rem" }}>
        <span style={{ color: "var(--gold)", cursor: "pointer", fontSize: "0.85rem" }} onClick={() => setPage("home")}>← Home</span>
      </div>
      <h1>Privacy Policy</h1>
      <div className="gold-line" />
      <p style={{ color: "var(--muted)", fontSize: "0.82rem" }}>Last updated: June 2026</p>
      {[
        ["1. Hamari Information Collection", "Hum sirf wahi information collect karte hain jo aap khud dete hain — jaise naam, email, aur contact details booking ke time. Payment information secure payment gateway ke through process hoti hai, hum koi card detail store nahi karte."],
        ["2. Information Ka Upyog", "Aapki information ka upyog booking confirm karne, invoice bhejna, updates dena, aur customer support ke liye kiya jaata hai. Hum kabhi bhi aapka data third parties ko sell nahi karte."],
        ["3. Cookies", "Hamari website cookies ka upyog karke aapka experience behtar banati hai. Aap apne browser se cookies disable kar sakte hain, lekin kuch features kaam band ho sakte hain."],
        ["4. Data Security", "Aapka data SSL encryption se protect hota hai. Hum industry-standard security measures follow karte hain. Koi bhi data breach hone par hum turant aapko inform karenge."],
        ["5. Aapke Adhikaar (Rights)", "Aap kabhi bhi apna data dekhne, edit karne, ya delete karne ka request kar sakte hain. Iske liye admin@photo.com par email karein."],
        ["6. Contact Us", "Privacy se related koi bhi sawaal ke liye: Email: admin@photo.com | Phone: +91 98765 43210 | Address: Studio 4, Karol Bagh, New Delhi - 110005"],
      ].map(([h, p]) => (
        <div key={h}><h2>{h}</h2><p>{p}</p></div>
      ))}
    </div>
  );

  return (
    <>
      <style>{styles}</style>
      <div className="app">
        {/* NAV */}
        <nav className="nav">
          <div className="nav-logo" onClick={() => setPage("home")}>📸 Raj Photography</div>
          <div className="nav-links">
            <button className={`nav-btn ${page === "home" ? "active" : ""}`} onClick={() => setPage("home")}>Home</button>
            <button className={`nav-btn ${page === "gallery" ? "active" : ""}`} onClick={() => setPage("gallery")}>Gallery</button>
            <button className="nav-btn" onClick={() => document.querySelector(".packages-grid")?.scrollIntoView({ behavior: "smooth" }) || setPage("home")}>Packages</button>
            {user?.role === "admin" && (
              <button className={`nav-btn ${page === "admin" ? "active" : ""}`} onClick={() => setPage("admin")} style={{ color: "var(--gold)" }}>
                👑 Admin
              </button>
            )}
            {user ? (
              <button className="btn-outline" onClick={() => { setUser(null); showToast("Logged out!"); }}>Logout</button>
            ) : (
              <>
                <button className="btn-outline" onClick={() => setModal("login")}>Login</button>
                <button className="btn-gold" onClick={() => setModal("register")}>Register</button>
              </>
            )}
          </div>
        </nav>

        {/* PAGE CONTENT */}
        {page === "gallery" ? renderGallery() : renderPage()}

        {/* MODALS */}
        {modal === "login" && (
          <div className="modal-overlay" onClick={() => setModal(null)}>
            <div className="modal" onClick={e => e.stopPropagation()}>
              <button className="modal-close" onClick={() => setModal(null)}>×</button>
              <div className="modal-title">Welcome Back</div>
              <div className="modal-sub">Apne account mein login karein</div>
              <div className="form-group">
                <label className="form-label">Email</label>
                <input className="form-input" type="email" placeholder="aapka@email.com"
                  value={loginData.email} onChange={e => setLoginData(p => ({ ...p, email: e.target.value }))} />
              </div>
              <div className="form-group">
                <label className="form-label">Password</label>
                <input className="form-input" type="password" placeholder="••••••••"
                  value={loginData.password} onChange={e => setLoginData(p => ({ ...p, password: e.target.value }))}
                  onKeyDown={e => e.key === "Enter" && handleLogin()} />
              </div>
              {loginErr && <div className="error-msg">{loginErr}</div>}
              <button className="btn-gold" style={{ width: "100%", marginTop: "1rem", padding: "0.8rem" }} onClick={handleLogin}>Login</button>
              <div style={{ marginTop: "1rem", fontSize: "0.82rem", color: "var(--muted)", textAlign: "center" }}>
                Account nahi hai? <span className="form-link" onClick={() => setModal("register")}>Register karein</span>
              </div>
              <div style={{ marginTop: "0.7rem", fontSize: "0.75rem", color: "var(--muted)", textAlign: "center" }}>
                Admin: admin@photo.com / admin123
              </div>
            </div>
          </div>
        )}

        {modal === "register" && (
          <div className="modal-overlay" onClick={() => setModal(null)}>
            <div className="modal" onClick={e => e.stopPropagation()}>
              <button className="modal-close" onClick={() => setModal(null)}>×</button>
              <div className="modal-title">Create Account</div>
              <div className="modal-sub">Free mein register karein</div>
              {["name", "email", "password", "confirm"].map(field => (
                <div className="form-group" key={field}>
                  <label className="form-label">{field === "confirm" ? "Confirm Password" : field.charAt(0).toUpperCase() + field.slice(1)}</label>
                  <input className="form-input"
                    type={field.includes("password") || field === "confirm" ? "password" : field === "email" ? "email" : "text"}
                    placeholder={field === "name" ? "Aapka Naam" : field === "email" ? "email@example.com" : "••••••••"}
                    value={regData[field]} onChange={e => setRegData(p => ({ ...p, [field]: e.target.value }))} />
                </div>
              ))}
              {regErr && <div className="error-msg">{regErr}</div>}
              <div style={{ fontSize: "0.75rem", color: "var(--muted)", marginBottom: "1rem", lineHeight: 1.5 }}>
                Register karke aap hamare <span className="form-link" onClick={() => { setModal(null); setPage("privacy"); }}>Privacy Policy</span> se agree karte hain.
              </div>
              <button className="btn-gold" style={{ width: "100%", padding: "0.8rem" }} onClick={handleRegister}>Register</button>
              <div style={{ marginTop: "1rem", fontSize: "0.82rem", color: "var(--muted)", textAlign: "center" }}>
                Already account hai? <span className="form-link" onClick={() => setModal("login")}>Login karein</span>
              </div>
            </div>
          </div>
        )}

        {modal === "photo" && selectedPhoto && (
          <div className="modal-overlay" onClick={() => setModal(null)}>
            <div className="modal" style={{ maxWidth: 600, padding: 0, overflow: "hidden" }} onClick={e => e.stopPropagation()}>
              <img src={selectedPhoto.img} alt={selectedPhoto.title} style={{ width: "100%", height: 350, objectFit: "cover" }} />
              <div style={{ padding: "1.5rem" }}>
                <button className="modal-close" onClick={() => setModal(null)}>×</button>
                <div className="modal-title">{selectedPhoto.title}</div>
                <div style={{ color: "var(--muted)", fontSize: "0.85rem", marginBottom: "1rem", textTransform: "capitalize" }}>
                  Category: {selectedPhoto.category} &nbsp;|&nbsp; ❤️ {selectedPhoto.likes} likes
                </div>
                <div style={{ display: "flex", gap: "1rem", alignItems: "center" }}>
                  <div style={{ color: "var(--gold)", fontSize: "1.5rem", fontWeight: 700 }}>₹{selectedPhoto.price.toLocaleString()}</div>
                  <button className="btn-gold" onClick={() => setModal("payment")}>Buy Print</button>
                  <button className="btn-outline" onClick={() => { showToast("❤️ Liked!"); setModal(null); }}>Like</button>
                </div>
              </div>
            </div>
          </div>
        )}

        {modal === "payment" && (
          <div className="modal-overlay" onClick={() => setModal(null)}>
            <div className="modal" onClick={e => e.stopPropagation()}>
              <button className="modal-close" onClick={() => setModal(null)}>×</button>
              {payStep === 1 ? (
                <>
                  <div className="modal-title">Payment Gateway</div>
                  <div className="modal-sub">
                    {selectedPkg ? `${selectedPkg.name} Package — ₹${selectedPkg.price.toLocaleString()}` : selectedPhoto ? `${selectedPhoto.title} Print — ₹${selectedPhoto.price?.toLocaleString()}` : "Booking Payment"}
                  </div>
                  <div style={{ color: "var(--muted)", fontSize: "0.8rem", marginBottom: "1rem", textTransform: "uppercase", letterSpacing: "0.08em" }}>Payment Method Chunein</div>
                  <div className="payment-methods">
                    {[["💳", "card", "Card"], ["📱", "upi", "UPI"], ["🏦", "netbanking", "Net Banking"], ["💵", "cod", "Cash"]].map(([icon, id, label]) => (
                      <div key={id} className={`pay-method ${payMethod === id ? "selected" : ""}`} onClick={() => setPayMethod(id)}>
                        <span className="pay-icon">{icon}</span>
                        <div className="pay-label">{label}</div>
                      </div>
                    ))}
                  </div>

                  {payMethod === "card" && (
                    <>
                      <div className="form-group">
                        <label className="form-label">Cardholder Name</label>
                        <input className="form-input" placeholder="Name as on card"
                          value={payData.name} onChange={e => setPayData(p => ({ ...p, name: e.target.value }))} />
                      </div>
                      <div className="form-group">
                        <label className="form-label">Card Number</label>
                        <input className="form-input" placeholder="1234 5678 9012 3456" maxLength={19}
                          value={payData.card} onChange={e => setPayData(p => ({ ...p, card: e.target.value.replace(/\D/g, "").replace(/(.{4})/g, "$1 ").trim() }))} />
                      </div>
                      <div className="card-grid">
                        <div className="form-group">
                          <label className="form-label">Expiry</label>
                          <input className="form-input" placeholder="MM/YY" maxLength={5}
                            value={payData.expiry} onChange={e => setPayData(p => ({ ...p, expiry: e.target.value }))} />
                        </div>
                        <div className="form-group">
                          <label className="form-label">CVV</label>
                          <input className="form-input" placeholder="•••" maxLength={3} type="password"
                            value={payData.cvv} onChange={e => setPayData(p => ({ ...p, cvv: e.target.value }))} />
                        </div>
                      </div>
                    </>
                  )}

                  {payMethod === "upi" && (
                    <div className="form-group">
                      <label className="form-label">UPI ID</label>
                      <input className="form-input" placeholder="name@upi"
                        value={payData.upi} onChange={e => setPayData(p => ({ ...p, upi: e.target.value }))} />
                    </div>
                  )}

                  {payMethod === "netbanking" && (
                    <div className="form-group">
                      <label className="form-label">Bank Chunein</label>
                      <select className="form-input">
                        {["SBI", "HDFC", "ICICI", "Axis", "Kotak", "Punjab National Bank"].map(b => <option key={b}>{b}</option>)}
                      </select>
                    </div>
                  )}

                  {payMethod === "cod" && (
                    <div style={{ background: "rgba(201,168,76,0.08)", border: "1px solid rgba(201,168,76,0.2)", borderRadius: 8, padding: "1rem", fontSize: "0.85rem", color: "var(--muted)", marginBottom: "1rem" }}>
                      💵 Cash on Delivery available hai sirf local shoots ke liye (Delhi NCR).
                    </div>
                  )}

                  <button className="btn-gold" style={{ width: "100%", padding: "0.85rem", marginTop: "0.5rem" }} onClick={handlePayment}>
                    {payMethod === "upi" ? "UPI Se Pay Karein" : "Confirm & Pay →"}
                  </button>
                  <div style={{ marginTop: "1rem", textAlign: "center", color: "var(--muted)", fontSize: "0.75rem" }}>
                    🔒 SSL encrypted | Powered by Razorpay (Demo)
                  </div>
                </>
              ) : (
                <div style={{ textAlign: "center", padding: "1rem" }}>
                  <div style={{ fontSize: "3rem", marginBottom: "1rem" }}>⏳</div>
                  <div className="modal-title" style={{ marginBottom: "0.5rem" }}>Processing...</div>
                  <div style={{ color: "var(--muted)", fontSize: "0.88rem", marginBottom: "2rem" }}>Aapka payment secure ho raha hai</div>
                  <button className="btn-gold" style={{ padding: "0.8rem 2rem" }} onClick={handlePayment}>✅ Confirm Payment</button>
                </div>
              )}
            </div>
          </div>
        )}

        {/* LIVE CHAT */}
        {chatOpen && (
          <div className="chat-window">
            <div className="chat-header">
              <div className="chat-avatar">RP</div>
              <div>
                <div className="chat-name">Raj Photography</div>
                <div className="chat-status">● Online</div>
              </div>
              <button onClick={() => setChatOpen(false)} style={{ marginLeft: "auto", background: "none", border: "none", color: "var(--muted)", cursor: "pointer", fontSize: "1.2rem" }}>×</button>
            </div>
            <div className="chat-messages">
              {chatMessages.map((m, i) => (
                <div key={i} className={`msg ${m.type}`}>
                  <div className="msg-bubble">{m.text}</div>
                </div>
              ))}
              <div ref={chatEndRef} />
            </div>
            <div className="chat-input-row">
              <input className="chat-inp" placeholder="Message likhein..." value={chatInput}
                onChange={e => setChatInput(e.target.value)} onKeyDown={e => e.key === "Enter" && sendChat()} />
              <button className="chat-send" onClick={sendChat}>➤</button>
            </div>
          </div>
        )}
        <button className="chat-bubble" onClick={() => setChatOpen(p => !p)} title="Live Chat">
          {chatOpen ? "✕" : "💬"}
        </button>

        {toast && <div className="toast">{toast}</div>}
      </div>
    </>
  );
}
