# Cadangan animasi tajuk seksyen

Research: 1 October 2026. Proposal untuk discussion; tiada heading animation baharu diterapkan dalam turn ini.

## Keputusan yang dicadangkan

Setiap tajuk mempunyai tiga keadaan: masuk, stabil untuk dibaca, keluar. Bezakan bahasa gerakan mengikut seksyen tetapi kongsi tempo, jarak kecil dan easing yang tenang. Kekalkan font, saiz, berat, warna, letter spacing, line break dan kedudukan akhir. Hero, Philosophy/quotes dan seluruh Greetly dikecualikan.

## Semakan kod semasa

Source snapshot: `2804d7b`. Remote `1304ed5` hanya menambah grafik profil GitHub pada masa semakan. Existing untracked CURRENT_STATE_AUDIT files tidak diubah.

- `AnimatedTitle.tsx` sudah ada lima preset: cinematic, wipe, swing, focal, epic. About, Selected Work, Capabilities, Intelligence dan Awards sudah menggunakannya. Future, LAB, Credentials dan footer masih menggunakan heading biasa. Intelligence dan Awards berkongsi focal.
- `toggleActions: 'play none none reverse'` memainkan entrance semasa masuk dari bawah, tetapi tiada exit semasa keluar di atas. Reverse hanya berlaku apabila kembali melepasi sempadan bawah. Jadi ia belum memenuhi in/out dua arah yang diminta. Urutan empat callback disahkan dalam [ScrollTrigger docs](https://www.gsap.com/docs/v3/Plugins/ScrollTrigger/).
- `useGSAP(..., [animation, reducedMotion])` belum menetapkan `revertOnUpdate: true`. Hook menangguhkan revert sehingga unmount secara default apabila ada dependencies. Dalam semakan live terhad, Awards masih beranimasi selepas Motion off: sebelum toggle opacity 0/blur 8px; selepas toggle dan scroll 500ms opacity 0.9375/blur 0.5px. Ini bukti animasi belum terus dihentikan, bukan dakwaan tajuk hilang kekal. [React lifecycle guidance](https://gsap.com/resources/React/).
- Preset epic mengakhiri `letterSpacing` pada `normal`, sedangkan heading global menggunakan `-.04em`. Preset itu belum dipakai oleh seksyen yang diperiksa; elakkan mengaktifkannya kerana ia menukar rupa akhir yang user mahu kekalkan.
- PointerMotion kini mengecualikan heading seksyen tersebut daripada transform hover. Kekalkan pemilikan transform yang jelas supaya scroll dan pointer tidak berebut property sama. [ScrollTrigger common mistakes](https://gsap.com/resources/st-mistakes/).

## Choreography setiap seksyen

Angka di bawah ialah starting values untuk prototype, bukan setting GSAP wajib atau hasil benchmark.

| Seksyen / tajuk | Masuk | Keluar | Tempo awal |
| --- | --- | --- | --- |
| About — Curious by nature / Builder by choice | Setiap baris naik dari bawah mask, satu baris menyusul 110ms. Rasa editorial, sesuai pengenalan diri. | Kedua-dua baris naik sedikit dan lenyap ke tepi atas mask, stagger jauh lebih pendek. | 850ms masuk / 400ms keluar |
| Selected work — Different problems / Same curiosity | Baris pertama masuk 28px dari kiri, baris kedua 28px dari kanan, kemudian settle tepat di alignment sekarang. | Baris bergerak keluar ke arah masing-masing 12px sambil fade, hanya di hujung kawasan baca. | 800ms / 350ms |
| Future — What I’m / building toward | Perkataan muncul sebagai gelombang diagonal pendek: x -10px, y 24px, stagger 45ms. Tidak split setiap huruf. | Gelombang ikut urutan ayat, bergerak x 8px/y -12px. | Maksimum keseluruhan 950ms / 400ms |
| LAB — /LAB_ | Slash muncul dulu; LAB didedahkan dalam tiga langkah pendek; underscore menyala sekali. Bentuk dan lebar asal kekal. | Underscore padam, huruf ditutup dari kanan ke kiri. | 650ms / 300ms |
| Capabilities — The system / behind the work | Setiap baris mempunyai shallow 3D rotationX dari sekitar -10deg ke 0, y 18px. Jauh lebih halus daripada swing -60deg sekarang. | Condong sekitar 4deg ke arah atas sambil fade. | 900ms / 400ms |
| Intelligence — Beyond the / chat window | Dua baris bergerak daripada depth berbeza: satu dari z -28px, satu z -12px; opacity naik, tanpa blur berat. | Berundur ke depth kecil sambil fade. CSS perspective; tiada canvas/WebGL tambahan. | 900ms / 450ms |
| Credentials — Always a / work in progress | Baris pertama muncul, kemudian baris kedua dibuka dari kiri ke kanan seperti sambungan ayat. Nada reflektif. | Baris kedua pudar dahulu, kemudian baris pertama. Tiada stamp atau label achievement baharu. | 800ms / 350ms |
| Awards — Awards & wins | Mask terbuka dari tengah ke sisi dengan scale halus .985 ke 1; memberi rasa presentation tanpa konfeti atau glow tambahan. | Mask menutup ke tengah, scale kekal hampir 1. | 950ms / 450ms |
| Footer — LET’S BUILD / SOMETHING REAL | Baris atas turun perlahan 16px; baris bawah naik 20px; kedua-duanya bertemu pada susunan asal. Warna REAL kekal. | Apabila scroll kembali keluar footer, dua baris berpisah sedikit dengan fade. Email/WhatsApp kekal stabil dan clickable. | 1000ms / 400ms |

LAB boleh menggunakan ScrambleText sebagai pilihan kedua, satu kitaran pendek sahaja. Ia sengaja tidak menjadi default: penggantian glyph boleh menukar lebar visual dan mengganggu pembacaan. Jika dipilih, guna lapisan visual berukuran tetap dengan accessible heading asal. Plugin menyokong set karakter dan kadar pertukaran; ini bukan keperluan untuk efek terminal. [ScrambleText documentation](https://gsap.com/docs/v3/Plugins/ScrambleTextPlugin/).

## Cara menjaga kelancaran

1. Default gunakan entrance berasaskan masa yang dicetus scroll. Jika pengguna berhenti scroll, tajuk tetap selesai muncul. Gunakan scrub hanya untuk efek yang benar-benar perlu mengikuti scroll; angka scrub ialah masa catch-up, bukan janji peningkatan FPS. [ScrollTrigger](https://www.gsap.com/docs/v3/Plugins/ScrollTrigger/).
2. Mulakan entrance sekitar top 85% viewport, kemudian kekalkan tajuk stabil dalam kawasan baca. Exit hanya bermula apabila tajuk menghampiri kawasan atas/header; tentukan berdasarkan tinggi heading dan header sebenar, bukan satu threshold buta untuk semua skrin.
3. Scroll balik mesti masuk semula dengan smooth. Elakkan reset mendadak pada tajuk yang masih kelihatan. Jika pengguna reverse atau fling cepat, controller menyambung daripada current pose dan membatalkan transition yang diganti.
4. Exit lebih pendek dan lebih kecil daripada entrance. Cadangan desktop 750–1000ms masuk, 300–450ms keluar; mobile 550–750ms masuk dengan jarak separuh. Tiada jaminan 60fps sebelum profiling pada device sebenar.
5. Footer perlu kekal dibaca ketika mencapai hujung page. Jangan paksa exit kerana progress sudah mencapai max scroll; exit hanya apabila tajuk benar-benar meninggalkan kawasan pandangan semasa scroll balik.
6. Reduced motion dan toggle website memulihkan heading kepada keadaan statik sepenuhnya serta membuang trigger/tween lama. HTML asal kekal visible tanpa JavaScript.

## Skills dan plugin yang sudah mencukupi

| Skill tempatan | Penggunaan |
| --- | --- |
| gsap-core | Transform/opacity, stagger, responsive matchMedia, nilai akhir asal. |
| gsap-scrolltrigger | Masuk/keluar dua arah, scroll thresholds, deep-link/resize dan koordinasi dengan pin sedia ada. |
| gsap-timeline | Urutan per baris/perkataan, overlap yang terkawal, satu timeline pemilik bagi setiap tajuk. |
| gsap-plugins | SplitText untuk lines/words dan masks; CustomEase jika built-in ease belum sesuai; ScrambleText hanya pilihan LAB. |
| gsap-react | useGSAP, refs, scope, revertOnUpdate, contextSafe untuk callback yang mencipta tween selepas setup. |
| gsap-performance | Utamakan transform/opacity, kurangkan layer/painter cost, cleanup dan profiling. |
| gsap-utils | Optional: clamp jarak atau collect target. Tidak perlu untuk menambah kerumitan. |

Semua skill ini sudah dipasang di `.agents/skills/`. Repo sudah mempunyai GSAP `^3.15.0` dan `@gsap/react ^2.1.2`; tiada library baharu diperlukan untuk proposal ini. gsap-frameworks (Vue/Svelte), Flip, MorphSVG, Physics2D dan ScrollSmoother tidak diperlukan untuk heading motion ini.

## Bentuk pelaksanaan selepas arah dipersetujui

- Kembangkan AnimatedTitle sedia ada dengan variant khusus, bukannya menambah beberapa animator global. Satu title controller memiliki transform dan timeline sendiri.
- Trigger menggunakan wrapper yang tidak bergerak; animate visual children. Kekalkan h2/h3, id, aria-labelledby, spans warna dan br sedia ada. Audit direct-child CSS sebelum memasukkan wrapper.
- Prefer whole lines/words supaya font kerning asal sedekat mungkin. SplitText mencatat kemungkinan kerning shift apabila split chars; jangan selesaikannya dengan mengubah typography seluruh site. Jika line splitting digunakan, `autoSplit` dengan animation returned dari `onSplit` membantu resize/font-load. [SplitText](https://gsap.com/docs/v3/Plugins/SplitText/).
- Pilih `power3.out` sebagai baseline entrance, `power2.inOut` untuk exit. CustomEase boleh menyatukan curve tersendiri jika preview memerlukannya; definisikan sekali. [CustomEase](https://gsap.com/docs/v3/Eases/CustomEase/).
- Gunakan config useGSAP dengan scope, dependencies dan `revertOnUpdate: true`. Callback yang mencipta animation selepas setup mesti context-safe. [useGSAP](https://gsap.com/resources/React/).
- Greetly sudah mempunyai pinned timeline. Setup/refresh heading baharu perlu mengambil kira ruang pin tersebut tanpa mengubah Greetly. Refresh selepas layout relevan berubah, bukan setiap frame. Satu nota research: jadual refreshPriority dalam skill tempatan menyebut lower-first, tetapi docs rasmi menyatakan higher number refreshed earlier. Ikut docs rasmi dan semak susunan trigger sebenar. [Refresh-order guidance](https://gsap.com/resources/st-mistakes/).
- Elakkan letter-spacing, width, height, top atau left sebagai mekanisme gerakan. Clip/mask dan perspektif digunakan terhad; ukur paint cost. `will-change` bukan blanket rule untuk semua tajuk.

## Semakan penerimaan yang diperlukan

- Desktop1440, panel489, mobile390: keadaan settled mempunyai bounding box, computed font dan line breaks yang sama dengan baseline.
- Scroll ke bawah/atas, reverse pertengahan animasi, fling, hash navigation terus ke section, reload di tengah page, resize selepas font load.
- Motion off ketika tajuk masih hidden, ketika entrance, dan ketika exit: semua tajuk mesti terus visible dengan transform/filter dibersihkan. Tiada pertambahan trigger selepas toggle berulang.
- Navigasi homepage → case study → homepage tidak menggandakan tween.
- No-JS, OS reduced motion dan keyboard masih boleh membaca semua headings; text splitting tidak membacakan setiap huruf secara berasingan.
- Hero, Philosophy dan Greetly kekal identikal. Contact actions tidak menerima exit animation dan sentiasa boleh digunakan.
- DevTools trace di bawah CPU throttling untuk mask/depth; sasaran 60fps pada desktop yang mampu, dengan mobile fallback lebih ringan. Jangan dakwa performance gain tanpa ukuran.

## Cadangan pemilihan

Gabungan paling seimbang: About masked lines, Selected opposing lines, Capabilities shallow 3D, Intelligence depth, LAB terminal pendek. Seksyen lain menjadi peralihan yang lebih tenang. Buat preview pertama dengan About, Capabilities dan LAB untuk menguji tiga bahasa gerakan sebelum menambah semua variant.

Enhancement terdahulu contact/WhatsApp/Awards/Symi sudah wujud dalam commit `8a3c42a`, berada dalam history origin/main, dan markup pengeluaran di https://syahmiaof.my disahkan HTTP200 serta mengandungi ketiga-tiga feature. Lima social URLs dan award entries masih menunggu maklumat owner. Review contact extension mempunyai disposition ship; itu bukan pengesahan penuh heading implementation terkini.
