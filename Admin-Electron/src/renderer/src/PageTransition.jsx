// src/components/PageTransition.jsx
import React from 'react';
import { motion } from 'framer-motion';

const PageTransition = ({ children }) => {
  const transition = {
    duration: 0.5,
    ease: [0.43, 0.13, 0.23, 0.96],
  };

  const variants = {
    initial: { opacity: 0, x: -200 },
    animate: { opacity: 1, x: 0 },
    exit: { opacity: 0, x: 200 },
  };

  return (
    <motion.div
      initial="initial"
      animate="animate"
      exit="exit"
      variants={variants}
      transition={transition}
    >
      {children}
    </motion.div>
  );
};

export default PageTransition;
