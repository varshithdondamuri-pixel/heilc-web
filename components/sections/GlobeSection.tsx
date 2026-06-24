"use client";
import { useEffect, useRef, useState } from "react";
import { motion } from "framer-motion";
import createGlobe from "cobe";
import { usePersona } from "../features/PersonaContext";

const CITY_LABELS: Record<string, string> = {
  IN: "Chennai, India", US: "San Francisco, USA",
  GB: "London, UK", JP: "Tokyo, Japan",
  SG: "Singapore", AE: "Dubai, UAE",
  BR: "São Paulo, Brazil", NG: "Lagos, Nigeria",
};

export default function GlobeSection() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [loaded, setLoaded] = useState(false);
  const { detectionData } = usePersona();
  const country = detectionData?.country || "IN";
  const label = detectionData?.city 
    ? `${detectionData.city}, ${detectionData.country}`
    : CITY_LABELS[country] || "Chennai, India";
  const isStartup = ["IN","NG","BR","ID","PK"].includes(country);

  const userLat = detectionData?.latitude;
  const userLon = detectionData?.longitude;

  useEffect(() => {
    let phi = 0;
    if (!canvasRef.current) return;

    const canvas = canvasRef.current;
    let width = canvas.offsetWidth || 600;

    const onResize = () => {
      if (canvasRef.current) {
        width = canvasRef.current.offsetWidth;
      }
    };
    window.addEventListener("resize", onResize);
    onResize();

    canvas.width = width * 2;
    canvas.height = width * 2;

    let globe: any;

    const baseMarkers = [
      { location: [37.7595, -122.4367] as [number, number], size: 0.03 },
      { location: [40.7128, -74.006] as [number, number], size: 0.03 },
      { location: [13.0827, 80.2707] as [number, number], size: 0.1 },
      { location: [1.3521, 103.8198] as [number, number], size: 0.03 },
      { location: [51.5074, -0.1278] as [number, number], size: 0.03 },
      { location: [35.6762, 139.6503] as [number, number], size: 0.03 },
    ];

    if (userLat !== undefined && userLon !== undefined) {
      const isClose = baseMarkers.some(
        (m) =>
          Math.abs(m.location[0] - userLat) < 0.5 &&
          Math.abs(m.location[1] - userLon) < 0.5
      );
      if (!isClose) {
        baseMarkers.push({ location: [userLat, userLon], size: 0.1 });
      }
    }

    try {
      globe = createGlobe(canvas, {
        devicePixelRatio: 2,
        width: width * 2,
        height: width * 2,
        phi: 0,
        theta: 0,
        dark: 1,
        diffuse: 1.2,
        mapSamples: 16000,
        mapBrightness: 6,
        baseColor: [0.3, 0.3, 0.3],
        markerColor: [0.1, 0.8, 0.8],
        glowColor: [0.1, 0.8, 0.8],
        markers: baseMarkers,
        onRender: (state) => {
          state.phi = phi;
          phi += 0.005;
          state.width = width * 2;
          state.height = width * 2;
        },
      });

      setLoaded(true);
    } catch (e) {
      console.error("Globe failed to initialize:", e);
    }

    return () => {
      if (globe) {
        globe.destroy();
      }
      window.removeEventListener("resize", onResize);
      setLoaded(false);
    };
  }, [userLat, userLon]);

  return (
    <section className="py-32 bg-[#030303] relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">

          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            className="flex items-center justify-center"
          >
            <div style={{ width: "100%", maxWidth: 600, aspectRatio: "1 / 1" }}>
              <canvas
                ref={canvasRef}
                style={{
                  width: "100%",
                  height: "100%",
                  opacity: loaded ? 1 : 0,
                  transition: "opacity 1s ease",
                }}
              />
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 40 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
          >
            <p className="section-label mb-6">— GLOBAL INTELLIGENCE</p>
            <h2
              style={{
                fontFamily: "var(--font-bebas)",
                fontSize: "clamp(40px,6vw,72px)",
                lineHeight: 0.95,
              }}
              className="text-white mb-6"
            >
              INTELLIGENCE<br />
              <span className="text-gradient">WITHOUT BORDERS</span>
            </h2>
            <p className="text-white/50 text-sm leading-relaxed mb-8 max-w-sm">
              HEILC detects your location, region, and context in real time.
              No forms. No clicks. Pure AI intelligence.
            </p>
            <div className="glass-card rounded-2xl p-6 mb-6"
              style={{ border: "1px solid rgba(20,197,212,0.25)" }}>
              <div className="flex items-center gap-2 mb-4">
                <div className="w-2 h-2 rounded-full bg-teal animate-pulse" />
                <p className="text-teal text-xs tracking-widest font-bold uppercase">
                  LIVE DETECTION
                </p>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-white/30 text-xs mb-1">Location</p>
                  <p className="text-white font-semibold text-sm">{label}</p>
                </div>
                <div>
                  <p className="text-white/30 text-xs mb-1">Market Type</p>
                  <p className="text-teal font-semibold text-sm">
                    {isStartup ? "Startup Ecosystem" : "Enterprise Market"}
                  </p>
                </div>
                <div>
                  <p className="text-white/30 text-xs mb-1">Country Code</p>
                  <p className="text-white font-semibold text-sm">{country}</p>
                </div>
                <div>
                  <p className="text-white/30 text-xs mb-1">Adapted To</p>
                  <p className="text-white font-semibold text-sm">
                    {isStartup ? "Startup Mode" : "Enterprise Mode"}
                  </p>
                </div>
              </div>
            </div>
            <p className="text-white/30 text-xs tracking-widest uppercase mb-3">
              GLOBAL REACH
            </p>
            <div className="flex flex-wrap gap-2">
              {[
                { code: "IN", label: "India" },
                { code: "US", label: "USA" },
                { code: "GB", label: "UK" },
                { code: "SG", label: "Singapore" },
                { code: "AE", label: "UAE" },
                { code: "JP", label: "Japan" },
              ].map((c) => (
                <span key={c.code}
                  className={`px-3 py-1.5 rounded-full text-xs border transition-all ${
                    country === c.code
                      ? "border-teal text-teal bg-teal/10"
                      : "border-white/10 text-white/30"
                  }`}>
                  {c.label}
                </span>
              ))}
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
