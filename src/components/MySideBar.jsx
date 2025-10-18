import React, { useEffect, useState } from "react";
import { NavLink } from "react-router-dom";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { Home, Activity, Utensils, Settings, ChevronLeft, ChevronRight } from "lucide-react";
import { LogOut } from "lucide-react";

export default function Sidebar({
  user = { initials: "S", name: "Shambi Hamisi", age: "AGE 28", height: "HEIGHT 185cm", weight: "WEIGHT 110kg" },
  items = [
    { key: "dashboard", label: "Dashboard", icon: Home, to: "/dashboard" },
    { key: "activity",  label: "Activity",  icon: Activity, to: "/activity" },
    { key: "nutrition", label: "Nutrition", icon: Utensils, to: "/nutrition" },
  ],
  defaultCollapsed,
}) {
  const prefersCollapsed = () => {
    const saved = localStorage.getItem("stride.sidebar.collapsed");
    if (saved != null) return saved === "1";

    if (typeof defaultCollapsed === "boolean") return defaultCollapsed;
    return window.innerWidth < 768;
  };

  const [collapsed, setCollapsed] = useState(prefersCollapsed);

  useEffect(() => {
    localStorage.setItem("stride.sidebar.collapsed", collapsed ? "1" : "0");
  }, [collapsed]);

  return (
    <TooltipProvider delayDuration={150}>
      <aside
        className={`relative flex flex-col bg-[#b3242b] text-white transition-[width] duration-300
        ${collapsed ? "w-20" : "w-64"}`}
      >
        {/* Toggle button */}
        <button
          onClick={() => setCollapsed((v) => !v)}
          aria-label={collapsed ? "Expand sidebar" : "Collapse sidebar"}
          className="absolute -right-3 top-6 z-10 grid place-items-center w-6 h-6 rounded-full bg-white text-[#b3242b] shadow-md"
        >
          {collapsed ? <ChevronRight className="w-4 h-4" /> : <ChevronLeft className="w-4 h-4" />}
        </button>

        {/* Profile */}
        <div className="flex flex-col items-center py-8">
          <Avatar className={`border-4 border-white ${collapsed ? "w-12 h-12" : "w-20 h-20"} mb-3`}>
            <AvatarFallback className="text-[#b3242b] font-bold bg-white">
              {user.initials ?? "S"}
            </AvatarFallback>
          </Avatar>

          {!collapsed && (
            <>
              <h2 className="text-lg font-semibold text-center px-4 truncate">{user.name}</h2>
              <div className="mt-3 text-[11px] opacity-90 leading-4 text-center">
                <p>{user.age}</p>
                <p>{user.height}</p>
                <p>{user.weight}</p>
              </div>
            </>
          )}
        </div>

        {/* Nav */}
        <nav className="mt-2 px-3 space-y-2">
          {items.map(({ key, label, icon: Icon, to }) => (
            <Tooltip key={key}>
              <TooltipTrigger asChild>
                <NavLink
                  to={to}
                  className={({ isActive }) =>
                    [
                      "w-full flex items-center gap-3 rounded-lg px-3 py-2 transition-colors",
                      collapsed ? "justify-center" : "",
                      isActive ? "bg-white text-primary font-semibold" : "text-white hover:bg-white/15",
                    ].join(" ")
                  }
                >
                  <Icon className="w-5 h-5 shrink-0" />
                  {!collapsed && <span className="truncate">{label}</span>}
                </NavLink>
              </TooltipTrigger>
              {collapsed && <TooltipContent side="right">{label}</TooltipContent>}
            </Tooltip>
          ))}
        </nav>

        <div className="flex-1" />

        {/*Logout button */}
        <div className="mt-auto mb-6 px-3">
        <button
            onClick={() => {
            window.location.href = "/signin";
            }}
            className={`
            w-full flex items-center ${collapsed ? "justify-center" : "justify-start"} 
            gap-3 px-3 py-2 rounded-lg text-white hover:bg-white/15 transition-colors
            cursor-pointer`}
        >
            <LogOut className="w-5 h-5" />
            {!collapsed && <span>Logout</span>}
        </button>
        </div>
      </aside>
    </TooltipProvider>
  );
}
