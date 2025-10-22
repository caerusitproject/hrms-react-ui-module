// tab-navigation.jsx (No changes needed, but ensure theme if applicable)
"use client"

import { theme } from '../../theme/theme';

export default function TabNavigation({ tabs, activeTab, onTabChange }) {
  return (
    <div className="flex gap-1 overflow-x-auto">
      {tabs.map((tab) => {
        const Icon = tab.icon
        const isActive = activeTab === tab.id
        return (
          <button
            key={tab.id}
            onClick={() => onTabChange(tab.id)}
            className={`flex items-center gap-2 border-b-2 px-4 py-4 text-sm font-medium transition-colors ${
              isActive ? "border-blue-600 text-blue-600" : "border-transparent text-slate-600 hover:text-slate-900"
            }`}
            style={{
              borderBottomColor: isActive ? theme.colors.primary : 'transparent',
              color: isActive ? theme.colors.primary : theme.colors.text.secondary,
              padding: '16px 24px',
              borderRadius: theme.borderRadius.small
            }}
          >
            <Icon size={18} />
            {tab.label}
          </button>
        )
      })}
    </div>
  )
}