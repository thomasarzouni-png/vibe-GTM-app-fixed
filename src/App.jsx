import React, { useState, useEffect, useMemo } from 'react';
import {
  Home, CheckSquare, FileText, Building2, Users, Mail, Send,
  Settings, LogOut, ChevronDown, Search, Zap, ExternalLink, Sparkles,
  MoreVertical, Linkedin, ThumbsUp, Loader2, X, Globe, Play, Filter,
  Plus, Bookmark, Download, Columns, ChevronUp
} from 'lucide-react';

const generateGmailComposeUrl = (to, subject, body) => {
  const params = new URLSearchParams({ view: 'cm', fs: '1', to, su: subject, body });
  return `https://mail.google.com/mail/?${params.toString()}`;
};

const generateEmailDraft = (contact) => {
  const firstName = contact.name.split(' ')[0];
  const drafts = {
    new_hire: { subject: `${firstName} + Thomas // CTV for ${contact.account}`, greeting: `Hi ${firstName},`, body: `Congratulations on your new role as ${contact.title} at ${contact.account}. With a fresh perspective, it's a great time to explore channels that can drive measurable brand lift and performance.\n\nVibe makes CTV advertising accessible — self-serve platform, no minimums, and attribution that actually works with tools like Northbeam and Triple Whale.\n\nWould you be open to a quick call next week to see if CTV fits your growth plans?` },
    competitor_remove: { subject: `Quick question about ${contact.account}'s CTV strategy`, greeting: `Hi ${firstName},`, body: `I noticed ${contact.account} recently moved away from ${contact.signal.detail.replace('Left ', '')}. Curious what drove that decision?\n\nWe've been helping similar brands simplify their CTV buying — transparent pricing, no hidden fees.\n\nWorth a 15-min chat to compare notes?` },
    competitor_add: { subject: `${contact.account} + CTV`, greeting: `Hi ${firstName},`, body: `Saw ${contact.account} is testing CTV. Smart move — CTV is where the attention is shifting.\n\nWe're a self-serve platform that makes launching your first CTV campaign ridiculously easy. Most brands are live within a day.\n\nWant me to show you how similar brands are using it?` },
    website_visit: { subject: `Following up - ${contact.account} + Vibe`, greeting: `Hi ${firstName},`, body: `I saw some activity from ${contact.account} on our site recently — looks like you're exploring CTV options.\n\nVibe is a self-serve CTV platform built for performance marketers. Most brands are live within a day.\n\nWould it be helpful to see how other brands in your space are using CTV?` },
    webinar: { subject: `Thanks for registering - ${contact.account}`, greeting: `Hi ${firstName},`, body: `Thanks for registering for our CTV 101 webinar! I wanted to reach out personally since ${contact.account} seems like a great fit.\n\nIf you have any questions before the webinar, or want to chat about how CTV could work for ${contact.account}, I'm happy to jump on a quick call.` },
    offsite_intent: { subject: `${firstName} - saw you're researching CTV`, greeting: `Hi ${firstName},`, body: `I noticed ${contact.account} has been researching CTV platforms — always excited to see more brands exploring this channel.\n\nVibe is a self-serve CTV platform built for performance marketers. We integrate with attribution tools like Northbeam and Triple Whale.\n\nWould you be open to a quick call to see if this could fit your 2026 plans?` },
  };
  return drafts[contact.signal.type] || drafts.website_visit;
};

