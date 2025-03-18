import { useEffect, useState } from "react";
import useRateLimitStore from "../../store/useStore";

const RateLimitBanner = () => {
  const { remaining } = useRateLimitStore();
  const [timeLeft, setTimeLeft] = useState<number | null>(null);

  console.log("RateLimitBanner: remaining =", remaining);

  useEffect(() => {
    console.log("RateLimitBanner: useEffect - obliczam czas do resetu");
    const updateTimer = () => {
      const now = new Date();
      const nextHour = new Date(
        now.getFullYear(),
        now.getMonth(),
        now.getDate(),
        now.getHours() + 1,
        0,
        0,
        0
      );
      const diff = nextHour.getTime() - now.getTime();
      setTimeLeft(diff);
    };
    updateTimer();
    const interval = setInterval(updateTimer, 1000);
    return () => clearInterval(interval);
  }, []);

  if (remaining === null || remaining > 0) {
    console.log(
      "RateLimitBanner: Banner nie wyświetlany, remaining =",
      remaining
    );
    return null;
  }

  const formatTimeLeft = (time: number) => {
    const minutes = Math.floor(time / 60000);
    const seconds = Math.ceil((time % 60000) / 1000);
    return `${minutes > 0 ? `${minutes}m ` : ""}${seconds}s`;
  };

  console.log("RateLimitBanner: Banner wyświetlany, remaining =", remaining);

  return (
    <div className="fixed top-0 left-0 right-0 bg-red-600 text-white text-center p-2 z-[9999]">
      <p>
        Limit requestów wyczerpany. Spróbuj ponownie za{" "}
        {timeLeft !== null ? formatTimeLeft(timeLeft) : "..."}.
      </p>
    </div>
  );
};

export default RateLimitBanner;
