"use client";

import { motion } from "motion/react";
import { useReducedMotionPreference } from "./use-reduced-motion";
import styles from "./pattern-material-study.module.css";

export function PatternMaterialStudy() {
  const reduceMotion = useReducedMotionPreference();
  const duration = reduceMotion ? 0 : 0.8;

  return (
    <div
      className={styles.study}
      aria-hidden="true"
      data-testid="pattern-material-study"
      data-reduced-motion={reduceMotion ? "true" : "false"}
    >
      <motion.div
        className={`${styles.sheet} ${styles.sheetOne}`}
        initial={reduceMotion ? false : { opacity: 0, x: 48, y: -18, rotate: -2 }}
        animate={{ opacity: 1, x: 0, y: 0, rotate: -8 }}
        whileHover={reduceMotion ? undefined : { y: -10, rotate: -5 }}
        transition={{ duration, ease: [0.22, 1, 0.36, 1] }}
      >
        <span>01</span>
        <i />
      </motion.div>
      <motion.div
        className={`${styles.sheet} ${styles.sheetTwo}`}
        initial={reduceMotion ? false : { opacity: 0, x: -34, y: 34, rotate: 2 }}
        animate={{ opacity: 1, x: 0, y: 0, rotate: 7 }}
        whileHover={reduceMotion ? undefined : { y: -8, rotate: 4 }}
        transition={{ duration, delay: reduceMotion ? 0 : 0.1, ease: [0.22, 1, 0.36, 1] }}
      >
        <span>FU</span>
        <i />
      </motion.div>
      <motion.div
        className={styles.thread}
        initial={reduceMotion ? false : { opacity: 0, scale: 0.88, rotate: 20 }}
        animate={{ opacity: 1, scale: 1, rotate: 12 }}
        transition={{ duration: reduceMotion ? 0 : 1, delay: reduceMotion ? 0 : 0.18 }}
      />
      <div className={styles.legend}>
        <span>Pattern</span>
        <span>Cut</span>
        <span>Assembly</span>
      </div>
    </div>
  );
}
