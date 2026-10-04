import { useEffect, useRef, useState, type ReactNode } from "react";
import {
  books,
  checkout,
  orders,
  promoDeadline,
  socialProofIsDemo,
  testimonials,
  type CheckoutKey,
  type Order,
} from "./data";
import {
  analyticsConfigured,
  getAnalyticsConsent,
  setAnalyticsConsent,
  trackBeginCheckout,
} from "./analytics";

function BuyButton({
  checkoutKey,
  children,
  outline = false,
}: {
  checkoutKey: CheckoutKey;
  children: ReactNode;
  outline?: boolean;
}) {
  const buy = () => {
    const url = checkout[checkoutKey];
    if (url && /^https?:\/\//i.test(url)) {
      let navigated = false;
      const navigate = () => {
        if (navigated) return;
        navigated = true;
        window.location.assign(url);
      };
      if (trackBeginCheckout(checkoutKey, navigate)) window.setTimeout(navigate, 600);
    }
    else
      window.alert(
        "Link pembayaran belum dipasang. Isi konfigurasi VITE_CHECKOUT_*.",
      );
  };

  return (
    <button className={`btn${outline ? " o" : ""}`} type="button" onClick={buy}>
      {children}
    </button>
  );
}

function AnalyticsConsent() {
  const [choice, setChoice] = useState(() =>
    analyticsConfigured ? getAnalyticsConsent() : "denied",
  );
  const [open, setOpen] = useState(analyticsConfigured && choice === null);

  if (!analyticsConfigured) return null;

  const choose = (nextChoice: "granted" | "denied") => {
    setAnalyticsConsent(nextChoice);
    if (nextChoice === "denied" && choice === "granted") {
      window.location.reload();
      return;
    }
    setChoice(nextChoice);
    setOpen(false);
  };

  return (
    <>
      {open && (
        <aside className="consent-banner" aria-label="Pilihan privasi analitik">
          <div>
            <b>Privasi &amp; analitik</b>
            <p>
              Situs ini memakai Google Analytics untuk memahami penggunaan situs.
              Analitik hanya aktif setelah Anda menyetujuinya. Data iklan dan
              personalisasi tetap dinonaktifkan.
            </p>
            <a href="/kebijakan-privasi.html">Baca kebijakan privasi</a>
          </div>
          <div className="consent-actions">
            <button type="button" className="btn o" onClick={() => choose("denied")}>
              Tolak
            </button>
            <button type="button" className="btn" onClick={() => choose("granted")}>
              Izinkan analitik
            </button>
          </div>
        </aside>
      )}
      {!open && (
        <button className="privacy-settings" type="button" onClick={() => setOpen(true)}>
          Pengaturan privasi: {choice === "granted" ? "aktif" : "nonaktif"}
        </button>
      )}
    </>
  );
}

function scrollToSection(targetId: string, focusTarget = false) {
  const target = document.getElementById(targetId);
  if (!target) return;

  target.scrollIntoView({
    behavior: window.matchMedia("(prefers-reduced-motion: reduce)").matches
      ? "auto"
      : "smooth",
    block: "start",
  });

  if (focusTarget) {
    target.setAttribute("tabindex", "-1");
    target.focus({ preventScroll: true });
  }

  if (window.location.hash) {
    window.history.replaceState(null, "", `${window.location.pathname}${window.location.search}`);
  }
}

function SectionButton({
  targetId,
  children,
  className,
  focusTarget = false,
}: {
  targetId: string;
  children: ReactNode;
  className?: string;
  focusTarget?: boolean;
}) {
  return (
    <button
      className={className}
      type="button"
      aria-controls={targetId}
      onClick={() => scrollToSection(targetId, focusTarget)}
    >
      {children}
    </button>
  );
}

function Countdown() {
  const [remaining, setRemaining] = useState(0);

  useEffect(() => {
    if (!promoDeadline) return;
    const update = () =>
      setRemaining(
        Math.max(
          0,
          Math.floor((new Date(promoDeadline).getTime() - Date.now()) / 1000),
        ),
      );
    update();
    const timer = window.setInterval(update, 1000);
    return () => window.clearInterval(timer);
  }, []);

  if (!remaining) return null;
  const pad = (value: number) => String(value).padStart(2, "0");
  const time = `${pad(Math.floor(remaining / 3600))}:${pad(Math.floor((remaining % 3600) / 60))}:${pad(remaining % 60)}`;

  return (
    <div id="cd" role="status" style={{ display: "block" }}>
      Harga promo berakhir dalam <b>{time}</b> · normal Rp174.000, sekarang
      Rp109.000 untuk 6 e-book
    </div>
  );
}

