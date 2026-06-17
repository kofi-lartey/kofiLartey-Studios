import { useState } from 'react';
import { FiGlobe, FiPlus, FiSave } from 'react-icons/fi';
import AdminLayout from '../components/AdminLayout';
import Badge from '../components/Badge';
import Toast from '../components/Toast';
import useAdmin from '../hooks/useAdmin';

const MultiLanguage = () => {
  const admin = useAdmin();
  const [languageForm, setLanguageForm] = useState({ name: '', code: '', flag: '', direction: 'LTR' });
  const [translationForm, setTranslationForm] = useState({ key: '', en: '', fr: '', ar: '' });

  const addLanguage = () => {
    if (!languageForm.name || !languageForm.code) return;
    admin.updateData('languages', (languages) => [...languages, { id: `lang_${Date.now()}`, ...languageForm, default: false }]);
    setLanguageForm({ name: '', code: '', flag: '', direction: 'LTR' });
    admin.showToast('Language added.');
  };

  const addTranslation = () => {
    if (!translationForm.key) return;
    admin.updateData('translations', (translations) => [translationForm, ...translations]);
    setTranslationForm({ key: '', en: '', fr: '', ar: '' });
    admin.showToast('Translation added.');
  };

  const setDefault = (id) => {
    admin.updateData('languages', (languages) => languages.map((language) => ({ ...language, default: language.id === id })));
    admin.showToast('Default language updated.');
  };

  return (
    <AdminLayout title="Multi Language">
      <section className="rounded-2xl border border-white/5 bg-white/[0.03] p-6 md:p-8">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <h1 className="text-3xl font-bold tracking-tight text-white">Multi Language</h1>
            <p className="mt-2 text-sm text-gray-400">Manage languages, direction, default locale, and translation keys.</p>
          </div>
          <button onClick={() => admin.updateData('settings', (settings) => ({ ...settings, language: 'en' }))} className="rounded-xl border border-white/10 bg-white/[0.03] px-5 py-3 text-sm font-semibold text-white hover:bg-white/[0.06]"><FiSave className="inline mr-2" size={16} />Sync locale</button>
        </div>
      </section>

      <div className="grid gap-6 xl:grid-cols-[1fr_0.8fr]">
        <div className="space-y-6">
          <div className="rounded-2xl border border-white/5 bg-white/[0.03] p-5">
            <div className="flex items-center gap-2 text-white"><FiGlobe /> <h2 className="text-lg font-bold">Languages</h2></div>
            <div className="mt-5 grid gap-3 md:grid-cols-2">
              <input value={languageForm.name} onChange={(event) => setLanguageForm((current) => ({ ...current, name: event.target.value }))} placeholder="Language name" className="rounded-xl border border-white/10 bg-white/[0.04] px-3 py-3 text-sm text-white placeholder:text-gray-500 focus:border-blue-500/60 focus:outline-none" />
              <input value={languageForm.code} onChange={(event) => setLanguageForm((current) => ({ ...current, code: event.target.value }))} placeholder="Code" className="rounded-xl border border-white/10 bg-white/[0.04] px-3 py-3 text-sm text-white placeholder:text-gray-500 focus:border-blue-500/60 focus:outline-none" />
              <input value={languageForm.flag} onChange={(event) => setLanguageForm((current) => ({ ...current, flag: event.target.value }))} placeholder="Flag" className="rounded-xl border border-white/10 bg-white/[0.04] px-3 py-3 text-sm text-white placeholder:text-gray-500 focus:border-blue-500/60 focus:outline-none" />
              <select value={languageForm.direction} onChange={(event) => setLanguageForm((current) => ({ ...current, direction: event.target.value }))} className="rounded-xl border border-white/10 bg-white/[0.04] px-3 py-3 text-sm text-white focus:border-blue-500/60 focus:outline-none"><option value="LTR">LTR</option><option value="RTL">RTL</option></select>
            </div>
            <button onClick={addLanguage} className="mt-4 rounded-xl bg-blue-600 px-5 py-3 text-sm font-semibold text-white hover:bg-blue-500"><FiPlus className="inline mr-2" size={16} />Add language</button>
            <div className="mt-5 space-y-3">
              {admin.data.languages.map((language) => (
                <div key={language.id} className="flex items-center justify-between rounded-xl border border-white/5 bg-white/[0.04] p-3">
                  <div className="flex items-center gap-3">
                    <span className="text-2xl">{language.flag}</span>
                    <div><p className="font-semibold text-white">{language.name}</p><p className="text-xs text-gray-500">{language.code} · {language.direction}</p></div>
                  </div>
                  <div className="flex items-center gap-2">
                    {language.default && <Badge tone="green">Default</Badge>}
                    <button onClick={() => setDefault(language.id)} className="rounded-lg border border-white/10 bg-white/[0.04] px-3 py-2 text-xs text-white hover:bg-white/[0.06]">Set default</button>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="rounded-2xl border border-white/5 bg-white/[0.03] p-5">
            <h2 className="text-lg font-bold text-white">i18n config</h2>
            <div className="mt-4 space-y-3 text-sm text-gray-300">
              <div className="rounded-xl border border-white/5 bg-white/[0.04] p-3">fallbackLocale: en</div>
              <div className="rounded-xl border border-white/5 bg-white/[0.04] p-3">rtlLocales: ar</div>
              <div className="rounded-xl border border-white/5 bg-white/[0.04] p-3">namespace: studio</div>
            </div>
          </div>
        </div>

        <div className="rounded-2xl border border-white/5 bg-white/[0.03] p-5">
          <h2 className="text-lg font-bold text-white">Translation dashboard</h2>
          <div className="mt-5 grid gap-3">
            <input value={translationForm.key} onChange={(event) => setTranslationForm((current) => ({ ...current, key: event.target.value }))} placeholder="Translation key" className="rounded-xl border border-white/10 bg-white/[0.04] px-3 py-3 text-sm text-white placeholder:text-gray-500 focus:border-blue-500/60 focus:outline-none" />
            <input value={translationForm.en} onChange={(event) => setTranslationForm((current) => ({ ...current, en: event.target.value }))} placeholder="English" className="rounded-xl border border-white/10 bg-white/[0.04] px-3 py-3 text-sm text-white placeholder:text-gray-500 focus:border-blue-500/60 focus:outline-none" />
            <input value={translationForm.fr} onChange={(event) => setTranslationForm((current) => ({ ...current, fr: event.target.value }))} placeholder="French" className="rounded-xl border border-white/10 bg-white/[0.04] px-3 py-3 text-sm text-white placeholder:text-gray-500 focus:border-blue-500/60 focus:outline-none" />
            <input value={translationForm.ar} onChange={(event) => setTranslationForm((current) => ({ ...current, ar: event.target.value }))} placeholder="Arabic" className="rounded-xl border border-white/10 bg-white/[0.04] px-3 py-3 text-sm text-white placeholder:text-gray-500 focus:border-blue-500/60 focus:outline-none" />
            <button onClick={addTranslation} className="rounded-xl bg-blue-600 px-5 py-3 text-sm font-semibold text-white hover:bg-blue-500"><FiPlus className="inline mr-2" size={16} />Add translation</button>
          </div>
          <div className="mt-5 overflow-x-auto">
            <table className="w-full text-left">
              <thead><tr className="border-b border-white/5 text-xs uppercase tracking-wider text-gray-500"><th className="px-3 py-3">Key</th><th className="px-3 py-3">EN</th><th className="px-3 py-3">FR</th><th className="px-3 py-3">AR</th></tr></thead>
              <tbody>{admin.data.translations.map((translation) => <tr key={translation.key} className="border-b border-white/5"><td className="px-3 py-3 text-sm text-white">{translation.key}</td><td className="px-3 py-3 text-sm text-gray-300">{translation.en}</td><td className="px-3 py-3 text-sm text-gray-300">{translation.fr}</td><td className="px-3 py-3 text-sm text-gray-300">{translation.ar}</td></tr>)}</tbody>
            </table>
          </div>
        </div>
      </div>
      {admin.toast && <Toast message={admin.toast.message} tone={admin.toast.tone} onClose={admin.clearToast} />}
    </AdminLayout>
  );
};

export default MultiLanguage;