const mockContacts = [
  { id: '1', name: 'Sarah Chen', title: 'Head of Growth', account: 'Hospitable', avatar: 'SC', signal: { type: 'competitor_remove', label: 'Competitor Removed', detail: 'Left StackAdapt' }, email: 'sarah.chen@hospitable.com', linkedin: 'https://www.linkedin.com/in/sarachen/' },
  { id: '2', name: 'Mike Rodriguez', title: 'VP Marketing', account: 'Molekule', avatar: 'MR', signal: { type: 'new_hire', label: 'New Hire', detail: 'Started 3 weeks ago' }, email: 'mike.r@molekule.com', linkedin: 'https://www.linkedin.com/in/mikerodriguez/' },
  { id: '3', name: 'Jennifer Walsh', title: 'Director of Paid Media', account: 'Molekule', avatar: 'JW', signal: { type: 'website_visit', label: 'Website Visit', detail: 'Visited pricing page' }, email: 'jwalsh@molekule.com', linkedin: 'https://www.linkedin.com/in/jenniferwalsh/' },
  { id: '4', name: 'Amanda Torres', title: 'Head of Digital', account: "Francesca's", avatar: 'AT', signal: { type: 'webinar', label: 'Webinar Registration', detail: 'CTV 101 Webinar' }, email: 'atorres@francescas.com', linkedin: 'https://www.linkedin.com/in/amandatorres/' },
  { id: '5', name: 'Robert Chang', title: 'Director of Performance', account: 'Achieve', avatar: 'RC', signal: { type: 'competitor_add', label: 'Competitor Activity', detail: 'Added MNTN pixel' }, email: 'rchang@achieve.com', linkedin: 'https://www.linkedin.com/in/robertchang/' },
  { id: '6', name: 'David Kim', title: 'CMO', account: 'Upwork', avatar: 'DK', signal: { type: 'offsite_intent', label: 'Offsite Intent', detail: 'Researching CTV platforms' }, email: 'dkim@upwork.com', linkedin: 'https://www.linkedin.com/in/davidkim/' },
];

const mockAccountsTable = [
  { id: 'acc_1', name: 'Hospitable', vertical: 'Consumer Services', vibeScore: 80, pulseData: [65, 68, 70, 72, 75, 76, 78, 80, 79, 82, 85, 88, 90, 88, 85], pulse90d: 76.9, manualStatus: 'Hot', accountStatus: 'Open Prospect', p0Penetration: { current: 1, total: 3 }, latestNote: 'controller loves Ram', assignedDate: 'Jan 22, 2026', recycle: false },
  { id: 'acc_2', name: 'Molekule', vertical: 'Consumer Durables & Apparel', vibeScore: 85, pulseData: [40, 45, 50, 55, 60, 65, 70, 75, 78, 82, 85, 88, 92, 95, 97], pulse90d: 97, manualStatus: 'Hot', accountStatus: 'Sales Opportunity', p0Penetration: { current: 5, total: 18 }, latestNote: 'lots of growth', assignedDate: 'Jan 06, 2026', recycle: false },
  { id: 'acc_3', name: "Francesca's", vertical: 'Retail', vibeScore: 61, pulseData: [60, 60, 60, 60, 60, 60, 60, 60, 60, 60, 60, 60, 60, 60, 60], pulse90d: 0, manualStatus: 'Hot', accountStatus: 'Closed Lost', p0Penetration: { current: 0, total: 1 }, latestNote: 'Meeting with Zack', assignedDate: 'Jan 06, 2026', recycle: false },
  { id: 'acc_4', name: 'Achieve', vertical: 'Fintech', vibeScore: 78, pulseData: [50, 55, 60, 65, 70, 72, 70, 68, 72, 75, 78, 80, 77, 75, 77], pulse90d: 77, manualStatus: 'Warm', accountStatus: 'Open Prospect', p0Penetration: { current: 2, total: 2 }, latestNote: 'netsuite; Audax', assignedDate: 'Jan 06, 2026', recycle: false },
  { id: 'acc_5', name: 'Upwork', vertical: 'Commercial & Professional Services', vibeScore: 79, pulseData: [60, 62, 65, 68, 72, 75, 78, 82, 85, 88, 90, 92, 94, 95, 96], pulse90d: 96.4, manualStatus: 'Warm', accountStatus: 'Closed Lost', p0Penetration: { current: 2, total: 11 }, latestNote: '', assignedDate: 'Jan 06, 2026', recycle: true },
  { id: 'acc_6', name: 'Pipedrive', vertical: 'Software & Services', vibeScore: null, pulseData: null, pulse90d: null, manualStatus: 'Hot', accountStatus: 'Closed Lost', p0Penetration: { current: 0, total: 5 }, latestNote: '', assignedDate: 'Jan 21, 2026', recycle: false },
  { id: 'acc_7', name: 'Outreach', vertical: 'Software & Services', vibeScore: 48, pulseData: [30, 35, 40, 45, 50, 55, 60, 65, 70, 72, 68, 65, 70, 75, 77], pulse90d: 76.9, manualStatus: 'Warm', accountStatus: 'Open Prospect', p0Penetration: { current: 2, total: 6 }, latestNote: 'biz credit cards', assignedDate: 'Jan 06, 2026', recycle: false },
  { id: 'acc_8', name: 'Clearbit', vertical: 'Software & Services', vibeScore: 63, pulseData: [50, 52, 55, 58, 60, 62, 65, 68, 70, 72, 74, 75, 76, 77, 77], pulse90d: 76.9, manualStatus: 'Cold', accountStatus: 'Open Prospect', p0Penetration: { current: 2, total: 6 }, latestNote: '', assignedDate: 'Jan 06, 2026', recycle: true },
];

