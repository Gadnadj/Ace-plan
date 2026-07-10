import { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { he } from '../i18n/he';
import ModifyModal from './ModifyModal';
import DeleteColisModal from './DeleteColisModal';

function formaterDate(dateValue) {
  if (!dateValue) return he.notUpdated;
  const date = new Date(dateValue);
  if (isNaN(date.getTime())) return he.notUpdated;
  return date.toLocaleDateString('he-IL', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
}

function ColisCard({ colis, onModifier, onSupprimer }) {
  const { isGestion } = useAuth();
  const [modalModifier, setModalModifier] = useState(false);
  const [modalSupprimer, setModalSupprimer] = useState(false);

  return (
    <>
      <div className='rounded-2xl bg-white p-4 shadow-sm ring-1 ring-slate-200'>
        <div className='flex items-start justify-between gap-3'>
          <div className='min-w-0 flex-1 text-start'>
            <p className='text-2xl font-bold tracking-wider text-slate-800'>
              <span dir='ltr'>{colis.code}</span>
            </p>

            <div className='mt-2'>
              <p className='text-lg font-semibold text-blue-700'>
                <span dir='ltr'>{colis.emplacement}</span>
              </p>
            </div>

            <p className='mt-1 text-sm text-slate-400'>
              {he.updatedAt}
              {formaterDate(colis.updatedAt || colis.dateModification)}
            </p>
          </div>

          {isGestion && (
            <div className='flex shrink-0 flex-col gap-2'>
              <button
                type='button'
                onClick={() => setModalModifier(true)}
                className='rounded-xl bg-amber-500 px-5 py-3 text-sm font-semibold text-white shadow-sm active:bg-amber-600'
              >
                {he.edit}
              </button>
              <button
                type='button'
                onClick={() => setModalSupprimer(true)}
                className='rounded-xl bg-red-100 px-5 py-3 text-sm font-semibold text-red-700 active:bg-red-200'
              >
                {he.delete}
              </button>
            </div>
          )}
        </div>
      </div>

      {modalModifier && (
        <ModifyModal
          colis={colis}
          onClose={() => setModalModifier(false)}
          onSave={(nouvelEmplacement) => {
            onModifier(colis.id, nouvelEmplacement);
            setModalModifier(false);
          }}
        />
      )}

      {modalSupprimer && (
        <DeleteColisModal
          colis={colis}
          onClose={() => setModalSupprimer(false)}
          onConfirm={onSupprimer}
        />
      )}
    </>
  );
}

export default function ColisList({
  colis,
  onModifier,
  onSupprimer,
  recherche,
}) {
  if (colis.length === 0) {
    return (
      <div className='px-4 py-12 text-center'>
        <p className='text-5xl'>📭</p>
        <p className='mt-4 text-lg font-medium text-slate-600'>
          {recherche ? he.noPackagesFor(recherche) : he.noPackages}
        </p>
      </div>
    );
  }

  return (
    <div className='flex flex-col gap-3 px-4 pb-8'>
      <p className='text-sm text-slate-500'>{he.packagesShown(colis.length)}</p>
      {colis.map((c) => (
        <ColisCard
          key={c.id}
          colis={c}
          onModifier={onModifier}
          onSupprimer={onSupprimer}
        />
      ))}
    </div>
  );
}