function Toast() {
  const [order, setOrder] = useState<Order | null>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    if (!orders.length) return;
    let index = 0;
    let hideTimer = 0;
    const show = () => {
      setOrder(orders[index++ % orders.length]);
      setVisible(true);
      hideTimer = window.setTimeout(() => setVisible(false), 4500);
    };
    const firstTimer = window.setTimeout(show, 3000);
    const interval = window.setInterval(show, 9000);
    return () => {
      window.clearTimeout(firstTimer);
      window.clearTimeout(hideTimer);
      window.clearInterval(interval);
    };
  }, []);

  return (
    <div
      id="toast"
      className={visible ? "on" : ""}
      role="status"
      aria-live="polite"
    >
      {order &&
        `${socialProofIsDemo ? "[PEMBELI BARU] " : ""}${order.nama} dari ${order.kota} ${socialProofIsDemo ? "mensimulasikan pembelian" : "baru membeli"} ${order.item}${order.menit ? ` · ${order.menit} menit lalu` : ""}`}
    </div>
  );
}

function TestimonialCarousel() {
  const trackRef = useRef<HTMLDivElement>(null);
  const [paused, setPaused] = useState(false);

  const move = (direction: 1 | -1) => {
    const track = trackRef.current;
    if (!track) return;

    const card = track.querySelector<HTMLElement>(".testimonial-card");
    const gap =
      Number.parseFloat(window.getComputedStyle(track).columnGap) || 16;
    const step = (card?.offsetWidth ?? track.clientWidth) + gap;
    const reachedEnd =
      track.scrollLeft + track.clientWidth >= track.scrollWidth - step / 2;

    track.scrollTo({
      left:
        direction > 0 && reachedEnd
          ? 0
          : Math.max(0, track.scrollLeft + step * direction),
      behavior: "smooth",
    });
  };

  useEffect(() => {
    if (paused || window.matchMedia("(prefers-reduced-motion: reduce)").matches)
      return;
    const timer = window.setInterval(() => move(1), 4500);
    return () => window.clearInterval(timer);
  }, [paused]);

  return (
    <div
      className="testimonial-carousel"
      aria-roledescription="carousel"
      aria-label="Testimoni pembaca"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
      onFocusCapture={() => setPaused(true)}
      onBlurCapture={() => setPaused(false)}
    >
      <div className="testimonial-controls">
        <button
          type="button"
          onClick={() => move(-1)}
          aria-label="Testimoni sebelumnya"
        >
          ←
        </button>
        <button
          type="button"
          onClick={() => move(1)}
          aria-label="Testimoni berikutnya"
        >
          →
        </button>
      </div>
      <div className="tst" ref={trackRef} tabIndex={0}>
        {testimonials.map((item, index) => (
          <figure
            className="box testimonial-card"
            key={`${item.nama}-${index}`}
          >
            <blockquote>“{item.teks}”</blockquote>
            <figcaption>
              <b>
                {item.nama}
                {item.kota ? ` · ${item.kota}` : ""}
              </b>
            </figcaption>
          </figure>
        ))}
      </div>
    </div>
  );
}

