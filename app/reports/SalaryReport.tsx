'use client';

import React, { useMemo } from 'react';
import { Worker } from '@/types';
import { useAppState } from '@/components/state/AppStateContext';
import { Wallet, AlertCircle } from 'lucide-react';


// Helper to format currency
const formatCurrency = (amount: number) => {
  return amount.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 }) + ' ريال';
};

interface SalaryReportProps {
  workers: Worker[];
}

export default function SalaryReport({ workers }: SalaryReportProps) {
  const { state } = useAppState();
  const salaryData = state.salaryData || {};

  const calculateRow = (workerId: string) => {
    // Cast to any to avoid type errors if types/index.ts is not updated in the build environment
    const data = (salaryData[workerId] as any) || {
      basicSalary: 0,
      advance: 0,
      advanceRepayment: 0,
      absenceDays: 0,
      absenceValue: 0,
      violationValue: 0,
      violationRepayment: 0,
      incentives: 0
    };

    const remainingAdvance = Math.max(0, (data.advance || 0) - (data.advanceRepayment || 0));
    const absenceValue = data.absenceValue || 0;
    const remainingViolations = Math.max(0, (data.violationValue || 0) - (data.violationRepayment || 0));
    
    // Net Salary = Basic + Incentives - Advance Repayment - Absence Value - Violation Repayment
    const netSalary = Math.max(0, (data.basicSalary || 0) + (data.incentives || 0) - (data.advanceRepayment || 0) - absenceValue - (data.violationRepayment || 0));

    return {
      ...data,
      remainingAdvance,
      absenceValue,
      remainingViolations,
      netSalary
    };
  };

  const totals = useMemo(() => {
    return workers.reduce((acc, w) => {
      const row = calculateRow(w.id);
      return {
        basicSalary: acc.basicSalary + row.basicSalary,
        netSalary: acc.netSalary + row.netSalary,
        advances: acc.advances + row.advance,
        violations: acc.violations + row.violationValue
      };
    }, { basicSalary: 0, netSalary: 0, advances: 0, violations: 0 });
  }, [workers, salaryData]);

  return (
    <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden print:border-2 print:border-gray-800">
        <div className="px-8 py-6 border-b border-gray-100 flex items-center justify-between bg-teal-50 print:bg-white print:border-b-2 print:border-teal-800">
            <h2 className="text-xl font-bold text-teal-700 flex items-center gap-2 print:text-black">
                <Wallet className="w-6 h-6" />
                تقرير الرواتب الشهرية
            </h2>
            <div className="flex gap-4">
                 <div className="bg-white/60 px-4 py-2 rounded-lg border border-teal-100 print:hidden">
                    <div className="text-xs text-teal-800 font-bold mb-1">إجمالي الرواتب الأساسية</div>
                    <div className="text-lg font-black text-teal-900">{formatCurrency(totals.basicSalary)}</div>
                 </div>
                 <div className="bg-teal-100/80 px-4 py-2 rounded-lg border border-teal-200 print:bg-white print:border-teal-800">
                    <div className="text-xs text-teal-800 font-bold mb-1 print:text-black">صافي الرواتب المستحقة</div>
                    <div className="text-lg font-black text-teal-900 print:text-black">{formatCurrency(totals.netSalary)}</div>
                 </div>
            </div>
        </div>

        <div className="overflow-x-auto">
            <table className="w-full text-right border-separate border-spacing-0">
                <thead className="bg-gray-100 print:bg-gray-100">
                    <tr>
                        <th className="px-4 py-4 text-xs font-bold text-gray-800 border-b border-gray-300 print:border-gray-400 first:rounded-tr-lg print:whitespace-normal print:py-2 print:px-2">الكود</th>
                        <th className="px-4 py-4 text-xs font-bold text-gray-800 border-b border-gray-300 print:border-gray-400 print:whitespace-normal print:py-2 print:px-2">الموظف</th>
                        <th className="px-4 py-4 text-xs font-bold text-gray-800 border-b border-gray-300 print:border-gray-400 print:whitespace-normal print:py-2 print:px-2">الراتب الاساسي</th>
                        
                        {/* Advances */}
                        <th className="px-4 py-4 text-xs font-bold text-gray-800 border-b border-gray-300 print:border-gray-400 bg-amber-50/50 print:bg-transparent">السلفه</th>
                        <th className="px-4 py-4 text-xs font-bold text-gray-800 border-b border-gray-300 print:border-gray-400 bg-amber-50/50 print:bg-transparent">سداد سلفه</th>
                        <th className="px-4 py-4 text-xs font-bold text-gray-800 border-b border-gray-300 print:border-gray-400 bg-amber-50/50 print:bg-transparent">باقي السلفه</th>

                        {/* Absence */}
                        <th className="px-4 py-4 text-xs font-bold text-gray-800 border-b border-gray-300 print:border-gray-400 bg-rose-50/50 print:bg-transparent">أيام غياب</th>
                        <th className="px-4 py-4 text-xs font-bold text-gray-800 border-b border-gray-300 print:border-gray-400 bg-rose-50/50 print:bg-transparent">قيمة الغياب</th>

                        {/* Violations */}
                        <th className="px-4 py-4 text-xs font-bold text-gray-800 border-b border-gray-300 print:border-gray-400 bg-red-50/50 print:bg-transparent">قيمة مخالفات</th>
                        <th className="px-4 py-4 text-xs font-bold text-gray-800 border-b border-gray-300 print:border-gray-400 bg-red-50/50 print:bg-transparent">سداد مخالفات</th>
                        <th className="px-4 py-4 text-xs font-bold text-gray-800 border-b border-gray-300 print:border-gray-400 bg-red-50/50 print:bg-transparent">متبقي مخالفات</th>

                        <th className="px-4 py-4 text-xs font-bold text-gray-800 border-b border-gray-300 print:border-gray-400 bg-emerald-50/50 print:bg-transparent">حوافز</th>
                        <th className="px-4 py-4 text-xs font-bold text-white bg-teal-600 border-b border-teal-700 print:border-gray-400 print:bg-gray-200 print:text-black first:rounded-tr-lg last:rounded-tl-lg">صافي الراتب</th>
                    </tr>
                </thead>
                <tbody className="divide-y divide-gray-100 bg-white">
                    {workers.length === 0 ? (
                        <tr>
                            <td colSpan={13} className="px-6 py-12 text-center text-gray-500">
                                <div className="flex flex-col items-center justify-center gap-3">
                                    <AlertCircle className="w-8 h-8 text-gray-300" />
                                    <p>لا توجد بيانات للعرض</p>
                                </div>
                            </td>
                        </tr>
                    ) : (
                        workers.map((worker, idx) => {
                            const row = calculateRow(worker.id);
                            return (
                                <tr key={worker.id} className={`hover:bg-gray-50/80 transition-colors group ${idx % 2 === 0 ? 'bg-white' : 'bg-gray-50/30 print:bg-gray-50/50'}`}>
                                    <td className="px-4 py-3 font-mono text-xs text-gray-600 border-b border-gray-50 print:border-gray-200">
                                        {worker.code || '-'}
                                    </td>
                                    <td className="px-4 py-3 font-bold text-gray-900 text-xs border-b border-gray-50 print:border-gray-200">
                                        <div className="flex flex-col">
                                            <span>{worker.name}</span>
                                            {worker.englishName && <span className="text-[10px] text-black font-normal">{worker.englishName}</span>}
                                            <span className="text-[10px] text-gray-400 font-normal mt-0.5">{worker.skill}</span>
                                        </div>
                                    </td>
                                    <td className="px-4 py-3 text-gray-700 font-mono text-xs border-b border-gray-50 print:border-gray-200">{row.basicSalary > 0 ? formatCurrency(row.basicSalary) : '-'}</td>
                                    
                                    <td className="px-4 py-3 text-gray-700 font-mono text-xs border-b border-gray-50 print:border-gray-200 bg-amber-50/20 print:bg-transparent">{row.advance > 0 ? formatCurrency(row.advance) : '-'}</td>
                                    <td className="px-4 py-3 text-gray-700 font-mono text-xs border-b border-gray-50 print:border-gray-200 bg-amber-50/20 print:bg-transparent">{row.advanceRepayment > 0 ? formatCurrency(row.advanceRepayment) : '-'}</td>
                                    <td className="px-4 py-3 font-bold text-amber-700 font-mono text-xs border-b border-gray-50 print:border-gray-200 bg-amber-50/20 print:bg-transparent">{row.remainingAdvance > 0 ? formatCurrency(row.remainingAdvance) : '-'}</td>

                                    <td className="px-4 py-3 text-gray-700 font-mono text-xs border-b border-gray-50 print:border-gray-200 bg-rose-50/20 print:bg-transparent">{row.absenceDays > 0 ? row.absenceDays : '-'}</td>
                                    <td className="px-4 py-3 font-bold text-rose-700 font-mono text-xs border-b border-gray-50 print:border-gray-200 bg-rose-50/20 print:bg-transparent">{row.absenceValue > 0 ? formatCurrency(row.absenceValue) : '-'}</td>

                                    <td className="px-4 py-3 text-gray-700 font-mono text-xs border-b border-gray-50 print:border-gray-200 bg-red-50/20 print:bg-transparent">{row.violationValue > 0 ? formatCurrency(row.violationValue) : '-'}</td>
                                    <td className="px-4 py-3 text-gray-700 font-mono text-xs border-b border-gray-50 print:border-gray-200 bg-red-50/20 print:bg-transparent">{row.violationRepayment > 0 ? formatCurrency(row.violationRepayment) : '-'}</td>
                                    <td className="px-4 py-3 font-bold text-red-700 font-mono text-xs border-b border-gray-50 print:border-gray-200 bg-red-50/20 print:bg-transparent">{row.remainingViolations > 0 ? formatCurrency(row.remainingViolations) : '-'}</td>

                                    <td className="px-4 py-3 text-emerald-700 font-bold font-mono text-xs border-b border-gray-50 print:border-gray-200 bg-emerald-50/20 print:bg-transparent">{row.incentives > 0 ? formatCurrency(row.incentives) : '-'}</td>
                                    <td className="px-4 py-3 font-black text-teal-800 bg-teal-50 font-mono text-xs border-b border-teal-100 print:border-gray-200 print:bg-gray-100 print:text-black">{formatCurrency(row.netSalary)}</td>
                                </tr>
                            );
                        })
                    )}
                </tbody>
                <tfoot className="bg-gray-50 font-bold print:bg-white border-t-2 border-gray-200">
                    <tr>
                        <td className="px-4 py-4 text-gray-900">الإجمالي</td>
                        <td className="px-4 py-4 text-blue-700 font-mono text-xs">{formatCurrency(totals.basicSalary)}</td>
                        <td colSpan={3} className="px-4 py-4 text-center text-amber-700 font-mono text-xs bg-amber-50/30 print:bg-transparent">{formatCurrency(totals.advances)} (سلف)</td>
                        <td colSpan={2} className="px-4 py-4 text-center text-rose-700 font-mono text-xs bg-rose-50/30 print:bg-transparent">-</td>
                        <td colSpan={3} className="px-4 py-4 text-center text-red-700 font-mono text-xs bg-red-50/30 print:bg-transparent">{formatCurrency(totals.violations)} (مخالفات)</td>
                        <td className="px-4 py-4 text-emerald-700 font-mono text-xs bg-emerald-50/30 print:bg-transparent">-</td>
                        <td className="px-4 py-4 text-teal-800 bg-teal-100 font-black font-mono text-xs print:bg-gray-200 print:text-black">{formatCurrency(totals.netSalary)}</td>
                    </tr>
                </tfoot>
            </table>
        </div>
    </div>
  );
}
