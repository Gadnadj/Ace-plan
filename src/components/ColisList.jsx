import { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { he } from '../i18n/he';
import ModifyModal from './ModifyModal';
import DeleteColisModal from './DeleteColisModal';

function estRechercheCode(recherche) {
  const terme = String(recherche || '').trim().replace(/\s+/g, '');
  return /^\d+$/.test(terme);
}

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

function ColisCard({
  colis,
  onModifier,
  onSupprimer,
  showCategorie,
  departementNom,
}) {
  const { isGestion } = useAuth();
  const [modalModifier, setModalModifier] = useState(false);
  const [modalSupprimer, setModalSupprimer] = useState(false);

  return (
    <>
      <div className='card-3d relative overflow-hidden rounded-xl border border-red-100 bg-white p-4'>
        <span className='absolute inset-y-0 right-0 w-1.5 bg-gradient-to-b from-red-400 to-red-600' />
        <div className='flex items-start justify-between gap-3'>
          <div className='min-w-0 flex-1 text-start'>
            <p className='text-2xl font-bold tracking-wider text-slate-900'>
              <span dir='ltr'>{colis.code}</span>
            </p>

            <div className='mt-1.5'>
              <p className='text-lg font-semibold text-red-700'>
                <span dir='ltr'>{colis.emplacement}</span>
              </p>
            </div>

            <p className='mt-1.5 text-sm text-slate-500'>
              {he.updatedAt}
              {formaterDate(colis.updatedAt || colis.dateModification)}
            </p>

            {showCategorie && (
              <p className='mt-1 text-sm text-slate-500'>
                {he.category}:{' '}
                <span className='font-semibold text-slate-700'>
                  {colis.categorieNom || departementNom}
                </span>
              </p>
            )}
          </div>

          {isGestion && (
            <div className='flex shrink-0 flex-col gap-2.5'>
              <button
                type='button'
                onClick={() => setModalModifier(true)}
                className='button-3d rounded-lg bg-gradient-to-b from-red-600 to-red-700 px-4 py-2.5 text-sm font-semibold text-white active:from-red-700 active:to-red-800'
              >
                {he.edit}
              </button>
              <button
                type='button'
                onClick={() => setModalSupprimer(true)}
                className='button-3d rounded-lg border border-red-200 bg-red-50 px-4 py-2.5 text-sm font-semibold text-red-700 active:bg-red-100'
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
  departementNom,
}) {
  const showCategorie = estRechercheCode(recherche);

  if (colis.length === 0) {
    return (
      <div className='rounded-xl border border-dashed border-red-200 bg-red-50/40 px-4 py-14 text-center'>
        <p className='text-6xl'>📭</p>
        <p className='mt-4 text-lg font-semibold text-slate-600'>
          {recherche ? he.noPackagesFor(recherche) : he.noPackages}
        </p>
      </div>
    );
  }

  return (
    <div className='flex flex-col gap-3 px-1 pb-8'>
      <p className='px-3 text-sm font-medium text-slate-500'>{he.packagesShown(colis.length)}</p>
      {colis.map((c) => (
        <ColisCard
          key={c.id}
          colis={c}
          onModifier={onModifier}
          onSupprimer={onSupprimer}
          showCategorie={showCategorie}
          departementNom={departementNom}
        />
      ))}
    </div>
  );
}
