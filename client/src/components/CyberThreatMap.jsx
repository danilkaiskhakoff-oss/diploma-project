function CyberThreatMap() {
  return (
    <div className="fixed inset-0 z-0">
      <iframe
        src="https://cybermap.kaspersky.com/widget"
        className="w-full h-full border-0"
        title="Kaspersky Cyber Threat Map"
        allow="fullscreen"
      />
      {/* Overlay для затемнения карты */}
      <div className="absolute inset-0 bg-black/70" />
    </div>
  );
}

export default CyberThreatMap;
