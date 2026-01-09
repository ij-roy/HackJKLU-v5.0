import { motion, AnimatePresence, useScroll, useTransform } from 'framer-motion';
import { useState, useEffect, useMemo } from 'react';

// Load all gallery images
const modules = import.meta.glob('../../assets/gallery/*.{jpg,JPG,jpeg,png,webp}', { eager: true });
const galleryImages = Object.values(modules).map((mod: any) => mod.default);

// Mythic Captions
const captions = [
    "LEGENDARY MOMENTS", "HEROES CODING", "THE ORACLE SPEAKS", "BUILDING OLYMPUS",
    "CODE OF THE GODS", "TITAN'S WORK", "MYTHIC CREATIONS", "VICTORY FEAST",
    "THE ODYSSEY BEGINS", "SPARTAN DISCIPLINE", "ATHENIAN WISDOM", "DELPHI'S VISION"
];

interface GalleryImage {
    src: string;
    caption: string;
    id: number;
}

export function PastPhotos() {
    const [selectedImage, setSelectedImage] = useState<GalleryImage | null>(null);
    const [columns, setColumns] = useState(4);

    // Responsive Column Calculation
    useEffect(() => {
        const handleResize = () => {
            if (window.innerWidth < 640) setColumns(1);
            else if (window.innerWidth < 1024) setColumns(2);
            else if (window.innerWidth < 1400) setColumns(3);
            else setColumns(4);
        };
        handleResize();
        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, []);

    // Split images into columns for true Masonry layout
    const columnStreams = useMemo(() => {
        const streams = Array.from({ length: columns }, () => [] as GalleryImage[]);
        galleryImages.forEach((img, i) => {
            streams[i % columns].push({
                src: img as string,
                caption: captions[i % captions.length],
                id: i
            });
        });
        return streams;
    }, [columns]);

    // Background Parallax for "Floating Dust"
    const { scrollYProgress } = useScroll();
    const yBg = useTransform(scrollYProgress, [0, 1], [0, -100]);

    // Memoize particles to prevent hydration mismatch
    const particles = useMemo(() => Array.from({ length: 20 }).map((_, i) => ({
        id: i,
        top: Math.random() * 100,
        left: Math.random() * 100,
        size: Math.random() * 4 + 1,
        opacity: Math.random() * 0.5 + 0.2
    })), []);

    return (
        <section className="relative min-h-screen bg-neutral-950 overflow-hidden py-24 px-4 sm:px-8">
            {/* --- MYTHIC BACKGROUND --- */}
            <div className="absolute inset-0 z-0 pointer-events-none">
                <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/black-scales.png')] opacity-20 mix-blend-overlay"></div>
                <motion.div
                    style={{ y: yBg }}
                    className="absolute inset-0 opacity-30"
                >
                    {/* Floating Gold Particles */}
                    {particles.map((p) => (
                        <div
                            key={p.id}
                            className="absolute rounded-full bg-gold-500 blur-[1px]"
                            style={{
                                top: `${p.top}%`,
                                left: `${p.left}%`,
                                width: `${p.size}px`,
                                height: `${p.size}px`,
                                opacity: p.opacity,
                            }}
                        />
                    ))}
                </motion.div>
                {/* Vignette */}
                <div className="absolute inset-0 bg-gradient-to-b from-neutral-950 via-transparent to-neutral-950 z-10"></div>
            </div>

            {/* --- HEADER --- */}
            <div className="relative z-10 text-center mb-16 md:mb-24">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8 }}
                >
                    <h2 className="text-3xl sm:text-4xl md:text-6xl lg:text-7xl font-[Cinzel] text-transparent bg-clip-text bg-gradient-to-b from-amber-100 to-amber-700 drop-shadow-[0_5px_15px_rgba(212,175,55,0.2)] tracking-widest mb-4 px-2">
                        HALL OF MEMORIES
                    </h2>
                    <div className="flex items-center justify-center gap-4 mb-6">
                        <div className="h-[1px] w-12 sm:w-32 bg-gradient-to-r from-transparent to-amber-600"></div>
                        <span className="text-amber-500 font-[Cinzel] text-xl">✦</span>
                        <div className="h-[1px] w-12 sm:w-32 bg-gradient-to-l from-transparent to-amber-600"></div>
                    </div>
                    <p className="font-[Cinzel] text-amber-100/60 uppercase tracking-[0.3em] text-[10px] sm:text-xs md:text-sm">
                        32 Artifacts Discovered
                    </p>
                </motion.div>
            </div>

            {/* --- MASONRY GRID --- */}
            <div className="relative z-10 max-w-[1600px] mx-auto grid gap-4 sm:gap-6 md:gap-8"
                style={{ gridTemplateColumns: `repeat(${columns}, 1fr)` }}>

                {columnStreams.map((column, colIndex) => (
                    <div key={colIndex} className="flex flex-col gap-4 sm:gap-6 md:gap-8">
                        {column.map((item: any, i: number) => (
                            <GalleryItem
                                key={item.id}
                                item={item}
                                index={i}
                                colIndex={colIndex}
                                onClick={() => setSelectedImage(item)}
                            />
                        ))}
                    </div>
                ))}
            </div>

            {/* --- LIGHTBOX MODAL --- */}
            <AnimatePresence>
                {selectedImage && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={() => setSelectedImage(null)}
                        className="fixed inset-0 z-50 flex items-center justify-center bg-black/95 backdrop-blur-xl p-4 sm:p-8 cursor-pointer"
                    >
                        <motion.div
                            layoutId={`image-${selectedImage.src}`}
                            className="relative max-w-6xl w-full max-h-[90vh] flex flex-col items-center justify-center"
                            onClick={(e) => e.stopPropagation()}
                        >
                            <img
                                src={selectedImage.src}
                                alt={selectedImage.caption}
                                className="w-auto h-auto max-w-full max-h-[80vh] object-contain border-2 border-amber-600/30 shadow-[0_0_50px_rgba(212,175,55,0.1)] rounded-sm"
                            />

                            <motion.div
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: 0.2 }}
                                className="mt-6 text-center"
                            >
                                <h3 className="text-amber-100 font-[Cinzel] text-lg sm:text-2xl tracking-widest border-b border-amber-500/30 pb-2 inline-block px-8 drop-shadow-md">
                                    {selectedImage.caption}
                                </h3>
                            </motion.div>

                            {/* Close Button */}
                            <button
                                onClick={() => setSelectedImage(null)}
                                className="absolute top-4 right-4 md:-top-12 md:right-0 bg-black/50 md:bg-transparent rounded-full p-2 md:p-0 text-amber-500 hover:text-amber-200 transition-colors z-50"
                            >
                                <span className="font-[Cinzel] text-xl tracking-widest">✕</span>
                            </button>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>
        </section>
    );
}