const signalFilters = [{ key: 'all', label: 'All Signals' }, { key: 'new_hire', label: 'New Hire' }, { key: 'offsite_intent', label: 'Offsite Intent' }, { key: 'webinar', label: 'Webinar Registration' }, { key: 'competitor', label: 'Competitor Activity' }];
const playTypes = ['New hire', 'Competitor switch', 'Re-engage', 'Product interest', 'Event follow-up'];
const tones = ['Direct', 'Consultative', 'Casual', 'Formal'];

const VibeLogo = () => (<svg viewBox="0 0 40 40" className="w-8 h-8" fill="none"><path d="M20 4C12 4 6 10 6 18C6 26 12 36 20 36C28 36 34 26 34 18C34 10 28 4 20 4Z" fill="url(#vg)" /><path d="M20 8C14 8 10 12 10 18C10 24 14 32 20 32C26 32 30 24 30 18C30 12 26 8 20 8Z" fill="#1e1b4b" /><path d="M20 12C16 12 14 14 14 18C14 22 16 28 20 28C24 28 26 22 26 18C26 14 24 12 20 12Z" fill="url(#vg)" /><defs><linearGradient id="vg" x1="6" y1="4" x2="34" y2="36"><stop stopColor="#818cf8" /><stop offset="1" stopColor="#4338ca" /></linearGradient></defs></svg>);

const Sparkline = ({ data, width = 80, height = 24 }) => {
  if (!data || data.length === 0) return <div className="text-sm text-gray-400 italic" style={{ width }}>No data</div>;
  const min = Math.min(...data), max = Math.max(...data), range = max - min || 1;
  const points = data.map((v, i) => `${(i / (data.length - 1)) * width},${height - ((v - min) / range) * height}`).join(' ');
  return <svg width={width} height={height}><polyline points={points} fill="none" stroke={data[data.length - 1] - data[0] >= 0 ? '#22c55e' : '#ef4444'} strokeWidth="2" strokeLinecap="round" /></svg>;
};

const StatusBadge = ({ status }) => {
  const styles = { 'Open Prospect': 'bg-green-50 text-green-700 border-green-200', 'Closed Lost': 'bg-red-50 text-red-700 border-red-200', 'Sales Opportunity': 'bg-blue-50 text-blue-700 border-blue-200' };
  return <span className={`px-2 py-1 rounded text-xs font-medium border ${styles[status] || 'bg-gray-50 text-gray-600'}`}>{status}</span>;
};

const ManualStatusDropdown = ({ value, onChange }) => {
  const colors = { 'Hot': 'text-red-600', 'Warm': 'text-orange-500', 'Cold': 'text-blue-500' };
  return <select value={value} onChange={(e) => onChange(e.target.value)} className={`bg-transparent border-none text-sm font-medium cursor-pointer focus:outline-none ${colors[value]}`}><option value="Hot">Hot</option><option value="Warm">Warm</option><option value="Cold">Cold</option></select>;
};

