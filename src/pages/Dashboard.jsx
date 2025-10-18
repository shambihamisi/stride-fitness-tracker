import React from "react";
import MySideBar from "../components/MySideBar";
import { Card, CardContent } from "@/components/ui/card";
import {
  BarChart as RBarChart, Bar, XAxis, YAxis, Tooltip as RTooltip, ResponsiveContainer,
} from "recharts";
import { Footprints, Flame, Droplet } from "lucide-react";

const data = [
  { name: "Mon", steps: 800 },
  { name: "Tue", steps: 1100 },
  { name: "Wed", steps: 950 },
  { name: "Thur", steps: 1300 },
  { name: "Fri", steps: 1150 },
  { name: "Sat", steps: 1400 },
  { name: "Sun", steps: 900 },
];

export default function Dashboard() {
  return (
    <div className="flex min-h-screen bg-[#f8f8f8]">
      <MySideBar />

      <main className="flex-1 p-6 md:p-10">
        <h1 className="text-2xl font-semibold text-primary mb-6">Dashboard</h1>

        {/* Greeting */}
        <Card className="bg-primary text-white mb-6 rounded-2xl shadow-md overflow-visible">
          <CardContent className="flex justify-between items-center p-6">
            <div>
              <h2 className="text-4xl font-bold">Hello Shambi,</h2>
              <p className="text-2xl text-white/90 mt-1">Recommended Today: Upper Body</p>
            </div>
            <img
              src="src\assets\Fit analytics.png"
              alt="Character"
              className="absolute
                        ml-300
                        mb-11
                        hidden
                        xl:block
                        w-[300px]
                        sm:w-[100px]
                        md:w-[300px]
                        object-contain
                        drop-shadow-2xl
                        transition-transform
                        duration-500
                        hover:scale-105"
            />
          </CardContent>
        </Card>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
          {/* Steps */}
            <div className="bg-[#b3242b] text-white rounded-2xl shadow-md">
                <div className="p-6 flex justify-between items-center">
                <div>
                    <h3 className="text-lg font-semibold">Steps</h3>
                    <p className="text-xl font-bold mt-2">4,500 / 10,000</p>
                </div>
                <Footprints className="w-8 h-8 text-white/90" />
                </div>
                <div className="px-6 pb-4">
                <div className="relative h-2 rounded-full bg-white/25">
                    <div className="absolute left-0 top-0 h-full rounded-full bg-white" style={{ width: "45%" }}></div>
                </div>
                <p className="text-right text-xs text-white/80 mt-1">45%</p>
                </div>
            </div>

            {/* Calories */}
            <div className="bg-[#b3242b] text-white rounded-2xl shadow-md">
                <div className="p-6 flex justify-between items-center">
                <div>
                    <h3 className="text-lg font-semibold">Calories</h3>
                    <p className="text-xl font-bold mt-2">1,500 / 2,500</p>
                </div>
                <Flame className="w-8 h-8 text-white/90" />
                </div>
                <div className="px-6 pb-4">
                <div className="relative h-2 rounded-full bg-white/25">
                    <div className="absolute left-0 top-0 h-full rounded-full bg-white" style={{ width: "60%" }}></div>
                </div>
                <p className="text-right text-xs text-white/80 mt-1">60%</p>
                </div>
            </div>

            {/* Hydration */}
            <div className="bg-[#b3242b] text-white rounded-2xl shadow-md">
                <div className="p-6 flex justify-between items-center">
                <div>
                    <h3 className="text-lg font-semibold">Water</h3>
                    <p className="text-xl font-bold mt-2">2L / 3.5L</p>
                </div>
                <Droplet className="w-8 h-8 text-white/90" />
                </div>
                <div className="px-6 pb-4">
                <div className="relative h-2 rounded-full bg-white/25">
                    <div className="absolute left-0 top-0 h-full rounded-full bg-white" style={{ width: "57%" }}></div>
                </div>
                <p className="text-right text-xs text-white/80 mt-1">57%</p>
                </div>
            </div>

        </div>

        {/* Chart + Progress */}
        <div className="grid grid-cols-1 md:grid-cols-[2fr_1fr] gap-6">
          <Card className="rounded-2xl shadow-md">
            <CardContent className="p-6">
              <h3 className="text-lg font-semibold mb-4 text-[#333]">Weekly Steps</h3>
              <ResponsiveContainer width="100%" height={250}>
                <RBarChart data={data}>
                  <XAxis dataKey="name" />
                  <YAxis />
                  <RTooltip />
                  <Bar dataKey="steps" fill="#3b82f6" radius={[5, 5, 0, 0]} />
                </RBarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          <Card className="rounded-2xl shadow-md flex flex-col items-center justify-center text-center">
            <CardContent>
              <h3 className="text-lg font-semibold text-[#333] mb-4">Progress</h3>
              <div className="w-40 h-40 rounded-full border-8 border-primary flex items-center justify-center text-2xl font-bold text-primary">
                68%
              </div>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  );
}
