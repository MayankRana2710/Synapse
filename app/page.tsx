"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useUser } from "@clerk/nextjs";
import { handleGetStartedRedirect } from "@/lib/get-started-action";

// ─── Icon components ───────────────────────────────────────────────────────────

const SynapseIcon = ({ size = 18, opacity = 0.8 }: { size?: number; opacity?: number }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none"
    stroke={`rgba(255,255,255,${opacity})`} strokeWidth="1.7" strokeLinecap="round">
    <circle cx="12" cy="12" r="3"/>
    <line x1="12" y1="2" x2="12" y2="9"/>
    <line x1="12" y1="15" x2="12" y2="22"/>
    <line x1="2" y1="12" x2="9" y2="12"/>
    <line x1="15" y1="12" x2="22" y2="12"/>
    <line x1="4.22" y1="4.22" x2="7.76" y2="7.76"/>
    <line x1="16.24" y1="16.24" x2="19.78" y2="19.78"/>
    <line x1="19.78" y1="4.22" x2="16.24" y2="7.76"/>
    <line x1="7.76" y1="16.24" x2="4.22" y2="19.78"/>
  </svg>
);

const MicIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none"
    stroke="rgba(255,255,255,0.65)" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round">
    <path d="M12 1a3 3 0 0 0-3 3v8a3 3 0 0 0 6 0V4a3 3 0 0 0-3-3z"/>
    <path d="M19 10v2a7 7 0 0 1-14 0v-2"/>
    <line x1="12" y1="19" x2="12" y2="23"/>
    <line x1="8" y1="23" x2="16" y2="23"/>
  </svg>
);

const HashIcon = ({ size = 14, o = 0.4 }: { size?: number; o?: number }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none"
    stroke={`rgba(255,255,255,${o})`} strokeWidth="2" strokeLinecap="round">
    <line x1="4" y1="9" x2="20" y2="9"/><line x1="4" y1="15" x2="20" y2="15"/>
    <line x1="10" y1="3" x2="8" y2="21"/><line x1="16" y1="3" x2="14" y2="21"/>
  </svg>
);

const ShieldIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none"
    stroke="rgba(255,255,255,0.55)" strokeWidth="1.5" strokeLinecap="round">
    <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/>
  </svg>
);

const ZapIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none"
    stroke="rgba(255,255,255,0.55)" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
    <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"/>
  </svg>
);

const VideoIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none"
    stroke="rgba(255,255,255,0.55)" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
    <polygon points="23 7 16 12 23 17 23 7"/>
    <rect x="1" y="5" width="15" height="14" rx="2" ry="2"/>
  </svg>
);

const UsersIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none"
    stroke="rgba(255,255,255,0.55)" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
    <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/>
    <circle cx="9" cy="7" r="4"/>
    <path d="M23 21v-2a4 4 0 0 0-3-3.87"/>
    <path d="M16 3.13a4 4 0 0 1 0 7.75"/>
  </svg>
);

const SearchIcon = () => (
  <svg width="13" height="13" viewBox="0 0 24 24" fill="none"
    stroke="rgba(255,255,255,0.3)" strokeWidth="2" strokeLinecap="round">
    <circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/>
  </svg>
);

const ChevronDown = () => (
  <svg width="13" height="13" viewBox="0 0 24 24" fill="none"
    stroke="rgba(255,255,255,0.3)" strokeWidth="2">
    <polyline points="6 9 12 15 18 9"/>
  </svg>
);

// ─── App UI mockup ─────────────────────────────────────────────────────────────

const CHANNELS = ["general", "announcements", "design", "engineering"];

const MESSAGES = [
  { user: "Alex K.", init: "A", time: "9:41 AM", color: "110,70,240", c2: "60,140,255",
    text: "Just pushed the new design system — the dark glass aesthetic looks stunning ✨" },
  { user: "Maya R.", init: "M", time: "9:43 AM", color: "60,140,255", c2: "110,70,240",
    text: "The spotlight hover effects on the card are so satisfying. Love the card-rim glow." },
  { user: "Luca D.", init: "L", time: "9:45 AM", color: "200,80,60", c2: "240,60,140",
    text: "End-to-end encrypted and it looks this good? Ship it." },
];

