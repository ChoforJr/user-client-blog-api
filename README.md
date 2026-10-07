# Blog API User Client

A responsive Next.js App Router and strict TypeScript frontend for the separately deployed Blog API. The client supports published posts, post details and comments, account registration/sign-in, profile updates, password changes, and account deletion.

## API configuration

The Blog API remains an independent backend deployment. Set its base URL in the Vercel project for this client and locally in `.env.local`:

```env
# Server-rendered published posts, comments, and profiles
BLOG_API_URL=https://your-blog-api.example.com

# Browser requests for sign-in, account management, and comments
NEXT_PUBLIC_BLOG_API_URL=https://your-blog-api.example.com
```

Both values should point to the API base URL (without a trailing slash). `BLOG_API_URL` is used for server-rendered public data; `NEXT_PUBLIC_BLOG_API_URL` is used by browser requests for sign-in, account management, and comments. The public URL is an endpoint address, **not a credential**. Do not put API secrets or credentials in either variable. If the API is hosted on another origin, its CORS policy must allow this frontend origin for browser-side requests.

An example is available in [`.env.example`](.env.example). The previous `VITE_BLOG_API_URL` setting is no longer read.

Browser API requests include credentials and use the API's HttpOnly `blog_user_session` cookie. The API keeps this session separate from the admin frontend, even though both clients call the same API origin. After the backend introduces role-specific cookies, sign in again once in each app; the previous shared cookie is no longer used. The client intentionally ignores any temporary JWT in the login response and never stores it in browser storage. The browser also connects to the API's native `/ws` endpoint for live post/comment updates, reconnecting and restoring the open post subscription after disconnects.

## Run locally

Requires Node.js 18.18 or newer and npm.

```bash
npm install
cp .env.example .env.local
# Set the API URLs in .env.local
npm run dev
```

Open `http://localhost:3000`.

## Scripts

| Command | Description |
| --- | --- |
| `npm run dev` | Start the Next.js development server |
| `npm run build` | Create the production build |
| `npm run start` | Serve the production build |
| `npm run typecheck` | Run strict TypeScript checks |
| `npm run lint` | Run ESLint with Next.js rules |
| `npm test` | Compile and run TypeScript unit tests |

## Routes

- `/` — Blog home
- `/posts` — Published posts and comment counts
- `/posts/[id]` — Post detail, comments, and authenticated comment controls
- `/signIn` — Sign in and account registration
- `/account` — Profile, username and password updates, sign out, and account deletion

Deployment is managed by Vercel's native Next.js integration; no SPA rewrite is required. Deploy this repository independently from the Blog API backend and admin client.

## Related projects

- [Blog API backend](https://github.com/ChoforJr/blog-api)
- [Admin client](https://github.com/ChoforJr/admin-client-blog-api)

## Author

**FORSAKANG CHOFOR JUNIOR**

- [GitHub](https://github.com/ChoforJr)
- [LinkedIn](https://www.linkedin.com/in/choforforsakang/)