// Individual Gallery Card Component
interface GalleryItemProps {
    item: { src: string; caption: string };
    index: number;
    colIndex: number;
    onClick: () => void;
}

function GalleryItem({ item, index, colIndex, onClick }: GalleryItemProps) {
    return (
        <motion.div
            layoutId={`container-${item.src}`}
            initial={{ opacity: 0, y: 50, filter: 'grayscale(100%)' }}
            whileInView={{ opacity: 1, y: 0, filter: 'grayscale(80%)' }}
            whileHover={{
                scale: 1.03,
                filter: 'grayscale(0%) contrast(1.1)',
                zIndex: 10,
                transition: { duration: 0.3 }
            }}
            viewport={{ once: true, margin: "50px" }}
            transition={{ duration: 0.8, delay: (colIndex * 0.2) + (index * 0.1) }}
            onClick={onClick}
            className="group relative cursor-pointer overflow-hidden rounded-sm border-[1px] border-amber-900/20 bg-neutral-900 shadow-lg transition-all duration-500 hover:shadow-[0_0_30px_rgba(212,175,55,0.15)] hover:border-amber-500/40"
        >
            {/* Image Container */}
            <div className="relative overflow-hidden">
                <motion.img
                    layoutId={`image-${item.src}`}
                    src={item.src}
                    alt={item.caption}
                    className="w-full h-auto transform transition-transform duration-700 group-hover:scale-110"
                    loading="lazy"
                />

                {/* Vintage Overlay - Fades out on hover */}
                <div className="absolute inset-0 bg-sepia/20 mix-blend-multiply group-hover:opacity-0 transition-opacity duration-500 pointer-events-none" />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-60 group-hover:opacity-40 transition-opacity duration-500" />
            </div>

            {/* Caption Overlay - Appears on hover */}
            <div className="absolute bottom-0 inset-x-0 p-4 translate-y-full group-hover:translate-y-0 transition-transform duration-500 ease-out bg-black/60 backdrop-blur-sm border-t border-amber-500/20">
                <p className="text-amber-100 font-[Cinzel] text-xs sm:text-sm text-center tracking-[0.2em]">
                    {item.caption}
                </p>
            </div>

            {/* Corner Accents */}
            <div className="absolute top-2 left-2 w-2 h-2 border-t border-l border-amber-600/0 group-hover:border-amber-600/60 transition-colors duration-500" />
            <div className="absolute top-2 right-2 w-2 h-2 border-t border-r border-amber-600/0 group-hover:border-amber-600/60 transition-colors duration-500" />
            <div className="absolute bottom-2 left-2 w-2 h-2 border-b border-l border-amber-600/0 group-hover:border-amber-600/60 transition-colors duration-500" />
            <div className="absolute bottom-2 right-2 w-2 h-2 border-b border-r border-amber-600/0 group-hover:border-amber-600/60 transition-colors duration-500" />
        </motion.div>
    );
}
