import React from "react";

export interface PawWatermarkProps extends React.SVGProps<SVGSVGElement> {
  /** Rotação em graus da patinha */
  rotate?: number;
  /** Classe CSS adicional */
  className?: string;
}

/**
 * Componente decorativo de patinha suave (marca d'água / selo lúdico)
 * Baseado no desenho vetorial de 4 almofadas e coxim central do ConnectPet.
 */
export function PawWatermark({
  rotate = 0,
  className = "w-12 h-12 text-sky-300/60 dark:text-sky-700/30",
  style,
  ...props
}: PawWatermarkProps) {
  return (
    <svg
      viewBox="0 0 64 64"
      fill="currentColor"
      aria-hidden="true"
      style={{
        transform: rotate ? `rotate(${rotate}deg)` : undefined,
        ...style,
      }}
      className={`pointer-events-none select-none transition-all duration-300 ${className}`}
      {...props}
    >
      {/* 4 Dedinhos / Almofadas digitais */}
      <ellipse cx="18" cy="25" rx="4.5" ry="6.5" transform="rotate(-20 18 25)" />
      <ellipse cx="27" cy="18" rx="4.8" ry="7" transform="rotate(-7 27 18)" />
      <ellipse cx="37" cy="18" rx="4.8" ry="7" transform="rotate(7 37 18)" />
      <ellipse cx="46" cy="25" rx="4.5" ry="6.5" transform="rotate(20 46 25)" />

      {/* Almofada Central (Coxim) */}
      <path d="M32 33 C27.5 30 19 32.5 19 40.5 C19 47 24.5 51 32 51 C39.5 51 45 47 45 40.5 C45 32.5 36.5 30 32 33 Z" />
    </svg>
  );
}
