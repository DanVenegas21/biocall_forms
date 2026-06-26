/**
 * Pie de pagina con aviso de manejo de datos personales y disclaimer de IA.
 */
export function AppFooter() {
  const year = new Date().getFullYear();

  return (
    <footer className="max-w-screen-2xl mx-auto px-4 sm:px-6 pb-8 pt-4">
      <div className="space-y-1 border-t border-brand-100/70 pt-4 text-[11px] text-brand-400/90">
        <p>
          La informacion capturada contiene datos personales y se trata de forma
          confidencial conforme a las politicas de la oficina.
        </p>
        <p>
          Los contenidos generados por IA pueden contener errores. Revise siempre
          la informacion con supervision humana.
        </p>
        <p>&copy; {year} Manuel Solis. Bio Call.</p>
      </div>
    </footer>
  );
}
