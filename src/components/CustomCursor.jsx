import { useEffect, useState } from "react";
import { motion, useMotionValue, useSpring } from "framer-motion";

export default function CustomCursor() {
  const [isHovering, setIsHovering] = useState(false);
  const [cursorText, setCursorText] = useState("");
  const [isVisible] = useState(() => typeof window !== 'undefined' && window.matchMedia("(pointer: fine)").matches);

  const cursorX = useMotionValue(-100);
  const cursorY = useMotionValue(-100);

  const springConfig = { damping: 25, stiffness: 700, mass: 0.1 };
  const cursorXSpring = useSpring(cursorX, springConfig);
  const cursorYSpring = useSpring(cursorY, springConfig);

  useEffect(() => {
    // Solo mostrar el cursor custom en dispositivos con mouse
    if (!window.matchMedia("(pointer: fine)").matches) return;

    const updateMousePosition = (e) => {
      cursorX.set(e.clientX);
      cursorY.set(e.clientY);
    };

    const handleMouseOver = (e) => {
      const interactiveEl = e.target.closest("a, button, .product-card, .interactive, [data-cursor]");
      
      if (interactiveEl) {
        setIsHovering(true);
        if (interactiveEl.hasAttribute("data-cursor")) {
          setCursorText(interactiveEl.getAttribute("data-cursor"));
        } else if (interactiveEl.classList.contains("product-card")) {
          setCursorText("VER");
        } else {
          setCursorText("");
        }
      } else {
        setIsHovering(false);
        setCursorText("");
      }
    };

    window.addEventListener("mousemove", updateMousePosition);
    window.addEventListener("mouseover", handleMouseOver);

    return () => {
      window.removeEventListener("mousemove", updateMousePosition);
      window.removeEventListener("mouseover", handleMouseOver);
    };
  }, [cursorX, cursorY]);

  if (!isVisible) return null;

  return (
    <>
      <motion.div
        style={{
          position: "fixed",
          top: 0,
          left: 0,
          width: 8,
          height: 8,
          borderRadius: "50%",
          backgroundColor: "var(--color-volt)",
          pointerEvents: "none",
          zIndex: 99999,
          mixBlendMode: "difference",
          x: cursorX,
          y: cursorY,
          translateX: "-50%",
          translateY: "-50%",
        }}
      />
      <motion.div
        style={{
          position: "fixed",
          top: 0,
          left: 0,
          width: 40,
          height: 40,
          borderRadius: "50%",
          border: "2px solid var(--color-volt)",
          backgroundColor: isHovering ? "var(--color-volt)" : "transparent",
          pointerEvents: "none",
          zIndex: 99998,
          mixBlendMode: "difference",
          x: cursorXSpring,
          y: cursorYSpring,
          translateX: "-50%",
          translateY: "-50%",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          fontFamily: "var(--font-display)",
          fontSize: "12px",
          fontWeight: 700,
          color: "#111",
          overflow: "hidden"
        }}
        animate={{
          scale: cursorText ? 2.5 : (isHovering ? 1.5 : 1),
          borderColor: isHovering ? "transparent" : "var(--color-volt)",
        }}
        transition={{ type: "tween", duration: 0.15 }}
      >
        <motion.span
          initial={{ opacity: 0 }}
          animate={{ opacity: cursorText ? 1 : 0 }}
          transition={{ duration: 0.15 }}
        >
          {cursorText}
        </motion.span>
      </motion.div>
    </>
  );
}
