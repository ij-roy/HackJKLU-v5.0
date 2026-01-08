import { motion } from 'framer-motion';
import { useRef } from 'react';

const modules = import.meta.glob('../../assets/gallery/*.{jpg,JPG,jpeg,png,webp}', { eager: true });
const galleryImages = Object.values(modules).map((mod: any) => mod.default);

const captions = [
    "LEGENDARY MOMENTS", "HEROES CODING", "THE ORACLE SPEAKS", "BUILDING OLYMPUS",
    "CODE OF THE GODS", "TITAN'S WORK", "MYTHIC CREATIONS", "VICTORY FEAST",
    "THE ODYSSEY BEGINS", "SPARTAN DISCIPLINE", "ATHENIAN WISDOM", "DELPHI'S VISION"
];

const photos = galleryImages.map((src, i) => {
    // Grid-based scattering for compact layout
    // 5 Columns to spread across the entire screen width
    const cols = 5;
    const col = i % cols;
    const row = Math.floor(i / cols);

    // Calculate base position with random jitter
    return {
        src,
        caption: captions[i % captions.length],
        rotation: Math.random() * 20 - 10,
        // Top: Distribute rows evenly
        top: `${(row * 10) + 2 + (Math.random() * 4 - 2)}%`,
        // Left: Distribute cols across 0-90% of screen
        left: `${(col * 19) + 1 + (Math.random() * 5 - 2.5)}%`,
        zIndex: Math.floor(Math.random() * 50) + 1
    };
});

export function PastPhotos() {
    const containerRef = useRef(null);

    return (
        <section className="min-h-screen bg-[#0c0a09] relative overflow-hidden flex flex-col items-center py-20 px-4 mythic-texture">
            {/* Title */}
            <div className="z-20 text-center mb-10 md:mb-20 relative pointer-events-none">
                <h2 className="text-4xl md:text-7xl font-[Uncial Antiqua] text-[#d4af37] tracking-wider drop-shadow-[0_4px_10px_rgba(212,175,55,0.3)]">
                    Past Memories
                </h2>
                <div className="h-1 w-48 bg-gradient-to-r from-transparent via-[#d4af37] to-transparent mx-auto mt-4"></div>
                <p className="font-[Cinzel] text-[#a89f91] mt-4 tracking-[0.2em] uppercase text-xs md:text-sm">
                    {galleryImages.length} Artifacts Discovered
                </p>
            </div>

            {/* Scattered Gallery Container - Full Width */}
            <div ref={containerRef} className="relative w-full h-[1000px] md:h-[1300px]">
                {photos.map((photo, i) => (
                    <motion.div
                        key={i}
                        drag
                        dragConstraints={containerRef}
                        whileHover={{ scale: 1.15, rotate: 0, zIndex: 1000 }}
                        whileDrag={{ scale: 1.1, zIndex: 1000 }}
                        initial={{ opacity: 0, scale: 0.5, y: 100 }}
                        whileInView={{ opacity: 1, scale: 1, y: 0 }}
                        viewport={{ once: true, margin: "-50px" }}
                        transition={{ duration: 0.6, delay: Math.min(i * 0.05, 1.0) }} // Cap delay so last photos don't take forever
                        className="absolute cursor-grab active:cursor-grabbing group touch-none"
                        style={{
                            top: photo.top,
                            left: photo.left,
                            rotate: photo.rotation,
                            zIndex: photo.zIndex
                        }}
                    >
                        {/* Photo Frame */}
                        <div className="bg-[#f0e6d2] p-2 pb-6 md:p-3 md:pb-10 shadow-[0_10px_30px_rgba(0,0,0,0.6)] transform transition-colors duration-300 border border-[#d4af37]/40 w-[22vw] md:w-[240px] lg:w-[280px]">
                            <div className="relative overflow-hidden aspect-[4/3] border border-black/10">
                                {/* Vintage Overlay */}
                                <div className="absolute inset-0 bg-gradient-to-tr from-[#3e2715]/20 to-transparent mix-blend-overlay z-10 pointer-events-none"></div>
                                <div className="absolute inset-0 bg-sepia/10 z-10 pointer-events-none"></div>

                                <img
                                    src={photo.src}
                                    alt={photo.caption}
                                    className="w-full h-full object-cover filter contrast-[1.05] sepia-[0.2] group-hover:sepia-0 group-hover:contrast-100 transition-all duration-500"
                                    draggable="false"
                                />
                            </div>

                            {/* Caption */}
                            <div className="absolute bottom-2 md:bottom-3 left-0 right-0 text-center">
                                <p className="font-[Cinzel] text-[#3e2715] text-[10px] md:text-xs font-bold tracking-[0.15em] opacity-70 group-hover:opacity-100 uppercase">
                                    {photo.caption}
                                </p>
                            </div>
                        </div>
                    </motion.div>
                ))}
            </div>
        </section>
    );
}
