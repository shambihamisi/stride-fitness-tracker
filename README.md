🏋️‍♂️ Stride Fitness Tracker

A modern, responsive fitness and wellness web app built with React + Vite + Tailwind CSS, designed to help users track workouts, nutrition, hydration, and overall fitness progress.
It combines a clean dashboard interface, collapsible sidebar navigation (via shadcn/ui), and real-time data visualization for a sleek, mobile-friendly experience.

🚀 Live Demo

👉 View on Vercel

🧩 Features
💪 Dashboard

Clean, responsive overview of daily fitness data

Cards for Steps, Calories, and Hydration

Animated progress bars and Lucide icons

🏃 Activity Page

Log custom workouts (sets, reps, weights)

Fetch real exercise data from the WGER API

Search exercises by name or muscle group

Visualize progress across upper-body workouts

🍎 Nutrition Page

Log meals with macros (protein, carbs, fat, kcal)

Hydration tracking with daily goals

Full-width “Today’s Log” and “Hydration Tips”

Quick-add buttons for common meals and drinks

🧭 Navigation

Responsive sidebar (collapsible to icons on desktop/mobile)

Smooth route transitions with React Router

🛠️ Tech Stack
Category	Technology
Framework	React 18
Build Tool	Vite
Styling	Tailwind CSS, shadcn/ui
Icons	Lucide React
Charts	Recharts
API	WGER Exercise API

Hosting	Vercel
⚙️ Setup & Installation
# Clone repository
git clone https://github.com/your-username/stride-fitness-tracker.git
cd stride-fitness-tracker

# Install dependencies
npm install

# Run development server
npm run dev


Then open http://localhost:5173
 in your browser.

🔑 Environment Variables

Create a .env.local file in the project root:

VITE_WGER_API_KEY=your_api_token_here


🔒 Make sure .env.local is included in .gitignore so your API key is never pushed to GitHub.

🧱 Build & Deploy

To build for production:

npm run build


To preview locally:

npm run preview


For deployment:

Push to GitHub

Import your repo to Vercel

Add the environment variable VITE_WGER_API_KEY under Project → Settings → Environment Variables

Click Deploy

🧠 Future Improvements

Add personalized nutrition suggestions

Sync with wearable devices (Fitbit, Garmin, etc.)

Add dark mode toggle

Implement user authentication for data persistence

📄 License

This project is licensed under the MIT License.
You’re free to use, modify, and distribute with attribution.