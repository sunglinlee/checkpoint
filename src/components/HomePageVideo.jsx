import React from "react";

const HomePageVideo = () => {
  const ref = React.useRef(null);
  const [play, setPlay] = React.useState(false);

  React.useEffect(() => {
    const observer = new window.IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setPlay(true);
        }
      },
      { threshold: 0.5 }
    );
    if (ref.current) {
      observer.observe(ref.current);
    }
    return () => {
      if (ref.current) observer.unobserve(ref.current);
    };
  }, []);

  const playlistId = "PLXTpd8LzMojaghltIZItNP46qGecx15au";
  const src = `https://www.youtube.com/embed/videoseries?list=${playlistId}&autoplay=1&mute=1`;

  return (
    <section ref={ref} className="py-8 md:py-16 lg:py-24 bg-white">
      <div className="container mx-auto px-4 md:px-6 text-center">
        <h2 className="text-xl md:text-2xl lg:text-3xl font-bold section-title mb-4 md:mb-6">推薦影片</h2>
        <div className="flex justify-center">
          <div className="w-full max-w-xs sm:max-w-md md:max-w-lg lg:max-w-2xl aspect-video rounded-lg overflow-hidden shadow-lg border">
            {play ? (
              <iframe
                width="100%"
                height="100%"
                src={src}
                title="YouTube video playlist"
                frameBorder="0"
                allow="autoplay; encrypted-media"
                allowFullScreen
                className="w-full h-full"
              ></iframe>
            ) : (
              <div className="w-full h-full bg-gray-200 flex items-center justify-center">
                <div className="text-gray-500 text-sm">載入影片中...</div>
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
};

export default HomePageVideo;
