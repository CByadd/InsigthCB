import React, { useEffect, useRef } from 'react';
import gsap from 'gsap';
import styles from './UD.module.css';

const UD = () => {
  const mainTextRef = useRef(null);
  const lineRefs = useRef([]);
  const line1Refs = useRef([]);

  useEffect(() => {
    const textElements = mainTextRef.current.querySelectorAll('h1, h2');

   
    textElements.forEach(element => {
      const chars = element.innerText.split('');
      element.innerHTML = chars.map(char => `<span class='char'>${char}</span>`).join('');
    });

    const chars = mainTextRef.current.querySelectorAll('.char');

    
    gsap.fromTo(chars,
        { opacity: 0 },
        { opacity: 1, duration: 1, stagger: 0.04, ease: 'power2.out' }
      );

  
    lineRefs.current.forEach(line => {
      gsap.fromTo(line, 
        { scaleX: 0,opacity:0 },
        { scaleX: 1, duration: 1.5, ease: 'power1.out', transformOrigin: "right center" ,opacity:1}
      );
    });

    line1Refs.current.forEach(line1 => {
      gsap.fromTo(line1, 
        { scaleX: 0 ,opacity:0},
        { scaleX: 1, duration: 1.5, ease: 'power1.out', transformOrigin: "left center" ,opacity:1}
      );
    });
  }, []);

  

  return (
    <div  className={styles.udwrapper}>
    <div className={styles.main_container}>
      
      <span className={styles.line_box}>
        <p className={styles.line} ref={(el) => (lineRefs.current[0] = el)}></p>
        <p className={styles.line1} ref={(el) => (line1Refs.current[0] = el)}></p>
      </span>
      <div className={styles.main_text} ref={mainTextRef}>
        <h1 className={styles.main_text_h1}>COMING SOON</h1>
        <h2 className={styles.main_text_h2}>UNDER-DEVELOPMENT</h2>
      </div>
      <span className={styles.line_box}>
        <p className={styles.line} ref={(el) => (lineRefs.current[1] = el)}></p>
        <p className={styles.line1} ref={(el) => (line1Refs.current[1] = el)}></p>
      </span>
    </div>
    </div>
  );
}

export default UD;
