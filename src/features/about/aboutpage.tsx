export function AboutPage() {
  return (
    <div className="space-y-6">
      <header className="mb-10">
        <h1 className="text-4xl font-extrabold tracking-tight text-white mb-2">Acerca de</h1>
        <p className="text-zinc-400 text-lg">Información sobre el proyecto.</p>
      </header>

      <section className="bg-zinc-900/50 border border-zinc-800/80 rounded-2xl p-8 backdrop-blur-sm shadow-xl">
        <h2 className="text-2xl font-bold text-white mb-4">Nuestra Misión</h2>
        <p className="text-zinc-300 leading-relaxed mb-6">
          Esta es una página de demostración para mostrar el funcionamiento del componente <code>Sidebar</code> implementado
          como una Single Page Application (SPA). Al navegar entre las páginas, notarás que el sidebar se mantiene en su
          lugar y la página no se recarga completamente.
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-8">
          <div className="bg-zinc-800/40 p-6 rounded-xl border border-zinc-700/50 hover:border-blue-500/30 transition-colors">
            <h3 className="text-xl font-semibold text-blue-400 mb-2">Rápido</h3>
            <p className="text-zinc-400 text-sm">Navegación instantánea gracias a React Router.</p>
          </div>
          <div className="bg-zinc-800/40 p-6 rounded-xl border border-zinc-700/50 hover:border-emerald-500/30 transition-colors">
            <h3 className="text-xl font-semibold text-emerald-400 mb-2">Moderno</h3>
            <p className="text-zinc-400 text-sm">Estilos limpios y responsivos utilizando TailwindCSS.</p>
          </div>
        </div>
      </section>

      <section className="bg-zinc-900/50 border border-zinc-800/80 rounded-2xl p-8 backdrop-blur-sm shadow-xl">
        <h2 className="text-2xl font-bold text-white mb-4">Nuestra Ubicación</h2>
        <p className="text-zinc-300 leading-relaxed mb-6">
          Encuéntranos en nuestras oficinas centrales.
        </p>
        <div className="w-full h-80 rounded-xl overflow-hidden border border-zinc-800/80">
          <iframe
            src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d15603.953531393693!2d-77.03759905!3d-12.1129339!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x9105c8172c72b533%3A0xc665123565f410bd!2sMiraflores%2C%20Peru!5e0!3m2!1sen!2sus!4v1709241512415!5m2!1sen!2sus"
            width="100%"
            height="100%"
            style={{ border: 0 }}
            allowFullScreen={true}
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
            title="Google Maps Location"
          ></iframe>
        </div>
      </section>
    </div>
  );
}