const PenetrationBar = ({ current, total }) => {
  const pct = total > 0 ? Math.round((current / total) * 100) : 0;
  const color = pct >= 50 ? 'bg-green-500' : pct >= 25 ? 'bg-orange-500' : 'bg-red-500';
  return <div className="flex items-center gap-2"><span className="text-sm font-medium">{current}/{total}</span><span className={`text-sm ${pct >= 50 ? 'text-green-600' : pct >= 25 ? 'text-orange-500' : 'text-red-500'}`}>{pct}%</span><div className="w-12 h-1.5 bg-gray-200 rounded-full"><div className={`h-full ${color} rounded-full`} style={{ width: `${pct}%` }} /></div></div>;
};

const Sidebar = ({ currentPage, setCurrentPage }) => {
  const navItems = [{ id: 'home', icon: Home, label: 'Home' }, { id: 'tasks', icon: CheckSquare, label: 'Tasks' }, { id: 'notes', icon: FileText, label: 'Notes' }];
  const researchItems = [{ id: 'accounts', icon: Building2, label: 'Accounts' }, { id: 'contacts', icon: Users, label: 'Contacts' }];
  return (
    <div className="w-56 bg-white border-r border-gray-200 flex flex-col h-screen">
      <div className="p-4 border-b border-gray-100"><div className="flex items-center gap-2"><VibeLogo /><span className="font-semibold text-indigo-900 text-lg">vibe</span><span className="text-xs text-indigo-400 font-medium ml-1">Revenue</span></div></div>
      <div className="p-3"><div className="flex items-center gap-2 px-3 py-2 bg-gray-50 rounded-lg text-gray-400 text-sm"><span className="text-xs bg-gray-200 text-gray-500 px-1.5 py-0.5 rounded">⌘</span><span className="text-xs bg-gray-200 text-gray-500 px-1.5 py-0.5 rounded">K</span><span className="ml-1">Search</span></div></div>
      <nav className="flex-1 px-3 py-2 overflow-y-auto">
        {navItems.map(item => <button key={item.id} onClick={() => setCurrentPage(item.id)} className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg text-sm mb-1 ${currentPage === item.id ? 'bg-indigo-50 text-indigo-700 font-medium' : 'text-gray-600 hover:bg-gray-50'}`}><item.icon className="w-4 h-4" />{item.label}</button>)}
        <div className="mt-4 mb-2 px-3 text-xs font-medium text-gray-400 uppercase">Research</div>
        {researchItems.map(item => <button key={item.id} onClick={() => setCurrentPage(item.id)} className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg text-sm mb-1 ${currentPage === item.id ? 'bg-indigo-50 text-indigo-700 font-medium' : 'text-gray-600 hover:bg-gray-50'}`}><item.icon className="w-4 h-4" />{item.label}</button>)}
        <div className="mt-4 mb-2 px-3 text-xs font-medium text-gray-400 uppercase">Engage</div>
        <button onClick={() => setCurrentPage('sequences')} className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg text-sm mb-1 ${currentPage === 'sequences' ? 'bg-indigo-50 text-indigo-700 font-medium' : 'text-gray-600 hover:bg-gray-50'}`}><Send className="w-4 h-4" />Sequences</button>
      </nav>
      <div className="p-3 border-t border-gray-100"><button className="w-full flex items-center gap-3 px-3 py-2 rounded-lg text-sm text-gray-600 hover:bg-gray-50"><Settings className="w-4 h-4" />Settings</button><button className="w-full flex items-center gap-3 px-3 py-2 rounded-lg text-sm text-gray-600 hover:bg-gray-50"><LogOut className="w-4 h-4" />Log out</button></div>
    </div>
  );
};

const SignalBadge = ({ signal }) => {
  const colors = { competitor_remove: 'bg-red-50 text-red-700 border-red-200', competitor_add: 'bg-orange-50 text-orange-700 border-orange-200', new_hire: 'bg-indigo-50 text-indigo-700 border-indigo-200', website_visit: 'bg-emerald-50 text-emerald-700 border-emerald-200', webinar: 'bg-purple-50 text-purple-700 border-purple-200', offsite_intent: 'bg-amber-50 text-amber-700 border-amber-200' };
  return <span className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium border ${colors[signal.type] || 'bg-gray-50 text-gray-600'}`}><Zap className="w-3 h-3" />{signal.label}</span>;
};

