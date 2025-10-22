// department-card.jsx (Updated)
"use client"

import { Building2, Edit2, Trash2 } from "lucide-react"
import { theme } from '../../theme/theme';

export default function DepartmentCard({ department, isAdmin, onDelete }) {
  return (
    <div className="group rounded-lg border border-slate-200 bg-white p-6 transition-all hover:border-blue-300 hover:shadow-lg" 
         style={{ 
           borderColor: theme.colors.lightGray, 
           backgroundColor: theme.colors.white,
           borderRadius: theme.borderRadius.medium,
           padding: theme.spacing.md,
           boxShadow: theme.shadows.small
         }}>
      <div className="mb-4 flex items-start justify-between">
        <div className="flex items-center gap-3">
          <div className="rounded-lg bg-gradient-to-br from-blue-100 to-blue-50 p-3" style={{ 
            backgroundColor: theme.colors.primaryLight,
            borderRadius: theme.borderRadius.small,
            padding: theme.spacing.sm
          }}>
            <Building2 size={24} className="text-blue-600" style={{ color: theme.colors.primary }} />
          </div>
          <div>
            <h3 className="font-semibold text-slate-900" style={{ color: theme.colors.text.primary }}>{department.name}</h3>
            <p className="text-sm text-slate-600" style={{ color: theme.colors.text.secondary }}>{department.description}</p>
          </div>
        </div>
        {isAdmin && (
          <div className="flex gap-1 opacity-0 transition-opacity group-hover:opacity-100">
            <button className="rounded-lg p-2 text-slate-600 hover:bg-slate-100" onClick={() => {/* Edit handler */}} style={{ 
              borderRadius: theme.borderRadius.small,
              color: theme.colors.text.secondary
            }}>
              <Edit2 size={16} />
            </button>
            <button className="rounded-lg p-2 text-red-600 hover:bg-red-50" onClick={() => onDelete(department.id)} style={{ 
              borderRadius: theme.borderRadius.small,
              color: theme.colors.error
            }}>
              <Trash2 size={16} />
            </button>
          </div>
        )}
      </div>

      <div className="flex items-center justify-between border-t border-slate-100 pt-4" style={{ 
        borderTopColor: theme.colors.lightGray,
        paddingTop: theme.spacing.md
      }}>
        <span className="text-sm text-slate-600" style={{ color: theme.colors.text.secondary }}>
          <span className="font-semibold text-slate-900" style={{ color: theme.colors.text.primary }}>{department.employeeCount}</span> employees
        </span>
        <span className="inline-block rounded-full bg-blue-50 px-3 py-1 text-xs font-medium text-blue-700" style={{ 
          backgroundColor: theme.colors.primaryLight,
          color: theme.colors.primary,
          borderRadius: theme.borderRadius.small,
          padding: '4px 8px'
        }}>Active</span>
      </div>
    </div>
  )
}