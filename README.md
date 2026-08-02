# 💌 Do You Love Me?

**A tiny, ridiculous, impossible-to-say-no-to website you send to someone you love (or want to annoy).**

Ask a question. They see a "YES" button... and a "NO" button that runs away every time they try to click it. Eventually they give up and press YES. That's the whole game. That's the whole point.

🔗 **Try it live → [do-you-love-me-test.vercel.app](https://do-you-love-me-test.vercel.app/)**

<img width="800" height="437" alt="Do You Love Me demo" src="https://github.com/user-attachments/assets/b6387530-8bf5-4b1a-91a5-f2cd1cf8ddac" />

---

## ✨ Why you'll want to send this

- **The NO button flees your cursor.** Every attempt to click it just makes it jump somewhere else on screen. It's playful, it's frustrating, it's *the point*.
- **Fully customizable.** Change the question, change the answer, generate your own shareable link in 10 seconds — no code required.
- **Works on mobile too.** No hover on touch screens, so the button teleports on tap instead — same energy, adapted to the device.
- **A "second chance" screen** if someone actually manages to catch the NO button (it happens, rarely, and it's glorious when it does).
- **Zero backend, zero database.** The whole customization is encoded directly in the URL — send a link, that's it.

## 🚀 Make it yours

1. Open the [live site](https://do-you-love-me-test.vercel.app/)
2. Click **"customize"**
3. Write your own question and answer
4. Hit **"Generate link"**
5. Send it to whoever you want ❤️

No account, no sign-up, no tracking of what you write — everything lives in the link itself.

## 🛠 Tech stack

- [Nuxt 3](https://nuxt.com/) / Vue 3
- [GSAP](https://gsap.com/) for the button-dodging animation and entrance effects
- Tailwind CSS
- Deployed on [Vercel](https://vercel.com/)

## 💻 Running it locally

Install dependencies:

```bash
npm install
# or
pnpm install
# or
yarn install
# or
bun install
```

Start the dev server on `http://localhost:3000`:

```bash
npm run dev
# or
pnpm dev
# or
yarn dev
# or
bun run dev
```

Build for production:

```bash
npm run build
```

Preview the production build locally:

```bash
npm run preview
```

See the [Nuxt deployment docs](https://nuxt.com/docs/getting-started/deployment) for hosting options.

## 🤝 Contributing

Found a bug? Have an idea for a fun new twist (a third button that also flees? confetti on YES? a leaderboard of how many times people dodged NO?)? PRs and issues are welcome.

## 📄 License

MIT — do whatever you want with it, just don't be mean with it. 💕

---

<p align="center">Made with love (and a mischievous NO button) by <a href="https://github.com/remycnl">Rémy Canal</a></p>