const ContactRow = ({ contact, isSelected, onClick }) => (
  <div onClick={onClick} className={`flex items-center gap-4 px-4 py-3 border-b border-gray-100 cursor-pointer ${isSelected ? 'bg-indigo-50' : 'hover:bg-gray-50'}`}>
    <input type="checkbox" className="w-4 h-4 rounded border-gray-300" onClick={e => e.stopPropagation()} />
    <div className="w-9 h-9 rounded-full bg-gradient-to-br from-indigo-400 to-purple-500 flex items-center justify-center text-white text-sm font-medium">{contact.avatar}</div>
    <div className="flex-1 min-w-0"><div className="flex items-center gap-2"><span className="font-medium text-gray-900">{contact.name}</span><SignalBadge signal={contact.signal} /></div><div className="text-sm text-gray-500"><span className="text-indigo-600">{contact.account}</span> · {contact.title}</div></div>
    <button className="p-2 hover:bg-gray-100 rounded"><Mail className="w-4 h-4 text-gray-500" /></button>
  </div>
);

const AIDraftPanel = ({ contact, onClose }) => {
  const [isThinking, setIsThinking] = useState(true);
  const [draft, setDraft] = useState(null);
  const [playType, setPlayType] = useState('New hire');
  const [tone, setTone] = useState('Direct');
  const [thinkingTime, setThinkingTime] = useState(0);
  const [emailSent, setEmailSent] = useState(false);

  useEffect(() => {
    setIsThinking(true); setDraft(null); setThinkingTime(0); setEmailSent(false);
    const timer = setInterval(() => setThinkingTime(t => t + 1), 1000);
    const timeout = setTimeout(() => { clearInterval(timer); setIsThinking(false); setDraft(generateEmailDraft(contact)); }, 3000);
    return () => { clearInterval(timer); clearTimeout(timeout); };
  }, [contact]);

  const handleOpenInGmail = () => {
    if (!draft) return;
    window.open(generateGmailComposeUrl(contact.email, draft.subject, `${draft.greeting}\n\n${draft.body}\n\nBest,\nThomas`), '_blank');
    setEmailSent(true);
  };

  return (
    <div className="w-[420px] border-l border-gray-200 bg-white flex flex-col h-full">
      <div className="flex items-center justify-between p-4 border-b border-gray-100"><span className="font-medium text-gray-900">{contact.name}</span><button onClick={onClose} className="p-1 hover:bg-gray-100 rounded"><X className="w-4 h-4 text-gray-400" /></button></div>
      <div className="flex-1 overflow-y-auto">
        <div className="m-4 p-4 bg-indigo-50 rounded-lg border border-indigo-200"><h3 className="font-medium text-indigo-800 mb-2">Account summary</h3><ul className="space-y-1"><li className="text-sm text-indigo-700 flex items-start gap-2"><span className="mt-1.5 w-1 h-1 bg-indigo-500 rounded-full" />{contact.title} at {contact.account}</li><li className="text-sm text-indigo-700 flex items-start gap-2"><span className="mt-1.5 w-1 h-1 bg-indigo-500 rounded-full" />Signal: {contact.signal.label} - {contact.signal.detail}</li></ul></div>
        <div className="px-4 pb-4">
          <div className="flex items-center gap-2 text-gray-500 mb-4">{isThinking ? <Loader2 className="w-4 h-4 animate-spin text-indigo-500" /> : <Sparkles className="w-4 h-4 text-indigo-500" />}<span className="text-sm">Thought for {thinkingTime} seconds</span></div>
          {draft && (<div className="space-y-4"><div className="text-xs text-gray-400 uppercase">1st draft</div><div className="p-3 bg-gray-50 rounded-lg border border-gray-200"><div className="text-xs text-gray-400 mb-1">Subject</div><div className="text-sm font-medium text-gray-900">{draft.subject}</div></div><div className="space-y-3 text-sm text-gray-700"><p>{draft.greeting}</p><p className="whitespace-pre-line">{draft.body}</p><p className="text-gray-500">Best,<br />Thomas</p></div></div>)}
        </div>
      </div>
      <div className="border-t border-gray-100 p-4 space-y-4">
        <div className="flex gap-4"><div className="flex-1"><div className="flex items-center gap-2 text-sm text-gray-500 mb-1"><Play className="w-3 h-3" />Play type</div><select value={playType} onChange={e => setPlayType(e.target.value)} className="w-full px-3 py-1.5 border border-gray-200 rounded-lg text-sm">{playTypes.map(pt => <option key={pt}>{pt}</option>)}</select></div><div className="flex-1"><div className="flex items-center gap-2 text-sm text-gray-500 mb-1"><Filter className="w-3 h-3" />Tone</div><select value={tone} onChange={e => setTone(e.target.value)} className="w-full px-3 py-1.5 border border-gray-200 rounded-lg text-sm">{tones.map(t => <option key={t}>{t}</option>)}</select></div></div>
        <input type="text" placeholder="Refine with a prompt" className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm" />
        <div className="flex flex-wrap gap-2">{['Mention CTV trends', 'Add case study', 'Shorter version'].map(chip => <button key={chip} className="flex items-center gap-1 px-3 py-1.5 bg-gray-50 hover:bg-gray-100 rounded-full text-xs text-gray-600 border border-gray-200"><Sparkles className="w-3 h-3" />{chip}</button>)}</div>
        <div className="flex gap-2 pt-2"><button onClick={handleOpenInGmail} disabled={!draft} className={`flex-1 flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg text-sm font-medium ${emailSent ? 'bg-green-500 text-white' : draft ? 'bg-indigo-600 text-white hover:bg-indigo-700' : 'bg-gray-300 text-gray-500'}`}><Mail className="w-4 h-4" />{emailSent ? 'Opened in Gmail ✓' : 'Open in Gmail'}</button><button onClick={() => window.open(contact.linkedin, '_blank')} className="p-2.5 border border-gray-200 rounded-lg hover:bg-gray-50"><Linkedin className="w-4 h-4 text-blue-600" /></button></div>
      </div>
    </div>
  );
};

