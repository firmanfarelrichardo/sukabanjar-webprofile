'use client';

import React from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';

export interface PaginationProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
  totalItems: number;
  itemsPerPage: number;
  itemName?: string;
  className?: string;
}

export default function Pagination({
  currentPage,
  totalPages,
  onPageChange,
  totalItems,
  itemsPerPage,
  itemName = 'data',
  className = '',
}: PaginationProps) {
  // Hanya tampil jika totalItems melebihi threshold (itemsPerPage) dan totalPages > 1
  if (totalItems <= itemsPerPage || totalPages <= 1) {
    return null;
  }

  const startItem = (currentPage - 1) * itemsPerPage + 1;
  const endItem = Math.min(currentPage * itemsPerPage, totalItems);

  // Generate array nomor halaman yang fleksibel (misal: 1, 2, 3, 4, ...)
  const getPageNumbers = () => {
    const pages: (number | string)[] = [];
    const maxVisiblePages = 5;

    if (totalPages <= maxVisiblePages) {
      for (let i = 1; i <= totalPages; i++) {
        pages.push(i);
      }
    } else {
      pages.push(1);

      let start = Math.max(2, currentPage - 1);
      let end = Math.min(totalPages - 1, currentPage + 1);

      if (currentPage <= 3) {
        end = 4;
      } else if (currentPage >= totalPages - 2) {
        start = totalPages - 3;
      }

      if (start > 2) {
        pages.push('...');
      }

      for (let i = start; i <= end; i++) {
        pages.push(i);
      }

      if (end < totalPages - 1) {
        pages.push('...');
      }

      pages.push(totalPages);
    }

    return pages;
  };

  const handlePageClick = (page: number) => {
    if (page >= 1 && page <= totalPages && page !== currentPage) {
      onPageChange(page);
    }
  };

  return (
    <div
      className={`flex flex-col sm:flex-row items-center justify-between gap-4 pt-6 border-t border-slate-200/80 ${className}`.trim()}
    >
      {/* Ringkasan Jumlah Data */}
      <div className="text-xs text-slate-500 font-medium">
        Menampilkan <span className="font-extrabold text-slate-800">{startItem}</span> -{' '}
        <span className="font-extrabold text-slate-800">{endItem}</span> dari{' '}
        <span className="font-extrabold text-slate-800">{totalItems}</span> {itemName}
      </div>

      {/* Navigasi Tombol Halaman */}
      <div className="flex items-center gap-1.5 select-none">
        {/* Tombol Sebelumnya */}
        <button
          onClick={() => handlePageClick(currentPage - 1)}
          disabled={currentPage === 1}
          className="inline-flex items-center gap-1 px-3 py-1.5 rounded-xl border border-slate-200 bg-white text-xs font-bold text-slate-700 hover:bg-slate-50 hover:border-slate-300 disabled:opacity-40 disabled:pointer-events-none transition-all shadow-sm cursor-pointer"
          aria-label="Halaman Sebelumnya"
        >
          <ChevronLeft size={15} />
          <span className="hidden xs:inline">Sebelumnya</span>
        </button>

        {/* Nomor-nomor Halaman */}
        <div className="flex items-center gap-1">
          {getPageNumbers().map((page, idx) => {
            if (typeof page === 'string') {
              return (
                <span
                  key={`ellipsis-${idx}`}
                  className="px-2 py-1.5 text-xs font-bold text-slate-400 select-none"
                >
                  ...
                </span>
              );
            }

            const isActive = page === currentPage;
            return (
              <button
                key={page}
                onClick={() => handlePageClick(page)}
                className={`min-w-[34px] h-[34px] px-2.5 rounded-xl text-xs font-extrabold transition-all cursor-pointer ${
                  isActive
                    ? 'bg-[#0086C9] text-white shadow-md shadow-[#0086C9]/20 scale-105'
                    : 'bg-white border border-slate-200 text-slate-700 hover:bg-slate-50 hover:border-slate-300'
                }`}
                aria-label={`Halaman ${page}`}
                aria-current={isActive ? 'page' : undefined}
              >
                {page}
              </button>
            );
          })}
        </div>

        {/* Tombol Selanjutnya */}
        <button
          onClick={() => handlePageClick(currentPage + 1)}
          disabled={currentPage === totalPages}
          className="inline-flex items-center gap-1 px-3 py-1.5 rounded-xl border border-slate-200 bg-white text-xs font-bold text-slate-700 hover:bg-slate-50 hover:border-slate-300 disabled:opacity-40 disabled:pointer-events-none transition-all shadow-sm cursor-pointer"
          aria-label="Halaman Selanjutnya"
        >
          <span className="hidden xs:inline">Selanjutnya</span>
          <ChevronRight size={15} />
        </button>
      </div>
    </div>
  );
}
