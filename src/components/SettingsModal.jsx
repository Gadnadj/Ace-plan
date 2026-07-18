import { useEffect, useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useZones } from '../context/ZonesContext';
import { useDepartements } from '../context/DepartementsContext';
import { he } from '../i18n/he';

export default function SettingsModal({ onClose }) {
  const { isGestion } = useAuth();
  const { zones, ajouterZone, supprimerZone } = useZones();
  const {
    departements,
    ajouterDepartement,
    renommerDepartement,
    supprimerDepartement,
  } = useDepartements();

  const [nouvelleZone, setNouvelleZone] = useState('');
  const [erreurZone, setErreurZone] = useState('');

  const [nouveauDept, setNouveauDept] = useState('');
  const [erreurDept, setErreurDept] = useState('');
  const [suppressionEnAttente, setSuppressionEnAttente] = useState(null);

  const [editionDept, setEditionDept] = useState(null);
  const [erreurEdition, setErreurEdition] = useState('');

  useEffect(() => {
    const precedentOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = precedentOverflow;
    };
  }, []);

  const handleAjouterZone = async (e) => {
    e.preventDefault();
    setErreurZone('');
    const resultat = await ajouterZone(nouvelleZone);
    if (resultat.ok) {
      setNouvelleZone('');
      setErreurZone('');
    } else if (resultat.erreur === 'exists') {
      setErreurZone(he.zoneExists);
    } else if (resultat.erreur === 'empty') {
      setErreurZone(he.zoneEmpty);
    } else {
      setErreurZone(he.zoneSaveError);
    }
  };

  const handleAjouterDept = async (e) => {
    e.preventDefault();
    setErreurDept('');
    const resultat = await ajouterDepartement(nouveauDept);
    if (resultat.ok) {
      setNouveauDept('');
      setErreurDept('');
    } else if (resultat.erreur === 'exists') {
      setErreurDept(he.departmentExists);
    } else if (resultat.erreur === 'empty') {
      setErreurDept(he.departmentEmpty);
    } else {
      setErreurDept(he.departmentSaveError);
    }
  };

  const handleRenommerDept = async () => {
    if (!editionDept) return;
    const resultat = await renommerDepartement(
      editionDept.id,
      editionDept.valeur,
    );
    if (resultat.ok) {
      setEditionDept(null);
      setErreurEdition('');
    } else if (resultat.erreur === 'exists') {
      setErreurEdition(he.departmentExists);
    } else if (resultat.erreur === 'empty') {
      setErreurEdition(he.departmentEmpty);
    } else {
      setErreurEdition(he.departmentSaveError);
    }
  };

  const handleConfirmerSuppression = async () => {
    if (!suppressionEnAttente) return;

    if (suppressionEnAttente.type === 'zone') {
      await supprimerZone(suppressionEnAttente.id);
      setSuppressionEnAttente(null);
      return;
    }

    if (suppressionEnAttente.type === 'departement') {
      await supprimerDepartement(suppressionEnAttente.id);
      setSuppressionEnAttente(null);
    }
  };

  return (
    <div
      className='fixed inset-0 z-50 flex items-end justify-center bg-black/45 backdrop-blur-sm sm:items-center'
      onClick={onClose}
      role='dialog'
      aria-modal='true'
      aria-labelledby='settings-titre'
    >
      <div
        className='flex max-h-[85svh] w-full max-w-xl flex-col rounded-t-3xl border border-slate-200 bg-white shadow-xl sm:max-h-[80svh] sm:rounded-3xl'
        onClick={(e) => e.stopPropagation()}
      >
        <div className='border-b border-slate-200 p-6 pb-4'>
          <h2 id='settings-titre' className='text-xl font-bold text-slate-800'>
            {he.settingsTitle}
          </h2>
          <p className='mt-1 text-sm text-slate-500'>{he.settingsSubtitle}</p>
        </div>

        <div className='flex-1 overflow-y-auto p-6 pt-4'>
          {/* מחלקות / pages */}
          {isGestion && (
            <section className='mb-8'>
              <h3 className='mb-3 text-sm font-semibold text-slate-600'>
                {he.departmentsList}
              </h3>
              <ul className='mb-4 flex flex-col gap-2'>
                {departements.map((d) => {
                  const enEdition = editionDept?.id === d.id;
                  return (
                    <li
                      key={d.id}
                      className='rounded-xl bg-slate-50 px-4 py-3'
                    >
                      {enEdition ? (
                        <div className='flex flex-col gap-2'>
                          <input
                            type='text'
                            autoFocus
                            value={editionDept.valeur}
                            onChange={(e) => {
                              setEditionDept({
                                id: d.id,
                                valeur: e.target.value,
                              });
                              setErreurEdition('');
                            }}
                            className='w-full rounded-xl border border-slate-300 bg-white px-3 py-2 text-base font-semibold text-slate-800 outline-none focus:border-slate-500'
                          />
                          {erreurEdition && (
                            <p className='text-sm text-red-600' role='alert'>
                              {erreurEdition}
                            </p>
                          )}
                          <div className='flex gap-2'>
                            <button
                              type='button'
                              onClick={() => {
                                setEditionDept(null);
                                setErreurEdition('');
                              }}
                              className='flex-1 rounded-lg border border-slate-200 bg-white py-2 text-sm font-semibold text-slate-700 active:bg-slate-100'
                            >
                              {he.cancel}
                            </button>
                            <button
                              type='button'
                              disabled={!editionDept.valeur.trim()}
                              onClick={handleRenommerDept}
                              className='flex-1 rounded-lg bg-slate-900 py-2 text-sm font-semibold text-white active:bg-slate-800 disabled:opacity-40'
                            >
                              {he.save}
                            </button>
                          </div>
                        </div>
                      ) : (
                        <div className='flex items-center justify-between gap-2'>
                          <span className='min-w-0 flex-1 truncate font-semibold text-slate-800'>
                            {d.nom}
                          </span>
                          <div className='flex shrink-0 items-center gap-2'>
                            <button
                              type='button'
                              onClick={() => {
                                setEditionDept({ id: d.id, valeur: d.nom });
                                setErreurEdition('');
                              }}
                              className='rounded-lg bg-slate-200 px-3 py-1 text-xs font-semibold text-slate-700 active:bg-slate-300'
                            >
                              {he.edit}
                            </button>
                            {departements.length > 1 && (
                              <button
                                type='button'
                                onClick={() =>
                                  setSuppressionEnAttente({
                                    type: 'departement',
                                    id: d.id,
                                    label: d.nom,
                                  })
                                }
                                className='rounded-lg bg-red-100 px-2 py-1 text-xs font-medium text-red-700'
                              >
                                ✕
                              </button>
                            )}
                          </div>
                        </div>
                      )}
                    </li>
                  );
                })}
              </ul>
              <form onSubmit={handleAjouterDept}>
                <label
                  htmlFor='nouveau-dept'
                  className='mb-2 block text-sm font-semibold text-slate-600'
                >
                  {he.addDepartment}
                </label>
                <div className='flex gap-2'>
                  <input
                    id='nouveau-dept'
                    type='text'
                    value={nouveauDept}
                    onChange={(e) => {
                      setNouveauDept(e.target.value);
                      setErreurDept('');
                    }}
                    placeholder={he.newDepartmentPlaceholder}
                    className='min-w-0 flex-1 rounded-2xl border border-slate-300 bg-white px-4 py-3 text-base font-semibold text-slate-800 outline-none focus:border-slate-500'
                  />
                  <button
                    type='submit'
                    disabled={!nouveauDept.trim()}
                    className='shrink-0 rounded-2xl bg-slate-900 px-5 py-3 text-sm font-semibold text-white active:bg-slate-800 disabled:opacity-40'
                  >
                    {he.add}
                  </button>
                </div>
                {erreurDept && (
                  <p className='mt-2 text-sm text-red-600' role='alert'>
                    {erreurDept}
                  </p>
                )}
              </form>
            </section>
          )}

          {/* אותיות אזור */}
          <section>
            <h3 className='mb-3 text-sm font-semibold text-slate-600'>
              {he.zonesList}
            </h3>

            {zones.length === 0 ? (
              <p className='py-6 text-center text-slate-400'>{he.noZones}</p>
            ) : (
              <ul dir='ltr' className='mb-6 flex flex-wrap gap-2'>
                {zones.map((z) => (
                  <li
                    key={z}
                    className='flex items-center gap-2 rounded-2xl bg-slate-50 px-4 py-3'
                  >
                    <span className='text-xl font-bold text-slate-800'>
                      {z}
                    </span>
                    <button
                      type='button'
                      onClick={() =>
                        setSuppressionEnAttente({
                          type: 'zone',
                          id: z,
                          label: z,
                        })
                      }
                      className='rounded-lg bg-red-100 px-2 py-1 text-xs font-medium text-red-700'
                    >
                      ✕
                    </button>
                  </li>
                ))}
              </ul>
            )}

            <form onSubmit={handleAjouterZone}>
              <label
                htmlFor='nouvelle-zone'
                className='mb-2 block text-sm font-semibold text-slate-600'
              >
                {he.addZone}
              </label>
              <div className='flex gap-2'>
                <input
                  id='nouvelle-zone'
                  type='text'
                  maxLength={1}
                  value={nouvelleZone}
                  onChange={(e) => {
                    setNouvelleZone(
                      e.target.value.toUpperCase().replace(/[^A-Z]/g, ''),
                    );
                    setErreurZone('');
                  }}
                  placeholder={he.newZonePlaceholder}
                  className='w-20 rounded-2xl border border-slate-300 bg-white px-4 py-3 text-center text-xl font-bold text-slate-800 outline-none focus:border-slate-500'
                />
                <button
                  type='submit'
                  disabled={!nouvelleZone.trim()}
                  className='flex-1 rounded-2xl bg-slate-900 px-5 py-3 text-sm font-semibold text-white active:bg-slate-800 disabled:opacity-40'
                >
                  {he.add}
                </button>
              </div>
              {erreurZone && (
                <p className='mt-2 text-sm text-red-600' role='alert'>
                  {erreurZone}
                </p>
              )}
            </form>
          </section>
        </div>

        <div className='border-t border-slate-200 p-4'>
          {suppressionEnAttente && (
            <div className='mb-4 rounded-2xl border border-red-200 bg-red-50 p-3'>
              <p className='text-sm font-semibold text-red-800'>
                {suppressionEnAttente.type === 'zone'
                  ? he.confirmDeleteZone(suppressionEnAttente.label)
                  : he.confirmDeleteDepartment(suppressionEnAttente.label)}
              </p>
              <div className='mt-3 flex gap-2'>
                <button
                  type='button'
                  onClick={() => setSuppressionEnAttente(null)}
                  className='flex-1 rounded-xl border border-slate-200 bg-white py-2.5 text-sm font-semibold text-slate-700 active:bg-slate-100'
                >
                  {he.cancel}
                </button>
                <button
                  type='button'
                  onClick={handleConfirmerSuppression}
                  className='flex-1 rounded-xl bg-red-600 py-2.5 text-sm font-semibold text-white active:bg-red-700'
                >
                  {he.confirm}
                </button>
              </div>
            </div>
          )}

          <button
            type='button'
            onClick={onClose}
            className='w-full rounded-2xl bg-slate-100 py-4 text-base font-semibold text-slate-600 active:bg-slate-200'
          >
            {he.close}
          </button>
        </div>
      </div>
    </div>
  );
}
