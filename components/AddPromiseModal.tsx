
import React, { useState, useEffect } from 'react';
import { X, Calendar, User, MessageCircle, AlertCircle } from 'lucide-react';
import { PromiseEntry, PromiseStatus } from '../types';

interface AddPromiseModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (promise: Omit<PromiseEntry, 'id' | 'createdAt'> & { id?: string }) => void;
  editingPromise?: PromiseEntry | null;
}

const AddPromiseModal: React.FC<AddPromiseModalProps> = ({ isOpen, onClose, onSave, editingPromise }) => {
  const [personName, setPersonName] = useState('');
  const [description, setDescription] = useState('');
  const [dateMade, setDateMade] = useState(new Date().toISOString().split('T')[0]);
  const [followUpDate, setFollowUpDate] = useState('');
  const [notes, setNotes] = useState('');
  const [status, setStatus] = useState<PromiseStatus>(PromiseStatus.PENDING);
  const [remindMe, setRemindMe] = useState(false);

  useEffect(() => {
    if (editingPromise) {
      setPersonName(editingPromise.personName);
      setDescription(editingPromise.description);
      setDateMade(new Date(editingPromise.dateMade).toISOString().split('T')[0]);
      setFollowUpDate(new Date(editingPromise.followUpDate).toISOString().split('T')[0]);
      setNotes(editingPromise.notes || '');
      setStatus(editingPromise.status);
      setRemindMe(editingPromise.remindMe);
    } else {
      setPersonName('');
      setDescription('');
      setDateMade(new Date().toISOString().split('T')[0]);
      setFollowUpDate('');
      setNotes('');
      setStatus(PromiseStatus.PENDING);
      setRemindMe(false);
    }
  }, [editingPromise, isOpen]);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!personName || !description || !followUpDate) return;

    onSave({
      id: editingPromise?.id,
      personName,
      description,
      dateMade,
      followUpDate,
      notes,
      status,
      remindMe,
    });
    onClose();
  };

  return (
    <div className="fixed inset-0 z-[60] flex items-end sm:items-center justify-center bg-black/40 backdrop-blur-sm px-0 sm:px-4">
      <div className="bg-white dark:bg-neutral-900 w-full max-w-lg sm:rounded-3xl h-[92vh] sm:h-auto overflow-hidden flex flex-col shadow-2xl transition-transform transform translate-y-0">
        <div className="flex items-center justify-between p-5 border-b border-gray-100 dark:border-neutral-800">
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600 dark:hover:text-white transition-colors">
            <X className="w-6 h-6" />
          </button>
          <h2 className="text-lg font-semibold">{editingPromise ? 'Edit Promise' : 'New Promise'}</h2>
          <button 
            type="submit" 
            form="promise-form"
            className="text-blue-500 font-bold hover:text-blue-600 active:opacity-70 transition-all"
          >
            Done
          </button>
        </div>

        <form id="promise-form" onSubmit={handleSubmit} className="flex-1 overflow-y-auto p-6 space-y-8 scrollbar-hide">
          <div className="space-y-6">
            <div className="space-y-2">
              <label className="text-xs font-bold text-gray-400 dark:text-neutral-500 uppercase px-1">Person</label>
              <div className="relative">
                <User className="absolute left-4 top-3.5 w-5 h-5 text-gray-300 pointer-events-none" />
                <input
                  autoFocus
                  required
                  type="text"
                  placeholder="Who made the promise?"
                  value={personName}
                  onChange={(e) => setPersonName(e.target.value)}
                  className="w-full pl-12 pr-4 py-3.5 bg-gray-50 dark:bg-neutral-800 rounded-2xl border-transparent focus:border-blue-500 focus:bg-white dark:focus:bg-neutral-800 transition-all outline-none"
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-xs font-bold text-gray-400 dark:text-neutral-500 uppercase px-1">Commitment</label>
              <div className="relative">
                <MessageCircle className="absolute left-4 top-4 w-5 h-5 text-gray-300 pointer-events-none" />
                <textarea
                  required
                  rows={3}
                  placeholder="What did they promise to do?"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  className="w-full pl-12 pr-4 py-3.5 bg-gray-50 dark:bg-neutral-800 rounded-2xl border-transparent focus:border-blue-500 focus:bg-white dark:focus:bg-neutral-800 transition-all outline-none resize-none"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="text-xs font-bold text-gray-400 dark:text-neutral-500 uppercase px-1">Date Made</label>
                <div className="relative">
                  <Calendar className="absolute left-4 top-3.5 w-5 h-5 text-gray-300 pointer-events-none" />
                  <input
                    required
                    type="date"
                    value={dateMade}
                    onChange={(e) => setDateMade(e.target.value)}
                    className="w-full pl-12 pr-4 py-3.5 bg-gray-50 dark:bg-neutral-800 rounded-2xl border-transparent focus:border-blue-500 transition-all outline-none"
                  />
                </div>
              </div>
              <div className="space-y-2">
                <label className="text-xs font-bold text-gray-400 dark:text-neutral-500 uppercase px-1">Follow up</label>
                <div className="relative">
                  <Calendar className="absolute left-4 top-3.5 w-5 h-5 text-gray-300 pointer-events-none" />
                  <input
                    required
                    type="date"
                    value={followUpDate}
                    onChange={(e) => setFollowUpDate(e.target.value)}
                    className="w-full pl-12 pr-4 py-3.5 bg-gray-50 dark:bg-neutral-800 rounded-2xl border-transparent focus:border-blue-500 transition-all outline-none"
                  />
                </div>
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-xs font-bold text-gray-400 dark:text-neutral-500 uppercase px-1">Outcome</label>
              <div className="grid grid-cols-2 gap-2">
                {Object.values(PromiseStatus).map((s) => (
                  <button
                    key={s}
                    type="button"
                    onClick={() => setStatus(s)}
                    className={`py-3 px-4 rounded-xl text-sm font-medium transition-all border-2 ${
                      status === s 
                        ? 'bg-blue-50 dark:bg-blue-900/20 border-blue-500 text-blue-600 dark:text-blue-400' 
                        : 'bg-gray-50 dark:bg-neutral-800 border-transparent text-gray-500 dark:text-neutral-400 hover:bg-gray-100'
                    }`}
                  >
                    {s}
                  </button>
                ))}
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-xs font-bold text-gray-400 dark:text-neutral-500 uppercase px-1">Notes (Optional)</label>
              <textarea
                rows={2}
                placeholder="Any context or thoughts..."
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                className="w-full px-4 py-3.5 bg-gray-50 dark:bg-neutral-800 rounded-2xl border-transparent focus:border-blue-500 outline-none resize-none"
              />
            </div>

            <div className="flex items-center justify-between p-4 bg-gray-50 dark:bg-neutral-800 rounded-2xl">
              <div className="flex items-center space-x-3">
                <AlertCircle className="w-5 h-5 text-gray-400" />
                <span className="font-medium text-sm">Remind me to follow up</span>
              </div>
              <button
                type="button"
                onClick={() => setRemindMe(!remindMe)}
                className={`w-12 h-6 rounded-full transition-colors relative ${remindMe ? 'bg-blue-500' : 'bg-gray-300 dark:bg-neutral-700'}`}
              >
                <div className={`absolute top-1 left-1 w-4 h-4 bg-white rounded-full transition-transform ${remindMe ? 'translate-x-6' : 'translate-x-0'}`} />
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddPromiseModal;