function AppMockup() {
  return (
    <div style={{
      display: "flex", height: 400, borderRadius: 18, overflow: "hidden",
      border: "1px solid rgba(255,255,255,0.06)",
      background: "rgba(0,0,0,0.55)",
      boxShadow: "0 60px 120px rgba(0,0,0,0.95), 0 0 0 1px rgba(255,255,255,0.03) inset",
    }}>
      {/* Nav sidebar */}
      <div style={{
        width: 60, background: "rgba(0,0,0,0.5)",
        borderRight: "1px solid rgba(255,255,255,0.04)",
        display: "flex", flexDirection: "column", alignItems: "center",
        padding: "12px 0", gap: 8,
      }}>
        <div style={{
          width: 40, height: 40, borderRadius: 12,
          background: "rgba(255,255,255,0.09)",
          border: "1px solid rgba(255,255,255,0.1)",
          display: "flex", alignItems: "center", justifyContent: "center",
          position: "relative",
        }}>
          <div style={{
            position: "absolute", left: -6, top: "50%",
            transform: "translateY(-50%)", width: 3, height: 24,
            background: "rgba(255,255,255,0.6)", borderRadius: "0 2px 2px 0",
          }}/>
          <SynapseIcon size={16} opacity={0.85}/>
        </div>
        <div style={{ width: 24, height: 1, background: "rgba(255,255,255,0.06)", margin: "2px 0" }}/>
        {["D", "G", "P"].map((l, i) => (
          <div key={i} style={{
            width: 36, height: 36, borderRadius: "50%",
            background: "rgba(255,255,255,0.05)",
            border: "1px solid rgba(255,255,255,0.06)",
            display: "flex", alignItems: "center", justifyContent: "center",
            fontSize: 12, fontWeight: 600, color: "rgba(255,255,255,0.35)",
          }}>{l}</div>
        ))}
        <div style={{ marginTop: "auto" }}>
          <div style={{
            width: 30, height: 30, borderRadius: "50%",
            background: "linear-gradient(135deg, rgba(110,70,240,0.5), rgba(60,140,255,0.4))",
            border: "1px solid rgba(255,255,255,0.1)",
            display: "flex", alignItems: "center", justifyContent: "center",
            fontSize: 11, fontWeight: 600, color: "rgba(255,255,255,0.8)",
          }}>Y</div>
        </div>
      </div>

      {/* Server sidebar */}
      <div style={{
        width: 190, background: "rgba(0,0,0,0.3)",
        borderRight: "1px solid rgba(255,255,255,0.04)",
        display: "flex", flexDirection: "column",
      }}>
        <div style={{
          padding: "14px 14px 12px",
          borderBottom: "1px solid rgba(255,255,255,0.04)",
          display: "flex", alignItems: "center", justifyContent: "space-between",
        }}>
          <span style={{ fontSize: 13, fontWeight: 600, color: "rgba(255,255,255,0.85)" }}>Synapse HQ</span>
          <ChevronDown/>
        </div>
        <div style={{ padding: "6px 8px" }}>
          <div style={{
            padding: "6px 8px", borderRadius: 7, marginBottom: 4,
            background: "rgba(255,255,255,0.04)",
            border: "1px solid rgba(255,255,255,0.05)",
            display: "flex", alignItems: "center", gap: 6,
          }}>
            <SearchIcon/>
            <span style={{ fontSize: 11, color: "rgba(255,255,255,0.2)", fontWeight: 300 }}>Search</span>
            <kbd style={{
              marginLeft: "auto", fontSize: 8, color: "rgba(255,255,255,0.18)",
              background: "rgba(255,255,255,0.04)", padding: "1px 4px", borderRadius: 3,
              border: "1px solid rgba(255,255,255,0.05)",
            }}>⌘K</kbd>
          </div>
          <div style={{
            fontSize: 9, fontWeight: 600, color: "rgba(255,255,255,0.2)",
            letterSpacing: "0.8px", textTransform: "uppercase",
            padding: "8px 4px 4px",
          }}>Text Channels</div>
          {CHANNELS.map((ch, i) => (
            <div key={ch} style={{
              padding: "5px 8px", borderRadius: 7,
              display: "flex", alignItems: "center", gap: 6, marginBottom: 1,
              background: i === 0 ? "rgba(255,255,255,0.07)" : "transparent",
              color: i === 0 ? "rgba(255,255,255,0.8)" : "rgba(255,255,255,0.35)",
              fontSize: 12, fontWeight: i === 0 ? 500 : 400,
            }}>
              <HashIcon size={12} o={i === 0 ? 0.55 : 0.25}/>
              {ch}
            </div>
          ))}
        </div>
      </div>

      {/* Chat area */}
      <div style={{ flex: 1, display: "flex", flexDirection: "column", background: "rgba(0,0,0,0.12)", minWidth: 0 }}>
        <div style={{
          height: 46, padding: "0 16px",
          borderBottom: "1px solid rgba(255,255,255,0.04)",
          display: "flex", alignItems: "center", gap: 8,
        }}>
          <HashIcon size={15} o={0.4}/>
          <span style={{ fontSize: 13, fontWeight: 600, color: "rgba(255,255,255,0.8)" }}>general</span>
          <div style={{ marginLeft: "auto", display: "flex", alignItems: "center", gap: 6 }}>
            <div style={{ width: 6, height: 6, borderRadius: "50%", background: "rgba(60,200,120,0.9)" }}/>
            <span style={{ fontSize: 10, color: "rgba(255,255,255,0.25)" }}>Live</span>
          </div>
        </div>
        <div style={{ flex: 1, padding: "10px 6px", overflowY: "auto", display: "flex", flexDirection: "column", gap: 1 }}>
          {MESSAGES.map((m, i) => (
            <div key={i} style={{
              display: "flex", gap: 10, padding: "8px 12px", borderRadius: 8,
            }}>
              <div style={{
                width: 30, height: 30, borderRadius: "50%", flexShrink: 0,
                background: `linear-gradient(135deg, rgba(${m.color},0.55), rgba(${m.c2},0.35))`,
                border: "1px solid rgba(255,255,255,0.08)",
                display: "flex", alignItems: "center", justifyContent: "center",
                fontSize: 11, fontWeight: 600, color: "rgba(255,255,255,0.8)",
              }}>{m.init}</div>
              <div>
                <div style={{ display: "flex", alignItems: "baseline", gap: 8, marginBottom: 2 }}>
                  <span style={{ fontSize: 12, fontWeight: 500, color: "rgba(255,255,255,0.75)" }}>{m.user}</span>
                  <span style={{ fontSize: 9, color: "rgba(255,255,255,0.18)" }}>{m.time}</span>
                </div>
                <p style={{ fontSize: 12, color: "rgba(255,255,255,0.5)", lineHeight: 1.45, margin: 0, fontWeight: 300 }}>
                  {m.text}
                </p>
              </div>
            </div>
          ))}
        </div>
        <div style={{ padding: "8px 10px 10px" }}>
          <div style={{
            background: "rgba(255,255,255,0.04)",
            border: "1px solid rgba(255,255,255,0.07)",
            borderRadius: 9, padding: "9px 12px",
            display: "flex", alignItems: "center", gap: 8,
          }}>
            <span style={{ fontSize: 12, color: "rgba(255,255,255,0.14)", fontWeight: 300, flex: 1 }}>
              Message #general
            </span>
            <svg width="13" height="13" viewBox="0 0 24 24" fill="none"
              stroke="rgba(255,255,255,0.18)" strokeWidth="2" strokeLinecap="round">
              <circle cx="12" cy="12" r="10"/>
              <path d="M8 14s1.5 2 4 2 4-2 4-2"/>
              <line x1="9" y1="9" x2="9.01" y2="9"/>
              <line x1="15" y1="9" x2="15.01" y2="9"/>
            </svg>
          </div>
        </div>
      </div>
    </div>
  );
}

