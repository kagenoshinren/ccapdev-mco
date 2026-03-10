import { ActionIcon, Group } from "@mantine/core";
import { IconChevronLeft, IconChevronRight } from "@tabler/icons-react";
import useEmblaCarousel from "embla-carousel-react";
import { type ReactNode, useCallback, useEffect, useState } from "react";

import styles from "./card-carousel.module.css";

interface CardCarouselProps {
  readonly children: ReactNode;
}

export function CardCarousel({ children }: CardCarouselProps) {
  const [emblaRef, emblaApi] = useEmblaCarousel({ loop: true, align: "start", dragFree: true });
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [scrollSnaps, setScrollSnaps] = useState<number[]>([]);

  const scrollPrev = useCallback(() => emblaApi?.scrollPrev(), [emblaApi]);
  const scrollNext = useCallback(() => emblaApi?.scrollNext(), [emblaApi]);

  useEffect(() => {
    if (!emblaApi) {
      return;
    }

    const onSelect = () => setSelectedIndex(emblaApi.selectedScrollSnap());
    setScrollSnaps(emblaApi.scrollSnapList());
    emblaApi.on("select", onSelect);
    onSelect();

    return () => {
      emblaApi.off("select", onSelect);
    };
  }, [emblaApi]);

  return (
    <div>
      <div className={styles.carousel} ref={emblaRef}>
        <div className={styles.carouselContainer}>{children}</div>
      </div>
      <Group justify="space-between" mt="md">
        <div className={styles.carouselDots}>
          {scrollSnaps.map((_, idx) => (
            <button
              key={idx}
              type="button"
              className={`${styles.carouselDot} ${idx === selectedIndex ? styles.carouselDotActive : ""}`}
              onClick={() => emblaApi?.scrollTo(idx)}
              aria-label={`Go to slide ${idx + 1}`}
            />
          ))}
        </div>
        <div className={styles.carouselControls}>
          <ActionIcon variant="light" color="pink" size="lg" radius="xl" onClick={scrollPrev} aria-label="Previous">
            <IconChevronLeft size={18} />
          </ActionIcon>
          <ActionIcon variant="light" color="pink" size="lg" radius="xl" onClick={scrollNext} aria-label="Next">
            <IconChevronRight size={18} />
          </ActionIcon>
        </div>
      </Group>
    </div>
  );
}

export function CarouselSlide({ children }: { readonly children: ReactNode }) {
  return <div className={styles.carouselSlide}>{children}</div>;
}
