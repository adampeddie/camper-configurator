# Camper Configurator

Build Camper Source UK: an intuitive campervan conversion configurator web app.

Features & Flow:
1. Onboarding / Build Setup: Van make/model, wheelbase (MWB/LWB/XLWB), occupants count, conversion budget (£), usage (weekends, holidays, extended touring, full-time), climate (UK, European summer, four-season), off-grid requirement (low, medium, high), shower (yes/no), hot water (yes/no), gasless build (yes/no). 'Build My Camper' button.
2. Recommendation Engine: Rule-based system selecting sensible defaults across 18 conversion systems (Insulation, Windows, Roof Ventilation, Battery, Solar, DC-DC Charging, Inverter/Mains, Heating, Fresh Water, Waste Water, Hot Water, Fridge, Toilet, Shower, Cooking, Flooring, Furniture, Consumables). Rules account for off-grid level, climate, gasless, family size, budget, etc.
3. Interactive Dashboard & System Cards: Top sticky summary tracking budget, total cost, remaining/over budget, estimated weight (kg), and visual budget progress bar. Each system card shows the selected product, why it was chosen, spec details, and inline quick-swaps ("Save £X - Cheaper alternative" and "Upgrade +£X - Premium alternative"). Upgrades allowed past budget with prominent "Build is £X over budget" status and actionable savings suggestions.
4. Build Summary View: Breakdown of van profile, category subtotals, itemized parts with external buy links, and a prominent 'Buy My Build' action.
5. Design & Feel: Premium, outdoor/adventure aesthetic with warm off-white background, charcoal text, muted olive green, burnt orange accents, clean typography, responsive car-configurator UX. Clean structured local product data ready for Supabase later.

This project was built with [Lovable](https://lovable.dev).

## Build with Lovable

Continue developing this project in the [Lovable editor](https://lovable.dev/projects/378eadd6-3952-4981-b558-d106138230a9).

- **Ship faster**: describe what you want to build and Lovable handles the code.
- **Stay in sync**: every change made in Lovable is committed straight to this repository.
- **Full ownership**: this code is yours. Push to `main` on GitHub and your changes sync back into Lovable, ready for your next prompt.

## Development

Prefer working locally? You need Node.js and npm — [install with nvm](https://github.com/nvm-sh/nvm#installing-and-updating).

```sh
git clone <this-repository-url>
cd <repository-name>
npm i
npm run dev
```
