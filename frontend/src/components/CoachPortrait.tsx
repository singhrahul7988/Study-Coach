import Image from "next/image";

export function CoachPortrait() {
  return (
    <span className="journey-message-avatar coach-portrait">
      <Image
        src="/brand/ranjan-sir-portrait.png"
        width={1277}
        height={1231}
        alt=""
        className="coach-portrait-image"
      />
    </span>
  );
}
