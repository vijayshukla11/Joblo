# Architecture Blueprint - JOB Lo Full-Stack Migration

This document provides a technical blueprint of the full-stack architecture of the JOB Lo platform. It describes how the frontend application communicates with the backend, and details the database layers and fallback synchronization mechanisms.

---

## 🎛️ System Architecture Diagram

```
                              +---------------------------------------+
                              |              React Client             |
                              |   (Vite + React 19 + Tailwind CSS)    |
                              +---------------------------------------+
                                                  |
                                                  v
                              +---------------------------------------+
                              |         Unified Service Layer         |
                              | (authService, profileService, etc.)   |
                              +---------------------------------------+
                                                  |
                                                  v
                              +---------------------------------------+
                              |        Supabase Repositories          |
                              |  (CandidateRepository, JobRepository, |
                              |         EmployerRepository)           |
                              +---------------------------------------+
                                                  |
                                                  v
                              +---------------------------------------+
                              |         Hybrid Client Proxy           |
                              | (integrations/supabase/client.ts)     |
                              +---------------------------------------+
                                        /                   \
                                       /                     \  [VITE_SUPABASE_URL is unconfigured]
         [VITE_SUPABASE_URL present]  /                       \
                                     v                         v
                       +---------------------------+     +---------------------------+
                       |   Real Supabase Backend   |     |    Simulated Database     |
                       |       (PostgreSQL)        |     |     (LocalStorage DAL)    |
                       +---------------------------+     +---------------------------+
```

---

## 🏗️ Architectural Core Principles

### 1. Robust Modularization
To adhere to memory limitations and improve load times, all features, views, and repositories are split into separate files. This makes debugging isolated issues simple and fast.

### 2. The Hybrid Connection Proxy Pattern
We introduce a connection-safe proxy on the client side (`supabaseClient`).
- **Connection Health Check**: When the container spins up, `supabaseClient` queries the Vite environment configuration.
- **Fail-Safe Operation**: If no keys are specified in `.env`, the client wraps and replicates all query actions inside a custom localStorage database driver (`SupabaseQueryBuilder`). 
- **Production Connections**: Once keys are provided, the proxy automatically routes all requests to the real Supabase cloud endpoint, running real PostgreSQL statements against tables and using Row-Level Security (RLS) policies.

### 3. Separation of Concerns (SoC)
Views are purely presentation layers. They call high-level business services which coordinate with repositories. This isolates raw database schema interactions from UI rendering components.

### 4. Zero-Friction Developer Experience
Because the application retains fully integrated LocalStorage simulations alongside the real Supabase SDK integrations, local builders and preview servers can run immediate tests with 100% functionality without first needing to establish database instances in the cloud.