export default function App() {
  useEffect(() => {
    const targetId = window.location.hash.slice(1);
    if (!targetId) return;

    window.history.replaceState(null, "", `${window.location.pathname}${window.location.search}`);
    window.requestAnimationFrame(() =>
      scrollToSection(targetId === "testimonial" ? "testi" : targetId),
    );
  }, []);

  return (
    <>
      <SectionButton className="skip-link" targetId="main" focusTarget>
        Langsung ke konten
      </SectionButton>
      <nav aria-label="Navigasi utama">
        <div className="w">
          <div className="logo">
            DWC<b>.BOOKS</b>
          </div>
          <span>
            <a href="https://dadikwahyuchang.id">Profil Dadik</a>
            <SectionButton className="btn" targetId="paket">
              Beli
            </SectionButton>
          </span>
        </div>
      </nav>
      <Countdown />

      <main id="main">
        <section>
          <div className="w hero">
            <div>
              <div className="eyebrow">
                E-Book Koleksi Pemikiran dan Praktik Baik
              </div>
              <h1>
                Belajar dari praktik,{" "}
                <span className="r">bukan sekadar teori.</span>
              </h1>
              <p className="m">
                Kumpulan pemikiran, metode, kegagalan, eksperimen, dan praktik
                baik <b>Dadik Wahyu Chang</b> yang kini dibagikan melalui buku.
              </p>
              <p>
                <span className="m">E-book mulai dari</span>
              </p>
              <div className="price">Rp29.000</div>
              <br />
              <SectionButton className="btn" targetId="paket">
                Ambil 6 Buku — Rp109.000
              </SectionButton>{" "}
              <SectionButton className="btn o" targetId="buku">
                Lihat Buku
              </SectionButton>
              <p className="m">
                Bayar → Download → Baca → Konsultasi dengan DWC.AI
              </p>
            </div>
            <div className="box">
              <div className="eyebrow">Termasuk akses</div>
              <h2>
                DWC.<span className="r">AI</span>
                <br />
                selama 1 bulan
              </h2>
              <p className="m">
                Tanya jawab strategi, diskusi, insight tambahan — melalui{" "}
                <a className="r" href="https://dadikwahyuchang.id/ai">
                  dadikwahyuchang.id/ai
                </a>
              </p>
            </div>
          </div>
        </section>

        <section>
          <div className="w proof">
            <div>
              <b>25+</b>
              <span>tahun praktik di desain, branding &amp; bisnis</span>
            </div>
            <div>
              <b>6</b>
              <span>e-book dari pengalaman nyata</span>
            </div>
            <div>
              <b>46</b>
              <span>tahapan bangun brand di W Method</span>
            </div>
            <div>
              <b>1 bulan</b>
              <span>akses konsultasi DWC.AI</span>
            </div>
          </div>
        </section>

        <section aria-labelledby="galeri-title">
          <div className="w">
            <div className="eyebrow" id="galeri-title">
              Galeri sampul
            </div>
            <div className="gal">
              {books.map((book) => (
                <img
                  key={book.key}
                  src={book.cover}
                  alt={`Sampul ${book.title}`}
                />
              ))}
            </div>
          </div>
        </section>

        <section id="siapa">
          <div className="w">
            <div className="eyebrow">Siapa Dadik Wahyu Chang?</div>
            <h2>25+ tahun belajar dari dunia nyata.</h2>
            <p>
              <b>Dadik Wahyu Chang</b> adalah Brand Developer &amp; Identity
              Strategist yang tumbuh melalui perjalanan panjang di dunia desain,
              branding, bisnis, industri kreatif, hingga city branding.
            </p>
            <p className="m">
              Sebagian buku lahir dari keberhasilan, sebagian dari kegagalan —
              dari proses jatuh, bangun, mencoba kembali, dan menemukan metode
              yang bisa dipraktikkan.
            </p>
            <p>
              <a className="btn o" href="https://dadikwahyuchang.id">
                Kenali Dadik Wahyu Chang di dadikwahyuchang.id →
              </a>
            </p>
            <blockquote>
              Apa yang pernah saya jalankan, saya dokumentasikan. Apa yang
              berhasil, saya metodologikan. Apa yang saya pelajari, saya
              bagikan.
            </blockquote>
          </div>
        </section>

        <section>
          <div className="w">
            <div className="eyebrow">Kenapa buku ini ada?</div>
            <h2>Praktik baik tidak boleh berhenti pada satu orang.</h2>
            <p className="m">
              Pengalaman lebih bernilai ketika bisa dipelajari dan dikembangkan
              orang lain. Karena itu perjalanan, metodologi, dan studi kasus
              didokumentasikan menjadi buku.
            </p>
            <p>
              <b>
                Bisnis → Kreativitas → Desain → Branding → City Branding →{" "}
                <span className="r">Monetisasi Kota</span>
              </b>
            </p>
          </div>
        </section>

        <section id="buku">
          <div className="w">
            <div className="eyebrow">Koleksi 6 E-Book</div>
            <h2>Apa saja bukunya?</h2>
            <div className="grid">
              {books.map((book) => (
                <article className="box book" key={book.key}>
                  <img
                    className="cimg"
                    src={book.cover}
                    alt={`Sampul ${book.title}`}
                  />
                  <div>
                    <h3>{book.title}</h3>
                    <p>{book.description}</p>
                    <BuyButton checkoutKey={book.key}>
                      Rp29.000 — Beli
                    </BuyButton>
                  </div>
                </article>
              ))}
            </div>
          </div>
        </section>

        {testimonials.length > 0 && (
          <section id="testi">
            <div className="w">
              <div className="eyebrow">Kata pembaca</div>
              <h2>Apa kata mereka?</h2>
              {/* {socialProofIsDemo && (
                <p className="demo-note" role="note">
                  <b>DATA DEMO</b> — Seluruh testimoni berikut merupakan konten
                  simulasi untuk pratinjau tampilan, bukan ulasan pelanggan
                  nyata.
                </p>
              )} */}
              <TestimonialCarousel />
            </div>
          </section>
        )}

        <section id="paket">
          <div className="w">
            <div className="eyebrow">Pilih cara belajarmu</div>
            <h2>Paket &amp; harga</h2>
            <div className="grid">
              <article className="box pk">
                <h3>Satu Buku</h3>
                <p className="m">Pilih 1 e-book</p>
                <div className="p">Rp29.000</div>
                <p aria-hidden="true">&nbsp;</p>
                <BuyButton checkoutKey="single" outline>
                  Pilih Buku
                </BuyButton>
              </article>
              <article className="box pk">
                <h3>Paket 4 Buku</h3>
                <p className="m">Pilih 4 e-book</p>
                <div className="p">Rp60.000</div>
                <p>
                  <b>Hemat Rp56.000</b>
                </p>
                <BuyButton checkoutKey="four">Pilih Paket</BuyButton>
              </article>
              <article className="box pk best">
                <span className="tag">BEST VALUE</span>
                <h3>Koleksi 6 Buku</h3>
                <p>Semua e-book + DWC.AI 1 bulan</p>
                <div className="p">Rp109.000</div>
                <p>
                  <s>Rp174.000</s> · <b>Hemat Rp65.000</b>
                </p>
                <BuyButton checkoutKey="six">Ambil 6 Buku</BuyButton>
              </article>
            </div>
          </div>
        </section>

        <section>
          <div className="w">
            <div className="eyebrow">Bonus yang membedakan</div>
            <h2>Bukan hanya membeli e-book.</h2>
            <div className="box">
              <h3>
                DWC.<span className="r">AI</span> — AI Agent Dadik Wahyu Chang
              </h3>
              <p>
                Akses <b>1 bulan</b> melalui{" "}
                <a className="r" href="https://dadikwahyuchang.id/ai">
                  dadikwahyuchang.id/ai
                </a>{" "}
                untuk tanya jawab strategi, diskusi
                branding-bisnis-desain-kreativitas, mengembangkan ide dari buku,
                dan menerapkan pemikiran buku pada kasus nyata.
              </p>
              <p className="m">
                Buku → Pengetahuan → DWC.AI · Baca → Tanya → Diskusi → Praktik
              </p>
            </div>
          </div>
        </section>

        <section>
          <div className="w">
            <div className="eyebrow">Mau mulai dari mana?</div>
            <h2>Pilih sesuai kebutuhanmu.</h2>
            <div className="need">
              <SectionButton targetId="buku">
                Sedang membangun kembali bisnis? → <b>Balik Jungkir</b>
              </SectionButton>
              <SectionButton targetId="buku">
                Membangun brand atau perusahaan? → <b>W Method</b>
              </SectionButton>
              <SectionButton targetId="buku">
                Bergerak di pendidikan atau desain? → <b>Doseen Desoon</b>
              </SectionButton>
              <SectionButton targetId="buku">
                Ingin melatih kreativitas berpikir? → <b>Berpikir Miring</b>
              </SectionButton>
              <SectionButton targetId="buku">
                Mengelola identitas kota atau daerah? → <b>City Branding</b>
              </SectionButton>
              <SectionButton targetId="buku">
                Ingin tahu kota menciptakan nilai ekonomi? →{" "}
                <b>The Monetized City</b>
              </SectionButton>
            </div>
          </div>
        </section>

        <section>
          <div className="w">
            <div className="eyebrow">Cara beli</div>
            <h2>Mudah. Cepat. Langsung baca.</h2>
            <div className="steps">
              <div>
                <b>Pilih</b>
                <br />
                <span className="m">Satu buku atau paket.</span>
              </div>
              <div>
                <b>Isi data</b>
                <br />
                <span className="m">Nama, WhatsApp, Email.</span>
              </div>
              <div>
                <b>Bayar</b>
                <br />
                <span className="m">Transfer / QRIS / E-Wallet.</span>
              </div>
              <div>
                <b>Download</b>
                <br />
                <span className="m">Link e-book via email / WhatsApp.</span>
              </div>
              <div>
                <b>Akses DWC.AI</b>
                <br />
                <span className="m">1 bulan di dadikwahyuchang.id/ai</span>
              </div>
            </div>
          </div>
        </section>

        <section>
          <div className="w">
            <blockquote>
              Saya tidak menulis karena sudah mengetahui semuanya. Saya menulis
              karena terlalu banyak perjalanan yang sayang jika hanya menjadi
              pengalaman.
              <br />
              <span className="m">— Dadik Wahyu Chang</span>
            </blockquote>
            <h2>
              Mulai dari satu buku. <span className="r">Rp29.000</span>
            </h2>
            <BuyButton checkoutKey="single" outline>
              Pilih Buku
            </BuyButton>{" "}
            <BuyButton checkoutKey="six">Ambil Semuanya — Rp109.000</BuyButton>
          </div>
        </section>
      </main>

      <footer>
        <div className="w">
          © DWC Books by Dadik Wahyu Chang ·{" "}
          <a href="https://dadikwahyuchang.id">dadikwahyuchang.id</a> ·{" "}
          <a href="/kebijakan-privasi.html">Kebijakan privasi</a>
        </div>
      </footer>
      <Toast />
      <AnalyticsConsent />
    </>
  );
}
