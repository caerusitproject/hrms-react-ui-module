// designation-card.jsx (Updated - similar to department-card)
"use client"

import { Briefcase, Edit2, Trash2 } from "lucide-react"
import { theme } from '../../theme/theme';

export default function DesignationCard({ designation, isAdmin, onDelete }) {
  const levelColors = {
    junior: { bg: "bg-green-50", text: "text-green-700" },
    mid: { bg: "bg-blue-50", text: "text-blue-700" },
    senior: { bg: "bg-purple-50", text: "text-purple-700" },
    lead: { bg: "bg-orange-50", text: "text-orange-700" },
  }

  const levelColor = levelColors[designation.level.toLowerCase()] || levelColors.mid;

  return (
    <div className="group rounded-lg border border-slate-200 bg-white p-6 transition-all hover:border-purple-300 hover:shadow-lg" 
         style={{ 
           borderColor: theme.colors.lightGray, 
           backgroundColor: theme.colors.white,
           borderRadius: theme.borderRadius.medium,
           padding: theme.spacing.md,
           boxShadow: theme.shadows.small
         }}>
      <div className="mb-4 flex items-start justify-between">
        <div className="flex items-center gap-3">
          <div className="rounded-lg bg-gradient-to-br from-purple-100 to-purple-50 p-3" style={{ 
            backgroundColor: theme.colors.secondaryLight || theme.colors.primaryLight,
            borderRadius: theme.borderRadius.small,
            padding: theme.spacing.sm
          }}>
            <Briefcase size={24} className="text-purple-600" style={{ color: theme.colors.secondary || theme.colors.primary }} />
          </div>
          <div>
            <h3 className="font-semibold text-slate-900" style={{ color: theme.colors.text.primary }}>{designation.name}</h3>
            <p className="text-sm text-slate-600" style={{ color: theme.colors.text.secondary }}>{designation.department}</p>
          </div>
        </div>
        {isAdmin && (
          <div className="flex gap-1 opacity-0 transition-opacity group-hover:opacity-100">
            <button className="rounded-lg p-2 text-slate-600 hover:bg-slate-100" style={{ borderRadius: theme.borderRadius.small }}>
              <Edit2 size={16} />
            </button>
            <button className="rounded-lg p-2 text-red-600 hover:bg-red-50" onClick={() => onDelete(designation.id)} style={{ borderRadius: theme.borderRadius.small }}>
              <Trash2 size={16} />
            </button>
          </div>
        )}
      </div>

      <div className="space-y-3 border-t border-slate-100 pt-4" style={{ 
        borderTopColor: theme.colors.lightGray,
        paddingTop: theme.spacing.md
      }}>
        <div className="flex items-center justify-between">
          <span className="text-sm text-slate-600" style={{ color: theme.colors.text.secondary }}>Level</span>
          <span className={`rounded-full px-3 py-1 text-xs font-medium ${levelColor.bg} ${levelColor.text}`} style={{ 
            backgroundColor: theme.colors.successLight || levelColor.bg,
            color: theme.colors.success || levelColor.text,
            borderRadius: theme.borderRadius.small
          }}>
            {designation.level}
          </span>
        </div>
        <div className="flex items-center justify-between">
          <span className="text-sm text-slate-600" style={{ color: theme.colors.text.secondary }}>Salary Range</span>
          <span className="font-semibold text-slate-900" style={{ color: theme.colors.text.primary }}>{designation.salary_range}</span>
        </div>
      </div>
    </div>
  )
}