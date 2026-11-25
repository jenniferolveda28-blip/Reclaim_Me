import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ALL_PAGE_GROUPS, ALL_PAGE_COUNT } from '@/lib/allPagesMenuData';
import { LayoutGrid, Search, ChevronDown } from 'lucide-react';

export default function SharedAllPagesMenu() {
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState('');

  const q = query.trim().toLowerCase();
  const groups = q
    ? ALL_PAGE_GROUPS.map((group) => ({
        ...group,
        items: group.items.filter((item) => item.label.toLowerCase().includes(q)),
      })).filter((group) => group.items.length > 0)
    : ALL_PAGE_GROUPS;

  return (
    <Popover
      open={open}
      onOpenChange={(next) => {
        setOpen(next);
        if (!next) setQuery('');
      }}
    >
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          className="w-full sm:w-auto justify-between sm:justify-start gap-2 border-cyan-500/40 text-cyan-200 bg-slate-900/80 hover:bg-cyan-500/10 hover:text-cyan-100"
        >
          <LayoutGrid className="w-4 h-4" />
          <span className="font-semibold">All Pages</span>
          <Badge variant="outline" className="border-cyan-500/40 text-cyan-300 bg-cyan-500/10 text-[10px] px-1.5">
            {ALL_PAGE_COUNT}
          </Badge>
          <ChevronDown className="w-4 h-4 opacity-70" />
        </Button>
      </PopoverTrigger>

      <PopoverContent
        align="start"
        className="w-[calc(100vw-2rem)] sm:w-[420px] p-0 bg-slate-900 border-slate-700 shadow-2xl"
      >
        <div className="p-3 border-b border-slate-800">
          <div className="relative">
            <Search className="w-4 h-4 text-slate-500 absolute left-3 top-1/2 -translate-y-1/2" />
            <Input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search all pages…"
              autoFocus
              className="pl-9 bg-slate-950 border-slate-700 text-slate-100 placeholder:text-slate-500"
            />
          </div>
        </div>

        <div className="max-h-[60vh] overflow-y-auto p-2">
          {groups.length === 0 && (
            <p className="text-slate-400 text-sm p-4 text-center">
              No page matches “{query}”.
            </p>
          )}

          {groups.map((group) => (
            <div key={group.label} className="mb-2">
              <p className="px-2 py-1.5 text-[11px] font-semibold uppercase tracking-wide text-slate-500">
                {group.label}
              </p>
              {group.items.map((item) => (
                <Link
                  key={`${group.label}-${item.to}`}
                  to={item.to}
                  onClick={() => setOpen(false)}
                  className="block px-2.5 py-2 rounded-md text-sm text-slate-300 hover:bg-cyan-500/10 hover:text-cyan-200 transition-colors truncate"
                >
                  {item.label}
                </Link>
              ))}
            </div>
          ))}
        </div>
      </PopoverContent>
    </Popover>
  );
}