// ─── Main landing page ─────────────────────────────────────────────────────────

export default function SynapseHomePage() {
  const router = useRouter();
  const { user, isLoaded } = useUser();
  const [mouse, setMouse] = useState({ x: -1000, y: -1000 });
  const [ctaCM, setCtaCM] = useState({ x: 260, y: 0 });
  const [mounted, setMounted] = useState(false);
  const ctaRef = useRef<HTMLDivElement>(null);

  // Form State
  const [name, setName] = useState("");
  const [workspaceName, setWorkspaceName] = useState("");

  useEffect(() => {
    // Load Outfit font
    const link = document.createElement("link");
    link.rel = "stylesheet";
    link.href =
      "https://fonts.googleapis.com/css2?family=Outfit:wght@300;400;500;600;700&display=swap";
    document.head.appendChild(link);
    setMounted(true);

    const onMove = (e: MouseEvent) => {
      setMouse({ x: e.clientX, y: e.clientY });
      if (ctaRef.current) {
        const r = ctaRef.current.getBoundingClientRect();
        setCtaCM({ x: e.clientX - r.left, y: e.clientY - r.top });
      }
    };
    window.addEventListener("mousemove", onMove as any);
    return () => window.removeEventListener("mousemove", onMove as any);
  }, []);

  const handleGetStarted = async () => {
    await handleGetStartedRedirect();
  };

  const handleCreateWorkspace = (e: React.FormEvent) => {
    e.preventDefault();
    // Redirects to sign-up to begin onboarding
    router.push('/sign-up');
  };

  const FEATURES = [
    { icon: <ShieldIcon />, title: "End-to-end encrypted", desc: "Every message, every file. Zero access, even for us. Security by design." },
    { icon: <ZapIcon />, title: "Sub-50ms delivery", desc: "Real-time across all your devices. No polling. No delays. Just instant." },
    { icon: <VideoIcon />, title: "Crystal-clear calls", desc: "HD video and spatial audio built in. No plugins. No downloads." },
    { icon: <UsersIcon />, title: "Community tools", desc: "Roles, permissions, threads. All in a UI that stays out of your way." },
  ];

  const cardLight = `radial-gradient(260px circle at ${ctaCM.x}px ${ctaCM.y}px, rgba(255,255,255,0.055), transparent 70%)`;
  const cardRim = `radial-gradient(180px circle at ${ctaCM.x}px ${ctaCM.y}px, rgba(255,255,255,0.18), transparent 70%)`;

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Outfit:wght@300;400;500;600;700&display=swap');
        *{box-sizing:border-box;margin:0;padding:0;}
        html,body{background:#000;overflow-x:hidden;}
        .synapse{font-family:'Outfit',-apple-system,sans-serif;background:#050505;min-height:100vh;position:relative;cursor:none;overflow-x:hidden;}
        .gradient-text{background:linear-gradient(160deg,rgba(255,255,255,0.95) 30%,rgba(255,255,255,0.42) 100%);-webkit-background-clip:text;background-clip:text;-webkit-text-fill-color:transparent;}
        @keyframes drift1{0%,100%{transform:translate(0,0)}40%{transform:translate(14px,-22px)}70%{transform:translate(-8px,10px)}}
        @keyframes drift2{0%,100%{transform:translate(0,0)}50%{transform:translate(-20px,-18px)}}
        @keyframes fadeUp{from{opacity:0;transform:translateY(24px)}to{opacity:1;transform:translateY(0)}}
        @keyframes cardIn{from{opacity:0;transform:translateY(28px) scale(0.96)}to{opacity:1;transform:translateY(0) scale(1)}}
        .fade-up{animation:fadeUp 0.8s cubic-bezier(0.16,1,0.3,1) forwards;opacity:0;}
        .d1{animation-delay:0.05s}.d2{animation-delay:0.15s}.d3{animation-delay:0.25s}.d4{animation-delay:0.35s}.d5{animation-delay:0.5s}
        .card-in{animation:cardIn 0.8s cubic-bezier(0.16,1,0.3,1) forwards;}
        .nav-link{font-size:13px;font-weight:400;color:rgba(255,255,255,0.4);text-decoration:none;transition:color 0.2s;cursor:none;}
        .nav-link:hover{color:rgba(255,255,255,0.8);}
        .btn-primary{display:inline-flex;align-items:center;justify-content:center;gap:8px;background:rgba(255,255,255,0.86);color:#000;border:none;border-radius:10px;font-family:inherit;font-size:14px;font-weight:500;padding:12.5px 28px;cursor:none;transition:all 0.3s cubic-bezier(0.16,1,0.3,1);position:relative;overflow:hidden;letter-spacing:0.05px;text-decoration:none;}
        .btn-primary:hover{background:#fff;box-shadow:0 6px 36px rgba(255,255,255,0.22),0 0 80px rgba(255,255,255,0.06);transform:translateY(-1px);}
        .btn-primary:active{transform:scale(0.99);}
        .btn-primary::after{content:'';position:absolute;inset:0;background:linear-gradient(100deg,transparent 35%,rgba(255,255,255,0.45) 50%,transparent 65%);transform:translateX(-120%);transition:none;}
        .btn-primary:hover::after{transform:translateX(120%);transition:transform 0.55s ease;}
        .btn-ghost{display:inline-flex;align-items:center;gap:8px;background:rgba(255,255,255,0.07);color:rgba(255,255,255,0.65);border:1px solid rgba(255,255,255,0.1);border-radius:10px;font-family:inherit;font-size:14px;font-weight:400;padding:12.5px 28px;cursor:none;transition:all 0.3s cubic-bezier(0.16,1,0.3,1);text-decoration:none;}
        .btn-ghost:hover{background:rgba(255,255,255,0.12);color:rgba(255,255,255,0.9);border-color:rgba(255,255,255,0.2);}
        .feature-card{background:rgba(255,255,255,0.028);border:1px solid rgba(255,255,255,0.07);border-radius:18px;padding:28px;transition:border-color 0.3s,background 0.3s;}
        .feature-card:hover{border-color:rgba(255,255,255,0.13);background:rgba(255,255,255,0.04);}
        ::-webkit-scrollbar{width:3px}::-webkit-scrollbar-track{background:transparent}::-webkit-scrollbar-thumb{background:rgba(255,255,255,0.07);border-radius:2px}
      `}</style>

      <div className="synapse">
        {/* ── Custom cursor ── */}
        {mounted && (
          <div style={{
            position: "fixed", width: 8, height: 8, borderRadius: "50%",
            background: "rgba(255,255,255,0.9)",
            left: mouse.x, top: mouse.y,
            transform: "translate(-50%,-50%)",
            zIndex: 9999, pointerEvents: "none",
            mixBlendMode: "difference",
          }}/>
        )}

        {/* ── Global spotlight ── */}
        {mounted && (
          <div style={{
            position: "fixed", width: 700, height: 700, borderRadius: "50%",
            left: mouse.x, top: mouse.y,
            transform: "translate(-50%,-50%)",
            background: "radial-gradient(circle at center, rgba(255,255,255,0.065) 0%, rgba(180,140,255,0.03) 30%, transparent 65%)",
            filter: "blur(1px)", zIndex: 1, pointerEvents: "none",
            transition: "left 0.07s ease-out, top 0.07s ease-out",
          }}/>
        )}

        {/* ── Film grain ── */}
        <div style={{
          position: "fixed", inset: 0, zIndex: 2, pointerEvents: "none", opacity: 0.04,
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E")`,
          backgroundSize: "180px 180px",
        }}/>

        {/* ── Ambient orbs ── */}
        <div style={{ position:"fixed", width:350, height:350, borderRadius:"50%", top:"5%", left:"5%", background:"radial-gradient(circle, rgba(110,70,240,0.09), transparent 70%)", filter:"blur(70px)", zIndex:0, pointerEvents:"none", animation:"drift1 11s ease-in-out infinite" }}/>
        <div style={{ position:"fixed", width:250, height:250, borderRadius:"50%", bottom:"10%", right:"10%", background:"radial-gradient(circle, rgba(255,255,255,0.04), transparent 70%)", filter:"blur(70px)", zIndex:0, pointerEvents:"none", animation:"drift2 14s ease-in-out infinite" }}/>
        <div style={{ position:"fixed", width:180, height:180, borderRadius:"50%", bottom:"25%", left:"8%", background:"radial-gradient(circle, rgba(60,140,255,0.07), transparent 70%)", filter:"blur(70px)", zIndex:0, pointerEvents:"none", animation:"drift1 18s ease-in-out infinite reverse" }}/>

        {/* ── Hairline rules ── */}
        <div style={{ position:"fixed", left:0, right:0, height:1, top:"28%", background:"linear-gradient(90deg, transparent, rgba(255,255,255,0.045) 20%, rgba(255,255,255,0.045) 80%, transparent)", zIndex:1, pointerEvents:"none" }}/>
        <div style={{ position:"fixed", left:0, right:0, height:1, bottom:"28%", background:"linear-gradient(90deg, transparent, rgba(255,255,255,0.045) 20%, rgba(255,255,255,0.045) 80%, transparent)", zIndex:1, pointerEvents:"none" }}/>

        {/* ── Main content ── */}
        <div style={{ position: "relative", zIndex: 10 }}>

          {/* Navbar */}
          <nav style={{
            display:"flex", alignItems:"center", justifyContent:"space-between",
            padding:"18px 48px",
            borderBottom:"1px solid rgba(255,255,255,0.04)",
          }}>
            <div style={{ display:"flex", alignItems:"center", gap:10 }}>
              <div style={{
                width:30, height:30, borderRadius:8,
                background:"rgba(255,255,255,0.07)",
                border:"1px solid rgba(255,255,255,0.09)",
                display:"flex", alignItems:"center", justifyContent:"center",
              }}>
                <SynapseIcon size={16} opacity={0.8}/>
              </div>
              <span style={{ fontSize:15, fontWeight:600, color:"rgba(255,255,255,0.85)", letterSpacing:"-0.3px" }}>
                Synapse
              </span>
            </div>

            <div style={{ display:"flex", gap:32 }}>
              {["Features","Download","Pricing","Community"].map(l => (
                <Link key={l} href="#" className="nav-link">{l}</Link>
              ))}
            </div>

            <div style={{ display:"flex", gap:10 }}>
              {isLoaded && user ? (
                <button 
                  onClick={handleGetStarted}
                  className="btn-primary" 
                  style={{ padding:"9px 20px", fontSize:13, cursor:"pointer" }}
                >
                  Get started
                </button>
              ) : (
                <>
                  <Link href="/sign-in" className="btn-ghost" style={{ padding:"9px 20px", fontSize:13 }}>Sign in</Link>
                  <Link href="/sign-up" className="btn-primary" style={{ padding:"9px 20px", fontSize:13 }}>Start for free</Link>
                </>
              )}
            </div>
          </nav>

          {/* Hero */}
          <section style={{ display:"flex", flexDirection:"column", alignItems:"center", padding:"88px 48px 64px", textAlign:"center" }}>
            {/* Beta pill */}
            <div className="fade-up d1" style={{
              display:"inline-flex", alignItems:"center", gap:8,
              background:"rgba(255,255,255,0.04)",
              border:"1px solid rgba(255,255,255,0.08)",
              borderRadius:100, padding:"6px 14px", marginBottom:28,
            }}>
              <div style={{ width:6, height:6, borderRadius:"50%", background:"rgba(60,200,120,0.85)" }}/>
              <span style={{ fontSize:12, color:"rgba(255,255,255,0.38)", fontWeight:400, letterSpacing:"0.3px" }}>
                Now in public beta · 12,000+ teams
              </span>
            </div>

            {/* H1 */}
            <h1 className="fade-up d2 gradient-text" style={{
              fontSize: "clamp(48px, 8vw, 80px)",
              fontWeight: 700,
              letterSpacing: "-2.5px",
              lineHeight: 1.07,
              marginBottom: 22,
              maxWidth: 720,
            }}>
              Talk to anyone,<br/>instantly.
            </h1>

            {/* Subtitle */}
            <p className="fade-up d3" style={{
              fontSize: 17, fontWeight: 300,
              color: "rgba(255,255,255,0.33)",
              maxWidth: 440, lineHeight: 1.65,
              marginBottom: 40, letterSpacing: "0.1px",
            }}>
              A next-generation communication platform built for teams who move fast and demand exceptional design.
            </p>

            {/* CTAs */}
            <div className="fade-up d4" style={{ display:"flex", gap:12, marginBottom:72 }}>
              {isLoaded && user ? (
                <button 
                  onClick={handleGetStarted}
                  className="btn-primary"
                >
                  Get started
                </button>
              ) : (
                <>
                  <Link href="/sign-up" className="btn-primary">Start free trial</Link>
                  <Link href="/sign-in" className="btn-ghost">Sign in →</Link>
                </>
              )}
            </div>

            {/* App mockup */}
            <div className="fade-up d5" style={{ width:"100%", maxWidth:880 }}>
              <AppMockup/>
            </div>
          </section>

          {/* Features */}
          <section style={{ padding:"88px 48px 72px" }}>
            <div style={{ textAlign:"center", marginBottom:52 }}>
              <p style={{
                fontSize:11, fontWeight:600, color:"rgba(255,255,255,0.2)",
                letterSpacing:"1.8px", textTransform:"uppercase", marginBottom:14,
              }}>Why Synapse</p>
              <h2 className="gradient-text" style={{ fontSize:"clamp(32px,5vw,46px)", fontWeight:700, letterSpacing:"-1.2px", lineHeight:1.1 }}>
                Built for the modern team
              </h2>
            </div>
            <div style={{
              display:"grid",
              gridTemplateColumns:"repeat(auto-fit, minmax(220px, 1fr))",
              gap:14, maxWidth:920, margin:"0 auto",
            }}>
              {FEATURES.map(({ icon, title, desc }) => (
                <div key={title} className="feature-card">
                  <div style={{
                    width:40, height:40, borderRadius:11,
                    background:"rgba(255,255,255,0.04)",
                    border:"1px solid rgba(255,255,255,0.07)",
                    display:"flex", alignItems:"center", justifyContent:"center",
                    marginBottom:18,
                  }}>{icon}</div>
                  <h3 style={{ fontSize:15, fontWeight:500, color:"rgba(255,255,255,0.82)", marginBottom:8, letterSpacing:"-0.2px" }}>
                    {title}
                  </h3>
                  <p style={{ fontSize:13, fontWeight:300, color:"rgba(255,255,255,0.3)", lineHeight:1.65 }}>
                    {desc}
                  </p>
                </div>
              ))}
            </div>
          </section>

          {/* Stats banner */}
          <section style={{ padding:"0 48px 88px" }}>
            <div style={{
              background:"rgba(255,255,255,0.022)",
              border:"1px solid rgba(255,255,255,0.06)",
              borderRadius:20, padding:"40px 48px",
              display:"flex", justifyContent:"space-around", flexWrap:"wrap", gap:32,
              maxWidth:920, margin:"0 auto",
            }}>
              {[
                { val:"12K+", label:"Active teams" },
                { val:"99.99%", label:"Uptime SLA" },
                { val:"<50ms", label:"Message delivery" },
                { val:"E2EE", label:"Encrypted by default" },
              ].map(({ val, label }) => (
                <div key={label} style={{ textAlign:"center" }}>
                  <div className="gradient-text" style={{ fontSize:34, fontWeight:700, letterSpacing:"-1px", lineHeight:1 }}>
                    {val}
                  </div>
                  <div style={{ fontSize:12, fontWeight:300, color:"rgba(255,255,255,0.25)", marginTop:6, letterSpacing:"0.3px" }}>
                    {label}
                  </div>
                </div>
              ))}
            </div>
          </section>

          {/* CTA card section */}
          <section style={{ padding:"0 48px 100px", display:"flex", justifyContent:"center" }}>
            {isLoaded && !user ? (
              // Show form only for unauthenticated users
              // Frosted glass CTA card
            <div
              ref={ctaRef}
              className="card-in"
              style={{
                width: 380,
                padding: "44px 34px 34px",
                borderRadius: 22,
                background: "rgba(255,255,255,0.028)",
                border: "1px solid rgba(255,255,255,0.07)",
                boxShadow: "0 0 0 1px rgba(255,255,255,0.035) inset, 0 50px 100px rgba(0,0,0,0.95), 0 20px 40px rgba(0,0,0,0.6)",
                overflow: "hidden",
                position: "relative",
              }}
            >
              {/* Card light */}
              <div style={{
                position:"absolute", inset:-1, borderRadius:22,
                background: cardLight,
                pointerEvents:"none", zIndex:0,
              }}/>
              {/* Card rim */}
              <div style={{
                position:"absolute", inset:0, borderRadius:22, padding:1,
                pointerEvents:"none", zIndex:0,
                background: cardRim,
                WebkitMask:"linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0)",
                WebkitMaskComposite:"destination-out",
                maskComposite:"exclude",
              }}/>

              {/* Content wrapped in a functional form */}
              <form onSubmit={handleCreateWorkspace} style={{ position:"relative", zIndex:2 }}>
                {/* Wordmark */}
                <div style={{ display:"flex", alignItems:"center", gap:9, marginBottom:30 }}>
                  <div style={{
                    width:32, height:32, borderRadius:9,
                    background:"rgba(255,255,255,0.07)",
                    border:"1px solid rgba(255,255,255,0.09)",
                    display:"grid", placeItems:"center",
                  }}><MicIcon/></div>
                  <span style={{ fontSize:12.5, fontWeight:500, color:"rgba(255,255,255,0.3)", letterSpacing:"0.4px" }}>
                    Synapse
                  </span>
                </div>

                {/* Heading */}
                <h2 className="gradient-text" style={{
                  fontSize:27, fontWeight:600, letterSpacing:"-0.9px",
                  lineHeight:1.18, marginBottom:26,
                }}>
                  Connect your team,<br/>for free.
                </h2>

                {/* Inputs */}
                <div style={{ marginBottom:9 }}>
                  <input
                    placeholder="Your name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    required
                    style={{
                      width:"100%", padding:"11.5px 14px",
                      background:"rgba(255,255,255,0.04)",
                      border:"1px solid rgba(255,255,255,0.075)",
                      borderRadius:10, fontFamily:"inherit", fontSize:14,
                      fontWeight:400, color:"rgba(255,255,255,0.85)",
                      outline:"none", WebkitAppearance:"none",
                      transition:"border-color 0.2s, background 0.2s",
                    }}
                    onFocus={e => {
                      e.target.style.borderColor = "rgba(255,255,255,0.2)";
                      e.target.style.background = "rgba(255,255,255,0.06)";
                      e.target.style.boxShadow = "0 0 0 3px rgba(255,255,255,0.035)";
                    }}
                    onBlur={e => {
                      e.target.style.borderColor = "rgba(255,255,255,0.075)";
                      e.target.style.background = "rgba(255,255,255,0.04)";
                      e.target.style.boxShadow = "none";
                    }}
                  />
                </div>
                <div style={{ marginBottom:16 }}>
                  <input
                    placeholder="Workspace name"
                    value={workspaceName}
                    onChange={(e) => setWorkspaceName(e.target.value)}
                    required
                    style={{
                      width:"100%", padding:"11.5px 14px",
                      background:"rgba(255,255,255,0.04)",
                      border:"1px solid rgba(255,255,255,0.075)",
                      borderRadius:10, fontFamily:"inherit", fontSize:14,
                      fontWeight:400, color:"rgba(255,255,255,0.85)",
                      outline:"none", WebkitAppearance:"none",
                      transition:"border-color 0.2s, background 0.2s",
                    }}
                    onFocus={e => {
                      e.target.style.borderColor = "rgba(255,255,255,0.2)";
                      e.target.style.background = "rgba(255,255,255,0.06)";
                      e.target.style.boxShadow = "0 0 0 3px rgba(255,255,255,0.035)";
                    }}
                    onBlur={e => {
                      e.target.style.borderColor = "rgba(255,255,255,0.075)";
                      e.target.style.background = "rgba(255,255,255,0.04)";
                      e.target.style.boxShadow = "none";
                    }}
                  />
                </div>

                <button type="submit" className="btn-primary" style={{ width:"100%" }}>
                  Get started free
                </button>

                {/* Footer row */}
                <div style={{ display:"flex", alignItems:"center", justifyContent:"center", gap:7, marginTop:16 }}>
                  <div style={{ width:3, height:3, borderRadius:"50%", background:"rgba(255,255,255,0.12)" }}/>
                  <span style={{ fontSize:11, fontWeight:300, color:"rgba(255,255,255,0.18)", letterSpacing:"0.2px" }}>
                    End-to-end encrypted · Press Enter
                  </span>
                  <div style={{ width:3, height:3, borderRadius:"50%", background:"rgba(255,255,255,0.12)" }}/>
                </div>
              </form>
            </div>
            ) : (
              // Show welcome message for authenticated users
              <div style={{
                width: 380,
                padding: "44px 34px 34px",
                borderRadius: 22,
                background: "rgba(255,255,255,0.028)",
                border: "1px solid rgba(255,255,255,0.07)",
                boxShadow: "0 0 0 1px rgba(255,255,255,0.035) inset, 0 50px 100px rgba(0,0,0,0.95), 0 20px 40px rgba(0,0,0,0.6)",
                textAlign: "center",
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                gap: 20,
              }}>
                <div style={{ display:"flex", alignItems:"center", gap:9 }}>
                  <div style={{
                    width:32, height:32, borderRadius:9,
                    background:"rgba(255,255,255,0.07)",
                    border:"1px solid rgba(255,255,255,0.09)",
                    display:"grid", placeItems:"center",
                  }}><MicIcon/></div>
                  <span style={{ fontSize:12.5, fontWeight:500, color:"rgba(255,255,255,0.3)", letterSpacing:"0.4px" }}>
                    Synapse
                  </span>
                </div>
                <h2 className="gradient-text" style={{
                  fontSize:27, fontWeight:600, letterSpacing:"-0.9px",
                  lineHeight:1.18,
                }}>
                  Welcome back!
                </h2>
                <p style={{ fontSize:14, fontWeight:300, color:"rgba(255,255,255,0.4)", margin:0 }}>
                  Ready to connect with your team?
                </p>
                <button 
                  onClick={handleGetStarted}
                  className="btn-primary" 
                  style={{ width:"100%" }}
                >
                  Get started
                </button>
              </div>
            )}
          </section>

          {/* Footer */}
          <footer style={{
            padding:"24px 48px",
            borderTop:"1px solid rgba(255,255,255,0.04)",
            display:"flex", alignItems:"center", justifyContent:"space-between",
          }}>
            <div style={{ display:"flex", alignItems:"center", gap:8 }}>
              <SynapseIcon size={14} opacity={0.25}/>
              <span style={{ fontSize:12, color:"rgba(255,255,255,0.18)", fontWeight:300 }}>
                © 2026 Synapse Inc.
              </span>
            </div>
            <div style={{ display:"flex", gap:24 }}>
              {["Privacy","Terms","Status","Twitter"].map(l => (
                <Link key={l} href="#" className="nav-link" style={{ fontSize:12 }}>{l}</Link>
              ))}
            </div>
          </footer>
        </div>
      </div>
    </>
  );
}