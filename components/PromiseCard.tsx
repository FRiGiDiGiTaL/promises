
import React from 'react';
import { Clock, CheckCircle2, XCircle, HelpCircle, Edit3, Trash2 } from 'lucide-react';
import { PromiseEntry, PromiseStatus } from '../types';

interface PromiseCardProps {
  promise: PromiseEntry;
  onEdit: (promise: PromiseEntry) => void;
  onDelete: (id: string) => void;
}

const statusIcons = {
  [PromiseStatus.PENDING]: <Clock className="w-4 h-4 text-amber-500" />,
  [PromiseStatus.FULFILLED]: <CheckCircle2 className="w-4 h-4 text-emerald-500" />,
  [PromiseStatus.BROKEN]: <XCircle className="w-4 h-4 text-rose-500" />,
  [PromiseStatus.UNCLEAR]: <HelpCircle className="w-4 h-4 text-gray-400" />,
};

const statusColors = {
  [PromiseStatus.PENDING]: 'bg-amber-50 text-amber-700 dark:bg-amber-900/20 dark:text-amber-400 border-amber-100 dark:border-amber-900/30',
  [PromiseStatus.FULFILLED]: 'bg-emerald-50 text-emerald-700 dark:bg-emerald-900/20 dark:text-emerald-400 border-emerald-100 dark:border-emerald-900/30',
  [PromiseStatus.BROKEN]: 'bg-rose-50 text-rose-700 dark:bg-rose-900/20 dark:text-rose-400 border-rose-100 dark:border-rose-900/30',
  [PromiseStatus.UNCLEAR]: 'bg-gray-50 text-gray-600 dark:bg-gray-800 dark:text-gray-400 border-gray-200 dark:border-gray-700',
};

const PromiseCard: React.FC<PromiseCardProps> = ({ promise, onEdit, onDelete }) => {
  const followUpDate = new Date(promise.followUpDate);
  const isOverdue = promise.status === PromiseStatus.PENDING && followUpDate < new Date();

  return (
    <div className="bg-white dark:bg-neutral-900 rounded-2xl p-5 border border-gray-100 dark:border-neutral-800 shadow-sm transition-all hover:shadow-md active:scale-[0.99]">
      <div className="flex justify-between items-start mb-3">
        <div>
          <h3 className="text-sm font-medium text-gray-400 dark:text-neutral-500 uppercase tracking-wider">
            {promise.personName}
          </h3>
          <p className="text-lg font-semibold mt-0.5 leading-snug">{promise.description}</p>
        </div>
        <div className={`flex items-center space-x-1.5 px-3 py-1 rounded-full border text-xs font-medium ${statusColors[promise.status]}`}>
          {statusIcons[promise.status]}
          <span>{promise.status}</span>
        </div>
      </div>

      {promise.notes && (
        <p className="text-sm text-gray-500 dark:text-neutral-400 line-clamp-2 mb-4 italic">
          "{promise.notes}"
        </p>
      )}

      <div className="flex items-center justify-between mt-4 pt-4 border-t border-gray-50 dark:border-neutral-800">
        <div className="flex flex-col">
          <span className="text-[10px] text-gray-400 dark:text-neutral-500 uppercase font-bold tracking-tight">
            Follow up
          </span>
          <span className={`text-sm ${isOverdue ? 'text-rose-500 font-semibold' : 'text-gray-600 dark:text-neutral-400'}`}>
            {followUpDate.toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' })}
          </span>
        </div>

        <div className="flex space-x-2">
          <button 
            onClick={() => onEdit(promise)}
            className="p-2.5 bg-gray-50 dark:bg-neutral-800 text-gray-500 dark:text-neutral-400 rounded-full hover:bg-gray-100 dark:hover:bg-neutral-700 transition-colors"
            aria-label="Edit promise"
          >
            <Edit3 className="w-4 h-4" />
          </button>
          <button 
            onClick={() => {
                if(confirm("Delete this promise? This cannot be undone.")) {
                    onDelete(promise.id);
                }
            }}
            className="p-2.5 bg-rose-50 dark:bg-rose-900/10 text-rose-400 dark:text-rose-500 rounded-full hover:bg-rose-100 dark:hover:bg-rose-900/20 transition-colors"
            aria-label="Delete promise"
          >
            <Trash2 className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default PromiseCard;
