# Music Reviews Platform

## 1. Short Summary

The application is a platform that unites creators (authors) and listeners of modern music. Here, users analyze music releases and write reviews, and the authors receive feedback in the form of constructive criticism. Registered artists and producers can mark their favorite reviews of their releases with "Author's likes", as well as leave "Author's comments" in their release cards.

## 2. Main Functionality

- Registration / Authentication with email verification
- Reset password via email
- Role management (User, Media, Admin, Root Admin)
- Content management via Admin Dashboard
- Various aggregated lists with searchability and pagination
- A favorites system that allows users to mark releases, reviews, and authors as favourite
- User profiles with the ability to specify social networks, as well as uploading avatar and cover
- A custom rating system that allows users to rate a release, including adding a review to it, as well as attaching a media review for media users
- A system of monthly nominations and awards that allows users to select the best works/authors from the last month in various categories
- A verification system for authors that allows them to leave "Author's comments" on their releases, as well as mark reviews of their releases with "Author's likes"
- Built-in gamification implemented through receiving points for various actions on the platform
- Email-based feedback
- Fully responsive interface of the entire application
- Custom centralized notification system

## 3. Tech Stack

**Frontend:**

- TypeScript
- React 19
- React Router
- Vite
- MobX
- TanStack Query
- TailwindCSS
- Axios
- Embla-carousel-react

**Backend:**

- TypeScript
- NestJS
- Prisma ORM
- PostgreSQL

## 4. Repository architecture and structure

The application is a `monorepository` and is built on the principle of `client-server` architecture

```
project-root/
├── /client
│   ├── /src
│   │    ├── /api           # The REST API request layer
│   │    ├── /components    # Reusable UI components
│   │    ├── /contexts      # React contexts
│   │    ├── /hooks         # Custom React hooks
│   │    ├── /pages         # Pages that encapsulate specialized components
│   │    ├── /providers     # Context providers
│   │    ├── /routes        # Route definitions
│   │    ├── /types         # Types and interfaces distributed by domain names
│   │    ├── /query-keys    # TanStack Query keys
│   │    ├── /stores        # MobX global stores
│   │    ├── /utils         # Utility functions
│   │    └── main.tsx       # React entry point
│   ├── public/             # Public assets (icons, logos)
│   ├── index.html          # Main HTML file
│   ├── vite.config.ts       # Contains build and development settings for the Vite bundler
│   └── package.json        # Lists frontend project dependencies, scripts, and metadata
│
├── /server
│   ├── /public                     # Static files (avatars, covers, assets)
│   ├── /prisma                       # Database related folder (schemas, sql, seeders)
│   │   ├── /schema                       # Prisma schemas
│   │   ├── /sql                          # Raw PostgreSql functions, procedures, triggers and views
│   │   └── ...
│   ├── /src                          # NestJS modules and utils
│   │   ├── /auth                         # Authentication module (strategies, guards, types, services, controllers)
│   │   ├── /author-confirmations         # Module for managing author verification requests
│   │   ├── /author-confirmation-statuses # Module for managing statuses of author confirmation requests
│   │   ├── /album-values                 # Module for managing the "Album Value" ratings
│   │   ├── /album-value-votes            # Module for processing "Album Value" ratings from users
│   │   ├── /author-comments              # Module for processing comments from verified authors
│   │   ├── /author-types                 # Module for managing types of authors
│   │   ├── /authors                      # Module for managing authors
│   │   ├── /feedback                     # Module for managing feedback
│   │   ├── /feedback-replies             # Module for processing feedback replies
│   │   ├── /feedback-statuses            # Module for managing statuses of feedback
│   │   ├── /leaderboard                  # Module for managing leaderboard of the most active users
│   │   ├── /nominations                  # Module for managing nominations (candidates, winners, votes etc.)
│   │   ├── /nomination-types             # Module for managing types of nominations
│   │   ├── /profiles                     # Module for managing user profiles
│   │   ├── /registered-authors           # Module for managing verified authors
│   │   ├── /release-media                # Module for managing release media entries
│   │   ├── /release-media-types          # Module for managing types of release media entries
│   │   ├── /release-media-statuses       # Module for managing statuses of release media entries
│   │   ├── /release-types                # Module for managing types of releases
│   │   ├── /releases                     # Module for managing releases
│   │   ├── /reviews                      # Module for managing user's reviews and marks
│   │   ├── /roles                        # Module for role management
│   │   ├── /social-media                 # Module for managing social media
│   │   ├── /user-fav-authors             # Module for managing user's favourite authors
│   │   ├── /user-fav-media               # Module for managing user's favourite media
│   │   ├── /user-fav-releases            # Module for managing user's favourite releases
│   │   ├── /user-fav-reviews             # Module for managing user's favourite reviews
│   │   ├── /users                         # Module for managing users
│   │   ├── /file                         # Module for file management
│   │   ├── /shared                       # Shared folder
│   │   │   ├── /decorators                   # Shared custom decorators
│   │   │   ├── /exceptions                   # Shared custom exceptions
│   │   │   ├── /guards                       # Shared custom guards
│   │   │   ├── /types                        # Shared types and interfaces
│   │   │   └── /utils                        # Shared utility functions
│   │   └── /mails                        # Module for email management
│   ├── prisma.config.ts       # Contains build and development settings for the Prisma
│   └── package.json        # Lists backend project dependencies, scripts, and metadata
└── README.md
```

## 5. Database (PostgreSQL + Prisma)

### Schema

![schema](assets/public.png)

**Features:**

- Prisma is used to describe database models
- Rigid integrity through foreign keys and cascading constraints
- Views, triggers, functions, and procedures are described separately in raw sql (`../prisma/sql/*`)
- Raw sql is also used for complex aggregated queries instead of Prisma queries
- Seeding (`server/prisma/seed.ts`) for data filling

## 6. Future plans

- Internationalization, including automatic translation of reviews
- Integration with Spotify API with the ability to listen to the release directly on the website, as well as making playlists
- Integration with the Genius API to view song lyrics directly on the website
- Frontend render optimization

## 7. Preview

Will be available soon
