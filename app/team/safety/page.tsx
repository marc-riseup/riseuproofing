'use client';

import React, { useState, useEffect, useRef } from 'react';
import Image from 'next/image';
import {
  ShieldAlert,
  ShieldCheck,
  FileText,
  Download,
  Printer,
  ExternalLink,
  Lock,
  Unlock,
  Phone,
  PhoneCall,
  AlertTriangle,
  CheckCircle2,
  Calendar,
  MapPin,
  User,
  Camera,
  Upload,
  Eye,
  EyeOff,
  RefreshCw,
  X,
  FileCheck,
} from 'lucide-react';
import { SAFETY_DOCUMENTS, type SafetyDocument } from '@/lib/safety-docs/data';

export default function SafetyPortalPage() {
  // Authentication State
  const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null);
  const [passwordInput, setPasswordInput] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [authError, setAuthError] = useState<string | null>(null);
  const [authLoading, setAuthLoading] = useState(false);

  // Document Library Filter
  const [docFilter, setDocFilter] = useState<'all' | 'en' | 'es'>('all');

  // Hazard Report Form State
  const [reportDate, setReportDate] = useState(() => new Date().toISOString().split('T')[0]);
  const [reportLocation, setReportLocation] = useState('');
  const [hazardDescription, setHazardDescription] = useState('');
  const [actionTaken, setActionTaken] = useState('');
  const [reporterName, setReporterName] = useState('');
  const [reporterPhone, setReporterPhone] = useState('');
  const [photoFile, setPhotoFile] = useState<File | null>(null);
  const [photoPreview, setPhotoPreview] = useState<string | null>(null);

  const [formSubmitting, setFormSubmitting] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);
  const [formSuccess, setFormSuccess] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Check auth session on mount
  useEffect(() => {
    async function checkAuth() {
      try {
        const res = await fetch('/api/team/safety/auth');
        if (res.ok) {
          const data = await res.json();
          setIsAuthenticated(Boolean(data.authenticated));
        } else {
          setIsAuthenticated(false);
        }
      } catch {
        setIsAuthenticated(false);
      }
    }
    checkAuth();
  }, []);

  // Handle password unlock
  const handleUnlock = async (e: React.FormEvent) => {
    e.preventDefault();
    setAuthLoading(true);
    setAuthError(null);

    try {
      const res = await fetch('/api/team/safety/auth', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ password: passwordInput }),
      });

      const data = await res.json();
      if (res.ok && data.ok) {
        setIsAuthenticated(true);
        setPasswordInput('');
      } else {
        setAuthError(
          data.errorEs && data.errorEn
            ? `${data.errorEn} / ${data.errorEs}`
            : 'Incorrect password / Contraseña incorrecta'
        );
      }
    } catch {
      setAuthError('Connection error. Please try again / Error de conexión. Intente nuevamente.');
    } finally {
      setAuthLoading(false);
    }
  };

  // Handle locking/logout
  const handleLock = async () => {
    try {
      await fetch('/api/team/safety/auth', { method: 'DELETE' });
    } finally {
      setIsAuthenticated(false);
    }
  };

  // Photo selection handler
  const handlePhotoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 15 * 1024 * 1024) {
        alert('File size too large (max 15MB) / Archivo demasiado grande (máx 15MB)');
        return;
      }
      setPhotoFile(file);
      const url = URL.createObjectURL(file);
      setPhotoPreview(url);
    }
  };

  const removePhoto = () => {
    setPhotoFile(null);
    if (photoPreview) {
      URL.revokeObjectURL(photoPreview);
      setPhotoPreview(null);
    }
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  // Handle hazard report submission
  const handleSubmitReport = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormSubmitting(true);
    setFormError(null);
    setFormSuccess(null);

    try {
      const formData = new FormData();
      formData.append('date', reportDate);
      formData.append('location', reportLocation);
      formData.append('hazardDescription', hazardDescription);
      formData.append('actionTaken', actionTaken);
      formData.append('reporterName', reporterName);
      formData.append('reporterPhone', reporterPhone);

      if (photoFile) {
        formData.append('photo', photoFile);
      }

      const res = await fetch('/api/team/safety/report', {
        method: 'POST',
        body: formData,
      });

      const data = await res.json();
      if (res.ok && data.ok) {
        setFormSuccess(
          'Hazard report submitted successfully and dispatched to Christian Lavalle (chris@riseuprac.com). Thank you for keeping our crew safe!'
        );
        // Reset non-date fields
        setReportLocation('');
        setHazardDescription('');
        setActionTaken('');
        setReporterName('');
        setReporterPhone('');
        removePhoto();
      } else {
        setFormError(
          data.errorEs && data.errorEn
            ? `${data.errorEn} / ${data.errorEs}`
            : 'Error submitting report. Please call Christian or Marc directly.'
        );
      }
    } catch {
      setFormError(
        'Network error submitting report. Please verify connection or call Christian Lavalle at (760) 557-0981.'
      );
    } finally {
      setFormSubmitting(false);
    }
  };

  // Print document helper
  const handlePrintDoc = (doc: SafetyDocument) => {
    const url = `/api/team/safety/docs?id=${encodeURIComponent(doc.id)}`;
    const printWindow = window.open(url, '_blank');
    if (printWindow) {
      printWindow.focus();
    }
  };

  const filteredDocs = SAFETY_DOCUMENTS.filter((doc) => {
    if (docFilter === 'all') return true;
    return doc.lang === docFilter;
  });

  return (
    <div className="min-h-screen bg-[#F4F9FC] text-[#0B1B2B] flex flex-col font-sans">
      {/* 1. TOP EMERGENCY BANNER (ALWAYS VISIBLE) */}
      <div className="bg-[#D42227] text-white py-2.5 px-4 shadow-md sticky top-0 z-50">
        <div className="max-w-5xl mx-auto flex flex-wrap items-center justify-between gap-3 text-sm">
          <div className="flex items-center gap-2 font-black tracking-wide">
            <span className="w-2.5 h-2.5 rounded-full bg-white animate-ping shrink-0" aria-hidden="true" />
            <span className="uppercase text-xs sm:text-sm font-extrabold">
              Emergency / Emergencia: Call 911 Immediately
            </span>
          </div>
          <a
            href="tel:911"
            className="inline-flex items-center gap-1.5 bg-white text-[#D42227] hover:bg-white/90 active:scale-95 px-3.5 py-1.5 rounded-full text-xs font-black uppercase tracking-wider transition-all shadow-sm"
          >
            <Phone className="w-3.5 h-3.5 fill-current" />
            <span>Call 911 / Llamar 911</span>
          </a>
        </div>
      </div>

      {/* 2. BRAND & PORTAL HEADER */}
      <header className="bg-[#0B1B2B] text-white border-b border-white/10 px-4 py-5 shadow-sm">
        <div className="max-w-5xl mx-auto flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-3.5">
            <div className="relative w-10 h-10 shrink-0 bg-white rounded-lg p-1 shadow-sm flex items-center justify-center">
              <Image
                src="/favicon.svg"
                alt="Rise Up Roofing Logo"
                width={32}
                height={32}
                className="w-8 h-8 object-contain"
                priority
              />
            </div>
            <div>
              <div className="text-[11px] font-extrabold uppercase tracking-widest text-[#2F9FE3]">
                Rise Up Roofing &amp; Construction
              </div>
              <h1 className="text-lg sm:text-xl font-extrabold tracking-tight text-white leading-tight">
                Employee Safety Portal
                <span className="block text-xs sm:text-sm font-medium text-[#C8DDF0]">
                  Portal de Seguridad de Empleados
                </span>
              </h1>
            </div>
          </div>

          {/* Authentication Badge / Lock Control */}
          {isAuthenticated && (
            <div className="flex items-center gap-2">
              <span className="hidden sm:inline-flex items-center gap-1.5 text-xs text-[#10B981] font-semibold bg-white/5 border border-[#10B981]/30 rounded-full px-3 py-1">
                <ShieldCheck className="w-3.5 h-3.5" />
                <span>Unlocked / Desbloqueado</span>
              </span>
              <button
                type="button"
                onClick={handleLock}
                className="inline-flex items-center gap-1.5 bg-white/10 hover:bg-white/20 active:scale-95 text-white border border-white/20 rounded-lg px-3 py-1.5 text-xs font-bold transition-all"
                title="Lock portal / Bloquear portal"
              >
                <Lock className="w-3.5 h-3.5 text-[#EAA636]" />
                <span>Lock / Salir</span>
              </button>
            </div>
          )}
        </div>
      </header>

      {/* 3. MAIN BODY (LOCKED OR UNLOCKED) */}
      <main className="flex-1 max-w-5xl w-full mx-auto p-4 sm:p-6 lg:p-8 space-y-8">
        {/* LOADING STATE */}
        {isAuthenticated === null && (
          <div className="py-24 text-center space-y-4">
            <RefreshCw className="w-8 h-8 mx-auto animate-spin text-[#2F9FE3]" />
            <p className="text-sm text-gray-500 font-medium">
              Checking employee authorization... / Verificando autorización...
            </p>
          </div>
        )}

        {/* LOCKED STATE: PASSWORD INPUT SCREEN */}
        {isAuthenticated === false && (
          <div className="max-w-md mx-auto my-6 sm:my-12">
            <div className="bg-white rounded-2xl border border-gray-200/80 shadow-lg p-6 sm:p-8 space-y-6">
              <div className="text-center space-y-2">
                <div className="w-14 h-14 mx-auto rounded-full bg-[#0B1B2B] flex items-center justify-center text-[#2F9FE3] shadow-md">
                  <Lock className="w-7 h-7" />
                </div>
                <h2 className="text-xl font-extrabold text-[#0B1B2B]">
                  Private Employee Access
                  <span className="block text-sm font-semibold text-gray-500 mt-0.5">
                    Acceso Privado para Empleados
                  </span>
                </h2>
                <p className="text-xs text-gray-600 leading-relaxed max-w-xs mx-auto pt-1">
                  Enter the safety password to view documents and report jobsite hazards.
                  <span className="block text-gray-500 italic mt-0.5">
                    Ingrese la contraseña de seguridad para ver documentos y reportar peligros.
                  </span>
                </p>
              </div>

              {authError && (
                <div className="p-3.5 rounded-xl bg-red-50 border border-red-200 text-red-800 text-xs font-medium flex items-start gap-2.5">
                  <AlertTriangle className="w-4 h-4 text-red-600 shrink-0 mt-0.5" />
                  <span>{authError}</span>
                </div>
              )}

              <form onSubmit={handleUnlock} className="space-y-4">
                <div className="space-y-1.5">
                  <label htmlFor="portal-password" className="block text-xs font-bold uppercase tracking-wider text-gray-700">
                    Password / Contraseña
                  </label>
                  <div className="relative">
                    <input
                      id="portal-password"
                      type={showPassword ? 'text' : 'password'}
                      value={passwordInput}
                      onChange={(e) => setPasswordInput(e.target.value)}
                      placeholder="••••••••••••"
                      required
                      autoFocus
                      className="w-full px-4 py-3 rounded-xl border border-gray-300 text-base font-medium text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#2F9FE3] focus:border-transparent transition-all shadow-sm"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 p-1"
                      aria-label={showPassword ? 'Hide password' : 'Show password'}
                    >
                      {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                    </button>
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={authLoading || !passwordInput}
                  className="w-full min-h-[50px] bg-[#0B1B2B] hover:bg-[#112D49] active:scale-[0.99] disabled:opacity-50 text-white font-extrabold uppercase tracking-wider text-sm rounded-xl py-3 px-4 shadow-md flex items-center justify-center gap-2 transition-all cursor-pointer"
                >
                  {authLoading ? (
                    <>
                      <RefreshCw className="w-4 h-4 animate-spin" />
                      <span>Verifying... / Verificando...</span>
                    </>
                  ) : (
                    <>
                      <Unlock className="w-4 h-4 text-[#2F9FE3]" />
                      <span>Unlock Safety Portal / Desbloquear</span>
                    </>
                  )}
                </button>
              </form>

              <div className="pt-4 border-t border-gray-100 text-center space-y-1.5">
                <p className="text-[11px] text-gray-500 font-medium">
                  Forgot password or need immediate access? Contact Operations:
                </p>
                <div className="flex flex-wrap items-center justify-center gap-3 text-xs font-bold text-[#0F5C8C]">
                  <a href="tel:7605570981" className="hover:underline inline-flex items-center gap-1">
                    <Phone className="w-3 h-3" />
                    <span>Christian (760) 557-0981</span>
                  </a>
                  <span>·</span>
                  <a href="tel:7606221230" className="hover:underline inline-flex items-center gap-1">
                    <Phone className="w-3 h-3" />
                    <span>Marc (760) 622-1230</span>
                  </a>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* UNLOCKED STATE: FULL SAFETY PORTAL */}
        {isAuthenticated === true && (
          <>
            {/* 4. EMERGENCY & OPERATIONS CALL DIRECTORY */}
            <section className="bg-white rounded-2xl border border-gray-200/90 shadow-sm p-4 sm:p-6 overflow-hidden">
              <div className="flex items-center gap-2.5 pb-3 border-b border-gray-100">
                <PhoneCall className="w-5 h-5 text-[#2F9FE3]" />
                <h2 className="text-base sm:text-lg font-extrabold text-[#0B1B2B]">
                  Who to Call / A Quién Llamar
                  <span className="block text-xs font-medium text-gray-500">
                    Direct Operations Contacts for Immediate Safety Assistance
                  </span>
                </h2>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-4">
                {/* Christian Lavalle */}
                <div className="bg-[#F4F9FC] border border-[#2F9FE3]/20 rounded-xl p-4 flex flex-col justify-between gap-3">
                  <div>
                    <div className="flex items-center justify-between gap-2">
                      <span className="text-xs font-extrabold text-[#2F9FE3] uppercase tracking-wider">
                        Primary Safety Contact
                      </span>
                      <span className="text-[11px] bg-green-100 text-green-800 font-bold px-2 py-0.5 rounded-full">
                        Director of Operations
                      </span>
                    </div>
                    <div className="text-base font-extrabold text-[#0B1B2B] mt-1">
                      Christian Lavalle
                    </div>
                    <div className="text-xs text-gray-600">
                      Director de Operaciones · Safety Administrator
                    </div>
                  </div>
                  <div className="flex items-center gap-2 pt-1">
                    <a
                      href="tel:7605570981"
                      className="flex-1 min-h-[44px] bg-[#0B1B2B] hover:bg-[#112D49] active:scale-95 text-white rounded-lg font-extrabold text-xs sm:text-sm flex items-center justify-center gap-2 transition-all shadow-sm"
                    >
                      <Phone className="w-4 h-4 text-[#10B981]" />
                      <span>Call (760) 557-0981</span>
                    </a>
                    <a
                      href="sms:7605570981"
                      className="min-h-[44px] px-3.5 bg-white border border-gray-300 hover:bg-gray-50 text-gray-700 rounded-lg font-bold text-xs flex items-center justify-center transition-all"
                    >
                      SMS
                    </a>
                  </div>
                </div>

                {/* Marc Sarellano */}
                <div className="bg-[#F4F9FC] border border-gray-200 rounded-xl p-4 flex flex-col justify-between gap-3">
                  <div>
                    <div className="flex items-center justify-between gap-2">
                      <span className="text-xs font-extrabold text-gray-600 uppercase tracking-wider">
                        Operations Backup
                      </span>
                      <span className="text-[11px] bg-gray-100 text-gray-700 font-bold px-2 py-0.5 rounded-full">
                        Head of Operations
                      </span>
                    </div>
                    <div className="text-base font-extrabold text-[#0B1B2B] mt-1">
                      Marc Sarellano
                    </div>
                    <div className="text-xs text-gray-600">
                      Jefe de Operaciones (Respaldo) · Dispatch Office
                    </div>
                  </div>
                  <div className="flex items-center gap-2 pt-1">
                    <a
                      href="tel:7606221230"
                      className="flex-1 min-h-[44px] bg-[#0B1B2B] hover:bg-[#112D49] active:scale-95 text-white rounded-lg font-extrabold text-xs sm:text-sm flex items-center justify-center gap-2 transition-all shadow-sm"
                    >
                      <Phone className="w-4 h-4 text-[#10B981]" />
                      <span>Call (760) 622-1230</span>
                    </a>
                    <a
                      href="sms:7606221230"
                      className="min-h-[44px] px-3.5 bg-white border border-gray-300 hover:bg-gray-50 text-gray-700 rounded-lg font-bold text-xs flex items-center justify-center transition-all"
                    >
                      SMS
                    </a>
                  </div>
                </div>
              </div>
            </section>

            {/* 5. WORKER PROTECTION NON-RETALIATION POLICY CALLOUT */}
            <section className="bg-gradient-to-r from-emerald-50 via-teal-50 to-green-50 border-2 border-emerald-500/40 rounded-2xl p-4 sm:p-6 shadow-sm">
              <div className="flex items-start gap-3.5">
                <div className="w-10 h-10 rounded-xl bg-emerald-600 text-white flex items-center justify-center shrink-0 shadow-sm">
                  <ShieldCheck className="w-6 h-6" />
                </div>
                <div className="space-y-1">
                  <div className="text-xs font-black uppercase tracking-wider text-emerald-800">
                    Cal/OSHA Whistleblower Protection · Protección al Trabajador
                  </div>
                  <p className="text-base sm:text-lg font-extrabold text-emerald-950 leading-snug">
                    &ldquo;No one will be punished for reporting a hazard or an injury.&rdquo;
                  </p>
                  <p className="text-sm sm:text-base font-bold text-emerald-900 italic">
                    &ldquo;Nadie será castigado por reportar un peligro o una lesión.&rdquo;
                  </p>
                  <p className="text-xs text-emerald-800/80 pt-1 leading-relaxed">
                    Under California Labor Code §6310 and Rise Up Roofing company policy, all workers have the legal right to report unsafe working conditions, defective equipment, or workplace injuries without fear of discharge, demotion, discrimination, or retaliation.
                  </p>
                </div>
              </div>
            </section>

            {/* 6. SAFETY DOCUMENTS REPOSITORY */}
            <section className="bg-white rounded-2xl border border-gray-200/90 shadow-sm p-4 sm:p-6 space-y-5">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-gray-100">
                <div>
                  <div className="flex items-center gap-2">
                    <FileText className="w-5 h-5 text-[#2F9FE3]" />
                    <h2 className="text-base sm:text-lg font-extrabold text-[#0B1B2B]">
                      Official Safety Programs (IIPP)
                    </h2>
                  </div>
                  <p className="text-xs text-gray-500 font-medium mt-0.5">
                    Programas Oficiales de Prevención · Open, download, and print compliance manuals
                  </p>
                </div>

                <div className="flex items-center gap-3">
                  <span className="text-xs font-bold text-gray-700 bg-amber-50 border border-amber-200 text-amber-900 rounded-full px-3 py-1 shrink-0">
                    Last updated: November 2026 / Noviembre 2026
                  </span>
                </div>
              </div>

              {/* Language Filters */}
              <div className="flex flex-wrap items-center gap-2 pt-1">
                <span className="text-xs font-bold text-gray-500 uppercase tracking-wider mr-1">
                  Filter / Filtrar:
                </span>
                <button
                  type="button"
                  onClick={() => setDocFilter('all')}
                  className={`px-3 py-1.5 rounded-lg text-xs font-extrabold transition-all ${
                    docFilter === 'all'
                      ? 'bg-[#0B1B2B] text-white shadow-sm'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  All Documents / Todos (8)
                </button>
                <button
                  type="button"
                  onClick={() => setDocFilter('en')}
                  className={`px-3 py-1.5 rounded-lg text-xs font-extrabold transition-all ${
                    docFilter === 'en'
                      ? 'bg-[#0B1B2B] text-white shadow-sm'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  English (4)
                </button>
                <button
                  type="button"
                  onClick={() => setDocFilter('es')}
                  className={`px-3 py-1.5 rounded-lg text-xs font-extrabold transition-all ${
                    docFilter === 'es'
                      ? 'bg-[#0B1B2B] text-white shadow-sm'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  Español (4)
                </button>
              </div>

              {/* Document Cards Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
                {filteredDocs.map((doc) => {
                  const docUrl = `/api/team/safety/docs?id=${encodeURIComponent(doc.id)}`;
                  const downloadUrl = `/api/team/safety/docs?id=${encodeURIComponent(doc.id)}&download=1`;

                  return (
                    <article
                      key={doc.id}
                      data-doc-id={doc.id}
                      className="border border-gray-200 rounded-xl p-4 bg-[#F8FAFC] hover:border-[#2F9FE3]/50 transition-all flex flex-col justify-between gap-3 shadow-xs"
                    >
                      <div className="space-y-1.5">
                        <div className="flex items-center justify-between gap-2">
                          <span className="inline-flex items-center gap-1.5 font-mono text-xs font-black text-[#0F5C8C] bg-[#E8F1F8] px-2.5 py-0.5 rounded-md">
                            <FileCheck className="w-3.5 h-3.5" />
                            {doc.code}
                          </span>
                          <span
                            className={`text-[10px] font-black uppercase tracking-wider px-2 py-0.5 rounded-full ${
                              doc.lang === 'es'
                                ? 'bg-amber-100 text-amber-900 border border-amber-300'
                                : 'bg-blue-100 text-blue-900 border border-blue-200'
                            }`}
                          >
                            {doc.lang === 'es' ? 'Español' : 'English'}
                          </span>
                        </div>

                        <h3 className="text-sm font-extrabold text-[#0B1B2B] leading-snug">
                          {doc.lang === 'es' ? doc.titleEs : doc.titleEn}
                        </h3>

                        <div className="text-[11px] font-medium text-gray-500">
                          {doc.calOshaRef}
                        </div>

                        <p className="text-xs text-gray-600 leading-relaxed line-clamp-2">
                          {doc.lang === 'es' ? doc.descriptionEs : doc.descriptionEn}
                        </p>
                      </div>

                      {/* Open / Download / Print Buttons */}
                      <div className="grid grid-cols-3 gap-2 pt-2 border-t border-gray-200/80">
                        <a
                          href={docUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="min-h-[38px] px-2 bg-white hover:bg-gray-50 text-[#0B1B2B] border border-gray-300 rounded-lg text-xs font-extrabold flex items-center justify-center gap-1.5 transition-all shadow-xs"
                          title="Open and view PDF / Abrir y ver PDF"
                        >
                          <ExternalLink className="w-3.5 h-3.5 text-[#2F9FE3]" />
                          <span>Open / Abrir</span>
                        </a>

                        <a
                          href={downloadUrl}
                          className="min-h-[38px] px-2 bg-[#0B1B2B] hover:bg-[#112D49] text-white rounded-lg text-xs font-extrabold flex items-center justify-center gap-1.5 transition-all shadow-xs"
                          title="Download PDF / Descargar PDF"
                        >
                          <Download className="w-3.5 h-3.5 text-white" />
                          <span>Download</span>
                        </a>

                        <button
                          type="button"
                          onClick={() => handlePrintDoc(doc)}
                          className="min-h-[38px] px-2 bg-white hover:bg-gray-50 text-gray-700 border border-gray-300 rounded-lg text-xs font-extrabold flex items-center justify-center gap-1.5 transition-all shadow-xs"
                          title="Print document / Imprimir documento"
                        >
                          <Printer className="w-3.5 h-3.5 text-gray-600" />
                          <span>Print</span>
                        </button>
                      </div>
                    </article>
                  );
                })}
              </div>
            </section>

            {/* 7. ANONYMOUS HAZARD REPORT FORM */}
            <section className="bg-white rounded-2xl border-2 border-[#D42227]/30 shadow-md p-4 sm:p-6 lg:p-8 space-y-6">
              <div className="flex items-start gap-3.5 pb-4 border-b border-gray-200">
                <div className="w-12 h-12 rounded-xl bg-[#D42227] text-white flex items-center justify-center shrink-0 shadow-md">
                  <ShieldAlert className="w-6 h-6" />
                </div>
                <div>
                  <div className="text-xs font-black uppercase tracking-wider text-[#D42227]">
                    Confidential Safety Channel · Canal Confidencial de Seguridad
                  </div>
                  <h2 className="text-lg sm:text-xl font-extrabold text-[#0B1B2B]">
                    Anonymous Hazard Report Form
                    <span className="block text-sm font-semibold text-gray-600">
                      Formulario de Reporte Anónimo de Peligros
                    </span>
                  </h2>
                  <p className="text-xs text-gray-600 mt-1">
                    Direct dispatch to Christian Lavalle (Director of Operations · chris@riseuprac.com). No login or email required.
                  </p>
                </div>
              </div>

              {/* Success Feedback Banner */}
              {formSuccess && (
                <div className="p-4 rounded-xl bg-green-50 border border-green-300 text-green-900 space-y-2">
                  <div className="flex items-start gap-2.5 font-bold text-sm">
                    <CheckCircle2 className="w-5 h-5 text-green-600 shrink-0 mt-0.5" />
                    <span>Report Received / Reporte Recibido</span>
                  </div>
                  <p className="text-xs text-green-800 leading-relaxed pl-7">
                    {formSuccess}
                  </p>
                  <div className="pl-7 pt-1">
                    <button
                      type="button"
                      onClick={() => setFormSuccess(null)}
                      className="text-xs font-bold text-green-700 underline hover:text-green-900"
                    >
                      Submit another report / Enviar otro reporte
                    </button>
                  </div>
                </div>
              )}

              {/* Error Feedback Banner */}
              {formError && (
                <div className="p-4 rounded-xl bg-red-50 border border-red-300 text-red-900 flex items-start gap-2.5 text-xs font-medium">
                  <AlertTriangle className="w-5 h-5 text-red-600 shrink-0 mt-0.5" />
                  <span>{formError}</span>
                </div>
              )}

              <form onSubmit={handleSubmitReport} className="space-y-5">
                {/* Honeypot field (hidden from humans) */}
                <input
                  type="text"
                  name="company_website"
                  tabIndex={-1}
                  autoComplete="off"
                  className="hidden"
                  aria-hidden="true"
                />

                {/* Row 1: Date & Jobsite Location */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {/* Date (Required) */}
                  <div className="space-y-1.5">
                    <label htmlFor="hazard-date" className="flex items-center gap-1.5 text-xs font-extrabold uppercase tracking-wider text-gray-800">
                      <Calendar className="w-3.5 h-3.5 text-[#2F9FE3]" />
                      <span>Date / Fecha</span>
                      <span className="text-red-600 font-bold">*</span>
                    </label>
                    <input
                      id="hazard-date"
                      type="date"
                      value={reportDate}
                      onChange={(e) => setReportDate(e.target.value)}
                      required
                      className="w-full min-h-[48px] px-3.5 py-2.5 rounded-xl border border-gray-300 text-sm font-medium text-gray-900 focus:outline-none focus:ring-2 focus:ring-[#2F9FE3] focus:border-transparent transition-all shadow-xs"
                    />
                  </div>

                  {/* Jobsite Location (Required) */}
                  <div className="space-y-1.5">
                    <label htmlFor="hazard-location" className="flex items-center gap-1.5 text-xs font-extrabold uppercase tracking-wider text-gray-800">
                      <MapPin className="w-3.5 h-3.5 text-[#2F9FE3]" />
                      <span>Jobsite or Location / Sitio o Ubicación</span>
                      <span className="text-red-600 font-bold">*</span>
                    </label>
                    <input
                      id="hazard-location"
                      type="text"
                      value={reportLocation}
                      onChange={(e) => setReportLocation(e.target.value)}
                      placeholder="e.g. 1420 Coast Hwy, Oceanside (or Crew 3)"
                      required
                      className="w-full min-h-[48px] px-3.5 py-2.5 rounded-xl border border-gray-300 text-sm font-medium text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#2F9FE3] focus:border-transparent transition-all shadow-xs"
                    />
                  </div>
                </div>

                {/* Row 2: Hazard Description (Required) */}
                <div className="space-y-1.5">
                  <label htmlFor="hazard-description" className="flex items-center gap-1.5 text-xs font-extrabold uppercase tracking-wider text-gray-800">
                    <AlertTriangle className="w-3.5 h-3.5 text-[#D42227]" />
                    <span>Describe the Hazard / Describa el Peligro</span>
                    <span className="text-red-600 font-bold">*</span>
                  </label>
                  <textarea
                    id="hazard-description"
                    rows={4}
                    value={hazardDescription}
                    onChange={(e) => setHazardDescription(e.target.value)}
                    placeholder="Describe what is unsafe, where on the roof it is located, broken equipment, fall risks, rotted deck, high winds, etc. / Describa qué condición es insegura, dónde está ubicada, equipo dañado, riesgo de caída, etc."
                    required
                    className="w-full p-3.5 rounded-xl border border-gray-300 text-sm font-medium text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#2F9FE3] focus:border-transparent transition-all shadow-xs"
                  />
                </div>

                {/* Row 3: What was done about it (Optional) */}
                <div className="space-y-1.5">
                  <label htmlFor="hazard-action" className="flex items-center justify-between text-xs font-extrabold uppercase tracking-wider text-gray-800">
                    <span>What was done about it, if anything / ¿Qué se hizo al respecto?</span>
                    <span className="text-gray-400 font-medium lowercase">Optional / Opcional</span>
                  </label>
                  <textarea
                    id="hazard-action"
                    rows={2}
                    value={actionTaken}
                    onChange={(e) => setActionTaken(e.target.value)}
                    placeholder="e.g. Stopped work, cautioned the crew, placed barricade, flagged the foreman / p. ej. Se detuvo la labor, se advirtió a la cuadrilla, se colocó cinta de peligro."
                    className="w-full p-3.5 rounded-xl border border-gray-300 text-sm font-medium text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#2F9FE3] focus:border-transparent transition-all shadow-xs"
                  />
                </div>

                {/* Row 4: Photo Upload (Optional) */}
                <div className="space-y-1.5">
                  <label className="flex items-center justify-between text-xs font-extrabold uppercase tracking-wider text-gray-800">
                    <span className="flex items-center gap-1.5">
                      <Camera className="w-3.5 h-3.5 text-[#2F9FE3]" />
                      <span>Photo Upload / Subir Foto</span>
                    </span>
                    <span className="text-gray-400 font-medium lowercase">Optional / Opcional</span>
                  </label>

                  <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
                    <input
                      type="file"
                      ref={fileInputRef}
                      accept="image/*"
                      capture="environment"
                      onChange={handlePhotoChange}
                      className="hidden"
                      id="photo-upload-input"
                    />

                    <label
                      htmlFor="photo-upload-input"
                      className="min-h-[48px] px-4 py-2.5 rounded-xl border-2 border-dashed border-gray-300 hover:border-[#2F9FE3] bg-gray-50 hover:bg-blue-50/40 text-gray-700 text-xs font-extrabold flex items-center justify-center gap-2 cursor-pointer transition-all"
                    >
                      <Upload className="w-4 h-4 text-[#2F9FE3]" />
                      <span>Take or Choose Photo / Tomar o Seleccionar Foto</span>
                    </label>

                    {photoFile && (
                      <div className="flex items-center gap-2.5 bg-gray-100 rounded-xl px-3 py-2 border border-gray-200">
                        {photoPreview && (
                          <img
                            src={photoPreview}
                            alt="Preview"
                            className="w-8 h-8 rounded object-cover border border-gray-300 shrink-0"
                          />
                        )}
                        <span className="text-xs font-bold text-gray-800 truncate max-w-[180px]">
                          {photoFile.name}
                        </span>
                        <button
                          type="button"
                          onClick={removePhoto}
                          className="p-1 hover:bg-gray-200 rounded text-gray-600 ml-auto"
                          title="Remove photo"
                        >
                          <X className="w-4 h-4" />
                        </button>
                      </div>
                    )}
                  </div>
                </div>

                {/* Row 5: Name & Phone (Optional) */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
                  {/* Name (Optional) */}
                  <div className="space-y-1.5">
                    <label htmlFor="reporter-name" className="block text-xs font-extrabold uppercase tracking-wider text-gray-800">
                      <span className="flex items-center gap-1.5">
                        <User className="w-3.5 h-3.5 text-gray-500" />
                        <span>Name / Nombre</span>
                      </span>
                    </label>
                    <input
                      id="reporter-name"
                      type="text"
                      value={reporterName}
                      onChange={(e) => setReporterName(e.target.value)}
                      placeholder="Leave blank to stay anonymous / Deje en blanco"
                      className="w-full min-h-[48px] px-3.5 py-2.5 rounded-xl border border-gray-300 text-sm font-medium text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#2F9FE3] focus:border-transparent transition-all shadow-xs"
                    />
                    <p className="text-[11px] text-gray-500 font-medium">
                      Leave blank to stay anonymous / Deje en blanco para permanecer anónimo.
                    </p>
                  </div>

                  {/* Phone (Optional) */}
                  <div className="space-y-1.5">
                    <label htmlFor="reporter-phone" className="block text-xs font-extrabold uppercase tracking-wider text-gray-800">
                      <span className="flex items-center gap-1.5">
                        <Phone className="w-3.5 h-3.5 text-gray-500" />
                        <span>Phone / Teléfono</span>
                      </span>
                    </label>
                    <input
                      id="reporter-phone"
                      type="tel"
                      value={reporterPhone}
                      onChange={(e) => setReporterPhone(e.target.value)}
                      placeholder="(760) 000-0000"
                      className="w-full min-h-[48px] px-3.5 py-2.5 rounded-xl border border-gray-300 text-sm font-medium text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#2F9FE3] focus:border-transparent transition-all shadow-xs"
                    />
                    <p className="text-[11px] text-gray-500 font-medium">
                      Optional if you want Christian to follow up / Opcional para seguimiento.
                    </p>
                  </div>
                </div>

                {/* Submit Button */}
                <div className="pt-3">
                  <button
                    type="submit"
                    disabled={formSubmitting}
                    className="w-full min-h-[52px] bg-[#D42227] hover:bg-[#B81C21] active:scale-[0.99] disabled:opacity-50 text-white font-extrabold uppercase tracking-wider text-sm rounded-xl py-3.5 px-6 shadow-md flex items-center justify-center gap-2.5 transition-all cursor-pointer"
                  >
                    {formSubmitting ? (
                      <>
                        <RefreshCw className="w-4 h-4 animate-spin" />
                        <span>Transmitting Report... / Enviando Reporte...</span>
                      </>
                    ) : (
                      <>
                        <ShieldAlert className="w-5 h-5" />
                        <span>Submit Hazard Report / Enviar Reporte de Peligro</span>
                      </>
                    )}
                  </button>
                  <p className="text-center text-[11px] text-gray-500 font-semibold pt-2.5">
                    Dispatches instantly to Christian Lavalle (chris@riseuprac.com) · Director of Operations
                  </p>
                </div>
              </form>
            </section>
          </>
        )}
      </main>

      {/* 8. FOOTER */}
      <footer className="bg-[#0B1B2B] text-gray-400 text-xs py-6 px-4 border-t border-white/10 mt-auto">
        <div className="max-w-5xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4 text-center sm:text-left">
          <div className="space-y-1">
            <p className="text-white font-bold text-xs">
              Rise Up Roofing &amp; Construction Inc. · CSLB #1096492
            </p>
            <p className="text-gray-400 text-[11px]">
              2182 S El Camino Real, Oceanside, CA 92054 · Confidential Employee Safety Portal
            </p>
          </div>
          <div className="text-gray-400 text-[11px]">
            Cal/OSHA Title 8 CCR §1509 Compliant · Non-Retaliation Standard
          </div>
        </div>
      </footer>
    </div>
  );
}
