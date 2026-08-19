import React from "react";
import { Link } from "wouter";

export default function NotFound() {
  return (
    <div className="flex flex-col items-center justify-center min-h-[100dvh] bg-[#06090e] text-secondary font-mono p-4">
      <div className="terminal-panel p-8 max-w-md w-full border border-primary/50 text-center">
        <h1 className="text-4xl font-bold text-primary mb-4 font-display">ERR 404</h1>
        <div className="w-full h-px bg-primary/30 mb-6" />
        <p className="text-sm text-secondary/80 mb-8 uppercase tracking-widest">
          The requested system node could not be located on the network.
        </p>
        <Link 
          href="/" 
          className="inline-flex items-center justify-center px-4 py-2 bg-secondary/10 border border-secondary text-secondary hover:bg-secondary hover:text-black transition-colors uppercase text-xs tracking-wider"
        >
          Return to Command Centre
        </Link>
      </div>
    </div>
  );
}