const HomePage = ({ onSelectContact, selectedContact }) => {
  const [filter, setFilter] = useState('all');
  const filteredContacts = mockContacts.filter(c => filter === 'all' ? true : filter === 'competitor' ? c.signal.type.includes('competitor') : c.signal.type === filter);
  return (
    <div className="flex-1 flex flex-col h-full overflow-hidden">
      <div className="p-6 border-b border-gray-100"><div className="text-sm text-gray-500 mb-1">Good morning, Thomas</div><h1 className="text-2xl font-semibold text-gray-900">Here's what to focus on</h1><div className="mt-4 flex items-center gap-4"><div className="flex-1 h-1.5 bg-gray-100 rounded-full overflow-hidden"><div className="h-full bg-indigo-500 rounded-full" style={{ width: '15%' }} /></div><span className="text-sm text-gray-500">{filteredContacts.length} recommendations</span></div></div>
      <div className="flex-1 overflow-hidden flex flex-col">
        <div className="px-6 py-4 border-b border-gray-100"><div className="flex items-center gap-3"><ChevronDown className="w-4 h-4 text-gray-400" /><span className="text-sm font-medium text-gray-700">Recommended contacts</span><span className="text-sm text-gray-400">{filteredContacts.length}</span></div><div className="flex flex-wrap gap-2 mt-3">{signalFilters.map(f => <button key={f.key} onClick={() => setFilter(f.key)} className={`px-3 py-1.5 rounded-full text-sm border ${filter === f.key ? 'bg-indigo-900 text-white border-indigo-900' : 'bg-white text-gray-600 border-gray-200 hover:border-indigo-300'}`}>{f.label}</button>)}</div></div>
        <div className="flex-1 overflow-y-auto"><div className="border-b border-gray-100 px-4 py-2 bg-gray-50 text-xs font-medium text-gray-500 uppercase">Contacts</div>{filteredContacts.map(contact => <ContactRow key={contact.id} contact={contact} isSelected={selectedContact?.id === contact.id} onClick={() => onSelectContact(contact)} />)}</div>
      </div>
    </div>
  );
};

