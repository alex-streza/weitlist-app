## Make SaaS Waitlists Simple & OpenSource

Weitlist is exatly what it says it is, a waitlist platform for your projects.

https://weitlist.me

> **Note**
>
> This project is very EARLY on.

<sup>Made for Supabase Launch Week X Hackathon.</sup>

Built with

- [Supabase](https://supabase.com/)
- [Vercel](https://vercel.com/)
- [Resend](https://resend.com/) - SOON
- [Next.JS](https://nextjs.org/)
- [shadcn/ui](https://ui.shadcn.com/)
- [TailwindCSS](https://tailwindcss.com/)

## How it works

> **Warning**
>
> Weit! Here's a guide
>
> First and foremost you'll need a Github account, I'll add other OAuth later on + email.

In a couple minutes you'll be able to create and embed your personal waitlist form for your side-project.

1. Connect with Github
2. Create a new waitlist in the right side bar
3. Edit name/website URL
4. Copy the waitlist link and share with others
5. Grab the embed code from Integrations page

The API is designed using TRPC and the OpenAPI version is not yet implemented (not OpenAI!!!), it uses prisma as ORM over a Supabase database.

List of Supabase features used:

- Database
  - storing all table data (users, accounts, waitlist, entries & more)
- More coming soon

## Motivation

When I was working at morrow.to landing page I found myself spending literal hours making a decent waitlist experience, when I heard Supabase Launch Week X is coming I knew I had to act on that need. I know there are several other waitlist SaaS (extremely powerful and more feature rich), but I'll try my best to evolve weitlist.me as an open-source competitor.

## Disclaimer

This project is usable, but far from complete, I had a lot more features planned to be ready before I open-sourced it but I had a hectic week, my phone got stolen and I had to travel 250km to get it back and the following day I had to have my appendix removed out of the blue. Not a sob story to gain extra awareness but I feel bad for not rising to the expectations and target I set for myself.

## Ideas for the future

- Add no-code fields to add branding to join form
- Create weitlist templates
- Allow API access
- Use more Supabase because it's cool
- Improve mobile version

## The team / contributors

- alex-streza ([GitHub](https://github.com/alex-streza), [Twitter](https://twitter.com/alex_streza))
- catalina ([GitHub](https://github.com/welnic), [Twitter](https://twitter.com/Catalina_Melnic)

## Thanks to

- [laznic](https://github.com/laznic) [GetLaunchlist](https://getlaunchlist.com/) was the website I got the most inspiration from (mainly features)- [cata](https://twitter.com/Catalina_Melnic) for standing by my side and coding in my place when I had the IV in and couldn't code
