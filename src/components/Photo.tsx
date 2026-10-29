import { asset } from "@/lib/asset";

type Props = { src: string; alt: string; caption?: string; className?: string; ratio?: string; position?: string; eager?: boolean; credit?: boolean };

// Real ASEB event photography only. Captions credit ASEB Society.
export function Photo({ src, alt, caption, className = "", ratio = "aspect-[3/2]", position = "center", eager = false, credit = true }: Props) {
  return (
    <figure className={className}>
      <div className={`photo ${ratio}`}>
        <img src={asset(src)} alt={alt} loading={eager ? "eager" : "lazy"} decoding="async" style={{ objectPosition: position }} />
      </div>
      {caption && (
        <figcaption className="caption">
          {caption}
          {credit && <span className="text-stone/80"> · Photo: ASEB Society</span>}
        </figcaption>
      )}
    </figure>
  );
}
