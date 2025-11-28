# Welcome to your Expo app 👋

This is an [Expo](https://expo.dev) project created with [`create-expo-app`](https://www.npmjs.com/package/create-expo-app).

## Environment setup

1. Copy `env.example` to `.env` (or `.env.local`) and fill in your Supabase credentials:

   ```bash
   cp env.example .env
   ```

   ```
   EXPO_PUBLIC_SUPABASE_URL=your-project-url
   EXPO_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
   ```

   These keys are injected into the app through `app.config.ts`, so Expo Router screens and backend helpers can use Supabase.

## Get started

1. Install dependencies

   ```bash
   npm install
   ```

2. Start the app

   ```bash
   npx expo start
   ```

In the output, you'll find options to open the app in a

- [development build](https://docs.expo.dev/develop/development-builds/introduction/)
- [Android emulator](https://docs.expo.dev/workflow/android-studio-emulator/)
- [iOS simulator](https://docs.expo.dev/workflow/ios-simulator/)
- [Expo Go](https://expo.dev/go), a limited sandbox for trying out app development with Expo

You can start developing by editing the files inside the **app** directory. This project uses [file-based routing](https://docs.expo.dev/router/introduction).

## Get a fresh project

When you're ready, run:

```bash
npm run reset-project
```

This command will move the starter code to the **app-example** directory and create a blank **app** directory where you can start developing.

## Learn more

To learn more about developing your project with Expo, look at the following resources:

- [Expo documentation](https://docs.expo.dev/): Learn fundamentals, or go into advanced topics with our [guides](https://docs.expo.dev/guides).
- [Learn Expo tutorial](https://docs.expo.dev/tutorial/introduction/): Follow a step-by-step tutorial where you'll create a project that runs on Android, iOS, and the web.

## Join the community

Join our community of developers creating universal apps.

- [Expo on GitHub](https://github.com/expo/expo): View our open source platform and contribute.
- [Discord community](https://chat.expo.dev): Chat with Expo users and ask questions.

## Deployment

### Supabase Configuration

Before deploying, you must configure Supabase:

**1. Run SQL Scripts**

In Supabase Dashboard → SQL Editor, execute these files in order:
1. `backend/supabase/updated_trigger.sql` - Creates improved user creation trigger
2. `backend/supabase/updated_policies.sql` - Sets up RLS policies for all tables

**2. Configure Redirect URLs**

In Supabase Dashboard → Authentication → URL Configuration, add:
- `weversityorg://auth/verified` (production deep link)
- `exp://*/auth/verified` (for Expo Go testing)

**3. Email Template** (Optional)

In Authentication → Email Templates → Confirm Signup:
- Ensure template uses `{{ .ConfirmationURL }}`
- Verify redirect URL points to your app scheme

### Vercel Deployment

**Environment Variables:**

Set these in Vercel Dashboard → Project Settings → Environment Variables:
- `EXPO_PUBLIC_SUPABASE_URL` - Your Supabase project URL
- `EXPO_PUBLIC_SUPABASE_ANON_KEY` - Your Supabase anon key

**Build Settings:**
- Build Command: `npm run build:web`
- Output Directory: `dist`
- Node Version: 18+

**Deploy:**
```bash
npm run build:web  # Test build locally first
# Then push to GitHub - Vercel will auto-deploy
```

### Testing After Deployment

1. Sign up as a student → verify email → login → check Student Dashboard appears
2. Sign up as a teacher → verify email → login → check Teacher Dashboard appears
3. Try login with unverified email → should show "Email not verified" message
4. Try login with wrong password → should show "Invalid Credentials" message
5. Check `public.users` table in Supabase → rows should be created immediately after signup
