"use client";

export default function InteractiveCourt({ onHover, activePart = null }) {
  const handleMouseMove = (e) => {
    const info = e.currentTarget.getAttribute("data-info");
    onHover?.({ visible: true, content: info, x: e.pageX, y: e.pageY });
  };
  const handleMouseLeave = () => onHover?.({ visible: false, content: "", x: 0, y: 0 });

  const isActive = (part) => {
    if (activePart === 'halfCourt') {
      return ['center', 'leftKey', 'rightKey'].includes(part);
    }
    return activePart && part === activePart;
  };
  const transitionCls = "transition-[fill-opacity,filter,transform] duration-300 motion-reduce:transition-none";

  const mkAreaProps = (part) => ({
    onMouseMove: handleMouseMove,
    onMouseLeave: handleMouseLeave,
    className: `cursor-pointer ${transitionCls}`,
    style: {
      fill: "#00AEEF",
      fillOpacity: isActive(part) ? 0.35 : 0.10,
      filter: isActive(part) ? "drop-shadow(0 0 14px rgba(0,174,239,0.45))" : "none",
    },
  });

  // --- Constantes para las dimensiones de la cancha (basado en 94x50 pies) ---
  const courtWidth = 940;
  const courtHeight = 500;
  const keyWidth = 160;
  const keyLength = 190;
  const keyY = (courtHeight - keyWidth) / 2; // 170
  const ftCircleRadius = 60;
  const ftCircleCenterY = courtHeight / 2; // 250

  // Coordenadas para la línea de 3 puntos
  const threePtIntersectX = 142;
  const threePtLineYTop = 30;
  const threePtLineYBottom = 470;
  const threePtRadius = 237.5;

  return (
    <div className="relative w-full max-w-3xl mx-auto">
      <svg className="w-full h-auto drop-shadow-2xl" viewBox={`0 0 ${courtWidth} ${courtHeight}`} xmlns="http://www.w3.org/2000/svg">
        {/* Fondo de la cancha */}
        <rect width={courtWidth} height={courtHeight} rx="16" ry="16" fill="#CBE9F7" />

        {/* Líneas de la cancha (solo bordes, sin relleno) */}
        <g stroke="#FFFFFF" strokeWidth="4" fill="none">
          {/* Bordes y línea central */}
          <rect x="2" y="2" width={courtWidth - 4} height={courtHeight - 4} rx="16" ry="16" />
          <line x1={courtWidth / 2} y1="0" x2={courtWidth / 2} y2={courtHeight} />
          <circle cx={courtWidth / 2} cy={ftCircleCenterY} r={ftCircleRadius} />

          {/* --- Lado Izquierdo --- */}
          {/* Rectángulo de la pintura */}
          <rect x="0" y={keyY} width={keyLength} height={keyWidth} />
          {/* Semicírculo de tiro libre */}
          <path d={`M ${keyLength} ${ftCircleCenterY - ftCircleRadius} A ${ftCircleRadius} ${ftCircleRadius} 0 0 1 ${keyLength} ${ftCircleCenterY + ftCircleRadius}`} />
          {/* Línea de 3 puntos */}
          <path d={`M 0 ${threePtLineYTop} L ${threePtIntersectX} ${threePtLineYTop} A ${threePtRadius} ${threePtRadius} 0 0 1 ${threePtIntersectX} ${threePtLineYBottom} L 0 ${threePtLineYBottom}`} />

          {/* --- Lado Derecho (simétrico) --- */}
          {/* Rectángulo de la pintura */}
          <rect x={courtWidth - keyLength} y={keyY} width={keyLength} height={keyWidth} />
          {/* Semicírculo de tiro libre */}
          <path d={`M ${courtWidth - keyLength} ${ftCircleCenterY - ftCircleRadius} A ${ftCircleRadius} ${ftCircleRadius} 0 0 0 ${courtWidth - keyLength} ${ftCircleCenterY + ftCircleRadius}`} />
          {/* Línea de 3 puntos */}
          <path d={`M ${courtWidth} ${threePtLineYTop} L ${courtWidth - threePtIntersectX} ${threePtLineYTop} A ${threePtRadius} ${threePtRadius} 0 0 0 ${courtWidth - threePtIntersectX} ${threePtLineYBottom} L ${courtWidth} ${threePtLineYBottom}`} />
        </g>

        {/* --- Secciones interactivas (con relleno y opacidad) --- */}

        {/* Círculo central (encima de la media cancha) */}
        <path
          {...mkAreaProps("center")}
          data-info="Fundado en 1945. ¡Corazón celeste y blanco!"
          d={`M${courtWidth / 2} ${ftCircleCenterY} m -${ftCircleRadius} 0 a ${ftCircleRadius} ${ftCircleRadius} 0 1 0 ${ftCircleRadius * 2} 0 a ${ftCircleRadius} ${ftCircleRadius} 0 1 0 -${ftCircleRadius * 2} 0`}
        />

        {/* Pintura izquierda (se dibuja al final para que esté por encima del área de triple) */}
        <rect
          {...mkAreaProps("leftKey")}
          data-info="La pintura: zona de gigantes y batallas."
          x="0"
          y={keyY}
          width={keyLength}
          height={keyWidth}
        />

        {/* Pintura derecha */}
        <rect
          {...mkAreaProps("rightKey")}
          data-info="Aquí se definen los partidos."
          x={courtWidth - keyLength}
          y={keyY}
          width={keyLength}
          height={keyWidth}
        />
      </svg>
    </div>
  );
}
