import { useEffect, useState } from "react";

/** Teks yang mengetik & menghapus kata bergantian */
export default function Typewriter({ words, className = "" }) {
  const [wi, setWi] = useState(0);
  const [len, setLen] = useState(0);
  const [deleting, setDeleting] = useState(false);

  useEffect(() => {
    const word = words[wi];
    let delay = deleting ? 45 : 95;
    if (!deleting && len === word.length) delay = 1500;
    else if (deleting && len === 0) delay = 250;

    const t = setTimeout(() => {
      if (!deleting && len === word.length) setDeleting(true);
      else if (deleting && len === 0) {
        setDeleting(false);
        setWi((i) => (i + 1) % words.length);
      } else setLen((l) => l + (deleting ? -1 : 1));
    }, delay);
    return () => clearTimeout(t);
  }, [len, deleting, wi, words]);

  return (
    <span className={className}>
      {words[wi].slice(0, len)}
      <span className="animate-blink font-normal">|</span>
    </span>
  );
}
