import React, { useState, useMemo, useCallback } from 'react';
import { Plus, Search, AlertTriangle, Heart, List, Info } from 'lucide-react';
import { useLocalStorage } from './hooks/useLocalStorage';
import { PromiseEntry, PromiseStatus, FilterState } from './types';
import PromiseCard from './components/PromiseCard';
import AddPromiseModal from './components/AddPromiseModal';
import Onboarding from './components/Onboarding';
import SettingsModal from './components/SettingsModal';

const App: React.FC = () => {
  const [promises, setPromises, clearPromises] = useLocalStorage<PromiseEntry[]>('promises', []);
  const [hasOnboarded, setHasOnboarded] = useLocalStorage<boolean>('hasOnboarded', false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingPromise, setEditingPromise] = useState<PromiseEntry | null>(null);
  const [showSettings, setShowSettings] = useState(false);
  const [notification, setNotification] = useState<{ message: string; type: 'success' | 'error' } | null>(null);
  
  const [filter, setFilter] = useState<FilterState>({
    search: '',
    status: 'All',
    person: 'All'
  });

  const uniquePeople = useMemo(() => {
    const people = Array.from(new Set(promises.map(p => p.personName)));
    return ['All', ...people.sort()];
  }, [promises]);

  const filteredPromises = useMemo(() => {
    return promises
      .filter(p => {
        const matchesSearch = p.personName.toLowerCase().includes(filter.search.toLowerCase()) || 
                             p.description.toLowerCase().includes(filter.search.toLowerCase());
        const matchesStatus = filter.status === 'All' || p.status === filter.status;
        const matchesPerson = filter.person === 'All' || p.personName === filter.person;
        return matchesSearch && matchesStatus && matchesPerson;
      })
      .sort((a, b) => new Date(a.followUpDate).getTime() - new Date(b.followUpDate).getTime());
  }, [promises, filter]);

  const overduCount = useMemo(() => {
    const now = new Date();
    return promises.filter(p => 
      p.status === PromiseStatus.PENDING && new Date(p.followUpDate) < now
    ).length;
  }, [promises]);

  const handleSavePromise = useCallback((data: Omit<PromiseEntry, 'id' | 'createdAt'> & { id?: string }) => {
    try {
      if (data.id) {
        setPromises(promises.map(p => p.id === data.id ? { 
          ...p, 
          ...data, 
          id: data.id as string, 
          createdAt: p.createdAt 
        } : p));
        setNotification({ message: 'Promise updated successfully', type: 'success' });
      } else {
        const newPromise: PromiseEntry = {
          ...data,
          id: crypto.randomUUID(),
          createdAt: new Date().toISOString()
        };
        setPromises([...promises, newPromise]);
        setNotification({ message: 'Promise added successfully', type: 'success' });
      }
      setEditingPromise(null);
      setIsModalOpen(false);
    } catch (error) {
      console.error('Error saving promise:', error);
      setNotification({ message: 'Failed to save promise', type: 'error' });
    }
  }, [promises, setPromises]);

  const handleDeletePromise = useCallback((id: string) => {
    try {
      setPromises(promises.filter(p => p.id !== id));
      setNotification({ message: 'Promise deleted', type: 'success' });
    } catch (error) {
      console.error('Error deleting promise:', error);
      setNotification({ message: 'Failed to delete promise', type: 'error' });
    }
  }, [promises, setPromises]);

  const handleEditClick = useCallback((promise: PromiseEntry) => {
    setEditingPromise(promise);
    setIsModalOpen(true);
  }, []);

  const handleCloseModal = useCallback(() => {
    setIsModalOpen(false);
    setEditingPromise(null);
  }, []);

  if (!hasOnboarded) {
    return <Onboarding onComplete={() => setHasOnboarded(true)} />;
  }

  return (
    <div className="min-h-screen pb-32 bg-gray-50 dark:bg-black overflow-x-hidden">
      {notification && (
        <div className={`fixed top-4 left-1/2 -translate-x-1/2 z-[70] px-4 py-3 rounded-lg text-sm font-medium transition-all ${
          notification.type === 'success' 
            ? 'bg-emerald-500 text-white' 
            : 'bg-rose-500 text-white'
        }`}>
          {notification.message}
        </div>
      )}

      <header className="sticky top-0 z-40 bg-gray-50/80 dark:bg-black/80 backdrop-blur-md px-6 pt-12 pb-6 flex flex-col space-y-4">
        <div className="flex justify-between items-end">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Promises</h1>
            {overduCount > 0 && (
              <p className="text-xs text-rose-500 font-semibold mt-1 flex items-center space-x-1">
                <AlertTriangle className="w-3 h-3" />
                <span>{overduCount} overdue</span>
              </p>
            )}
          </div>
          <button 
            onClick={() => { setEditingPromise(null); setIsModalOpen(true); }}
            className="p-2.5 bg-blue-500 text-white rounded-full shadow-lg shadow-blue-500/20 active:scale-90 transition-transform hover:bg-blue-600"
            aria-label="Add new promise"
          >
            <Plus className="w-6 h-6" />
          </button>
        </div>

        <div className="space-y-3">
          <div className="relative">
            <Search className="absolute left-3.5 top-2.5 w-4 h-4 text-gray-400 pointer-events-none" />
            <input 
              type="text" 
              placeholder="Search people or promises..."
              value={filter.search}
              onChange={(e) => setFilter({ ...filter, search: e.target.value })}
              className="w-full bg-white dark:bg-neutral-900 border-none rounded-xl pl-10 pr-4 py-2.5 text-sm shadow-sm focus:ring-2 focus:ring-blue-500 outline-none transition-all"
              aria-label="Search promises"
            />
          </div>

          <div className="flex space-x-2 overflow-x-auto scrollbar-hide pb-1">
            {['All', ...Object.values(PromiseStatus)].map(s => (
              <button
                key={s}
                onClick={() => setFilter({ ...filter, status: s as any })}
                className={`px-4 py-1.5 rounded-full text-xs font-semibold whitespace-nowrap transition-all border ${
                  filter.status === s 
                    ? 'bg-black text-white dark:bg-white dark:text-black border-transparent' 
                    : 'bg-white dark:bg-neutral-900 text-gray-500 dark:text-neutral-400 border-gray-100 dark:border-neutral-800'
                }`}
                aria-pressed={filter.status === s}
              >
                {s}
              </button>
            ))}
          </div>

          {uniquePeople.length > 2 && (
            <div className="flex space-x-2 overflow-x-auto scrollbar-hide pb-1">
              {uniquePeople.map(person => (
                <button
                  key={person}
                  onClick={() => setFilter({ ...filter, person })}
                  className={`px-3 py-1 rounded-full text-xs whitespace-nowrap transition-all ${
                    filter.person === person
                      ? 'bg-gray-800 dark:bg-gray-200 text-white dark:text-black'
                      : 'bg-gray-100 dark:bg-neutral-800 text-gray-600 dark:text-neutral-400'
                  }`}
                  aria-pressed={filter.person === person}
                >
                  {person}
                </button>
              ))}
            </div>
          )}
        </div>
      </header>

      <main className="px-6 mt-4">
        {filteredPromises.length > 0 ? (
          <div className="space-y-4">
            {filteredPromises.map((promise) => (
              <PromiseCard 
                key={promise.id} 
                promise={promise} 
                onEdit={handleEditClick}
                onDelete={handleDeletePromise}
              />
            ))}
          </div>
        ) : (
          <div className="py-24 text-center space-y-4">
            <div className="inline-flex items-center justify-center w-20 h-20 bg-gray-100 dark:bg-neutral-900 rounded-3xl mb-4">
              <Heart className="w-10 h-10 text-gray-300 dark:text-neutral-800" />
            </div>
            <h3 className="text-xl font-semibold text-gray-400">Clear Mind</h3>
            <p className="text-gray-500 max-w-xs mx-auto text-sm">
              {filter.search || filter.status !== 'All' || filter.person !== 'All'
                ? "No promises match your current filters." 
                : "No promises recorded yet. Tap the + icon to record a new commitment someone made to you."}
            </p>
          </div>
        )}
      </main>

      <div className="fixed bottom-6 left-1/2 -translate-x-1/2 w-[90%] max-w-sm z-50">
        <nav className="bg-white/90 dark:bg-neutral-900/90 ios-blur p-2 rounded-2xl border border-gray-100 dark:border-neutral-800 shadow-xl flex items-center justify-around">
          <button 
            className="flex flex-col items-center p-2 text-blue-500"
            aria-label="Journal view (current)"
            aria-current="page"
          >
            <List className="w-6 h-6" />
            <span className="text-[10px] font-bold mt-1 uppercase tracking-tighter">Journal</span>
          </button>
          <button 
            className="flex flex-col items-center p-2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors"
            onClick={() => setShowSettings(true)}
            aria-label="Settings and information"
          >
            <Info className="w-6 h-6" />
            <span className="text-[10px] font-bold mt-1 uppercase tracking-tighter">About</span>
          </button>
        </nav>
      </div>

      <AddPromiseModal 
        isOpen={isModalOpen} 
        onClose={handleCloseModal}
        onSave={handleSavePromise}
        editingPromise={editingPromise}
      />

      <SettingsModal 
        isOpen={showSettings}
        onClose={() => setShowSettings(false)}
        onClearData={() => {
          if (window.confirm('Are you sure? This will delete all promises. This cannot be undone.')) {
            clearPromises();
            setShowSettings(false);
            setNotification({ message: 'All data cleared', type: 'success' });
          }
        }}
        promiseCount={promises.length}
      />
    </div>
  );
};

export default App;