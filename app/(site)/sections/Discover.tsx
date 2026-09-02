"use client";

import { motion } from "framer-motion";
import TheUnderground from "../discover/TheUnderground";
import WeeklyTop from "../discover/WeeklyTop";
import Playlists from "../discover/Playlists";

export default function Discover() {
  return (
    <section
      id="discover"
      className="
        relative
        inset-0
        bg-black/30
        py-24
        px-5
        md:px-8
        xl:px-12
      "
    >
      <div className="max-w-[1600px] mx-auto">

        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: .6 }}
        >

          <div
            className="
              grid
              grid-cols-1
              lg:grid-cols-12
              gap-6
              xl:gap-8
            "
          >

            {/* =======================================================
                            THE UNDERGROUND
            ======================================================= */}

          <TheUnderground />
            {/* =======================================================
                              WEEKLY TOP
            ======================================================= */}

            <WeeklyTop />

            {/* =======================================================
                                PLAYLISTS
            ======================================================= */}

            <Playlists />

          </div>

        </motion.div>

      </div>
    </section>
  );
}