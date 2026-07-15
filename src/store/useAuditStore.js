import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export const useAuditStore = create(
  persist(
    (set, get) => ({
      logs: [],

      addLog: (action, user, details, severity = "info") => {
        const newLog = {
          id: Date.now(),
          action,
          user: user || "Sistema",
          details,
          severity,
          date: new Date().toISOString(),
        };
        
        set((state) => ({
          // Keep only the last 1000 logs to prevent unbounded growth
          logs: [newLog, ...state.logs].slice(0, 1000),
        }));
      },

      clearLogs: () => set({ logs: [] }),
      
      exportLogs: () => {
        const logs = get().logs;
        const csvContent = "data:text/csv;charset=utf-8," 
          + "ID,Fecha,Usuario,Acción,Severidad,Detalles\n"
          + logs.map(l => `${l.id},"${l.date}","${l.user}","${l.action}","${l.severity}","${l.details}"`).join("\n");
        const encodedUri = encodeURI(csvContent);
        const link = document.createElement("a");
        link.setAttribute("href", encodedUri);
        link.setAttribute("download", `audit_logs_${new Date().toISOString().split('T')[0]}.csv`);
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
      }
    }),
    {
      name: 'nike-audit-storage',
    }
  )
);
