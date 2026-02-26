# Changelog

All notable changes to the **Expense Tracker (Mobile)** project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [1.1.0] - 2026-02-25
### Added
- **Global State Context:** Implemented `GastosContext` to serve as a Single Source of Truth for sharing expense data across tabs.
- **Skeleton Loaders:** Integrated pre-rendered gray wireframe blocks in `index.tsx` (Dashboard) and `categorias.tsx` to completely eliminate UI layout jumping (shifts) during API fetches.
- **Background Sync:** Implemented silent data refreshing on the global context when a new expense is successfully saved in `captura.tsx`.

### Changed
- **Unified Header UI:** Standardized the top headers (Month and Total Amount) across both "Mes en curso" and "Categorías" views to provide a seamless filtering experience.
- **Optimized Network Calls:** Removed aggressive `useFocusEffect` hooks that forcefully refetched data from Railway API upon every tab switch, heavily reducing backend load.
- **Removed Disruptive Spinners:** Replaced central `ActivityIndicator` loading blocks with structural skeletons and native pull-to-refresh (`RefreshControl`), improving user perception of speed.

### Removed
- **Static Mock Data:** Replaced the static vision-model data array in `categorias.tsx` with dynamic backend connectivity.
- **Inline API Calls:** Fully abstracted inline fetch/mutation logic to centralized hooks (`useGastos`, `useGastoMutation`).

## [1.0.0] - 2026-02-24
### Added
- Initial release of the React Native (v0.81.5) and Expo (v54) mobile application.
- Custom REST API integration hosted on Railway.
- NativeWind (Tailwind CSS) integration with strict design tokens (spacing, colors, typography).
- Custom transparent Bottom Tab Bar (`GradientFooter`).
- Filter by category utilizing Horizontal Scroll View.
- Capture screen for adding new expenses with Keyboard Avoiding View.