const MyAccountsPage = () => {
  const [accounts, setAccounts] = useState(mockAccountsTable);
  const [sortField, setSortField] = useState('vibeScore');
  const [sortDir, setSortDir] = useState('desc');
  const sortedAccounts = useMemo(() => [...accounts].sort((a, b) => { const av = a[sortField] ?? -Infinity, bv = b[sortField] ?? -Infinity; return sortDir === 'desc' ? bv - av : av - bv; }), [accounts, sortField, sortDir]);
  const handleSort = (field) => { if (sortField === field) setSortDir(sortDir === 'desc' ? 'asc' : 'desc'); else { setSortField(field); setSortDir('desc'); } };
  const updateManualStatus = (id, status) => setAccounts(accounts.map(a => a.id === id ? { ...a, manualStatus: status } : a));

  return (
    <div className="flex-1 flex flex-col h-full overflow-hidden bg-gray-50">
      <div className="bg-white border-b border-gray-200 px-6 py-4"><div className="flex items-center justify-between mb-4"><h1 className="text-2xl font-semibold text-gray-900">My accounts <span className="ml-3 text-base font-normal text-gray-400">{accounts.length}</span></h1><div className="flex items-center gap-2"><button className="p-2 hover:bg-gray-100 rounded-lg"><Download className="w-4 h-4 text-gray-500" /></button><button className="p-2 hover:bg-gray-100 rounded-lg"><Columns className="w-4 h-4 text-gray-500" /></button></div></div><div className="flex items-center gap-6 border-b border-gray-200 -mb-4"><button className="pb-3 border-b-2 border-indigo-500 text-sm font-medium text-gray-900">All</button><button className="pb-3 border-b-2 border-transparent text-sm text-gray-500 flex items-center gap-1"><Plus className="w-3 h-3" />Save as new view</button></div></div>
      <div className="bg-white border-b border-gray-200 px-6 py-3"><div className="flex items-center gap-3"><div className="flex items-center gap-2 px-3 py-1.5 bg-gray-50 rounded-lg border border-gray-200 w-64"><Search className="w-4 h-4 text-gray-400" /><input type="text" placeholder="Search or filter..." className="bg-transparent text-sm focus:outline-none flex-1" /></div></div></div>
      <div className="flex-1 overflow-auto">
        <table className="w-full">
          <thead className="bg-gray-50 sticky top-0"><tr className="text-left text-xs font-medium text-gray-500 uppercase"><th className="px-4 py-3 w-12"><input type="checkbox" className="w-4 h-4 rounded border-gray-300" /></th><th className="px-4 py-3 min-w-[240px]">Account name</th><th className="px-4 py-3 cursor-pointer" onClick={() => handleSort('vibeScore')}><div className="flex items-center gap-1">Vibe{sortField === 'vibeScore' && (sortDir === 'desc' ? <ChevronDown className="w-3 h-3" /> : <ChevronUp className="w-3 h-3" />)}</div></th><th className="px-4 py-3">VibePulse · 90d</th><th className="px-4 py-3">Manual status</th><th className="px-4 py-3">Account status</th><th className="px-4 py-3">P0 penetration</th><th className="px-4 py-3">Latest note</th><th className="px-4 py-3">Assigned date</th><th className="px-4 py-3 w-32"></th></tr></thead>
          <tbody className="bg-white divide-y divide-gray-100">
            {sortedAccounts.map(account => (<tr key={account.id} className="hover:bg-gray-50"><td className="px-4 py-3"><input type="checkbox" className="w-4 h-4 rounded border-gray-300" /></td><td className="px-4 py-3"><div className="flex items-center gap-3"><div className="w-8 h-8 bg-gradient-to-br from-indigo-100 to-purple-100 rounded-lg flex items-center justify-center"><Globe className="w-4 h-4 text-indigo-500" /></div><div><div className="flex items-center gap-2"><span className="font-medium text-gray-900">{account.name}</span>{account.recycle && <span className="px-2 py-0.5 bg-gray-100 text-gray-600 text-xs rounded">Recycle</span>}</div><div className="text-xs text-gray-500">{account.vertical}</div></div></div></td><td className="px-4 py-3"><span className="font-medium text-gray-900">{account.vibeScore ?? '—'}</span></td><td className="px-4 py-3"><div className="flex items-center gap-3"><Sparkline data={account.pulseData} width={70} height={20} /><span className="text-sm text-gray-600">{account.pulse90d ?? '—'}</span></div></td><td className="px-4 py-3"><ManualStatusDropdown value={account.manualStatus} onChange={(s) => updateManualStatus(account.id, s)} /></td><td className="px-4 py-3"><StatusBadge status={account.accountStatus} /></td><td className="px-4 py-3"><PenetrationBar current={account.p0Penetration.current} total={account.p0Penetration.total} /></td><td className="px-4 py-3"><span className="text-sm text-gray-600 truncate block max-w-[160px]">{account.latestNote || '—'}</span></td><td className="px-4 py-3 text-sm text-gray-500">{account.assignedDate}</td><td className="px-4 py-3"><div className="flex items-center gap-1"><button className="p-1.5 hover:bg-gray-100 rounded text-gray-400"><Linkedin className="w-4 h-4" /></button><button className="p-1.5 hover:bg-gray-100 rounded text-gray-400"><ThumbsUp className="w-4 h-4" /></button><button className="p-1.5 hover:bg-gray-100 rounded text-gray-400"><Send className="w-4 h-4" /></button><button className="p-1.5 hover:bg-gray-100 rounded text-gray-400"><ExternalLink className="w-4 h-4" /></button></div></td></tr>))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default function VibeRevenueApp() {
  const [currentPage, setCurrentPage] = useState('home');
  const [selectedContact, setSelectedContact] = useState(null);
  const [showDraftPanel, setShowDraftPanel] = useState(false);

  return (
    <div className="flex h-screen bg-white">
      <Sidebar currentPage={currentPage} setCurrentPage={(page) => { setCurrentPage(page); setShowDraftPanel(false); }} />
      <div className="flex-1 flex overflow-hidden">
        {currentPage === 'home' && (<><HomePage onSelectContact={(c) => { setSelectedContact(c); setShowDraftPanel(true); }} selectedContact={selectedContact} />{showDraftPanel && selectedContact && <AIDraftPanel contact={selectedContact} onClose={() => { setShowDraftPanel(false); setSelectedContact(null); }} />}</>)}
        {currentPage === 'accounts' && <MyAccountsPage />}
        {currentPage === 'sequences' && <div className="flex-1 flex items-center justify-center text-gray-400"><div className="text-center"><Send className="w-12 h-12 mx-auto mb-3 text-indigo-200" /><div className="text-lg font-medium text-gray-600">Sequences</div><div className="text-sm">Review and send batch drafts</div></div></div>}
        {['tasks', 'notes', 'contacts', 'imports'].includes(currentPage) && <div className="flex-1 flex items-center justify-center text-gray-400"><div className="text-center"><div className="text-4xl mb-2">🚧</div><div className="text-lg font-medium capitalize text-gray-600">{currentPage}</div><div className="text-sm">Coming soon</div></div></div>}
      </div>
    </div>
  );
}
