import { lazy, Suspense } from "react";
import { Link, NavLink, Outlet } from "react-router-dom";
import { useCart } from "./context/CartContext";

const FloatingLines = lazy(() => import("./components/FloatingLines"));

function App() {
  const { items } = useCart();
  const itemCount = items.reduce((sum, item) => sum + item.quantity, 0);

  return (
    <div className="relative min-h-screen bg-slate-950 text-slate-100">
      {/* FLOATING LINES BACKGROUND - FULL SCREEN */}
      <div className="floating-lines-bg fixed inset-0 z-0 pointer-events-none opacity-15">
        <Suspense fallback={<div className="w-full h-full bg-slate-900" aria-hidden="true" />}> 
          <FloatingLines
            linesGradient={["#8b5cf6", "#ec4899", "#22d3ee"]}
            enabledWaves={["top", "middle", "bottom"]}
            lineCount={[8, 12, 10]}
            lineDistance={[6, 5, 7]}
            bendRadius={5.0}
            bendStrength={-0.5}
            interactive={false}
            parallax={true}
            animationSpeed={0.6}
            mixBlendMode="screen"
          />
        </Suspense>
      </div>

      {/* ALL CONTENT ON TOP OF BACKGROUND */}
      <div className="relative z-10">
        {/* Top bar */}
        <header className="border-b border-slate-800 bg-slate-950/60 backdrop-blur-md">
          <div className="mx-auto max-w-6xl px-4 py-3 sm:px-6 lg:px-8">
            <div className="grid grid-cols-3 items-center">
              {/* left (empty for spacing) */}
              <div />

              {/* centered title with glass effect */}
              <div className="flex justify-center">
                <Link to="/" className="glass px-4 py-2 rounded-xl text-center">
                  <h1 className="text-2xl font-bold neon-text">
                    Gear Store
                  </h1>
                  <span className="text-xs text-slate-300/80 block">
                    Gaming gear picked by Blurry Shady
                  </span>
                </Link>
              </div>

              {/* right: cart */}
              <div className="flex justify-end">
                <NavLink
                  to="/cart"
                  className="rounded-full border-2 border-slate-700 px-3 py-1 text-sm text-slate-100 transition hover:border-indigo-400 hover:bg-slate-900/60 neon-border"
                >
                  Cart ({itemCount})
                </NavLink>
              </div>
            </div>
          </div>
        </header>

        {/* Main content */}
        <main className="mx-auto max-w-6xl px-4 py-6 sm:px-6 lg:px-8">
          <Outlet />
        </main>
      </div>
    </div>
  );
}

export default App;