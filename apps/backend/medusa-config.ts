import { loadEnv, defineConfig } from '@medusajs/framework/utils'
import { lazyBetterAuthPlugin } from '@nualt/medusa-plugin-better-auth/lib/lazy-plugins'

loadEnv(process.env.NODE_ENV || 'development', process.cwd())

module.exports = defineConfig({
  projectConfig: {
    databaseUrl: process.env.DATABASE_URL,
    http: {
      storeCors: process.env.STORE_CORS!,
      adminCors: process.env.ADMIN_CORS!,
      authCors: process.env.AUTH_CORS!,
      jwtSecret: process.env.JWT_SECRET,
      cookieSecret: process.env.COOKIE_SECRET,
    }
  },
  plugins: [
    {
      resolve: '@nualt/medusa-plugin-better-auth',
      options: {
        betterAuth: {
          baseURL: process.env.BETTER_AUTH_URL,
          plugins: [
            lazyBetterAuthPlugin('emailOTP', {
              async sendVerificationOTP({
                email,
                otp,
                type,
              }: {
                email: string
                otp: string
                type: 'sign-in' | 'email-verification' | 'forget-password'
              }) {
                const { Resend } = await import('resend')
                const resend = new Resend(process.env.RESEND_API_KEY)

                const subject =
                  type === 'sign-in'
                    ? `${otp} is your Bottega Sicula sign-in code`
                    : `${otp} is your verification code`

                await resend.emails.send({
                  from: process.env.RESEND_FROM_EMAIL!,
                  to: email,
                  subject,
                  html: `<p>Your code is <strong>${otp}</strong>. It expires in 5 minutes.</p>`,
                })
              },
            }),
          ],
        },
      },
    },
  ],
  modules: [
    {
      resolve: '@medusajs/medusa/auth',
      options: {
        providers: [
          {
            resolve: '@nualt/medusa-plugin-better-auth/providers/better-auth',
            id: 'better-auth',
          },
        ],
      },
    },
  ],
})
